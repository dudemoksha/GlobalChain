"use client";

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Network, EyeOff, Link2, Activity, Database, Globe, Lock, ArrowUpRight, Upload
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import Link from 'next/link';

export default function Tier2NetworkPage() {
  const { suppliers } = useStore();
  const tier2 = suppliers.filter(s => s.tier === 2);
  const hasData = suppliers.length > 0;

  const avgHealth = tier2.length > 0 ? Math.round(tier2.reduce((a, s) => a + s.health, 0) / tier2.length) : 0;
  const maskedCount = Math.round(tier2.length * 0.85); // Simulated masked ratio

  if (!hasData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-10 bg-[#0a0c10]/50 rounded-[3.5rem] border border-white/5 border-dashed">
         <Network className="w-16 h-16 text-slate-800 mb-6" />
         <h2 className="font-header text-3xl text-white uppercase italic mb-4">Tier 2 Deep Network <span className="text-glow-blue">Offline</span></h2>
         <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed mb-8 font-bold uppercase tracking-tight">Indirect dependency mapping is inactive. Upload your supplier dataset to reveal hidden nodes and calculate Tier 2 risk exposure.</p>
         <Link href="/data/upload">
           <button className="px-10 py-5 bg-glow-blue text-white rounded-2xl font-bold uppercase tracking-widest text-xs shadow-[0_0_30px_rgba(59,130,246,0.3)]">Activate Deep Scan</button>
         </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
           <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-glow-blue/10 rounded-xl flex items-center justify-center border border-glow-blue/20">
                 <Network className="w-5 h-5 text-glow-blue" />
              </div>
              <span className="text-xs font-bold text-glow-blue uppercase tracking-[0.4em]">Indirect Partner Matrix</span>
           </div>
           <h2 className="font-header text-5xl text-white tracking-tighter uppercase italic leading-[0.9] mb-4">
              Tier 2 <span className="text-glow-blue">Deep Network</span>
           </h2>
           <p className="text-slate-500 text-sm max-w-xl font-bold uppercase tracking-tight">Monitoring {tier2.length} indirect dependencies through privacy-preserving identity masking protocols.</p>
        </div>
        
        <div className="flex gap-4">
           <div className="px-8 py-6 glass-panel rounded-3xl border border-white/10 flex flex-col items-center min-w-[200px]">
              <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest mb-1">Total T2 Nodes</p>
              <p className="text-3xl font-header text-white">{tier2.length}</p>
              <div className="flex items-center gap-1 text-[10px] font-bold text-warning mt-1 uppercase">
                 <EyeOff className="w-3 h-3" /> {maskedCount} Masked
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         <div className="lg:col-span-2 glass-panel p-10 rounded-[3rem] border border-white/10 bg-white/[0.01] h-[550px] relative overflow-hidden group">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px]" />
            <div className="relative z-10 h-full flex flex-col justify-between">
               <div className="flex justify-between items-start">
                  <div>
                     <h3 className="text-white font-header text-sm uppercase tracking-widest flex items-center gap-2">
                        <Database className="w-4 h-4 text-glow-blue" /> Shadow_Node_Topology
                     </h3>
                     <p className="text-[10px] text-slate-500 font-mono mt-1 uppercase">Protocol: PRIVACY_PRESERVING_GRAPH_v4</p>
                  </div>
               </div>

               <div className="flex items-center justify-center flex-1">
                  <div className="relative">
                     {[...Array(3)].map((_, i) => (
                       <motion.div key={i} animate={{ rotate: 360 }} transition={{ duration: 30 + (i * 10), repeat: Infinity, ease: "linear" }} className={`absolute inset-0 border border-glow-blue/${10 + (i * 10)} rounded-full`} style={{ width: 150 + (i * 100), height: 150 + (i * 100), left: -(75 + (i * 50)), top: -(75 + (i * 50)) }} />
                     ))}
                     <div className="w-20 h-20 bg-glow-blue rounded-3xl flex items-center justify-center relative z-10 shadow-[0_0_50px_rgba(59,130,246,0.4)]">
                        <Link2 className="text-white w-10 h-10" />
                     </div>
                     {tier2.slice(0, 12).map((s, i) => (
                        <motion.div key={i} className={`absolute w-1.5 h-1.5 rounded-full ${s.health < 40 ? 'bg-critical' : 'bg-glow-blue'}`} style={{
                          top: '50%', left: '50%',
                          transform: `rotate(${i * 30}deg) translate(${100 + (i % 2 * 50)}px) rotate(-${i * 30}deg)`
                        }} animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 3, repeat: Infinity, delay: i * 0.1 }} />
                     ))}
                  </div>
               </div>

               <div className="p-6 bg-black/40 border border-white/10 rounded-[2.5rem] backdrop-blur-md flex items-center justify-between">
                  <div className="flex gap-8">
                     <div>
                        <p className="text-[8px] text-slate-500 uppercase font-bold tracking-widest mb-1">Avg Health</p>
                        <p className="text-sm font-header text-white tracking-widest">{avgHealth}%</p>
                     </div>
                     <div>
                        <p className="text-[8px] text-slate-500 uppercase font-bold tracking-widest mb-1">Risk Exposure</p>
                        <p className={`text-sm font-header tracking-widest ${avgHealth < 70 ? 'text-critical' : 'text-success'}`}>{avgHealth < 70 ? 'HIGH' : 'LOW'}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                     <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest italic">Sync_Status: NOMINAL</span>
                  </div>
               </div>
            </div>
         </div>

         <div className="space-y-6 overflow-y-auto max-h-[550px] pr-2 custom-scrollbar">
            <h3 className="text-white font-header text-sm uppercase tracking-widest px-2">Deep Intel Feed</h3>
            {tier2.map((s, i) => (
              <motion.div key={s.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="glass-panel p-6 rounded-3xl border border-white/5 hover:border-glow-blue/20 transition-all group">
                 <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] text-slate-500 font-mono">ID: {s.id.slice(0, 8)}</span>
                    <span className={`text-[9px] font-bold uppercase tracking-widest ${s.health < 40 ? 'text-critical' : 'text-glow-blue'}`}>{s.health < 40 ? 'CRITICAL' : 'MASKED'}</span>
                 </div>
                 <h4 className="text-white font-header text-xl uppercase italic tracking-tight mb-2 group-hover:text-glow-blue transition-colors truncate pr-4">{s.name}</h4>
                 <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-6">{s.category}</p>
                 <div className="space-y-2">
                    <div className="flex justify-between text-[9px] text-slate-600 uppercase font-bold">
                       <span>Health Score</span>
                       <span className="text-white font-mono">{s.health}%</span>
                    </div>
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                       <motion.div initial={{ width: 0 }} animate={{ width: `${s.health}%` }} className={`h-full ${s.health < 40 ? 'bg-critical' : 'bg-glow-blue'}`} />
                    </div>
                 </div>
                 {s.affectedBy && (
                   <p className="mt-4 text-[9px] text-critical font-mono uppercase italic leading-tight">{s.reason}</p>
                 )}
              </motion.div>
            ))}
         </div>
      </div>
    </div>
  );
}
