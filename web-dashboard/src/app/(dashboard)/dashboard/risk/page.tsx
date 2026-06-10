"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldAlert, AlertTriangle, Target, Activity, 
  ShieldCheck, Zap, BarChart3, Database, Upload, ArrowRight
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import Link from 'next/link';

export default function RiskIntelligenceDashboard() {
  const { suppliers: allSuppliers, activeSimulation } = useStore();
  const suppliers = allSuppliers.filter(s => s.tier === 1);
  const hasData = suppliers.length > 0;

  const affectedNodes = suppliers.filter(s => s.affectedBy);
  const criticalNodes = suppliers.filter(s => s.health < 40);
  const avgRisk = hasData ? Math.round(suppliers.reduce((a, s) => a + (100 - s.health), 0) / suppliers.length) : 0;

  const riskKPIs = [
    { label: 'Avg Network Risk', val: `${avgRisk}/100`, trend: avgRisk > 30 ? 'ELEVATED' : 'NOMINAL', color: avgRisk > 30 ? 'text-critical' : 'text-success' },
    { label: 'Critical Nodes', val: criticalNodes.length.toString(), trend: criticalNodes.length > 0 ? 'ACTION REQ' : 'STABLE', color: criticalNodes.length > 0 ? 'text-critical' : 'text-success' },
    { label: 'Impacted Clusters', val: affectedNodes.length.toString(), trend: activeSimulation ? 'SIM_ACTIVE' : 'IDLE', color: 'text-glow-blue' },
    { label: 'Mitigation Readiness', val: suppliers.filter(s => s.isBackup).length > 0 ? 'HIGH' : 'LOW', trend: 'FAILOVER', color: 'text-success' },
  ];

  if (!hasData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-8">
        <div className="w-32 h-32 mx-auto bg-white/[0.02] border border-white/5 rounded-[3rem] flex items-center justify-center">
          <ShieldAlert className="w-14 h-14 text-slate-700" />
        </div>
        <h2 className="font-header text-4xl text-white uppercase italic">Risk Engine <span className="text-glow-blue">Inactive</span></h2>
        <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed font-bold uppercase tracking-tight">Upload your supply chain data to identify vulnerabilities, monitor critical nodes, and calculate risk exposure.</p>
        <Link href="/data/upload">
          <button className="px-10 py-5 bg-glow-blue text-white rounded-2xl text-sm font-bold uppercase tracking-widest shadow-[0_0_30px_rgba(59,130,246,0.4)]">Initialize Risk Audit</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-header text-4xl text-white tracking-tight uppercase italic mb-2">Risk <span className="text-glow-blue">Intelligence Terminal</span></h2>
        <p className="text-slate-500 text-sm font-bold uppercase tracking-tight">Dynamic vulnerability assessment based on uploaded dependency structures and live simulation vectors.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {riskKPIs.map((kpi, i) => (
          <motion.div key={i} whileHover={{ y: -5 }} className="glass-panel border border-white/10 p-8 rounded-3xl relative group overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity"><ShieldAlert className="w-12 h-12 text-white" /></div>
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-2">{kpi.label}</p>
            <div className="flex items-end justify-between">
              <h3 className="text-3xl font-header text-white">{kpi.val}</h3>
              <span className={`text-[10px] font-bold ${kpi.color} uppercase tracking-widest`}>{kpi.trend}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
           <div className="glass-panel border border-white/10 rounded-3xl p-10 min-h-[400px]">
              <h3 className="font-header text-sm text-white uppercase tracking-widest mb-10 flex items-center gap-2">
                 <BarChart3 className="w-4 h-4 text-glow-blue" /> Nodal Vulnerability Index
              </h3>
              <div className="h-[300px] flex items-end gap-2 px-2">
                 {suppliers.slice(0, 40).map((s, i) => (
                   <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${100 - s.health}%` }} className={`flex-1 rounded-t-lg relative group ${s.health < 40 ? 'bg-critical' : s.health < 70 ? 'bg-warning' : 'bg-glow-blue/20'}`}>
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black border border-white/10 px-2 py-1 rounded text-[8px] text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">Risk: {100 - s.health}%</div>
                   </motion.div>
                 ))}
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="glass-panel border border-white/10 rounded-[2.5rem] p-8">
                 <h4 className="font-header text-[10px] text-slate-400 uppercase tracking-widest mb-8">Highest Risk Entities</h4>
                 <div className="space-y-6">
                    {suppliers.sort((a,b) => a.health - b.health).slice(0, 4).map((s, i) => (
                      <div key={i} className="flex items-center justify-between">
                         <div>
                            <div className="text-[11px] text-white font-bold uppercase">{s.name}</div>
                            <div className="text-[8px] text-slate-600 font-mono">TIER {s.tier} // {s.category}</div>
                         </div>
                         <div className="text-right">
                            <div className={`text-xs font-header ${s.health < 40 ? 'text-critical' : 'text-warning'}`}>{100 - s.health}% RISK</div>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="glass-panel border border-white/10 rounded-[2.5rem] p-8 flex flex-col justify-between">
                 <div>
                    <h4 className="font-header text-[10px] text-slate-400 uppercase tracking-widest mb-4">Risk Propagation Logic</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-bold uppercase tracking-tight italic">
                       {affectedNodes.length > 0 
                        ? `Currently identifying cascading failures for ${affectedNodes.length} nodes. Impact is propagating from ${activeSimulation?.type || 'active disruption'} epicenter.` 
                        : "Network state is stable. No active propagation detected. Stress test via Simulation Center to analyze vulnerability spread."}
                    </p>
                 </div>
                 <Link href="/simulations/center">
                    <button className="w-full py-4 bg-glow-blue text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(59,130,246,0.3)]">Launch Stress Test</button>
                 </Link>
              </div>
           </div>
        </div>

        <div className="lg:col-span-4">
           <div className="glass-panel border border-white/10 rounded-[3rem] p-10 h-full">
              <h3 className="font-header text-sm text-white uppercase tracking-widest mb-10 flex items-center gap-2"><Zap className="w-4 h-4 text-glow-blue" /> Disruption Feed</h3>
              <div className="space-y-6">
                 {affectedNodes.length > 0 ? affectedNodes.map((s, i) => (
                   <div key={i} className="p-5 bg-critical/5 border border-critical/10 rounded-2xl">
                      <div className="flex justify-between items-center mb-2">
                         <span className="text-[9px] font-bold text-critical uppercase tracking-widest">IMPACTED</span>
                         <span className="text-[8px] text-slate-600 font-mono">NOW</span>
                      </div>
                      <p className="text-[11px] text-white font-bold uppercase mb-2">{s.name}</p>
                      <p className="text-[9px] text-slate-500 leading-tight uppercase font-mono italic">{s.reason}</p>
                   </div>
                 )) : (
                   <div className="flex flex-col items-center justify-center py-20 text-center opacity-30">
                      <ShieldCheck className="w-12 h-12 text-success mb-4" />
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">All Nodes Secured</p>
                   </div>
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
