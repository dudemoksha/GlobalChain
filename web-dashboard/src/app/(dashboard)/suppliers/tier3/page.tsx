"use client";

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Factory, Package, Layers, Activity, Zap, AlertTriangle, 
  TrendingDown, Globe, Search, Filter, Thermometer, Droplets, Upload
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import Link from 'next/link';

export default function Tier3MaterialsPage() {
  const { suppliers } = useStore();
  const [bufferInitiated, setBufferInitiated] = useState(false);
  const tier3 = suppliers.filter(s => s.tier === 3);
  const hasData = suppliers.length > 0;

  const avgHealth = tier3.length > 0 ? Math.round(tier3.reduce((a, s) => a + s.health, 0) / tier3.length) : 0;
  const scarcityIndex = 100 - avgHealth;

  if (!hasData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-10 bg-[#0a0c10]/50 rounded-[3.5rem] border border-white/5 border-dashed">
         <Package className="w-16 h-16 text-slate-800 mb-6" />
         <h2 className="font-header text-3xl text-white uppercase italic mb-4">Tier 3 Resource Pool <span className="text-warning">Offline</span></h2>
         <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed mb-8 font-bold uppercase tracking-tight">Raw material tracking is inactive. Upload your dataset to monitor foundational resources and extraction node stability.</p>
         <Link href="/data/upload">
           <button className="px-10 py-5 bg-warning text-black rounded-2xl font-bold uppercase tracking-widest text-xs shadow-[0_0_30px_rgba(245,158,11,0.3)] hover:bg-white transition-all">Connect Resource Stream</button>
         </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
           <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-warning/10 rounded-xl flex items-center justify-center border border-warning/20">
                 <Package className="w-5 h-5 text-warning" />
              </div>
              <span className="text-xs font-bold text-warning uppercase tracking-[0.4em]">Raw Material Sub-Layer</span>
           </div>
           <h2 className="font-header text-5xl text-white tracking-tighter uppercase italic leading-[0.9] mb-4">
              Tier 3 <span className="text-warning">Resource Pool</span>
           </h2>
           <p className="text-slate-500 text-sm max-w-xl font-bold uppercase tracking-tight">Deep-layer tracking of {tier3.length} foundational material nodes across global mining and chemical clusters.</p>
        </div>
        
        <div className="flex gap-4">
           <div className="px-8 py-6 glass-panel rounded-3xl border border-white/10 flex flex-col items-center min-w-[200px]">
              <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest mb-1">Scarcity Index</p>
              <p className="text-3xl font-header text-white">{scarcityIndex}</p>
              <div className={`flex items-center gap-1 text-[10px] font-bold mt-1 uppercase ${scarcityIndex > 40 ? 'text-critical' : 'text-success'}`}>
                 {scarcityIndex > 40 ? <TrendingDown className="w-3 h-3" /> : <Zap className="w-3 h-3" />} {scarcityIndex > 40 ? 'SUPPLY_DEFICIT' : 'NOMINAL_FLOW'}
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {tier3.slice(0, 8).map((mat, i) => (
          <motion.div key={mat.id} whileHover={{ y: -5 }} className="glass-panel p-8 rounded-[2.5rem] border border-white/10 relative group overflow-hidden">
             <div className="absolute top-0 right-0 w-24 h-24 bg-warning/[0.02] rounded-bl-[4rem] group-hover:bg-warning/5 transition-all flex items-center justify-center translate-x-4 -translate-y-4">
                <Layers className="w-10 h-10 text-warning opacity-10 group-hover:opacity-100 transition-opacity" />
             </div>
             <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-2">Category: {mat.category}</p>
             <h3 className="text-2xl font-header text-white mb-6 uppercase italic truncate pr-4">{mat.name}</h3>
             <div className="space-y-4">
                <div className="flex justify-between items-center text-[10px] uppercase font-bold">
                   <span className="text-slate-500">Global Supply</span>
                   <span className={mat.health < 40 ? 'text-critical' : 'text-success'}>{mat.health}%</span>
                </div>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                   <motion.div initial={{ width: 0 }} animate={{ width: `${mat.health}%` }} className={`h-full ${mat.health < 40 ? 'bg-critical' : 'bg-warning'}`} />
                </div>
             </div>
             <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
                <span className={`text-[9px] font-bold uppercase tracking-widest ${mat.health < 40 ? 'text-critical' : mat.health < 70 ? 'text-warning' : 'text-success'}`}>{mat.health < 40 ? 'CRITICAL' : mat.health < 70 ? 'HIGH' : 'LOW'} RISK</span>
                <span className="text-[9px] text-slate-600 font-mono italic">Tier 3 Node</span>
             </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         <div className="lg:col-span-2 glass-panel p-10 rounded-[3rem] border border-white/10 bg-white/[0.01] h-[500px] relative overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.03]" />
            <div className="relative z-10 h-full flex flex-col justify-between">
               <div className="flex justify-between items-start">
                  <div>
                     <h3 className="text-white font-header text-sm uppercase tracking-widest flex items-center gap-2">
                        <Globe className="w-4 h-4 text-warning" /> Resource_Extraction_Overlay
                     </h3>
                     <p className="text-[10px] text-slate-500 font-mono mt-1 uppercase">Source_Nodes: {tier3.length} Active // {tier3.filter(s => s.health < 20).length} Critical</p>
                  </div>
               </div>

               <div className="flex justify-between items-end">
                  <div className="p-8 bg-black/40 border border-white/10 rounded-[2rem] backdrop-blur-md max-w-sm">
                     <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center border border-warning/20">
                           <AlertTriangle className={`w-5 h-5 ${scarcityIndex > 40 ? 'text-critical animate-pulse' : 'text-warning'}`} />
                        </div>
                        <div>
                           <p className="text-xs font-bold text-white uppercase">{scarcityIndex > 40 ? 'Strategic Deficit Detected' : 'Supply Chain Nominal'}</p>
                           <p className="text-[9px] text-slate-500 font-mono uppercase mt-0.5 italic">Resolution Speed: 1.4ms // Grid Active</p>
                        </div>
                     </div>
                     <button 
                        onClick={() => { setBufferInitiated(true); setTimeout(() => setBufferInitiated(false), 3000); }}
                        className="w-full py-4 bg-warning text-black font-bold text-[10px] uppercase tracking-widest rounded-xl hover:bg-white transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)]"
                     >
                        {bufferInitiated ? 'Strategic Buffer Initiated' : 'Initiate Strategic Buffer'}
                     </button>
                  </div>
                  
                  <div className="flex flex-col gap-3">
                     {[
                       { label: 'Avg Node Stability', val: `${avgHealth}%`, color: avgHealth < 60 ? 'text-critical' : 'text-warning' },
                       { label: 'Environmental Stress', val: `${scarcityIndex}%`, color: scarcityIndex > 40 ? 'text-critical' : 'text-success' },
                     ].map((stat, i) => (
                       <div key={i} className="p-4 bg-black/40 border border-white/10 rounded-2xl min-w-[180px]">
                          <p className="text-[8px] text-slate-600 font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                          <p className={`text-lg font-header ${stat.color}`}>{stat.val}</p>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>

         <div className="glass-panel p-10 rounded-[3rem] border border-white/10 h-full flex flex-col justify-between">
            <div>
               <h3 className="text-white font-header text-sm uppercase tracking-widest mb-10 flex items-center gap-2">
                  <Factory className="w-4 h-4 text-warning" /> Resource Intel
               </h3>
               <div className="space-y-12">
                  {tier3.slice(0, 4).map((s, i) => (
                    <div key={i}>
                       <div className="flex justify-between items-center mb-3 text-[9px] font-bold uppercase tracking-widest">
                          <span className="text-slate-400">{s.name}</span>
                          <span className={s.health < 40 ? 'text-critical' : 'text-success'}>{s.health < 40 ? 'CRITICAL' : 'STABLE'}</span>
                       </div>
                       <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${s.health}%` }} className="h-full bg-warning shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                       </div>
                    </div>
                  ))}
               </div>
            </div>
            <div className="mt-12 p-8 bg-warning/5 border border-warning/10 rounded-[2.5rem]">
               <p className="text-[10px] text-warning font-bold uppercase tracking-widest mb-4">Tactical Advisory</p>
               <p className="text-[11px] text-slate-500 leading-relaxed uppercase font-mono italic">
                 {avgHealth < 70 ? `Warning: Tier 3 resource stability is compromised. Projected impact on Tier 2 components: 14.2% yield reduction.` : "Foundation resources are maintaining target throughput levels. No immediate procurement pivot required."}
               </p>
            </div>
         </div>
      </div>
    </div>
  );
}
