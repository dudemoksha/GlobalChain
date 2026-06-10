"use client";

import React, { useMemo } from 'react';
import EmptyState from '@/components/EmptyState';
import AnalyticsLayout from '@/components/AnalyticsLayout';
import { useStore } from '@/store/useStore';
import { Factory, Cpu, Hammer } from 'lucide-react';

export default function ManufacturingAnalytics() {
  const { suppliers } = useStore();
  const hasData = suppliers.length > 0;

  const metrics = useMemo(() => {
    if (!hasData) return null;
    const total = suppliers.length;
    const disrupted = suppliers.filter(s => s.health < 50).length;
    return { total, disrupted };
  }, [suppliers, hasData]);

  if (!hasData) return <EmptyState />;

  return (
    <AnalyticsLayout category="Manufacturing Output">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-panel p-6 text-center border-l-4 border-l-glow-blue">
          <h4 className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-2">Production Nodes</h4>
          <p className="text-2xl font-header text-white">{metrics?.total}</p>
        </div>
        <div className="glass-panel p-6 text-center">
          <h4 className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-2">Lines Disrupted</h4>
          <p className="text-2xl font-header text-critical">{metrics?.disrupted}</p>
        </div>
        <div className="glass-panel p-6 text-center">
          <h4 className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-2">Global OEE</h4>
          <p className="text-2xl font-header text-glow-blue">76%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 glass-panel p-8 rounded-3xl">
           <h3 className="font-header text-sm text-white uppercase tracking-widest mb-6 flex items-center gap-2">
              <Factory className="w-4 h-4 text-glow-blue" /> Line Efficiency
           </h3>
           <div className="space-y-6">
              {suppliers.slice(0, 5).map((s, i) => {
                 const oee = s.health; 
                 return (
                 <div key={i} className="flex justify-between items-end p-4 bg-white/5 border border-white/5 rounded-xl">
                    <div className="w-full">
                       <div className="flex justify-between items-center mb-3">
                          <div>
                             <p className="text-[11px] font-bold text-white uppercase tracking-tight">{s.name} Facility</p>
                             <p className="text-[9px] text-slate-500 font-mono mt-1">Tier {s.tier}</p>
                          </div>
                          <div className="text-right">
                             <p className="text-[11px] text-white font-mono">OEE: {oee}%</p>
                             <p className={`text-[9px] uppercase font-bold ${oee < 50 ? 'text-critical' : 'text-success'}`}>
                                {oee < 50 ? 'Suboptimal' : 'Target Met'}
                             </p>
                          </div>
                       </div>
                       <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${oee < 50 ? 'bg-critical' : 'bg-success'}`} style={{ width: `${oee}%` }} />
                       </div>
                    </div>
                 </div>
              )})}
           </div>
        </div>

        <div className="lg:col-span-4 glass-panel p-8 rounded-3xl h-full">
           <h3 className="font-header text-sm text-white uppercase tracking-widest mb-6 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-glow-blue" /> AI Analysis
           </h3>
           <div className="p-5 bg-glow-blue/5 border border-glow-blue/20 rounded-2xl mb-6">
              <p className="text-[11px] text-slate-300 leading-relaxed italic">
                 "Aggregate manufacturing output remains steady. {metrics?.disrupted} facilities are operating below optimal thresholds, likely due to micro-stoppages."
              </p>
           </div>
           
           <div className="p-4 bg-white/5 border border-white/5 rounded-xl flex gap-4 items-start">
              <Hammer className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
              <div>
                 <p className="text-[10px] text-white font-bold uppercase">Maintenance Window</p>
                 <p className="text-[9px] text-slate-400 mt-1">Predictive maintenance recommended for Tier 1 lines within 30 days.</p>
              </div>
           </div>
        </div>
      </div>
    </AnalyticsLayout>
  );
}
