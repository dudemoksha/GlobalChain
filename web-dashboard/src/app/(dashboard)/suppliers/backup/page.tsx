"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, RefreshCw, Zap, 
  Activity, Clock, AlertCircle, 
  CheckCircle2, Globe, Search, Filter,
  ArrowRight, ShieldAlert
} from 'lucide-react';

export default function BackupReadinessPage() {
  const readiness = [
    { component: 'Micro-Controllers', primary: 'NXP Semiconductors', backup: 'STMicro', status: 'Ready', sync: 100, health: 'Success' },
    { component: 'Power Modules', primary: 'Delta Electronics', backup: 'Lite-On', status: 'In Sync', sync: 84, health: 'Processing' },
    { component: 'Chassis Castings', primary: 'Alcoa Corp', backup: 'Rio Tinto', status: 'Delayed', sync: 12, health: 'Critical' },
    { component: 'Connectors', primary: 'Amphenol', backup: 'Molex', status: 'Ready', sync: 100, health: 'Success' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
           <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-success/10 rounded-xl flex items-center justify-center border border-success/20">
                 <ShieldCheck className="w-5 h-5 text-success" />
              </div>
              <span className="text-xs font-bold text-success uppercase tracking-[0.4em]">Redundancy Protocol Matrix</span>
           </div>
           <h2 className="font-header text-5xl text-white tracking-tighter uppercase italic leading-[0.9] mb-4">
              Backup <span className="text-success">Readiness</span>
           </h2>
           <p className="text-slate-500 text-sm max-w-xl">Auditing secondary and tertiary supplier failover systems to ensure zero-downtime transition during primary node failures.</p>
        </div>
        
        <div className="flex gap-4">
           <div className="px-8 py-6 glass-panel rounded-3xl border border-white/10 flex flex-col items-center">
              <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest mb-1">Failover Health</p>
              <p className="text-3xl font-header text-white">94%</p>
              <div className="flex items-center gap-1 text-[10px] font-bold text-success mt-1 uppercase">
                 <Activity className="w-3 h-3" /> Sync_Active
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         {/* Failover Status Table (Unique) */}
         <div className="lg:col-span-2 glass-panel p-10 rounded-[3rem] border border-white/10 h-fit">
            <div className="flex justify-between items-center mb-10">
               <h3 className="text-white font-header text-sm uppercase tracking-widest flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-success" /> Synchronization_Audit
               </h3>
               <button className="px-4 py-2 bg-success text-black font-bold text-[9px] uppercase tracking-widest rounded-xl hover:bg-white transition-all">
                  Run Global Audit
               </button>
            </div>

            <div className="space-y-4">
               {readiness.map((item, i) => (
                 <motion.div 
                   key={i}
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: i * 0.1 }}
                   className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-between group hover:border-success/30 transition-all"
                 >
                    <div className="flex items-center gap-8 flex-1">
                       <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-slate-600 group-hover:text-success transition-all border border-white/10">
                          <Zap className="w-5 h-5" />
                       </div>
                       <div className="grid grid-cols-2 gap-x-12 flex-1">
                          <div>
                             <p className="text-[8px] text-slate-600 uppercase font-bold tracking-widest mb-1">Component</p>
                             <p className="text-sm text-white font-header uppercase italic">{item.component}</p>
                          </div>
                          <div>
                             <p className="text-[8px] text-slate-600 uppercase font-bold tracking-widest mb-1">Failover Node</p>
                             <p className="text-sm text-slate-400 font-bold uppercase tracking-tight">{item.backup}</p>
                          </div>
                       </div>
                    </div>

                    <div className="flex items-center gap-8">
                       <div className="text-right">
                          <p className="text-[8px] text-slate-600 uppercase font-bold tracking-widest mb-1">Sync Status</p>
                          <div className="flex items-center gap-3">
                             <div className="h-1 w-20 bg-white/5 rounded-full overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: `${item.sync}%` }} className={`h-full ${item.sync < 50 ? 'bg-critical' : 'bg-success'}`} />
                             </div>
                             <span className={`text-[10px] font-mono font-bold ${item.health === 'Critical' ? 'text-critical' : 'text-success'}`}>{item.sync}%</span>
                          </div>
                       </div>
                       <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${
                         item.health === 'Critical' ? 'border-critical/30 bg-critical/10 text-critical' : 'border-success/30 bg-success/10 text-success'
                       }`}>
                          {item.health === 'Success' ? <CheckCircle2 className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
                       </div>
                    </div>
                 </motion.div>
               ))}
            </div>
         </div>

         {/* Backup Intelligence */}
         <div className="space-y-8">
            <div className="glass-panel p-10 rounded-[3rem] border border-white/10">
               <h3 className="text-white font-header text-sm uppercase tracking-widest mb-10 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-success" /> Transition Readiness
               </h3>
               
               <div className="space-y-10">
                  {[
                    { label: 'Contractual Activation', val: 100 },
                    { label: 'Logistics Buffer', val: 72 },
                    { label: 'Quality Certification', val: 94 },
                    { label: 'IT Bridge Status', val: 44 },
                  ].map((stat, i) => (
                    <div key={i}>
                       <div className="flex justify-between items-center mb-3 text-[9px] font-bold uppercase tracking-widest">
                          <span className="text-slate-400">{stat.label}</span>
                          <span className={stat.val < 50 ? 'text-critical' : 'text-success'}>{stat.val}%</span>
                       </div>
                       <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${stat.val}%` }} className="h-full bg-success" />
                       </div>
                    </div>
                  ))}
               </div>

               <div className="mt-16 p-8 bg-success/5 border border-success/10 rounded-[2.5rem]">
                  <p className="text-[10px] text-success font-bold uppercase tracking-widest mb-4">Failover Advisory</p>
                  <p className="text-[11px] text-slate-400 leading-relaxed uppercase font-mono italic">
                    Chassis casting failover to Rio Tinto is currently delayed due to unresolved SLA signatures. Operational risk: MODERATE.
                  </p>
                  <button className="mt-8 w-full py-4 bg-success/10 border border-success/20 text-success text-[9px] font-bold uppercase tracking-widest rounded-xl hover:bg-success hover:text-black transition-all">
                     Expedite Signing
                  </button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
