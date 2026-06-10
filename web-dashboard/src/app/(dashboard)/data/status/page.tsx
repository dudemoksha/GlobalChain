"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, Database, Server, 
  Search, Filter, CheckCircle2, 
  ArrowUpRight, AlertCircle, Zap,
  Layers, Cpu, RefreshCw, BarChart
} from 'lucide-react';

export default function DataHealthStatusPage() {
  const shards = [
    { id: 'SHARD-ALPHA', health: 98, load: 12, region: 'NA-EAST' },
    { id: 'SHARD-BETA', health: 94, load: 42, region: 'EU-WEST' },
    { id: 'SHARD-GAMMA', health: 88, load: 74, region: 'APAC-CENTRAL' },
    { id: 'SHARD-DELTA', health: 100, load: 4, region: 'LATAM-SOUTH' },
  ];

  return (
    <div className="space-y-8 font-mono">
      {/* Header */}
      <div className="flex justify-between items-start border-b border-white/10 pb-8">
        <div>
           <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
                 <Server className="w-5 h-5 text-slate-400" />
              </div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-[0.4em]">Distributed Graph Persistence Health</span>
           </div>
           <h2 className="font-header text-5xl text-white tracking-tighter uppercase italic leading-[0.9] mb-4">
              Data <span className="text-glow-blue">Health</span> Status
           </h2>
           <p className="text-slate-500 text-sm max-w-xl font-bold uppercase tracking-tight">Monitoring the integrity and latency of distributed data shards supporting the global intelligence engine.</p>
        </div>
        
        <div className="flex gap-4">
           <div className="px-8 py-6 glass-panel rounded-3xl border border-white/10 flex flex-col items-center">
              <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest mb-1">Total Shards</p>
              <p className="text-3xl font-header text-white tracking-widest">32</p>
              <div className="flex items-center gap-1 text-[10px] font-bold text-glow-blue mt-1 uppercase">
                 <RefreshCw className="w-3 h-3" /> Sync_Locked
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {shards.map((shard, i) => (
          <motion.div 
            key={shard.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="glass-panel p-8 rounded-[2.5rem] border border-white/10 relative group overflow-hidden"
          >
             <div className="absolute top-0 right-0 w-24 h-24 bg-white/[0.02] rounded-bl-[4rem] group-hover:bg-glow-blue/5 transition-all flex items-center justify-center translate-x-4 -translate-y-4">
                <Database className="w-10 h-10 text-glow-blue opacity-10 group-hover:opacity-100 transition-opacity" />
             </div>
             
             <h3 className="text-2xl font-header text-white mb-2 uppercase italic leading-tight">{shard.id}</h3>
             <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-8">{shard.region}</p>
             
             <div className="space-y-6">
                <div>
                   <div className="flex justify-between text-[9px] text-slate-600 uppercase font-bold mb-2">
                      <span>Persistence Integrity</span>
                      <span className="text-white">{shard.health}%</span>
                   </div>
                   <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${shard.health}%` }} className="h-full bg-glow-blue" />
                   </div>
                </div>

                <div className="flex justify-between items-end">
                   <div>
                      <p className="text-[8px] text-slate-600 uppercase font-bold tracking-widest mb-1">Current Load</p>
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${shard.load > 70 ? 'text-warning' : 'text-success'}`}>{shard.load}% UTIL</span>
                   </div>
                   <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center">
                      <Activity className={`w-4 h-4 ${shard.health > 90 ? 'text-success' : 'text-warning'}`} />
                   </div>
                </div>
             </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         {/* Performance Chart Placeholder (Unique) */}
         <div className="lg:col-span-2 glass-panel p-10 rounded-[3rem] border border-white/10 bg-white/[0.01] h-[500px] relative overflow-hidden group">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] opacity-10" />
            
            <div className="relative z-10 h-full flex flex-col justify-between">
               <div className="flex justify-between items-start">
                  <div>
                     <h3 className="text-white font-header text-sm uppercase tracking-widest flex items-center gap-2">
                        <BarChart className="w-4 h-4 text-glow-blue" /> Latency_Distribution_Audit
                     </h3>
                     <p className="text-[10px] text-slate-500 font-mono mt-1 uppercase">Global Sync Latency: 14.2ms // P99: 42ms</p>
                  </div>
                  <button className="p-3 bg-black/40 border border-white/10 rounded-xl text-white hover:bg-glow-blue transition-all"><Cpu className="w-4 h-4" /></button>
               </div>

               {/* Abstract Pulse Animation */}
               <div className="flex-1 flex items-center justify-center">
                  <div className="relative">
                     {[...Array(5)].map((_, i) => (
                       <motion.div
                         key={i}
                         animate={{ scale: [1, 2], opacity: [0.3, 0] }}
                         transition={{ duration: 3, delay: i * 0.6, repeat: Infinity }}
                         className="absolute inset-0 border border-glow-blue/20 rounded-full"
                         style={{ width: 100, height: 100, left: -50, top: -50 }}
                       />
                     ))}
                     <div className="w-16 h-16 bg-glow-blue/20 border border-glow-blue/40 rounded-2xl flex items-center justify-center backdrop-blur-xl shadow-[0_0_50px_rgba(59,130,246,0.3)]">
                        <Zap className="w-8 h-8 text-white" />
                     </div>
                  </div>
               </div>

               <div className="p-6 bg-black/40 border border-white/10 rounded-[2.5rem] backdrop-blur-md flex items-center justify-between">
                  <div className="flex gap-10">
                     <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-success" />
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest italic">Sync_Status: NOMINAL</span>
                     </div>
                  </div>
                  <button className="px-8 py-3 bg-glow-blue text-white font-bold text-[9px] uppercase tracking-widest rounded-xl hover:bg-white hover:text-black transition-all">
                     Initiate Re-Index
                  </button>
               </div>
            </div>
         </div>

         {/* Health Intelligence */}
         <div className="glass-panel p-10 rounded-[3rem] border border-white/10 h-full">
            <h3 className="text-white font-header text-sm uppercase tracking-widest mb-10 flex items-center gap-2">
               <Layers className="w-4 h-4 text-glow-blue" /> Infrastructure Intel
            </h3>
            
            <div className="space-y-12">
               {[
                 { label: 'Query Performance', val: 99.2 },
                 { label: 'Storage Utilization', val: 34.4 },
                 { label: 'Replication Lag', val: 0.02 },
                 { label: 'Cache Hit Rate', val: 96.8 },
               ].map((stat, i) => (
                 <div key={i}>
                    <div className="flex justify-between items-center mb-3 text-[10px] font-bold uppercase tracking-widest">
                       <span className="text-slate-400">{stat.label}</span>
                       <span className="text-white font-mono">{stat.val}%</span>
                    </div>
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                       <motion.div initial={{ width: 0 }} animate={{ width: `${stat.val}%` }} className="h-full bg-glow-blue" />
                    </div>
                 </div>
               ))}
            </div>

            <div className="mt-16 p-8 bg-glow-blue/5 border border-glow-blue/10 rounded-[2.5rem]">
               <p className="text-[10px] text-glow-blue font-bold uppercase tracking-widest mb-4">Infrastructure Advisory</p>
               <p className="text-[11px] text-slate-500 leading-relaxed uppercase font-mono italic">
                 Shard-Gamma experiencing elevated load due to high-frequency simulation activity in APAC. Automated shard splitting initiated.
               </p>
            </div>
         </div>
      </div>
    </div>
  );
}
