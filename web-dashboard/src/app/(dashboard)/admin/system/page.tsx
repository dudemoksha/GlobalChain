"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, Activity, Zap, 
  Search, Filter, Globe, 
  ArrowUpRight, CheckCircle2,
  TrendingUp, Layers, Database,
  Cpu, Server, HardDrive, Key
} from 'lucide-react';

export default function SystemAdminDashboardPage() {
  const systems = [
    { name: 'Neural Core', health: 99.4, load: 12, status: 'Stable' },
    { name: 'Graph DB Cluster', health: 92.1, load: 44, status: 'Nominal' },
    { name: 'Auth Bridge', health: 100, load: 8, status: 'Optimal' },
    { name: 'Simulation Engine', health: 84.2, load: 78, status: 'Peak' },
  ];

  return (
    <div className="space-y-8 font-mono">
      {/* Header */}
      <div className="flex justify-between items-start border-b border-white/10 pb-8">
        <div>
           <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
                 <Shield className="w-5 h-5 text-slate-400" />
              </div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-[0.4em]">Root System Architecture Overview</span>
           </div>
           <h2 className="font-header text-5xl text-white tracking-tighter uppercase italic leading-[0.9] mb-4">
              System <span className="text-glow-blue">Admin</span>
           </h2>
           <p className="text-slate-500 text-sm max-w-xl font-bold uppercase tracking-tight">Executive oversight of the GlobalChain technical stack, infrastructure health, and root-level security protocols.</p>
        </div>
        
        <div className="flex gap-4">
           <div className="px-8 py-6 glass-panel rounded-3xl border border-white/10 flex flex-col items-center">
              <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest mb-1">Total Resources</p>
              <p className="text-3xl font-header text-white tracking-widest">1.4 PB</p>
              <div className="flex items-center gap-1 text-[10px] font-bold text-glow-blue mt-1 uppercase">
                 <Activity className="w-3 h-3" /> Storage_Linked
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {systems.map((sys, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="glass-panel p-8 rounded-[2.5rem] border border-white/10 relative group overflow-hidden"
          >
             <div className="absolute top-0 right-0 w-24 h-24 bg-white/[0.02] rounded-bl-[4rem] group-hover:bg-glow-blue/5 transition-all flex items-center justify-center translate-x-4 -translate-y-4">
                <Server className="w-10 h-10 text-glow-blue opacity-10 group-hover:opacity-100 transition-opacity" />
             </div>
             
             <h3 className="text-2xl font-header text-white mb-2 uppercase italic leading-tight">{sys.name}</h3>
             <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-8">System ID: 0x{Math.floor(Math.random() * 9999)}</p>
             
             <div className="space-y-6">
                <div>
                   <div className="flex justify-between text-[9px] text-slate-600 uppercase font-bold mb-2">
                      <span>Integrity</span>
                      <span className="text-white">{sys.health}%</span>
                   </div>
                   <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${sys.health}%` }} className="h-full bg-glow-blue" />
                   </div>
                </div>

                <div className="flex justify-between items-end">
                   <div>
                      <p className="text-[8px] text-slate-600 uppercase font-bold tracking-widest mb-1">Load Status</p>
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${sys.load > 70 ? 'text-warning' : 'text-success'}`}>{sys.status}</span>
                   </div>
                   <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center">
                      <Zap className={`w-4 h-4 ${sys.health > 90 ? 'text-success' : 'text-warning'}`} />
                   </div>
                </div>
             </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         {/* System Analytics (Unique) */}
         <div className="lg:col-span-2 glass-panel p-10 rounded-[3rem] border border-white/10 bg-white/[0.01] h-[500px] relative overflow-hidden group">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] opacity-10" />
            
            <div className="relative z-10 h-full flex flex-col justify-between">
               <div className="flex justify-between items-start">
                  <div>
                     <h3 className="text-white font-header text-sm uppercase tracking-widest flex items-center gap-2">
                        <Database className="w-4 h-4 text-glow-blue" /> Global_Persistence_Audit
                     </h3>
                     <p className="text-[10px] text-slate-500 font-mono mt-1 uppercase">Distributed Persistence Health Across 14 Geozones</p>
                  </div>
                  <div className="flex gap-2">
                     <button className="p-3 bg-black/40 border border-white/10 rounded-xl text-white hover:bg-glow-blue transition-all"><Cpu className="w-4 h-4" /></button>
                     <button className="p-3 bg-black/40 border border-white/10 rounded-xl text-white hover:bg-glow-blue transition-all"><Key className="w-4 h-4" /></button>
                  </div>
               </div>

               {/* Abstract Pulse Animation */}
               <div className="flex-1 flex items-center justify-center">
                  <div className="relative">
                     {[...Array(5)].map((_, i) => (
                       <motion.div
                         key={i}
                         animate={{ scale: [1, 2.5], opacity: [0.2, 0] }}
                         transition={{ duration: 4, delay: i * 0.8, repeat: Infinity }}
                         className="absolute inset-0 border border-glow-blue/20 rounded-full"
                         style={{ width: 120, height: 120, left: -60, top: -60 }}
                       />
                     ))}
                     <div className="w-20 h-20 bg-glow-blue/10 border border-glow-blue/30 rounded-3xl flex items-center justify-center backdrop-blur-xl shadow-[0_0_50px_rgba(59,130,246,0.3)]">
                        <HardDrive className="w-10 h-10 text-glow-blue" />
                     </div>
                  </div>
               </div>

               <div className="p-6 bg-black/40 border border-white/10 rounded-[2.5rem] backdrop-blur-md flex items-center justify-between">
                  <div className="flex gap-10">
                     <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-success" />
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest italic">Core_Status: NOMINAL</span>
                     </div>
                     <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-glow-blue" />
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest italic">Sync: 100%</span>
                     </div>
                  </div>
                  <button className="px-8 py-3 bg-glow-blue text-white font-bold text-[9px] uppercase tracking-widest rounded-xl hover:bg-white hover:text-black transition-all">
                     View Shard Map
                  </button>
               </div>
            </div>
         </div>

         {/* Admin Intel */}
         <div className="glass-panel p-10 rounded-[3rem] border border-white/10 h-full">
            <h3 className="text-white font-header text-sm uppercase tracking-widest mb-10 flex items-center gap-2">
               <Zap className="w-4 h-4 text-glow-blue" /> Root Intelligence
            </h3>
            
            <div className="space-y-12">
               {[
                 { label: 'API Gateway Availability', val: 100 },
                 { label: 'Vulnerability Patching', val: 92.4 },
                 { label: 'Access Control Sync', val: 100 },
                 { label: 'System Backup Health', val: 99.8 },
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

            <div className="mt-16 p-8 bg-glow-blue/5 border border-glow-blue/10 rounded-[2.5rem]">
               <p className="text-[10px] text-glow-blue font-bold uppercase tracking-widest mb-4">Root Advisory</p>
               <p className="text-[11px] text-slate-500 leading-relaxed uppercase font-mono italic">
                 All primary systems are operating at optimal levels. No critical vulnerabilities detected in the last 24-hour sweep.
               </p>
            </div>
         </div>
      </div>
    </div>
  );
}
