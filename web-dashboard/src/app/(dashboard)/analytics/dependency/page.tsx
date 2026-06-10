"use client";

import React, { useMemo } from 'react';
import EmptyState from '@/components/EmptyState';
import AnalyticsLayout from '@/components/AnalyticsLayout';
import { useStore } from '@/store/useStore';
import { GitMerge, Cpu, AlertTriangle } from 'lucide-react';

export default function DependencyAnalytics() {
  const { suppliers } = useStore();
  const hasData = suppliers.length > 0;

  const metrics = useMemo(() => {
    if (!hasData) return null;
    const total = suppliers.length;
    const highRiskDependencies = suppliers.filter(s => s.health < 40).length;
    const tier1 = suppliers.filter(s => s.tier === 1 && !s.isBackup).length;
    const avgHealth = Math.round(suppliers.reduce((a, s) => a + s.health, 0) / total);
    return { total, highRiskDependencies, tier1, avgHealth };
  }, [suppliers, hasData]);

  if (!hasData) return <EmptyState />;

  return (
    <AnalyticsLayout category="Dependency">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-panel p-6 text-center border-l-4 border-l-glow-blue">
          <h4 className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-2">Total Dependencies</h4>
          <p className="text-2xl font-header text-white">{metrics?.total}</p>
        </div>
        <div className="glass-panel p-6 text-center">
          <h4 className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-2">High Risk Nodes</h4>
          <p className="text-2xl font-header text-critical">{metrics?.highRiskDependencies}</p>
        </div>
        <div className="glass-panel p-6 text-center">
          <h4 className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-2">Tier 1 Partners</h4>
          <p className="text-2xl font-header text-glow-blue">{metrics?.tier1}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 glass-panel p-8 rounded-3xl">
           <h3 className="font-header text-sm text-white uppercase tracking-widest mb-6 flex items-center gap-2">
              <GitMerge className="w-4 h-4 text-glow-blue" /> Dependency Mapping
           </h3>
           <div className="space-y-4">
              {suppliers.slice(0, 6).map((s, i) => (
                 <div key={i} className="flex justify-between items-center p-4 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-4">
                       <div className={`w-2 h-2 rounded-full ${s.health < 40 ? 'bg-critical shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 'bg-success'}`} />
                       <div>
                          <p className="text-[11px] font-bold text-white uppercase tracking-tight">{s.name}</p>
                          <p className="text-[9px] text-slate-500 font-mono mt-1">Tier {s.tier} • {s.category}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-[9px] text-slate-400 uppercase font-bold">Node Health</p>
                       <p className={`text-sm font-header ${s.health < 40 ? 'text-critical' : 'text-success'}`}>
                          {s.health}%
                       </p>
                    </div>
                 </div>
              ))}
           </div>
        </div>

        <div className="lg:col-span-4 glass-panel p-8 rounded-3xl h-full">
           <h3 className="font-header text-sm text-white uppercase tracking-widest mb-6 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-glow-blue" /> AI Analysis
           </h3>
           <div className="p-5 bg-glow-blue/5 border border-glow-blue/20 rounded-2xl mb-6">
              <p className="text-[11px] text-slate-300 leading-relaxed italic">
                 "Concentration risk detected. {metrics?.tier1} Tier-1 suppliers rely heavily on localized infrastructure. Recommend diversifying secondary providers."
              </p>
           </div>
           
           {metrics?.highRiskDependencies && metrics.highRiskDependencies > 0 && (
             <div className="p-4 bg-critical/10 border border-critical/20 rounded-xl flex gap-4 items-start">
                <AlertTriangle className="w-5 h-5 text-critical shrink-0 mt-0.5" />
                <div>
                   <p className="text-[10px] text-white font-bold uppercase">Structural Risk</p>
                   <p className="text-[9px] text-slate-400 mt-1">Downstream dependencies are threatened by {metrics?.highRiskDependencies} weak nodes.</p>
                </div>
             </div>
           )}
        </div>
      </div>
    </AnalyticsLayout>
  );
}
