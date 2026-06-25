"use client";

import React, { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, FileSpreadsheet, Download, CheckCircle2,
  AlertCircle, ArrowRight, X, Eye, Globe, Activity,
  Table, Loader2, Database, FileText, Zap, BarChart3,
  RefreshCcw, ShieldCheck, AlertTriangle
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { useStore, Supplier } from '@/store/useStore';
import {
  bulkInsertSuppliers,
  bulkInsertEdges,
  logDatasetUpload,
  getOrgId,
  setOrgId,
} from '@/lib/api';
import { supabase } from '@/lib/supabase';

type UploadStatus = 'idle' | 'dragging' | 'processing' | 'validating' | 'success' | 'error';
interface PreviewRow { [key: string]: string | number }

export default function UploadDatasetPage() {
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState('');
  const [previewData, setPreviewData] = useState<PreviewRow[]>([]);
  const [previewHeaders, setPreviewHeaders] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [importedCount, setImportedCount] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [dbStatus, setDbStatus] = useState<'idle'|'writing'|'done'|'error'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  
  const { 
    setSuppliers, setEdges, suppliers, db, 
    setDbSyncing, setSyncedAt, setOrgId: storeSetOrgId, 
    resetSimulations, edges 
  } = useStore();

  const processFile = useCallback((file: File) => {
    setFileName(file.name);
    setError('');
    setStatus('processing');

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const raw = XLSX.utils.sheet_to_json<PreviewRow>(ws);

        if (raw.length === 0) throw new Error('File is empty or has no valid rows.');

        const headers = Object.keys(raw[0]);
        setPreviewHeaders(headers);
        setPreviewData(raw.slice(0, 5));
        setStatus('validating');
        setProgress(20);

        const parsedSuppliers: Supplier[] = [];
        const rowErrors: string[] = [];

        raw.forEach((row: any, idx) => {
          const rowNum = idx + 2;
          const name = (row.name || row.Name || '').toString().trim();
          const lat = parseFloat(row.lat || row.Lat || row.latitude || row.Latitude || '0');
          const lng = parseFloat(row.lng || row.Lng || row.longitude || row.Longitude || '0');
          const rawTier = parseInt(row.tier || row.Tier || row.tier_level || '1');

          if (!name) rowErrors.push(`Row ${rowNum}: Missing required field 'name'.`);
          if (isNaN(lat) || lat === 0) rowErrors.push(`Row ${rowNum} (${name || '?'}): Invalid or missing 'lat' coordinate.`);
          if (isNaN(lng) || lng === 0) rowErrors.push(`Row ${rowNum} (${name || '?'}): Invalid or missing 'lng' coordinate.`);
          if (isNaN(rawTier) || rawTier < 1 || rawTier > 3) rowErrors.push(`Row ${rowNum} (${name || '?'}): 'tier' must be 1, 2, or 3.`);

          if (name && !isNaN(lat) && lat !== 0 && !isNaN(lng) && lng !== 0) {
            const tier = (isNaN(rawTier) || rawTier < 1 || rawTier > 3) ? 1 : rawTier as 1|2|3;
            parsedSuppliers.push({
              id: (row.id || row.Id || crypto.randomUUID()).toString(),
              name,
              tier,
              lat,
              lng,
              health: parseInt(row.health || row.Health || '100') || 100,
              risk: parseInt(row.risk || row.Risk || '0') || 0,
              visibility: (row.visibility === 'Private' ? 'Private' : 'Public') as 'Public' | 'Private',
              category: (row.category || row.Category || 'General').toString(),
              isBackup: row.isBackup === 'true' || row.isBackup === true,
              city: (row.city || row.City || row.source_location || '').toString()
            });
          }
        });

        if (rowErrors.length > 0) setValidationErrors(rowErrors);
        if (parsedSuppliers.length === 0) throw new Error(`Validation failed: No valid supplier rows found. Check that 'name', 'lat', 'lng', and 'tier' are present.`);


        // --- SUPPLY CHAIN EDGE ARCHITECTURE ---
        const newEdges: any[] = [];
        const tier1Nodes = parsedSuppliers.filter(s => s.tier === 1);
        const tier2Nodes = parsedSuppliers.filter(s => s.tier === 2);
        const tier3Nodes = parsedSuppliers.filter(s => s.tier === 3);

        // Tier 1 → Main HQ
        tier1Nodes.forEach(s => {
          newEdges.push({ source: s.id, target: 'Main', value: 1.0 });
        });

        // Tier 2 → nearest Tier 1
        tier2Nodes.forEach((s, idx) => {
          if (tier1Nodes.length > 0) {
            newEdges.push({ source: s.id, target: tier1Nodes[idx % tier1Nodes.length].id, value: 0.8 });
          } else {
            newEdges.push({ source: s.id, target: 'Main', value: 0.8 });
          }
        });

        // Tier 3 → nearest Tier 2 (or Tier 1 fallback)
        tier3Nodes.forEach((s, idx) => {
          if (tier2Nodes.length > 0) {
            newEdges.push({ source: s.id, target: tier2Nodes[idx % tier2Nodes.length].id, value: 0.6 });
          } else if (tier1Nodes.length > 0) {
            newEdges.push({ source: s.id, target: tier1Nodes[idx % tier1Nodes.length].id, value: 0.6 });
          } else {
            newEdges.push({ source: s.id, target: 'Main', value: 0.6 });
          }
        });

        setProgress(50);

        let orgId = getOrgId();
        let savedSuppliers = parsedSuppliers;
        let savedEdges = newEdges;

        if (db.isConnected) {
          setDbStatus('writing');
          setDbSyncing(true);
          
          if (!orgId) {
            // Force primary admin org for persistent storage if none exists
            const { data: adminOrg } = await supabase.from('organizations').select('id').eq('email', 'admin@globalchain.intel').single();
            if (adminOrg) { 
              orgId = adminOrg.id; 
              setOrgId(orgId as string); 
              storeSetOrgId(orgId as string); 
            } else {
              // Create it if it missing to prevent upload failure
              const { data: newOrg } = await supabase.from('organizations').insert([{ name: 'GlobalChain Admin', email: 'admin@globalchain.intel', status: 'Approved' }]).select().single();
              if (newOrg) {
                orgId = newOrg.id;
                setOrgId(orgId as string);
                storeSetOrgId(orgId as string);
              }
            }
          }

          if (orgId) {
            setProgress(65);
            // 1. Insert Suppliers
            const insertedSuppliers = await bulkInsertSuppliers(parsedSuppliers, orgId);
            if (!insertedSuppliers || insertedSuppliers.length === 0) throw new Error('Cloud Registry Failure: Dataset rejected.');
            
            setProgress(85);
            // 2. ID Mapping
            const idMap: Record<string, string> = {};
            insertedSuppliers.forEach((s) => {
              const original = parsedSuppliers.find(p => p.name === s.name);
              if (original) idMap[original.id] = s.id;
            });

            // 3. Insert Edges (Connections) with mapped UUIDs
            const mappedEdges = newEdges.map(e => ({
              ...e,
              source: idMap[e.source] || e.source,
              target: e.target === 'Main' ? 'Main' : (idMap[e.target] || e.target)
            }));
            await bulkInsertEdges(mappedEdges, orgId, idMap);
            savedEdges = mappedEdges;
            
            // 4. Log Metadata
            await logDatasetUpload(orgId, file.name, parsedSuppliers.length, 'completed');
            savedSuppliers = insertedSuppliers;
            setDbStatus('done');
            setSyncedAt();
          } else {
            throw new Error('Identity Initialization Error: Could not establish secure upload session.');
          }
        } 

        setProgress(100);
        resetSimulations();
        setSuppliers(savedSuppliers);
        setEdges(savedEdges);
        setImportedCount(savedSuppliers.length);
        setStatus('success');
        // Auto-redirect to Globe after a brief success moment
        setTimeout(() => router.push('/visualization/globe'), 1800);

      } catch (err: any) {
        setError(err.message || 'Failed to parse file.');
        setStatus('error');
        setDbStatus('error');
      }
    };
    reader.readAsBinaryString(file);
  }, [setSuppliers, setEdges, db.isConnected]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setStatus('idle');
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const downloadTemplate = (type: 'suppliers' | 'mapping') => {
    const data = type === 'suppliers'
      ? [{ id: 'SUP-001', name: 'Example Corp', tier: 1, lat: 35.6762, lng: 139.6503, health: 100, risk: 0, visibility: 'Public', category: 'Semiconductors', city: 'Tokyo', isBackup: false }]
      : [{ sourceId: 'SUP-002', targetId: 'SUP-001', weight: 0.9 }];
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template');
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GlobalChain_${type}_template.xlsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex justify-between items-end bg-[#0a0c10]/50 p-12 rounded-[3.5rem] border border-white/10 relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="relative z-10">
           <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-glow-blue/10 rounded-xl flex items-center justify-center border border-glow-blue/20">
                 <Database className="w-5 h-5 text-glow-blue" />
              </div>
              <span className="text-xs font-bold text-glow-blue uppercase tracking-[0.4em]">Intelligence Ingestion</span>
           </div>
           <h2 className="font-header text-6xl text-white tracking-tighter uppercase italic leading-[0.8] mb-4">
              Data <span className="text-glow-blue">Engine</span>
           </h2>
           <p className="text-slate-500 text-sm max-w-xl font-bold uppercase tracking-tight">Managing global mesh datasets. Drop your operational graph to initialize real-time forecasting and geopolitical simulations.</p>
        </div>
        
        <div className="flex gap-4 relative z-10">
           <button onClick={() => setStatus('idle')} className="px-8 py-5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-3">
              <RefreshCcw className="w-4 h-4" /> Reset Portal
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Upload & Controls */}
        <div className="lg:col-span-8 space-y-10">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div 
                 onDragOver={(e) => { e.preventDefault(); if (status === 'idle') setStatus('dragging'); }}
                 onDragLeave={() => { if (status === 'dragging') setStatus('idle'); }}
                 onDrop={handleDrop}
                 onClick={() => (status === 'idle' || status === 'error' || status === 'success') && fileInputRef.current?.click()}
                 className={`relative border-2 border-dashed rounded-[3rem] p-12 flex flex-col items-center justify-center transition-all cursor-pointer min-h-[350px] shadow-2xl ${
                   status === 'success' ? 'border-success/40 bg-success/[0.02]' : 
                   status === 'error' ? 'border-critical/40 bg-critical/[0.02]' :
                   status === 'dragging' ? 'border-glow-blue bg-glow-blue/5' : 'border-white/10 hover:border-white/20 bg-[#0a0c10]/40'
                 }`}
              >
                 <input ref={fileInputRef} type="file" className="hidden" accept=".xlsx,.xls,.csv" onChange={handleFileChange} />
                 
                 <AnimatePresence mode="wait">
                    {status === 'success' ? (
                       <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center text-center gap-6">
                          <div className="w-20 h-20 rounded-full bg-success/10 border border-success/30 flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                             <CheckCircle2 className="w-10 h-10 text-success" />
                          </div>
                          <div>
                             <p className="text-white font-header text-xl uppercase italic mb-1">Ingestion Successful</p>
                             <p className="text-success font-mono text-sm font-bold">{importedCount} Nodes Integrated</p>
                          </div>
                          <button onClick={(e) => { e.stopPropagation(); setShowPreview(true); }} className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-white uppercase tracking-widest hover:bg-white/10">Browse Preview</button>
                       </motion.div>
                    ) : status === 'processing' || status === 'validating' ? (
                       <motion.div key="proc" className="flex flex-col items-center gap-8 w-full max-w-xs">
                          <Loader2 className="w-12 h-12 text-glow-blue animate-spin" />
                          <div className="w-full space-y-3">
                             <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                <span>{status === 'processing' ? 'PARSING_STREAM' : 'SYNCING_NODES'}</span>
                                <span className="text-glow-blue">{progress}%</span>
                             </div>
                             <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <motion.div animate={{ width: `${progress}%` }} className="h-full bg-glow-blue shadow-[0_0_15px_rgba(59,130,246,0.6)]" />
                             </div>
                          </div>
                       </motion.div>
                    ) : (
                       <motion.div key="idle" className="flex flex-col items-center text-center gap-6">
                          <div className="w-20 h-20 rounded-3xl bg-white/[0.03] border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                             <Upload className="w-9 h-9 text-slate-600" />
                          </div>
                          <div>
                             <p className="text-white font-bold text-lg mb-1 italic">Ingest Operational Graph</p>
                             <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">Drag and drop .XLSX or .CSV</p>
                          </div>
                       </motion.div>
                    )}
                 </AnimatePresence>
              </div>

              <div className="glass-panel p-10 rounded-[3rem] border border-white/10 flex flex-col justify-between">
                 <div>
                    <h3 className="text-white font-header text-sm uppercase tracking-widest mb-8 flex items-center gap-2">
                       <ShieldCheck className="w-4 h-4 text-glow-blue" /> Protocol Guidelines
                    </h3>
                    <div className="space-y-4">
                       {[
                         { col: 'id', req: true },
                         { col: 'name', req: true },
                         { col: 'tier (1-3)', req: true },
                         { col: 'lat / lng', req: true },
                         { col: 'health (0-100)', req: false },
                         { col: 'category', req: false },
                       ].map((c, i) => (
                         <div key={i} className="flex justify-between items-center p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                            <span className="text-[10px] text-slate-400 font-mono font-bold uppercase">{c.col}</span>
                            {c.req ? <span className="text-[8px] text-critical font-bold uppercase tracking-widest px-2 py-0.5 border border-critical/20 rounded bg-critical/5">Required</span> : <span className="text-[8px] text-slate-600 font-bold uppercase">Optional</span>}
                         </div>
                       ))}
                    </div>
                 </div>
                 <div className="pt-8">
                    <p className="text-[9px] text-slate-600 font-mono italic leading-relaxed">System verifies nodal coordinates and Tier integrity before finalizing the mesh update.</p>
                 </div>
              </div>
           </div>

           {/* Post-Upload Permanent Actions */}
           <div className="glass-panel p-10 rounded-[3rem] border border-white/10 space-y-10">
              <div className="flex justify-between items-center">
                 <h3 className="text-white font-header text-xl uppercase italic">Intelligence <span className="text-glow-blue">Redirects</span></h3>
                 {suppliers.length > 0 && <span className="text-[9px] text-success font-bold uppercase tracking-widest animate-pulse">Graph Loaded: {suppliers.length} Nodes</span>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                 {[
                   { href: '/visualization/globe', icon: Globe, label: 'Geo Intelligence', color: 'text-glow-blue border-glow-blue/20 bg-glow-blue/5' },
                   { href: '/analytics/forecast', icon: BarChart3, label: 'Predictive Forecast', color: 'text-purple-400 border-purple-500/20 bg-purple-500/5' },
                   { href: '/simulations/center', icon: Zap, label: 'Simulation Lab', color: 'text-warning border-warning/20 bg-warning/5' },
                 ].map((a) => (
                   <Link key={a.href} href={a.href}>
                     <button className={`w-full py-6 border rounded-[2rem] text-[10px] font-bold uppercase tracking-[0.2em] flex flex-col items-center justify-center gap-4 transition-all group hover:scale-[1.02] shadow-xl ${a.color}`}>
                        <a.icon className="w-8 h-8 group-hover:scale-110 transition-transform" />
                        {a.label}
                     </button>
                   </Link>
                 ))}
              </div>
           </div>
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-4 space-y-10">
           <div className="glass-panel p-10 rounded-[3rem] border border-white/10 bg-white/[0.01]">
              <h3 className="text-white font-header text-sm uppercase tracking-widest mb-10 flex items-center gap-3">
                 <Download className="w-5 h-5 text-glow-blue" /> Infrastructure Templates
              </h3>
              <div className="space-y-4">
                 {[
                    { id: 'suppliers', label: 'Supplier Registry', sub: 'Nodal Hierarchy & Coordinates', color: 'text-glow-blue' },
                    { id: 'mapping', label: 'Dependency Graph', sub: 'Link Weights & Flow Vectors', color: 'text-warning' },
                 ].map((t) => (
                    <button key={t.id} onClick={() => downloadTemplate(t.id as any)} className="w-full p-6 bg-white/[0.03] border border-white/10 rounded-2xl flex items-center gap-5 transition-all group hover:bg-white/[0.06] hover:border-white/20">
                       <div className="w-12 h-12 bg-black/40 rounded-xl flex items-center justify-center text-slate-500 group-hover:text-white transition-colors">
                          <FileSpreadsheet className="w-6 h-6" />
                       </div>
                       <div className="text-left flex-1">
                          <p className="text-xs font-bold text-white uppercase tracking-tight mb-1">{t.label}</p>
                          <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">{t.sub}</p>
                       </div>
                       <ArrowRight className="w-4 h-4 text-slate-800 group-hover:text-white transition-all" />
                    </button>
                 ))}
              </div>
           </div>

           <div className="glass-panel p-10 rounded-[3rem] border border-white/10 h-[400px] flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-[0.02] pointer-events-none"><Activity className="w-64 h-64 text-white" /></div>
              <h3 className="text-white font-header text-sm uppercase tracking-widest flex items-center gap-3 relative z-10">
                 <Activity className="w-5 h-5 text-glow-blue" /> System Live Context
              </h3>
              <div className="space-y-8 relative z-10">
                 <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                    <span className="text-slate-500">Database Status</span>
                    <span className={db.isConnected ? 'text-success' : 'text-slate-600'}>{db.isConnected ? 'ENCRYPTED_SYNC' : 'LOCAL_ONLY'}</span>
                 </div>
                 <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                    <span className="text-slate-500">Active Mesh Nodes</span>
                    <span className="text-white font-mono">{suppliers.length}</span>
                 </div>
                 <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                    <span className="text-slate-500">Dependency Links</span>
                    <span className="text-white font-mono">{edges.length}</span>
                 </div>
              </div>
              <div className="pt-10 border-t border-white/5 relative z-10">
                 <button onClick={() => { setSuppliers([]); setEdges([]); resetSimulations(); }} className="w-full py-4 bg-critical/5 border border-critical/10 text-critical text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl hover:bg-critical/10 transition-all">Terminate Dataset</button>
              </div>
           </div>
        </div>
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreview && previewData.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-10" onClick={() => setShowPreview(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="glass-panel border border-white/10 rounded-[3rem] p-12 max-w-6xl w-full max-h-[85vh] overflow-hidden flex flex-col bg-[#05070a] shadow-[0_0_100px_rgba(0,0,0,0.8)]">
               <div className="flex justify-between items-center mb-10">
                  <div>
                    <h3 className="text-white font-header text-3xl uppercase italic mb-2 flex items-center gap-4">
                      <Table className="w-8 h-8 text-glow-blue" /> Data <span className="text-glow-blue">Audit Preview</span>
                    </h3>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Verifying first 5 rows for ingestion integrity</p>
                  </div>
                  <button onClick={() => setShowPreview(false)} className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-slate-500 hover:text-white transition-all"><X className="w-6 h-6" /></button>
               </div>
               <div className="overflow-auto flex-1 rounded-[2rem] border border-white/5 custom-scrollbar">
                  <table className="w-full text-[11px] font-mono border-collapse">
                    <thead>
                      <tr className="bg-white/[0.03] text-glow-blue sticky top-0 z-10 border-b border-white/10">
                        {previewHeaders.map((h) => (
                          <th key={h} className="text-left py-6 px-6 font-bold uppercase tracking-widest whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 bg-black/20">
                      {previewData.map((row, i) => (
                        <tr key={i} className="hover:bg-white/[0.03] transition-colors">
                          {previewHeaders.map((h) => (
                            <td key={h} className="py-6 px-6 text-slate-400 whitespace-nowrap">{String(row[h] ?? '—')}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
               </div>
               <div className="mt-10 flex justify-end gap-6 items-center">
                  <p className="text-[10px] text-slate-600 font-bold uppercase italic">System verification check finalized via L4 protocol.</p>
                  <button onClick={() => setShowPreview(false)} className="px-12 py-4 bg-glow-blue text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-lg">Confirm Integrity</button>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
