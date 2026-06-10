"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, ShieldCheck, Activity, 
  Search, Filter, Database, 
  ArrowUpRight, AlertCircle, Terminal,
  Workflow, Layers, Cpu, Fingerprint
} from 'lucide-react';

export default function ValidationAuditPage() {
  const validationRules = [
    { rule: 'Coordinate Integrity', status: 'Active', passed: 100, impact: 'High' },
    { rule: 'Tier Hierarchy Sync', status: 'Active', passed: 94, impact: 'Extreme' },
    { rule: 'Masking Protocol v4', status: 'Active', passed: 88, impact: 'High' },
    { rule: 'SLA Data Handshake', status: 'Warning', passed: 42, impact: 'Moderate' },
  ];

  return (
    <div className="space-y-8 font-mono">
      {/* Header */}
      <div className="flex justify-between items-start border-b border-white/10 pb-8">
        <div>
           <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-success/10 rounded-xl flex items-center justify-center border border-success/20">
                 <ShieldCheck className="w-5 h-5 text-success" />
              </div>
              <span className="text-xs font-bold text-success uppercase tracking-[0.4em]">Ingestion Integrity Guard</span>
           </div>
           <h2 className="font-header text-5xl text-white tracking-tighter uppercase italic leading-[0.9] mb-4">
              Validation <span className="text-success">Audit</span>
           </h2>
           <p className="text-slate-500 text-sm max-w-xl font-bold uppercase tracking-tight">Monitoring real-time data cleansing and validation protocols to ensure graph accuracy and nodal health.</p>
        </div>
        
        <div className="flex gap-4">
           <div className="px-8 py-6 glass-panel rounded-3xl border border-white/10 flex flex-col items-center">
              <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest mb-1">Sanity Index</p>
              <p className="text-3xl font-header text-white tracking-widest">98.2%</p>
              <div className="flex items-center gap-1 text-[10px] font-bold text-success mt-1 uppercase">
                 <CheckCircle2 className="w-3 h-3" /> System_Healthy
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         {/* Validation Feed (Unique) */}
         <div className="lg:col-span-2 glass-panel p-10 rounded-[3rem] border border-white/10 h-fit">
            <div className="flex justify-between items-center mb-10">
               <h3 className="text-white font-header text-sm uppercase tracking-widest flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-success" /> Logic_Constraint_Registry
               </h3>
               <button className="px-6 py-2 bg-success text-black font-bold text-[9px] uppercase tracking-widest rounded-xl hover:bg-white transition-all">
                  Re-Validate Graph
               </button>
            </div>

            <div className="space-y-4">
               {validationRules.map((rule, i) => (
                 <motion.div 
                   key={i}
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: i * 0.1 }}
                   className="p-8 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-between group hover:border-success/30 transition-all"
                 >
                    <div className="flex items-center gap-8 flex-1">
                       <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-slate-600 group-hover:text-success transition-all border border-white/10">
                          <Cpu className="w-7 h-7" />
                       </div>
                       <div className="grid grid-cols-2 gap-x-12 flex-1">
                          <div>
                             <p className="text-[8px] text-slate-600 uppercase font-bold tracking-widest mb-1">Rule Identifier</p>
                             <p className="text-lg text-white font-header italic">{rule.rule}</p>
                          </div>
                          <div>
                             <p className="text-[8px] text-slate-600 uppercase font-bold tracking-widest mb-1">Impact Level</p>
                             <span className={`text-[10px] font-bold tracking-widest ${
                               rule.impact === 'Extreme' ? 'text-critical' : rule.impact === 'High' ? 'text-warning' : 'text-success'
                             }`}>{rule.impact}</span>
                          </div>
                       </div>
                    </div>

                    <div className="text-right">
                       <p className="text-[8px] text-slate-600 uppercase font-bold tracking-widest mb-1">Pass Rate</p>
                       <p className="text-2xl font-header text-white tracking-widest">{rule.passed}%</p>
                    </div>
                 </motion.div>
               ))}
            </div>
         </div>

         {/* Validation Intelligence */}
         <div className="space-y-8">
            <div className="glass-panel p-10 rounded-[3rem] border border-white/10 h-full">
               <h3 className="text-white font-header text-sm uppercase tracking-widest mb-10 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-success" /> Integrity Analytics
               </h3>
               
               <div className="space-y-12">
                  {[
                    { label: 'Cleansing Throughput', val: 92 },
                    { label: 'Duplication Detection', val: 100 },
                    { label: 'Schema Conformance', val: 98 },
                    { label: 'API Signature Sync', val: 74 },
                  ].map((stat, i) => (
                    <div key={i}>
                       <div className="flex justify-between items-center mb-3 text-[10px] font-bold uppercase tracking-widest">
                          <span className="text-slate-400">{stat.label}</span>
                          <span className="text-white font-mono">{stat.val}%</span>
                       </div>
                       <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${stat.val}%` }} className="h-full bg-success shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                       </div>
                    </div>
                  ))}
               </div>

               <div className="mt-16 p-8 bg-success/5 border border-success/10 rounded-[2.5rem] relative group cursor-pointer hover:bg-success/10 transition-all">
                  <div className="flex items-center gap-4 mb-6">
                     <div className="w-10 h-10 bg-success/10 rounded-xl flex items-center justify-center border border-success/20">
                        <Fingerprint className="w-5 h-5 text-success" />
                     </div>
                     <span className="text-xs font-bold text-white uppercase tracking-widest">Identity Validation</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed uppercase font-mono italic">
                    All partner nodes must pass biometric and digital signature validation before their datasets are integrated into the primary simulation graph.
                  </p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
