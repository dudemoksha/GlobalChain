"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  History, Clock, Play, 
  Activity, Search, Filter,
  FileText, Download, Trash2,
  Layers, Database, Zap,
  CheckCircle2, AlertTriangle, XCircle
} from 'lucide-react';

export default function SimulationHistoryPage() {
  const history = [
    { id: 'SIM-802', type: 'Flood', date: '2026-05-14', impact: 'Severe', status: 'Completed', score: 42 },
    { id: 'SIM-794', type: 'Cyber', date: '2026-05-12', impact: 'Moderate', status: 'Completed', score: 84 },
    { id: 'SIM-788', type: 'Logistics', date: '2026-05-10', impact: 'Extreme', status: 'Failed', score: 12 },
    { id: 'SIM-772', type: 'Port', date: '2026-05-08', impact: 'Low', status: 'Completed', score: 92 },
  ];

  return (
    <div className="space-y-8 font-mono">
      {/* Header */}
      <div className="flex justify-between items-start border-b border-white/10 pb-8">
        <div>
           <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
                 <History className="w-5 h-5 text-slate-400" />
              </div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-[0.4em]">Historical Impact Audit</span>
           </div>
           <h2 className="font-header text-5xl text-white tracking-tighter uppercase italic leading-[0.9] mb-4">
              Simulation <span className="text-glow-blue">History</span>
           </h2>
           <p className="text-slate-500 text-sm max-w-xl font-bold uppercase tracking-tight">Reviewing previous stress-test data to track platform resilience improvements and identify recurring vulnerabilities.</p>
        </div>
        
        <div className="flex gap-4">
           <div className="px-8 py-6 glass-panel rounded-3xl border border-white/10 flex flex-col items-center">
              <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest mb-1">Total Simulations</p>
              <p className="text-3xl font-header text-white">1,402</p>
              <div className="flex items-center gap-1 text-[10px] font-bold text-glow-blue mt-1 uppercase">
                 <Activity className="w-3 h-3" /> Growth: +14%
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         {/* History Table (Unique) */}
         <div className="lg:col-span-2 glass-panel p-10 rounded-[3rem] border border-white/10 h-fit">
            <div className="flex justify-between items-center mb-10">
               <h3 className="text-white font-header text-sm uppercase tracking-widest flex items-center gap-2">
                  <Database className="w-4 h-4 text-glow-blue" /> Archive_Registry
               </h3>
               <div className="flex gap-4">
                  <div className="relative">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600" />
                     <input type="text" placeholder="FILTER_HISTORY..." className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-[10px] text-white focus:outline-none focus:border-glow-blue/50 transition-all font-bold tracking-widest" />
                  </div>
               </div>
            </div>

            <div className="space-y-4">
               {history.map((sim, i) => (
                 <motion.div 
                   key={sim.id}
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: i * 0.1 }}
                   className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-between group hover:border-white/20 transition-all cursor-pointer"
                 >
                    <div className="flex items-center gap-8 flex-1">
                       <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-slate-600 group-hover:text-glow-blue transition-all border border-white/10">
                          <Play className="w-5 h-5" />
                       </div>
                       <div className="grid grid-cols-3 gap-x-8 flex-1">
                          <div>
                             <p className="text-[8px] text-slate-600 uppercase font-bold tracking-widest mb-1">Scenario ID</p>
                             <p className="text-sm text-white font-header uppercase italic">{sim.id}</p>
                          </div>
                          <div>
                             <p className="text-[8px] text-slate-600 uppercase font-bold tracking-widest mb-1">Class</p>
                             <p className="text-sm text-slate-400 font-bold uppercase tracking-tight">{sim.type}</p>
                          </div>
                          <div>
                             <p className="text-[8px] text-slate-600 uppercase font-bold tracking-widest mb-1">Timestamp</p>
                             <p className="text-sm text-slate-500 font-bold uppercase tracking-tight font-mono">{sim.date}</p>
                          </div>
                       </div>
                    </div>

                    <div className="flex items-center gap-8">
                       <div className="text-right">
                          <p className="text-[8px] text-slate-600 uppercase font-bold tracking-widest mb-1">Resilience</p>
                          <span className={`text-[10px] font-bold uppercase tracking-widest ${
                            sim.score > 70 ? 'text-success' : sim.score > 40 ? 'text-warning' : 'text-critical'
                          }`}>{sim.score}%</span>
                       </div>
                       <div className="flex gap-2">
                          <button className="p-3 hover:bg-white/5 rounded-xl text-slate-600 hover:text-white transition-all"><Download className="w-4 h-4" /></button>
                          <button className="p-3 hover:bg-critical/10 rounded-xl text-slate-600 hover:text-critical transition-all"><Trash2 className="w-4 h-4" /></button>
                       </div>
                    </div>
                 </motion.div>
               ))}
            </div>
         </div>

         {/* Historical Intelligence */}
         <div className="space-y-8">
            <div className="glass-panel p-10 rounded-[3rem] border border-white/10 h-full">
               <h3 className="text-white font-header text-sm uppercase tracking-widest mb-10 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-glow-blue" /> Long-Term Trends
               </h3>
               
               <div className="space-y-12">
                  {[
                    { label: 'Avg Survival Rate', val: 82 },
                    { label: 'Failover Success', val: 94 },
                    { label: 'Network Integrity', val: 78 },
                    { label: 'Model Accuracy', val: 96 },
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

               <div className="mt-16 p-8 bg-glow-blue/5 border border-glow-blue/10 rounded-[2.5rem] relative group cursor-pointer hover:bg-glow-blue/10 transition-all">
                  <div className="flex items-center gap-4 mb-6">
                     <div className="w-10 h-10 bg-glow-blue/10 rounded-xl flex items-center justify-center border border-glow-blue/20">
                        <FileText className="w-5 h-5 text-glow-blue" />
                     </div>
                     <span className="text-xs font-bold text-white uppercase tracking-widest">Generate Report</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed uppercase font-mono italic">
                    Export high-fidelity PDF analysis of the last 30 days of simulation activity for executive review.
                  </p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
