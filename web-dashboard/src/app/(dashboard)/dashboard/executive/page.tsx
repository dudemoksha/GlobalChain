"use client";

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, Shield, Zap, AlertTriangle, 
  Database, ArrowUpRight, ArrowDownRight, Upload, PieChart, Activity,
  BarChart3, Heart, ShieldCheck
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import Link from 'next/link';

export default function ExecutiveDashboard() {
  const allSuppliers = useStore((s) => s.suppliers);
  const suppliers = allSuppliers.filter(s => s.tier === 1);
  const hasData = suppliers.length > 0;

  const affectedNodes = suppliers.filter(s => s.affectedBy);
  const criticalCount = suppliers.filter(s => s.health < 40).length;
  const warningCount = suppliers.filter(s => s.health >= 40 && s.health < 70).length;
  const healthyCount = suppliers.filter(s => s.health >= 70).length;
  const avgHealth = hasData ? Math.round(suppliers.reduce((a, s) => a + s.health, 0) / suppliers.length) : 0;

  const mainKpis = [
    { label: 'Network Resilience', value: hasData ? `${avgHealth}%` : '—', trend: hasData ? (avgHealth > 80 ? 'NOMINAL' : 'WARNING') : 'No Data', color: hasData ? (avgHealth > 80 ? 'text-success' : 'text-warning') : 'text-slate-600', icon: Shield },
    { label: 'Active Suppliers', value: hasData ? suppliers.length.toString() : '—', trend: hasData ? `T1: ${suppliers.length}` : 'No Data', color: hasData ? 'text-glow-blue' : 'text-slate-600', icon: Database },
    { label: 'Nodal Continuity', value: hasData ? `${Math.round(((suppliers.length - affectedNodes.length) / (suppliers.length || 1)) * 100)}%` : '—', trend: hasData ? `${affectedNodes.length} Impacted` : 'No Data', color: hasData ? (affectedNodes.length === 0 ? 'text-success' : 'text-warning') : 'text-slate-600', icon: Zap },
    { label: 'Critical Failures', value: hasData ? criticalCount.toString() : '—', trend: hasData ? (criticalCount > 0 ? 'ACTION REQ' : 'STABLE') : 'No Data', color: hasData ? (criticalCount > 0 ? 'text-critical' : 'text-success') : 'text-slate-600', icon: AlertTriangle },
  ];

  if (!hasData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-8">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
          <div className="w-32 h-32 mx-auto bg-white/[0.02] border border-white/5 rounded-[3rem] flex items-center justify-center">
            <Database className="w-14 h-14 text-slate-700" />
          </div>
          <div>
            <h2 className="font-header text-4xl text-white tracking-tight uppercase italic mb-4">No Supplier Data <span className="text-glow-blue">Available</span></h2>
            <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed font-bold uppercase tracking-tight">Upload a supplier dataset to activate enterprise-wide intelligence monitoring and risk analytics.</p>
          </div>
          <div className="flex items-center justify-center gap-4">
            <Link href="/data/upload">
              <button className="px-10 py-5 bg-glow-blue text-white rounded-2xl text-sm font-bold uppercase tracking-widest shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:bg-blue-500 transition-all flex items-center gap-3">
                <Upload className="w-5 h-5" /> Upload Dataset
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex justify-between items-end gap-6">
        <div>
          <h2 className="font-header text-4xl text-white tracking-tight uppercase italic mb-2">Executive <span className="text-glow-blue">Command Center</span></h2>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-tight">Real-time strategic oversight of your uploaded supply chain graph and operational resilience.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mainKpis.map((kpi, i) => (
          <motion.div key={i} whileHover={{ y: -5 }} className="glass-panel p-8 rounded-3xl border border-white/10 relative group overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                <kpi.icon className="w-16 h-16 text-white" />
             </div>
             <p className="text-[10px] text-slate-500 uppercase font-bold tracking-[0.2em] mb-2">{kpi.label}</p>
             <div className="flex items-end justify-between">
                <h3 className="text-3xl font-header text-white">{kpi.value}</h3>
                <div className={`text-[10px] font-bold ${kpi.color} uppercase tracking-widest`}>
                   {kpi.trend}
                </div>
             </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-panel p-10 rounded-[2.5rem] border border-white/10 flex flex-col justify-between h-[600px] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-[0.02]"><BarChart3 className="w-64 h-64 text-white" /></div>
          
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex justify-between items-center mb-10">
               <h3 className="text-white font-header text-xl uppercase italic tracking-tight">Nodal Health <span className="text-glow-blue">Distribution</span></h3>
               <div className="flex gap-4">
                  <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-success" /><span className="text-[9px] text-slate-500 font-bold uppercase">Healthy</span></div>
                  <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-warning" /><span className="text-[9px] text-slate-500 font-bold uppercase">Warning</span></div>
                  <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-critical" /><span className="text-[9px] text-slate-500 font-bold uppercase">Critical</span></div>
               </div>
            </div>

            <div className="flex-1 flex items-end gap-2 px-2 pb-10 border-b border-white/5">
               {suppliers.slice(0, 40).map((s, i) => (
                 <div key={i} className="flex-1 flex flex-col justify-end gap-1 group relative">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${s.health}%` }}
                      className={`w-full rounded-t-sm transition-all ${s.health < 40 ? 'bg-critical shadow-[0_0_10px_rgba(239,68,68,0.3)]' : s.health < 70 ? 'bg-warning shadow-[0_0_10px_rgba(245,158,11,0.3)]' : 'bg-glow-blue/40 group-hover:bg-glow-blue/60'}`}
                    />
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 p-3 bg-black/90 backdrop-blur-xl border border-white/10 text-[9px] text-white font-bold uppercase rounded-xl opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100 whitespace-nowrap z-20 shadow-2xl">
                       <p className="text-glow-blue mb-1">{s.name}</p>
                       <p className="font-mono">{s.health}% HEALTH // T{s.tier}</p>
                    </div>
                 </div>
               ))}
            </div>

            <div className="grid grid-cols-3 gap-10 pt-8">
               <div>
                  <p className="text-[8px] text-slate-600 font-bold uppercase tracking-[0.2em] mb-2 text-center">Entity Categorization</p>
                  <div className="flex items-center justify-center gap-6">
                     <div className="text-center">
                        <p className="text-lg font-header text-success">{healthyCount}</p>
                        <p className="text-[8px] text-slate-500 font-bold uppercase">Healthy</p>
                     </div>
                     <div className="text-center">
                        <p className="text-lg font-header text-warning">{warningCount}</p>
                        <p className="text-[8px] text-slate-500 font-bold uppercase">Warning</p>
                     </div>
                     <div className="text-center">
                        <p className="text-lg font-header text-critical">{criticalCount}</p>
                        <p className="text-[8px] text-slate-500 font-bold uppercase">Critical</p>
                     </div>
                  </div>
               </div>
               <div className="flex items-center justify-center border-x border-white/5">
                  <div className="text-center">
                     <p className="text-[8px] text-slate-600 font-bold uppercase tracking-[0.2em] mb-1">Network Peak</p>
                     <p className="text-xl font-header text-white">94% Stability</p>
                  </div>
               </div>
               <div className="flex items-center justify-center">
                  <div className="text-center">
                     <p className="text-[8px] text-slate-600 font-bold uppercase tracking-[0.2em] mb-1">Propagation Risk</p>
                     <p className="text-xl font-header text-warning">{Math.round((affectedNodes.length / suppliers.length) * 100)}%</p>
                  </div>
               </div>
            </div>
          </div>
        </div>

        <div className="glass-panel p-10 rounded-[2.5rem] border border-white/10 h-full flex flex-col bg-white/[0.01]">
          <h3 className="text-white font-header text-sm uppercase tracking-widest mb-10 flex items-center gap-2">
             <PieChart className="w-4 h-4 text-glow-blue" /> Network Composition
          </h3>
          <div className="space-y-10 flex-1">
             {[
               { name: 'Tier 1 Strategic', count: suppliers.length, color: 'bg-glow-blue', icon: ShieldCheck },
             ].map((cat, i) => (
               <div key={i}>
                  <div className="flex justify-between items-center mb-3">
                     <div className="flex items-center gap-2">
                        <cat.icon className="w-3.5 h-3.5 text-slate-500" />
                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">{cat.name}</span>
                     </div>
                     <span className="text-xs font-header text-white">{cat.count} Nodes</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                     <motion.div 
                       initial={{ width: 0 }}
                       animate={{ width: `${(cat.count / (suppliers.length || 1)) * 100}%` }}
                       className={`h-full ${cat.color} shadow-[0_0_8px_rgba(59,130,246,0.2)]`} 
                     />
                  </div>
               </div>
             ))}
          </div>
          <div className="mt-12 p-8 bg-glow-blue/5 border border-glow-blue/10 rounded-[2rem] relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-5"><Heart className="w-16 h-16 text-glow-blue" /></div>
             <div className="flex items-center gap-3 mb-4 relative z-10">
                <Activity className="w-4 h-4 text-glow-blue" />
                <span className="text-[10px] text-glow-blue font-bold uppercase tracking-widest">Resilience Intelligence</span>
             </div>
             <p className="text-[11px] text-slate-400 leading-relaxed uppercase font-mono italic relative z-10 font-bold">
               {affectedNodes.length > 0 
                 ? `Warning: ${affectedNodes.length} nodes are currently impacted by simulation vectors. Network stability reduced to ${100 - Math.round((affectedNodes.length / suppliers.length) * 100)}%.`
                 : `Graph contains ${suppliers.length} active nodes and ${useStore.getState().edges.length} edges. Monitoring Tier 1 dependencies for disruption propagation.`}
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
