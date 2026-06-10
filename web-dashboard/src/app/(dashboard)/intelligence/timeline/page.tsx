"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, Activity, Zap, 
  Search, Filter, Globe, 
  AlertTriangle, CheckCircle2,
  TrendingUp, Layers, Database,
  ArrowRight, ShieldAlert, Cpu
} from 'lucide-react';

export default function IntelligenceTimelinePage() {
  const events = [
    { time: '02:42:14', type: 'System', label: 'NEURAL_MODEL_RECALIBRATED', status: 'Success', node: 'GLOBAL_CORE' },
    { time: '01:14:02', type: 'Alert', label: 'SUEZ_CONGESTION_INCREASE_12%', status: 'Warning', node: 'APAC-EMEA' },
    { time: '23:54:12', type: 'Audit', label: 'TIER_2_IDENTITY_MASKING_SYNC', status: 'Success', node: 'SECURE_VAULT' },
    { time: '21:04:42', type: 'Sim', label: 'FLOOD_STRESS_TEST_COMPLETE', status: 'Critical', node: 'SIM_ENGINE' },
    { time: '19:42:01', type: 'Data', label: 'SHARD_GAMMA_LOAD_SPIKE', status: 'Warning', node: 'DB_CLUSTER' },
  ];

  return (
    <div className="space-y-8 font-mono">
      {/* Header */}
      <div className="flex justify-between items-start border-b border-white/10 pb-8">
        <div>
           <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
                 <Clock className="w-5 h-5 text-slate-400" />
              </div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-[0.4em]">Intelligence Stream Persistence</span>
           </div>
           <h2 className="font-header text-5xl text-white tracking-tighter uppercase italic leading-[0.9] mb-4">
              Timeline <span className="text-glow-blue">Feed</span>
           </h2>
           <p className="text-slate-500 text-sm max-w-xl font-bold uppercase tracking-tight">Real-time sequential log of all nodal mutations, simulation results, and external intelligence ingestion events.</p>
        </div>
        
        <div className="flex gap-4">
           <div className="px-8 py-6 glass-panel rounded-3xl border border-white/10 flex flex-col items-center">
              <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest mb-1">Events Today</p>
              <p className="text-3xl font-header text-white tracking-widest">4,204</p>
              <div className="flex items-center gap-1 text-[10px] font-bold text-glow-blue mt-1 uppercase">
                 <Zap className="w-3 h-3" /> Live_Syncing
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         {/* Timeline Log (Unique) */}
         <div className="lg:col-span-2 space-y-6">
            <h3 className="text-white font-header text-sm uppercase tracking-widest px-2 flex items-center gap-2">
               <Database className="w-4 h-4 text-glow-blue" /> Master_Event_Registry
            </h3>
            <div className="space-y-4">
               {events.map((event, i) => (
                 <motion.div 
                   key={i}
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: i * 0.1 }}
                   className="p-8 bg-white/[0.02] border border-white/5 rounded-[2rem] flex items-center justify-between group hover:border-glow-blue/30 transition-all cursor-pointer relative overflow-hidden"
                 >
                    <div className="absolute top-0 left-0 h-full w-1 bg-glow-blue/20 group-hover:bg-glow-blue transition-all" />
                    
                    <div className="flex items-center gap-10 flex-1">
                       <div className="text-left w-24">
                          <p className="text-[8px] text-slate-600 font-bold uppercase tracking-widest mb-1">Timestamp</p>
                          <p className="text-xs text-slate-400 font-mono">{event.time}</p>
                       </div>
                       
                       <div className="flex-1">
                          <p className="text-[8px] text-slate-600 font-bold uppercase tracking-widest mb-1">Event Logic</p>
                          <h4 className="text-sm text-white font-header italic uppercase tracking-widest group-hover:text-glow-blue transition-colors">{event.label}</h4>
                       </div>

                       <div className="w-32">
                          <p className="text-[8px] text-slate-600 font-bold uppercase tracking-widest mb-1">Node</p>
                          <p className="text-[10px] text-slate-500 font-bold">{event.node}</p>
                       </div>
                    </div>

                    <div className="flex items-center gap-4">
                       <span className={`px-4 py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest ${
                         event.status === 'Success' ? 'bg-success/10 text-success' : event.status === 'Warning' ? 'bg-warning/10 text-warning' : 'bg-critical/10 text-critical'
                       }`}>
                          {event.status}
                       </span>
                       <ArrowRight className="w-4 h-4 text-slate-700 group-hover:text-glow-blue transition-colors" />
                    </div>
                 </motion.div>
               ))}
            </div>
            <button className="w-full py-5 bg-white/5 border border-white/10 rounded-2xl text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em] hover:bg-white/10 transition-all">
               Load_Historical_Registry
            </button>
         </div>

         {/* Stream Intelligence */}
         <div className="space-y-8">
            <div className="glass-panel p-10 rounded-[3rem] border border-white/10 h-full">
               <h3 className="text-white font-header text-sm uppercase tracking-widest mb-10 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-glow-blue" /> High-Frequency Stats
               </h3>
               
               <div className="space-y-12">
                  {[
                    { label: 'Events / Second', val: 14.2 },
                    { label: 'Storage Persistence', val: 99.9 },
                    { label: 'Model Latency', val: 0.8 },
                    { label: 'Alert Suppression', val: 92 },
                  ].map((stat, i) => (
                    <div key={i}>
                       <div className="flex justify-between items-center mb-3 text-[10px] font-bold uppercase tracking-widest">
                          <span className="text-slate-400">{stat.label}</span>
                          <span className="text-white font-mono">{stat.val}</span>
                       </div>
                       <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${stat.val}%` }} className="h-full bg-glow-blue shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                       </div>
                    </div>
                  ))}
               </div>

               <div className="mt-16 p-10 bg-glow-blue/5 border border-glow-blue/10 rounded-[2.5rem] relative group cursor-pointer hover:bg-glow-blue/10 transition-all">
                  <div className="flex items-center gap-4 mb-6">
                     <div className="w-10 h-10 bg-glow-blue/10 rounded-xl flex items-center justify-center border border-glow-blue/20">
                        <Cpu className="w-5 h-5 text-glow-blue" />
                     </div>
                     <span className="text-xs font-bold text-white uppercase tracking-widest">Neural Stream Audit</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed uppercase font-mono italic">
                    The intelligence stream is currently processing high volumes of Tier 2 masking events. Persistence integrity is nominal.
                  </p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
