"use client";

import React, { useMemo } from 'react';
import EmptyState from '@/components/EmptyState';
import AnalyticsLayout from '@/components/AnalyticsLayout';
import { useStore } from '@/store/useStore';
import { LifeBuoy, Cpu, Timer } from 'lucide-react';

export default function RecoveryAnalytics() {
  const { suppliers } = useStore();
  const hasData = suppliers.length > 0;

  const metrics = useMemo(() => {
    if (!hasData) return null;
    const total = suppliers.length;
    const recovering = suppliers.filter(s => s.health < 60 && s.health >= 40).length;
    return { total, recovering };
  }, [suppliers, hasData]);

  if (!hasData) return <EmptyState />;

  return (
    <AnalyticsLayout category="Disaster Recovery">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-panel p-6 text-center border-l-4 border-l-glow-blue">
          <h4 className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-2">Total Monitored Nodes</h4>
          <p className="text-2xl font-header text-white">{metrics?.total}</p>
        </div>
        <div className="glass-panel p-6 text-center">
          <h4 className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-2">Nodes in Recovery Phase</h4>
          <p className="text-2xl font-header text-warning">{metrics?.recovering}</p>
        </div>
        <div className="glass-panel p-6 text-center">
          <h4 className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-2">Est. Recovery Speed</h4>
          <p className="text-2xl font-header text-glow-blue">Fast</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 glass-panel p-8 rounded-3xl">
           <h3 className="font-header text-sm text-white uppercase tracking-widest mb-6 flex items-center gap-2">
              <LifeBuoy className="w-4 h-4 text-glow-blue" /> Recovery Trajectory
           </h3>
           <div className="space-y-6">
              {suppliers.slice(0, 5).map((s, i) => {
                 const recoveryPercent = s.health; 
                 return (
                 <div key={i} className="flex justify-between items-end p-4 bg-white/5 border border-white/5 rounded-xl">
                    <div className="w-full">
                       <div className="flex justify-between items-center mb-3">
                          <div>
                             <p className="text-[11px] font-bold text-white uppercase tracking-tight">{s.name}</p>
                             <p className="text-[9px] text-slate-500 font-mono mt-1">Tier {s.tier}</p>
                          </div>
                          <div className="text-right">
                             <p className="text-[11px] text-white font-mono">{recoveryPercent}% Restored</p>
                             <p className={`text-[9px] uppercase font-bold ${recoveryPercent < 50 ? 'text-warning' : 'text-success'}`}>
                                {recoveryPercent < 50 ? 'Rebuilding' : 'Nearing Normalcy'}
                             </p>
                          </div>
                       </div>
                       <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${recoveryPercent < 50 ? 'bg-warning' : 'bg-success'}`} style={{ width: `${recoveryPercent}%` }} />
                       </div>
                    </div>
                 </div>
              )})}
           </div>
        </div>

        <div className="lg:col-span-4 glass-panel p-8 rounded-3xl h-full">
           <h3 className="font-header text-sm text-white uppercase tracking-widest mb-6 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-glow-blue" /> Strategy Intel
           </h3>
           <div className="p-5 bg-glow-blue/5 border border-glow-blue/20 rounded-2xl mb-6">
              <p className="text-[11px] text-slate-300 leading-relaxed italic">
                 "Aggregated recovery vectors indicate {metrics?.recovering} facilities are successfully bouncing back from recent disruptions. Average Time to Recovery (ATTR) remains ahead of baseline."
              </p>
           </div>
           
           <div className="p-4 bg-white/5 border border-white/5 rounded-xl flex gap-4 items-start">
              <Timer className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
              <div>
                 <p className="text-[10px] text-white font-bold uppercase">Uptime Assessment</p>
                 <p className="text-[9px] text-slate-400 mt-1">Expected return to 100% capacity in 3 weeks.</p>
              </div>
           </div>
        </div>
      </div>
    </AnalyticsLayout>
  );
}
