"use client";

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Box, Shield, Zap, ArrowRight, Activity, MapPin, Upload, 
  Plus, Edit2, Trash2, CheckCircle2, AlertTriangle, Search,
  BarChart3, Layers, Globe, Filter, Save, X, Database
} from 'lucide-react';
import { useStore, Supplier } from '@/store/useStore';
import Link from 'next/link';

export default function BackupSuppliers() {
  const { suppliers, activeSimulation, updateSupplier, deleteSupplier, addSupplier, userRole } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Supplier>>({
    name: '', category: 'Logistics', tier: 1, lat: 0, lng: 0, health: 100, isBackup: true, visibility: 'Public'
  });

  const hasData = suppliers.length > 0;
  const backups = suppliers.filter(s => s.isBackup);

  const filteredBackups = backups.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Recommendations from active simulation (isolated)
  const currentRecommendations = activeSimulation?.simulatedRecommendations || [];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
        updateSupplier(editingId, formData);
        setEditingId(null);
    } else {
        addSupplier({ ...formData, id: `bk-${Date.now()}` } as Supplier);
    }
    setIsAdding(false);
    setFormData({ name: '', category: 'Logistics', tier: 1, lat: 0, lng: 0, health: 100, isBackup: true, visibility: 'Public' });
  };

  const handleEdit = (s: Supplier) => {
    setEditingId(s.id);
    setFormData({ ...s });
    setIsAdding(true);
  };

  if (!hasData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-10 bg-[#0a0c10]/50 rounded-[3.5rem] border border-white/5 border-dashed">
         <Shield className="w-16 h-16 text-slate-800 mb-6" />
         <h2 className="font-header text-3xl text-white uppercase italic mb-4">Backup Readiness <span className="text-glow-blue">Offline</span></h2>
         <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed mb-8 font-bold uppercase tracking-tight">Redundancy protocols are inactive. Upload your dataset to identify backup nodes and initialize failover intelligence.</p>
         <Link href="/data/upload">
           <button className="px-10 py-5 bg-glow-blue text-white rounded-2xl font-bold uppercase tracking-widest text-xs shadow-[0_0_30px_rgba(59,130,246,0.3)]">Initalize Failover Matrix</button>
         </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-end bg-[#0a0c10]/50 p-10 rounded-[3rem] border border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px]" />
        <div>
           <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-glow-blue/10 rounded-xl flex items-center justify-center border border-glow-blue/20">
                 <Shield className="w-5 h-5 text-glow-blue" />
              </div>
              <span className="text-xs font-bold text-glow-blue uppercase tracking-[0.4em]">Redundancy Infrastructure</span>
           </div>
           <h2 className="font-header text-5xl text-white tracking-tighter uppercase italic leading-[0.9] mb-4">
              Backup <span className="text-glow-blue">Readiness Matrix</span>
           </h2>
           <p className="text-slate-500 text-sm max-w-xl font-bold uppercase tracking-tight">
             Managing {backups.length} secondary partners for immediate failover. Monitor readiness status and execute AI-staged mitigation during disruptions.
           </p>
        </div>
        
        <div className="flex gap-4">
           <button 
             onClick={() => { setEditingId(null); setIsAdding(true); }}
             className="px-8 py-5 bg-glow-blue text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-xl hover:bg-blue-600 transition-all flex items-center gap-3"
           >
              <Plus className="w-4 h-4" /> Add Backup Partner
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Backup Registry */}
        <div className="lg:col-span-8 space-y-8">
           <div className="glass-panel p-10 rounded-[3rem] border border-white/10 bg-white/[0.01]">
              <div className="flex justify-between items-center mb-10">
                 <h3 className="text-white font-header text-sm uppercase tracking-widest flex items-center gap-2">
                    <Database className="w-4 h-4 text-glow-blue" /> Verified Redundancy Registry
                 </h3>
                 <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      type="text" placeholder="Filter partners..." value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)}
                      className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-[10px] text-white focus:outline-none focus:border-glow-blue w-48"
                    />
                 </div>
              </div>

              <div className="space-y-4">
                 {filteredBackups.map((bk) => (
                   <div key={bk.id} className="p-6 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between group hover:border-glow-blue/20 transition-all">
                      <div className="flex items-center gap-6">
                         <div className="w-12 h-12 bg-glow-blue/10 border border-glow-blue/20 rounded-xl flex items-center justify-center">
                            <Box className="w-6 h-6 text-glow-blue" />
                         </div>
                         <div>
                            <h4 className="text-base font-header text-white uppercase italic truncate pr-4">{bk.name}</h4>
                            <div className="flex items-center gap-3 text-[9px] text-slate-500 font-mono font-bold uppercase">
                               <span>{bk.category}</span>
                               <span className="w-1 h-1 rounded-full bg-white/10" />
                               <span className="text-glow-blue">Tier {bk.tier} Node</span>
                            </div>
                         </div>
                      </div>
                      
                      <div className="flex items-center gap-10">
                         <div className="text-right">
                            <p className="text-[8px] text-slate-600 font-bold uppercase mb-1">Health Score</p>
                            <p className="text-lg font-header text-white">{bk.health}%</p>
                         </div>
                         <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                            <button onClick={() => handleEdit(bk)} className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-slate-500 hover:text-glow-blue hover:border-glow-blue/40 transition-all"><Edit2 className="w-3.5 h-3.5" /></button>
                            <button onClick={() => deleteSupplier(bk.id)} className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-slate-500 hover:text-critical hover:border-critical/40 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                         </div>
                      </div>
                   </div>
                 ))}
                 {filteredBackups.length === 0 && (
                   <div className="py-20 text-center opacity-30 border border-dashed border-white/10 rounded-3xl">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">No matching backup nodes found.</p>
                   </div>
                 )}
              </div>
           </div>

           {/* Failover Recommendation Dashboard (Simulation Isolated) */}
           <AnimatePresence>
            {currentRecommendations.length > 0 && (
               <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-10 rounded-[3rem] border border-white/10">
                  <h3 className="text-white font-header text-sm uppercase tracking-widest mb-10 flex items-center gap-2">
                     <Zap className="w-4 h-4 text-glow-blue" /> Staged Mitigation Vectors (Simulation)
                  </h3>
                  <div className="space-y-6">
                     {currentRecommendations.map((rec, i) => (
                       <div key={i} className="p-8 bg-glow-blue/5 border border-glow-blue/10 rounded-[2.5rem] flex flex-col gap-6 relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-6 opacity-[0.05]"><Shield className="w-16 h-16 text-glow-blue" /></div>
                          
                          <div className="flex justify-between items-start">
                             <div>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Target Disruption</p>
                                <h4 className="text-xl font-header text-white uppercase italic">{suppliers.find(s=>s.id === rec.supplierId)?.name || 'Unknown Node'}</h4>
                             </div>
                             <div className="text-right">
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Failover Partner</p>
                                <h4 className="text-xl font-header text-glow-blue uppercase italic">{rec.backupName}</h4>
                             </div>
                          </div>

                          <p className="text-[11px] text-slate-300 italic uppercase leading-relaxed font-mono font-bold bg-white/5 p-4 rounded-xl border border-white/5">
                             "{rec.reason}"
                          </p>

                          <div className="grid grid-cols-3 gap-6 py-4 border-y border-white/5">
                             <div>
                                <p className="text-[8px] text-slate-600 font-bold uppercase mb-1">Contact</p>
                                <p className="text-[10px] text-white font-bold">{rec.backupContact.representative}</p>
                             </div>
                             <div>
                                <p className="text-[8px] text-slate-600 font-bold uppercase mb-1">Email</p>
                                <p className="text-[10px] text-glow-blue font-bold">{rec.backupContact.email}</p>
                             </div>
                             <div>
                                <p className="text-[8px] text-slate-600 font-bold uppercase mb-1">Phone</p>
                                <p className="text-[10px] text-white font-bold">{rec.backupContact.phone}</p>
                             </div>
                          </div>

                          <div className="flex items-center justify-between">
                             <div className="flex gap-8">
                                <div className="text-left">
                                   <p className="text-[8px] text-slate-600 font-bold uppercase mb-1">Risk Offset</p>
                                   <p className="text-2xl font-header text-success">-{rec.riskReduction}%</p>
                                </div>
                                <div className="text-left">
                                   <p className="text-[8px] text-slate-600 font-bold uppercase mb-1">Resilience Boost</p>
                                   <p className="text-2xl font-header text-glow-blue">+{rec.resilienceBoost}%</p>
                                </div>
                             </div>
                             <button className="px-12 py-4 bg-glow-blue hover:bg-blue-600 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-2xl transition-all">Execute Failover</button>
                          </div>
                       </div>
                     ))}
                  </div>
               </motion.div>
            )}
           </AnimatePresence>
        </div>

        {/* Readiness Intelligence */}
        <div className="lg:col-span-4 space-y-8">
           <div className="glass-panel p-10 rounded-[3rem] border border-white/10 bg-glow-blue/[0.02]">
              <h3 className="text-white font-header text-sm uppercase tracking-widest mb-8 flex items-center gap-2">
                 <Activity className="w-4 h-4 text-glow-blue" /> Readiness Analytics
              </h3>
              <div className="space-y-8">
                 {[
                   { label: 'Redundancy Ratio', val: Math.round((backups.length / suppliers.length) * 100) || 0, color: 'text-glow-blue' },
                   { label: 'Verified Throughput', val: 92, color: 'text-success' },
                   { label: 'Avg Health Score', val: Math.round(backups.reduce((a,s)=>a+s.health,0)/backups.length) || 0, color: 'text-white' },
                 ].map((stat, i) => (
                   <div key={i}>
                      <div className="flex justify-between items-center mb-3 text-[10px] font-bold uppercase tracking-widest">
                         <span className="text-slate-500">{stat.label}</span>
                         <span className={stat.color}>{stat.val}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                         <motion.div initial={{ width: 0 }} animate={{ width: `${stat.val}%` }} className={`h-full ${stat.color.replace('text-', 'bg-')}`} />
                      </div>
                   </div>
                 ))}
              </div>
              <div className="mt-12 p-6 bg-white/5 border border-white/5 rounded-2xl">
                 <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mb-4">Failover Protocol v4.2</p>
                 <p className="text-[11px] text-slate-400 leading-relaxed uppercase font-mono italic font-bold">
                    "Current backup infrastructure provides 14.2% structural redundancy across Tier 1 dependencies. Geographic diversification is RECOMMENDED for APAC clusters."
                 </p>
              </div>
           </div>

           <div className="glass-panel p-10 rounded-[3rem] border border-white/10">
              <h3 className="text-white font-header text-sm uppercase tracking-widest mb-10 flex items-center gap-2">
                 <Layers className="w-4 h-4 text-glow-blue" /> Category Comparison
              </h3>
              <div className="space-y-6">
                 {['Logistics', 'Semiconductors', 'Raw Materials'].map((cat, i) => {
                    const count = backups.filter(s => s.category === cat).length;
                    return (
                      <div key={i} className="flex justify-between items-center p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                         <span className="text-[10px] text-slate-400 font-bold uppercase">{cat}</span>
                         <div className="flex items-center gap-3">
                            <span className="text-sm font-header text-white">{count}</span>
                            <div className={`w-2 h-2 rounded-full ${count > 0 ? 'bg-success' : 'bg-critical'}`} />
                         </div>
                      </div>
                    );
                 })}
              </div>
           </div>
        </div>
      </div>

      {/* Add/Edit Backup Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAdding(false)} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="glass-panel w-full max-w-lg rounded-[3rem] border border-white/10 relative z-10 overflow-hidden bg-[#0a0c10]">
               <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                  <h3 className="font-header text-xl text-white uppercase italic">{editingId ? 'Edit' : 'Define'} <span className="text-glow-blue">Backup Partner</span></h3>
                  <button onClick={() => setIsAdding(false)} className="text-slate-500 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
               </div>
               
               <form onSubmit={handleSave} className="p-8 space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-2 space-y-2">
                       <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest ml-1">Entity Name</label>
                       <input required type="text" value={formData.name} onChange={(e)=>setFormData({...formData, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-xs text-white focus:outline-none focus:border-glow-blue font-bold uppercase tracking-widest" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest ml-1">Category</label>
                       <input required type="text" value={formData.category} onChange={(e)=>setFormData({...formData, category: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-xs text-white focus:outline-none focus:border-glow-blue font-bold uppercase tracking-widest" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest ml-1">Tier Level</label>
                       <select value={formData.tier} onChange={(e)=>setFormData({...formData, tier: parseInt(e.target.value) as any})} className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-xs text-white focus:outline-none focus:border-glow-blue font-bold uppercase tracking-widest appearance-none">
                          <option value={1}>Tier 1</option>
                          <option value={2}>Tier 2</option>
                          <option value={3}>Tier 3</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest ml-1">Latitude</label>
                       <input required type="number" step="any" value={formData.lat} onChange={(e)=>setFormData({...formData, lat: parseFloat(e.target.value)})} className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-xs text-white focus:outline-none focus:border-glow-blue font-bold uppercase tracking-widest" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest ml-1">Longitude</label>
                       <input required type="number" step="any" value={formData.lng} onChange={(e)=>setFormData({...formData, lng: parseFloat(e.target.value)})} className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-xs text-white focus:outline-none focus:border-glow-blue font-bold uppercase tracking-widest" />
                    </div>
                  </div>

                  <div className="pt-6 flex gap-4">
                     <button type="button" onClick={() => setIsAdding(false)} className="flex-1 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-header text-[10px] uppercase tracking-widest transition-all">Cancel</button>
                     <button type="submit" className="flex-1 py-4 bg-glow-blue hover:bg-blue-600 text-white font-header text-[10px] uppercase tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] flex items-center justify-center gap-2">
                        <Save className="w-4 h-4" /> Finalize Partner
                     </button>
                  </div>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
