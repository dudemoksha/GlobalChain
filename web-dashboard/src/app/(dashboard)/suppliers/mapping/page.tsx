"use client";

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Network, Link2, Share2, Activity, Database, Zap, Workflow, GitBranch, Minimize2, Upload,
  Plus, Trash2, Edit2, Shield, AlertTriangle, ArrowRight, Save, X, Layers,
  Crosshair, BarChart3, TrendingUp, AlertOctagon
} from 'lucide-react';
import { useStore, Edge, Supplier } from '@/store/useStore';
import Link from 'next/link';

export default function RelationshipMappingPage() {
  const { suppliers, edges, addEdge, removeEdge, updateEdge, userRole } = useStore();
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<Edge>>({ source: '', target: '', value: 0.8 });

  const hasData = suppliers.length > 0;

  // Analysis Metrics
  const metrics = useMemo(() => {
    if (!hasData) return { density: '0.0', clusters: 0, critical: 0, exposure: 0 };
    const density = (edges.length / suppliers.length).toFixed(1);
    const critical = edges.filter(e => {
        const s = suppliers.find(sup => sup.id === e.source);
        return s && s.health < 40;
    }).length;
    const exposure = Math.round((critical / (edges.length || 1)) * 100);
    return { density, clusters: Math.ceil(suppliers.length / 4), critical, exposure };
  }, [suppliers, edges, hasData]);

  const handleAddEdge = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.source && formData.target) {
        addEdge(formData as Edge);
        setIsAdding(false);
        setFormData({ source: '', target: '', value: 0.8 });
    }
  };

  if (!hasData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-10 bg-[#0a0c10]/50 rounded-[3.5rem] border border-white/5 border-dashed">
         <Workflow className="w-16 h-16 text-slate-800 mb-6" />
         <h2 className="font-header text-3xl text-white uppercase italic mb-4">Topology Mapping <span className="text-glow-blue">Offline</span></h2>
         <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed mb-8 font-bold uppercase tracking-tight">Relationship telemetry is inactive. Upload your dataset to visualize the interdependency matrix and identify critical failure points.</p>
         <Link href="/data/upload">
           <button className="px-10 py-5 bg-glow-blue text-white rounded-2xl font-bold uppercase tracking-widest text-xs shadow-[0_0_30px_rgba(59,130,246,0.3)]">Initalize Graph Link</button>
         </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start bg-[#0a0c10]/50 p-10 rounded-[3rem] border border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px]" />
        <div>
           <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-glow-blue/10 rounded-xl flex items-center justify-center border border-glow-blue/20">
                 <Workflow className="w-5 h-5 text-glow-blue" />
              </div>
              <span className="text-xs font-bold text-glow-blue uppercase tracking-[0.4em]">Dependency Topology Matrix</span>
           </div>
           <h2 className="font-header text-5xl text-white tracking-tighter uppercase italic leading-[0.9] mb-4">
              Supply <span className="text-glow-blue">Interdependency</span>
           </h2>
           <p className="text-slate-500 text-sm max-w-xl font-bold uppercase tracking-tight">
             Visualizing {edges.length} relationships across {suppliers.length} nodes. Analyze Tier 1 → Tier 2 → Tier 3 propagation chains and structural risk.
           </p>
        </div>
        
        <div className="flex gap-4">
           <button 
             onClick={() => setIsAdding(true)}
             className="px-8 py-5 bg-glow-blue text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-xl hover:bg-blue-600 transition-all flex items-center gap-3"
           >
              <Plus className="w-4 h-4" /> Add Dependency
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         {/* Visual Dependency Graph (Schema-like) */}
         <div className="lg:col-span-8 glass-panel p-10 rounded-[3rem] border border-white/10 bg-black/40 min-h-[700px] relative overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.02]" />
            
            <div className="relative z-10 h-full flex flex-col">
               <div className="flex justify-between items-start mb-10">
                  <div>
                     <h3 className="text-white font-header text-sm uppercase tracking-widest flex items-center gap-2">
                        <Share2 className="w-4 h-4 text-glow-blue" /> Interdependency_Map_v8.4
                     </h3>
                     <p className="text-[10px] text-slate-500 font-mono mt-1 uppercase">Visualizing {edges.length} edges // Propagation active</p>
                  </div>
                  <div className="flex gap-4">
                     {['Tier 1', 'Tier 2', 'Tier 3'].map((t, i) => (
                       <div key={t} className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-white' : i === 1 ? 'bg-glow-blue' : 'bg-warning'}`} />
                          <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">{t}</span>
                       </div>
                     ))}
                  </div>
               </div>

               {/* Relationship Grid Visualization */}
               <div className="flex-1 grid grid-cols-3 gap-10 relative">
                  {/* Tier Columns */}
                  {[1, 2, 3].map((tier) => (
                    <div key={tier} className="flex flex-col gap-4">
                       <h4 className="text-center text-[9px] text-slate-600 font-bold uppercase tracking-[0.3em] mb-4 border-b border-white/5 pb-2">Tier {tier} Layer</h4>
                       <div className="space-y-3 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
                          {suppliers.filter(s => s.tier === tier).map(s => (
                            <div 
                              key={s.id} 
                              className={`p-4 rounded-xl border transition-all cursor-pointer group ${
                                s.health < 40 ? 'bg-critical/10 border-critical/30' : 'bg-white/5 border-white/10 hover:border-glow-blue/50'
                              }`}
                            >
                               <div className="flex justify-between items-start mb-1">
                                  <p className="text-[10px] text-white font-bold uppercase truncate">{userRole === 'MainCompany' && s.tier > 1 ? `Partner ${s.id.slice(0,4)}` : s.name}</p>
                                  <span className="text-[8px] font-mono text-slate-600">{s.id.slice(0,5)}</span>
                               </div>
                               <div className="flex items-center justify-between">
                                  <span className="text-[8px] text-slate-500 uppercase">{s.category}</span>
                                  <div className={`w-1.5 h-1.5 rounded-full ${s.health < 40 ? 'bg-critical animate-pulse' : 'bg-success'}`} />
                               </div>
                            </div>
                          ))}
                       </div>
                    </div>
                  ))}

                  {/* SVG Overlay for Connections (Visual Simulation) */}
                  <div className="absolute inset-0 pointer-events-none opacity-20">
                    <svg className="w-full h-full">
                       {/* This is a visual representation of links. In production, we'd calculate paths between DOM elements. */}
                       <line x1="33%" y1="20%" x2="66%" y2="40%" stroke="white" strokeWidth="0.5" strokeDasharray="4 4" />
                       <line x1="66%" y1="40%" x2="99%" y2="10%" stroke="white" strokeWidth="0.5" strokeDasharray="4 4" />
                    </svg>
                  </div>
               </div>

               <div className="mt-10 p-6 bg-black/40 border border-white/10 rounded-[2.5rem] backdrop-blur-md flex justify-between items-center">
                  <div className="flex gap-10">
                     <div>
                        <p className="text-[8px] text-slate-600 font-bold uppercase mb-1">Dependency Density</p>
                        <p className="text-xl font-header text-white">{metrics.density}x</p>
                     </div>
                     <div>
                        <p className="text-[8px] text-slate-600 font-bold uppercase mb-1">Active Clusters</p>
                        <p className="text-xl font-header text-glow-blue">{metrics.clusters}</p>
                     </div>
                     <div>
                        <p className="text-[8px] text-slate-600 font-bold uppercase mb-1">Critical Paths</p>
                        <p className="text-xl font-header text-critical">{metrics.critical}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-6">
                     <div className="text-right">
                        <p className="text-[8px] text-slate-600 font-bold uppercase mb-1">Operational Exposure</p>
                        <p className="text-xl font-header text-warning">{metrics.exposure}%</p>
                     </div>
                     <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center">
                        <Crosshair className="w-5 h-5 text-glow-blue" />
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* Edge List & Analysis */}
         <div className="lg:col-span-4 space-y-8">
            <div className="glass-panel p-10 rounded-[3rem] border border-white/10 h-full flex flex-col bg-white/[0.01]">
               <h3 className="text-white font-header text-sm uppercase tracking-widest mb-10 flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-glow-blue" /> Relationship Registry
               </h3>
               
               <div className="space-y-4 flex-1 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
                  {edges.map((edge, i) => {
                    const s = suppliers.find(sup => sup.id === edge.source);
                    const t = suppliers.find(sup => sup.id === edge.target) || (edge.target === 'Main' ? { name: 'Main Hub', tier: 0 } : null);
                    if (!s || !t) return null;

                    return (
                      <div key={i} className="p-5 bg-white/5 border border-white/5 rounded-2xl group hover:border-glow-blue/20 transition-all">
                        <div className="flex items-center justify-between mb-4">
                           <div className="flex items-center gap-3">
                              <span className="text-[10px] text-white font-bold uppercase truncate max-w-[80px]">{userRole === 'MainCompany' && s.tier > 1 ? `P-${s.id.slice(0,4)}` : s.name}</span>
                              <ArrowRight className="w-3 h-3 text-slate-600" />
                              <span className="text-[10px] text-glow-blue font-bold uppercase truncate max-w-[80px]">{userRole === 'MainCompany' && (t as any).tier > 1 ? `P-${(t as any).id?.slice(0,4)}` : t.name}</span>
                           </div>
                           <button onClick={() => removeEdge(edge.source, edge.target)} className="p-1.5 hover:bg-critical/10 rounded-lg text-slate-700 hover:text-critical opacity-0 group-hover:opacity-100 transition-all">
                              <Trash2 className="w-3.5 h-3.5" />
                           </button>
                        </div>
                        <div className="flex justify-between items-center">
                           <div className="flex items-center gap-4">
                              <div className="text-[8px] text-slate-600 font-bold uppercase">Dependency</div>
                              <div className="text-sm font-header text-white">{Math.round(edge.value * 100)}%</div>
                           </div>
                           <div className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${s.health < 40 ? 'bg-critical/10 text-critical' : 'bg-success/10 text-success'}`}>
                              {s.health < 40 ? 'Risk High' : 'Stable'}
                           </div>
                        </div>
                      </div>
                    );
                  })}
               </div>

               <div className="mt-10 p-8 bg-glow-blue/5 border border-glow-blue/10 rounded-[2.5rem]">
                  <div className="flex items-center gap-3 mb-4">
                     <AlertOctagon className="w-4 h-4 text-glow-blue" />
                     <p className="text-[10px] text-glow-blue font-bold uppercase tracking-widest">Structural Insights</p>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed uppercase font-mono italic font-bold">
                    {metrics.critical > 0 
                      ? `Alert: ${metrics.critical} critical paths detected. Disruption in Tier 3 clusters will impact Tier 1 operational capacity by estimated ${metrics.exposure}%.`
                      : "Graph topology shows healthy redundancy. Dependency weights are balanced across Tier 2 clusters. Recommended: Maintain current buffers."}
                  </p>
               </div>
            </div>
         </div>
      </div>

      {/* Add Connection Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAdding(false)} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="glass-panel w-full max-w-lg rounded-[3rem] border border-white/10 relative z-10 overflow-hidden bg-[#0a0c10]">
               <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                  <h3 className="font-header text-xl text-white uppercase italic">Define <span className="text-glow-blue">New Relationship</span></h3>
                  <button onClick={() => setIsAdding(false)} className="text-slate-500 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
               </div>
               
               <form onSubmit={handleAddEdge} className="p-8 space-y-6">
                  <div className="space-y-2">
                     <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest ml-1">Source Node (Upstream)</label>
                     <select required value={formData.source} onChange={(e)=>setFormData({...formData, source: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-xs text-white focus:outline-none focus:border-glow-blue font-bold uppercase tracking-widest appearance-none">
                        <option value="" className="bg-[#020617]">Select Supplier</option>
                        {suppliers.map(s => <option key={s.id} value={s.id} className="bg-[#020617]">{s.name} (T{s.tier})</option>)}
                     </select>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest ml-1">Target Node (Downstream)</label>
                     <select required value={formData.target} onChange={(e)=>setFormData({...formData, target: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-xs text-white focus:outline-none focus:border-glow-blue font-bold uppercase tracking-widest appearance-none">
                        <option value="" className="bg-[#020617]">Select Target</option>
                        <option value="Main" className="bg-[#020617]">MAIN HUB (Direct)</option>
                        {suppliers.map(s => <option key={s.id} value={s.id} className="bg-[#020617]">{s.name} (T{s.tier})</option>)}
                     </select>
                  </div>
                  <div className="space-y-4">
                     <div className="flex justify-between px-1">
                        <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Dependency Percentage</label>
                        <span className="text-xs font-mono text-glow-blue">{Math.round((formData.value || 0) * 100)}%</span>
                     </div>
                     <input type="range" min="0" max="1" step="0.1" value={formData.value} onChange={(e)=>setFormData({...formData, value: parseFloat(e.target.value)})} className="w-full h-1 bg-white/5 rounded-full appearance-none cursor-pointer accent-glow-blue" />
                  </div>

                  <div className="pt-6 flex gap-4">
                     <button type="button" onClick={() => setIsAdding(false)} className="flex-1 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-header text-[10px] uppercase tracking-widest transition-all">Cancel</button>
                     <button type="submit" className="flex-1 py-4 bg-glow-blue hover:bg-blue-600 text-white font-header text-[10px] uppercase tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] flex items-center justify-center gap-2">
                        <Save className="w-4 h-4" /> Finalize Link
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
