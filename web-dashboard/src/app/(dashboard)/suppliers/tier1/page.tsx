"use client";

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, Activity, Globe, ArrowUpRight, ArrowDownRight, 
  Database, Upload, Shield, Zap, Info, TrendingUp
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Tier1SuppliersPage() {
  const router = useRouter();
  const { suppliers } = useStore();
  const tier1 = suppliers.filter(s => s.tier === 1);
  const hasData = suppliers.length > 0;

  const avgHealth = tier1.length > 0 ? Math.round(tier1.reduce((a, s) => a + s.health, 0) / tier1.length) : 0;
  const criticalTier1 = tier1.filter(s => s.health < 40).length;

  if (!hasData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-10 bg-[#0a0c10]/50 rounded-[3.5rem] border border-white/5 border-dashed">
         <Building2 className="w-16 h-16 text-slate-800 mb-6" />
         <h2 className="font-header text-3xl text-white uppercase italic mb-4">Tier 1 Directory <span className="text-glow-blue">Offline</span></h2>
         <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed mb-8 font-bold uppercase tracking-tight">No Tier 1 partners detected in the system. Upload your supplier dataset to identify and monitor your primary strategic relationships.</p>
         <Link href="/data/upload">
           <button className="px-10 py-5 bg-glow-blue text-white rounded-2xl font-bold uppercase tracking-widest text-xs shadow-[0_0_30px_rgba(59,130,246,0.3)]">Initalize Data Link</button>
         </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
           <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
                 <Building2 className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-xs font-bold text-blue-400 uppercase tracking-[0.4em]">Strategic Direct Partners</span>
           </div>
           <h2 className="font-header text-5xl text-white tracking-tighter uppercase italic leading-[0.9] mb-4">
              Tier 1 <span className="text-blue-500">Suppliers</span>
           </h2>
           <p className="text-slate-500 text-sm max-w-xl font-bold uppercase tracking-tight">Managing {tier1.length} primary strategic partners with direct impact on mission-critical manufacturing pipelines.</p>
        </div>
        
        <div className="flex gap-4">
           <div className="px-8 py-6 glass-panel rounded-3xl border border-white/10 flex flex-col items-center min-w-[200px]">
              <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest mb-1">Portfolio Health</p>
              <p className="text-3xl font-header text-white">{avgHealth}%</p>
              <div className={`flex items-center gap-1 text-[10px] font-bold mt-1 uppercase ${avgHealth > 80 ? 'text-success' : 'text-warning'}`}>
                 <TrendingUp className="w-3 h-3" /> {avgHealth > 80 ? 'NOMINAL' : 'MONITOR'}
              </div>
           </div>
        </div>
      </div>

      {tier1.length === 0 ? (
        <div className="p-20 glass-panel rounded-[3rem] border border-white/5 text-center">
           <p className="text-slate-500 font-bold uppercase tracking-widest">No Tier 1 Suppliers found in uploaded dataset.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tier1.map((sup, i) => (
            <motion.div key={sup.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }} className="glass-panel p-8 rounded-[2.5rem] border border-white/10 relative group overflow-hidden">
               <div className="absolute top-0 right-0 w-24 h-24 bg-white/[0.02] rounded-bl-[4rem] group-hover:bg-blue-500/5 transition-all flex items-center justify-center translate-x-4 -translate-y-4">
                  <Shield className={`w-10 h-10 ${sup.health < 40 ? 'text-critical' : 'text-blue-500'} opacity-10 group-hover:opacity-100 transition-opacity`} />
               </div>
               <h3 className="text-2xl font-header text-white mb-2 uppercase italic leading-tight truncate pr-4">{sup.name}</h3>
               <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-8">{sup.category}</p>
               <div className="space-y-6">
                  <div>
                     <div className="flex justify-between text-[9px] text-slate-600 uppercase font-bold mb-2">
                        <span>Node Health</span>
                        <span className="text-white">{sup.health}%</span>
                     </div>
                     <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${sup.health}%` }} className={`h-full ${sup.health < 40 ? 'bg-critical' : sup.health < 70 ? 'bg-warning' : 'bg-blue-500'}`} />
                     </div>
                  </div>
                  <div className="flex justify-between items-end">
                     <div>
                        <p className="text-[8px] text-slate-600 uppercase font-bold tracking-widest mb-1">Exposure</p>
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${sup.health > 70 ? 'text-success' : sup.health > 40 ? 'text-warning' : 'text-critical'}`}>{sup.health > 70 ? 'LOW' : sup.health > 40 ? 'MEDIUM' : 'CRITICAL'} RISK</span>
                     </div>
                     <div className="text-right">
                        <p className="text-[8px] text-slate-600 uppercase font-bold tracking-widest mb-1">Location</p>
                        <p className="text-[10px] font-mono text-white tracking-widest">{sup.lat.toFixed(1)}, {sup.lng.toFixed(1)}</p>
                     </div>
                  </div>
               </div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         <div className="lg:col-span-2 glass-panel p-10 rounded-[3rem] border border-white/10 bg-white/[0.01] h-[500px] relative overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.05]" />
            <div className="relative z-10 h-full flex flex-col justify-between">
               <div>
                  <h3 className="text-white font-header text-sm uppercase tracking-widest flex items-center gap-2">
                     <Activity className="w-4 h-4 text-blue-500" /> Strategic_Nodal_Telemetry
                  </h3>
                  <p className="text-[10px] text-slate-500 font-mono mt-1 uppercase">Visualizing {tier1.length} Primary Ingestion Points</p>
               </div>
               <div className="flex-1 flex items-center justify-center">
                  <div className="relative">
                     <motion.div animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }} className="w-64 h-64 border border-dashed border-blue-500/20 rounded-full flex items-center justify-center" />
                     <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 bg-blue-500/10 border border-blue-500/30 rounded-3xl flex items-center justify-center backdrop-blur-xl shadow-[0_0_40px_rgba(59,130,246,0.2)]">
                           <Zap className="w-8 h-8 text-white" />
                        </div>
                     </div>
                     {tier1.slice(0, 8).map((s, i) => (
                       <motion.div key={i} className="absolute w-2 h-2 rounded-full bg-blue-500" style={{
                         top: '50%', left: '50%',
                         transform: `rotate(${i * 45}deg) translate(128px) rotate(-${i * 45}deg)`
                       }} animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }} />
                     ))}
                  </div>
               </div>
               <div className="p-6 bg-black/40 border border-white/10 rounded-[2.5rem] flex items-center justify-between">
                  <div className="flex gap-10">
                     <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Active Tier 1 Nodes</span>
                     </div>
                  </div>
                  <button onClick={() => router.push('/admin/audit')} className="px-8 py-3 bg-blue-500 text-white font-bold text-[9px] uppercase tracking-widest rounded-xl hover:bg-blue-600 transition-all">Audit Partners</button>
               </div>
            </div>
         </div>

         <div className="glass-panel p-10 rounded-[3rem] border border-white/10 h-full flex flex-col justify-between">
            <div>
               <h3 className="text-white font-header text-sm uppercase tracking-widest mb-10 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-500" /> Partner Intel
               </h3>
               <div className="space-y-12">
                  {[
                    { label: 'Avg Health Score', val: avgHealth },
                    { label: 'Critical Risk Nodes', val: Math.round((criticalTier1 / tier1.length) * 100 || 0) },
                    { label: 'SLA Adherence', val: tier1.length > 0 ? 94 : 0 },
                    { label: 'Network Redundancy', val: suppliers.filter(s => s.isBackup).length > 0 ? 82 : 0 },
                  ].map((stat, i) => (
                    <div key={i}>
                       <div className="flex justify-between items-center mb-3 text-[10px] font-bold uppercase tracking-widest">
                          <span className="text-slate-400">{stat.label}</span>
                          <span className="text-white font-mono">{stat.val}%</span>
                       </div>
                       <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${stat.val}%` }} className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                       </div>
                    </div>
                  ))}
               </div>
            </div>
            <div className="mt-12 p-8 bg-blue-500/5 border border-blue-500/10 rounded-[2.5rem]">
               <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mb-4">Advisory Insight</p>
               <p className="text-[11px] text-slate-500 leading-relaxed uppercase font-mono italic">
                 {criticalTier1 > 0 ? `Alert: ${criticalTier1} Tier 1 nodes are operating below threshold. Immediate intervention required.` : "Tier 1 network stability is within nominal parameters. No immediate strategic pivot necessary."}
               </p>
            </div>
         </div>
      </div>
    </div>
  );
}
