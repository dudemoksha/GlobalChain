"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Activity, Zap, 
  Search, Filter, Globe, 
  ArrowUpRight, ShieldCheck, CheckCircle2,
  TrendingUp, Layers, Database,
  Cpu, Terminal, Sliders, Box
} from 'lucide-react';

export default function OperationalMissionControlPage() {
  const operations = [
    { label: 'Core Persistence', status: 'Optimal', val: 99.9, node: 'L1' },
    { label: 'Nodal Handshake', status: 'Active', val: 94.2, node: 'L2' },
    { label: 'Sync Latency', status: 'Warning', val: 42.1, node: 'L3' },
    { label: 'Security Tunnel', status: 'Optimal', val: 100, node: 'L1' },
  ];

  return (
    <div className="space-y-8 font-mono">
      {/* Header */}
      <div className="flex justify-between items-start border-b border-white/10 pb-8">
        <div>
           <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-glow-blue/10 rounded-xl flex items-center justify-center border border-glow-blue/20">
                 <LayoutDashboard className="w-5 h-5 text-glow-blue" />
              </div>
              <span className="text-xs font-bold text-glow-blue uppercase tracking-[0.4em]">Strategic Mission Control</span>
           </div>
           <h2 className="font-header text-5xl text-white tracking-tighter uppercase italic leading-[0.9] mb-4">
              Operational <span className="text-glow-blue">Intelligence</span>
           </h2>
           <p className="text-slate-500 text-sm max-w-xl font-bold uppercase tracking-tight">Real-time oversight of internal system health, nodal throughput, and tactical operational efficiency.</p>
        </div>
        
        <div className="flex gap-4">
           <div className="px-8 py-6 glass-panel rounded-3xl border border-white/10 flex flex-col items-center">
              <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest mb-1">System Health</p>
              <p className="text-3xl font-header text-white tracking-widest">96%</p>
              <div className="flex items-center gap-1 text-[10px] font-bold text-success mt-1 uppercase">
                 <Activity className="w-3 h-3" /> Nominal
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {operations.map((op, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-panel p-8 rounded-[2.5rem] border border-white/10 relative group overflow-hidden"
          >
             <div className="absolute top-0 right-0 w-24 h-24 bg-white/[0.02] rounded-bl-[4rem] group-hover:bg-glow-blue/5 transition-all flex items-center justify-center translate-x-4 -translate-y-4">
                <Cpu className="w-10 h-10 text-glow-blue opacity-10 group-hover:opacity-100 transition-opacity" />
             </div>
             
             <h3 className="text-xl font-header text-white mb-2 uppercase italic leading-tight">{op.label}</h3>
             <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-8">Node: {op.node}</p>
             
             <div className="space-y-6">
                <div>
                   <div className="flex justify-between text-[9px] text-slate-600 uppercase font-bold mb-2">
                      <span>Performance</span>
                      <span className="text-white">{op.val}%</span>
                   </div>
                   <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${op.val}%` }} className="h-full bg-glow-blue" />
                   </div>
                </div>

                <div className="flex justify-between items-center">
                   <span className={`text-[10px] font-bold uppercase tracking-widest ${
                     op.status === 'Optimal' ? 'text-success' : 'text-warning'
                   }`}>{op.status}</span>
                   <Sliders className="w-4 h-4 text-slate-700" />
                </div>
             </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         {/* Live Terminal (Unique) */}
         <div className="lg:col-span-2 glass-panel p-10 rounded-[3rem] border border-white/10 bg-black/40 h-[500px] relative overflow-hidden group">
            <div className="absolute top-0 left-0 p-8 flex items-center gap-3">
               <Terminal className="w-4 h-4 text-glow-blue" />
               <span className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.4em]">Live_Operational_Telem</span>
            </div>

            <div className="mt-16 space-y-2 font-mono text-[10px] text-slate-500">
               <p className="text-success">{'>'} CORE_INIT: SUCCESS // PERSISTENCE_SHARD_ALPHA_SYNCED</p>
               <p className="text-white/60">{'>'} MONITORING_NODE_HANDSHAKE: 1,402 ACTIVE CONNECTIONS</p>
               <p className="text-warning">{'>'} WARNING: LATENCY_SPIKE_DETECTED_IN_APAC_REGION_4.2ms</p>
               <p className="text-white/40">{'>'} EXECUTING_AUTOMATED_SHARD_SPLIT_PROTOCOL_v4</p>
               <p className="text-white/20 animate-pulse">{'>'} LISTENING_FOR_INTERNAL_TELEMETRY_STREAM...</p>
            </div>

            <div className="absolute bottom-10 left-10 right-10 flex justify-between items-end">
               <div className="p-6 bg-black/60 border border-white/10 rounded-[2rem] backdrop-blur-md max-w-sm">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-4">Operational Status</p>
                  <div className="flex items-center gap-4">
                     <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                     <span className="text-xs text-white font-bold uppercase italic tracking-widest">System_Nominal</span>
                  </div>
               </div>
               <div className="flex gap-4">
                  <button className="px-6 py-3 bg-white/5 border border-white/10 text-white text-[9px] font-bold uppercase tracking-widest rounded-xl hover:bg-glow-blue transition-all">Export Logs</button>
                  <button className="px-6 py-3 bg-glow-blue text-white text-[9px] font-bold uppercase tracking-widest rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.3)]">Hard Reboot</button>
               </div>
            </div>
         </div>

         {/* Control Panel */}
         <div className="glass-panel p-10 rounded-[3rem] border border-white/10 h-full flex flex-col justify-between">
            <div>
               <h3 className="text-white font-header text-sm uppercase tracking-widest mb-10 flex items-center gap-2">
                  <Box className="w-4 h-4 text-glow-blue" /> Infrastructure
               </h3>
               
               <div className="space-y-12">
                  {[
                    { label: 'Compute Allocation', val: 72 },
                    { label: 'Network Throughput', val: 94 },
                    { label: 'Disk Integrity', val: 100 },
                    { label: 'Memory Pressure', val: 34 },
                  ].map((stat, i) => (
                    <div key={i}>
                       <div className="flex justify-between items-center mb-3 text-[10px] font-bold uppercase tracking-widest">
                          <span className="text-slate-400">{stat.label}</span>
                          <span className="text-white font-mono">{stat.val}%</span>
                       </div>
                       <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${stat.val}%` }} className="h-full bg-glow-blue shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            <div className="mt-16 p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem]">
               <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-4">Command Advisory</p>
               <p className="text-[11px] text-slate-600 leading-relaxed uppercase font-mono italic">
                 No critical operational failures detected. Latency in APAC is being handled by automated shard re-balancing.
               </p>
            </div>
         </div>
      </div>
    </div>
  );
}
