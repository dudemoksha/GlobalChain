"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileSearch, Activity, Zap, 
  Search, Filter, Database, 
  ArrowRight, CheckCircle2,
  TrendingUp, Layers, Terminal,
  History, Download, Trash2,
  User, ShieldCheck
} from 'lucide-react';

export default function InternalAuditLogsPage() {
  const logs = [
    { id: 'TX-4092', user: 'GC-ALPHA', action: 'NODE_MUTATION_Tier2', status: 'Success', time: '12:42:14' },
    { id: 'TX-4088', user: 'SYSTEM', action: 'NEURAL_CORE_RE-SYNC', status: 'Success', time: '11:14:02' },
    { id: 'TX-4082', user: 'GC-BETA', action: 'SLA_BREACH_INITIATE', status: 'Warning', time: '09:54:12' },
    { id: 'TX-4071', user: 'GC-GAMMA', action: 'DATA_INGESTION_VALIDATE', status: 'Success', time: '08:42:01' },
    { id: 'TX-4066', user: 'ADMIN-ROOT', action: 'SYS_ADMIN_REBOOT', status: 'Critical', time: '06:12:42' },
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
              <span className="text-xs font-bold text-slate-500 uppercase tracking-[0.4em]">Internal Transactional Integrity Log</span>
           </div>
           <h2 className="font-header text-5xl text-white tracking-tighter uppercase italic leading-[0.9] mb-4">
              Audit <span className="text-glow-blue">Logs</span>
           </h2>
           <p className="text-slate-500 text-sm max-w-xl font-bold uppercase tracking-tight">Reviewing granular user actions, system mutations, and security handshakes across the internal platform layers.</p>
        </div>
        
        <div className="flex gap-4">
           <div className="px-8 py-6 glass-panel rounded-3xl border border-white/10 flex flex-col items-center">
              <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest mb-1">Total Actions</p>
              <p className="text-3xl font-header text-white tracking-widest">14.2M</p>
              <div className="flex items-center gap-1 text-[10px] font-bold text-success mt-1 uppercase">
                 <ShieldCheck className="w-3 h-3" /> Integrity_Verified
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         {/* Audit Table (Unique) */}
         <div className="lg:col-span-2 glass-panel p-10 rounded-[3rem] border border-white/10 h-fit">
            <div className="flex justify-between items-center mb-10">
               <h3 className="text-white font-header text-sm uppercase tracking-widest flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-glow-blue" /> Master_Audit_Registry
               </h3>
               <div className="flex gap-4">
                  <div className="relative">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600" />
                     <input type="text" placeholder="FILTER_LOGS..." className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-[10px] text-white focus:outline-none focus:border-glow-blue/50 transition-all font-bold tracking-widest" />
                  </div>
               </div>
            </div>

            <div className="space-y-4">
               {logs.map((log, i) => (
                 <motion.div 
                   key={log.id}
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: i * 0.1 }}
                   className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-between group hover:border-white/20 transition-all cursor-pointer"
                 >
                    <div className="flex items-center gap-8 flex-1">
                       <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-slate-600 group-hover:text-glow-blue transition-all border border-white/10">
                          <User className="w-5 h-5" />
                       </div>
                       <div className="grid grid-cols-3 gap-x-8 flex-1">
                          <div>
                             <p className="text-[8px] text-slate-600 uppercase font-bold tracking-widest mb-1">Transaction ID</p>
                             <p className="text-sm text-white font-header uppercase italic">{log.id}</p>
                          </div>
                          <div>
                             <p className="text-[8px] text-slate-600 uppercase font-bold tracking-widest mb-1">Subject</p>
                             <p className="text-sm text-slate-400 font-bold uppercase tracking-tight">{log.user}</p>
                          </div>
                          <div>
                             <p className="text-[8px] text-slate-600 uppercase font-bold tracking-widest mb-1">Mutation Type</p>
                             <p className="text-sm text-slate-500 font-bold uppercase tracking-tight font-mono">{log.action}</p>
                          </div>
                       </div>
                    </div>

                    <div className="flex items-center gap-8">
                       <div className="text-right">
                          <p className="text-[8px] text-slate-600 uppercase font-bold tracking-widest mb-1">Timestamp</p>
                          <span className="text-xs text-slate-500 font-mono">{log.time}</span>
                       </div>
                       <span className={`px-4 py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest ${
                         log.status === 'Success' ? 'bg-success/10 text-success' : log.status === 'Warning' ? 'bg-warning/10 text-warning' : 'bg-critical/10 text-critical'
                       }`}>
                          {log.status}
                       </span>
                    </div>
                 </motion.div>
               ))}
            </div>
            <button className="w-full mt-10 py-5 bg-white/5 border border-white/10 rounded-2xl text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em] hover:bg-white/10 transition-all">
               Load_More_Logs
            </button>
         </div>

         {/* Audit Intelligence */}
         <div className="space-y-8">
            <div className="glass-panel p-10 rounded-[3rem] border border-white/10 h-full">
               <h3 className="text-white font-header text-sm uppercase tracking-widest mb-10 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-glow-blue" /> Action Density
               </h3>
               
               <div className="space-y-12">
                  {[
                    { label: 'Admin Activity', val: 12 },
                    { label: 'System Mutations', val: 88 },
                    { label: 'User Read Events', val: 100 },
                    { label: 'Critical Overrides', val: 0.2 },
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
                        <Download className="w-5 h-5 text-glow-blue" />
                     </div>
                     <span className="text-xs font-bold text-white uppercase tracking-widest">Export Audit Trail</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed uppercase font-mono italic">
                    Generate an immutable audit report for compliance verification and internal security review.
                  </p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
