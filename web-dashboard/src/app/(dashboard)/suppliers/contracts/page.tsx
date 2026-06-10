"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, ShieldCheck, Clock, 
  Activity, AlertCircle, CheckCircle2,
  TrendingUp, Search, Filter,
  FileSignature, Scale, Gavel
} from 'lucide-react';

export default function SLAContractsPage() {
  const contracts = [
    { provider: 'Global Logistics Inc', type: 'Service Level Agreement', status: 'Compliant', performance: 99.4, breachRisk: 'Low' },
    { provider: 'TechFlow Systems', type: 'Master Service Agreement', status: 'At Risk', performance: 82.1, breachRisk: 'Medium' },
    { provider: 'EuroMaterials AG', type: 'Supply Guarantee', status: 'Breached', performance: 44.8, breachRisk: 'High' },
    { provider: 'Pacific Carriers', type: 'Service Level Agreement', status: 'Compliant', performance: 98.9, breachRisk: 'Low' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
           <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
                 <FileSignature className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-xs font-bold text-blue-400 uppercase tracking-[0.4em]">Contractual Compliance Audit</span>
           </div>
           <h2 className="font-header text-5xl text-white tracking-tighter uppercase italic leading-[0.9] mb-4">
              SLA <span className="text-blue-500">Performance</span>
           </h2>
           <p className="text-slate-500 text-sm max-w-xl">Auditing partner adherence to Service Level Agreements and contractual obligations through real-time performance telemetry.</p>
        </div>
        
        <div className="flex gap-4">
           <div className="px-8 py-6 glass-panel rounded-3xl border border-white/10 flex flex-col items-center">
              <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest mb-1">Compliance Rate</p>
              <p className="text-3xl font-header text-white">88.2%</p>
              <div className="flex items-center gap-1 text-[10px] font-bold text-warning mt-1 uppercase">
                 <TrendingUp className="w-3 h-3" /> Improving
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         {/* Contract Compliance Feed (Unique) */}
         <div className="lg:col-span-2 space-y-6">
            <h3 className="text-white font-header text-sm uppercase tracking-widest px-2">Active Performance Audit</h3>
            {contracts.map((contract, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-panel p-8 rounded-[2.5rem] border border-white/5 hover:border-blue-500/30 transition-all group relative overflow-hidden"
              >
                 <div className="absolute top-0 right-0 w-24 h-24 bg-white/[0.02] rounded-bl-[4rem] group-hover:bg-blue-500/5 transition-all flex items-center justify-center translate-x-4 -translate-y-4">
                    <Scale className="w-10 h-10 text-blue-500 opacity-10 group-hover:opacity-100 transition-opacity" />
                 </div>

                 <div className="flex items-start gap-8">
                    <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10 group-hover:border-blue-500/30 transition-all">
                       <FileText className="w-7 h-7 text-slate-500 group-hover:text-blue-400 transition-colors" />
                    </div>
                    
                    <div className="flex-1">
                       <div className="flex justify-between items-center mb-4">
                          <div className="flex items-center gap-4">
                             <span className="px-3 py-1 rounded bg-blue-500/10 border border-blue-500/20 text-[9px] font-bold text-blue-400 uppercase tracking-widest">
                                {contract.type}
                             </span>
                             <span className={`text-[10px] font-bold uppercase tracking-widest ${
                               contract.status === 'Compliant' ? 'text-success' : contract.status === 'At Risk' ? 'text-warning' : 'text-critical'
                             }`}>
                                {contract.status}
                             </span>
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono italic">Breach Risk: {contract.breachRisk}</span>
                       </div>
                       
                       <h4 className="text-white font-header text-2xl uppercase italic tracking-tight mb-4 group-hover:text-blue-400 transition-colors">{contract.provider}</h4>
                       
                       <div className="space-y-3">
                          <div className="flex justify-between text-[9px] text-slate-500 uppercase font-bold tracking-widest">
                             <span>Performance KPI Adherence</span>
                             <span className="text-white font-mono">{contract.performance}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                             <motion.div initial={{ width: 0 }} animate={{ width: `${contract.performance}%` }} className={`h-full ${contract.performance < 70 ? 'bg-critical' : 'bg-blue-500'}`} />
                          </div>
                       </div>
                    </div>
                 </div>
              </motion.div>
            ))}
         </div>

         {/* Compliance Analytics */}
         <div className="space-y-8">
            <div className="glass-panel p-10 rounded-[3rem] border border-white/10 h-full">
               <h3 className="text-white font-header text-sm uppercase tracking-widest mb-10 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-500" /> Contractual Health
               </h3>
               
               <div className="space-y-12">
                  {[
                    { label: 'Uptime Commitment', val: 99.9 },
                    { label: 'Delivery Timeliness', val: 78.4 },
                    { label: 'Quality Acceptance', val: 94.2 },
                    { label: 'Payment Terms Sync', val: 100 },
                  ].map((stat, i) => (
                    <div key={i}>
                       <div className="flex justify-between items-center mb-3 text-[10px] font-bold uppercase tracking-widest">
                          <span className="text-slate-400">{stat.label}</span>
                          <span className="text-white font-mono">{stat.val}%</span>
                       </div>
                       <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${stat.val}%` }} className="h-full bg-blue-500" />
                       </div>
                    </div>
                  ))}
               </div>

               <div className="mt-16 p-10 bg-white/[0.02] border border-white/5 rounded-[2.5rem] relative group cursor-pointer hover:bg-white/[0.04] transition-all">
                  <div className="flex items-center gap-4 mb-6">
                     <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
                        <Gavel className="w-5 h-5 text-blue-400" />
                     </div>
                     <span className="text-xs font-bold text-white uppercase tracking-widest">Legal Review Panel</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed uppercase font-mono italic">
                    Initiate formal contractual review for EuroMaterials AG due to persistent KPI delinquency.
                  </p>
                  <button className="mt-8 w-full py-4 bg-blue-500 text-white text-[9px] font-bold uppercase tracking-widest rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                     Generate Legal Audit
                  </button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
