"use client";

import React, { useMemo } from 'react';
import EmptyState from '@/components/EmptyState';
import AnalyticsLayout from '@/components/AnalyticsLayout';
import { useStore } from '@/store/useStore';
import { Radar, Cpu, Zap } from 'lucide-react';

export default function PredictiveAnalytics() {
  const { suppliers } = useStore();
  const hasData = suppliers.length > 0;

  const metrics = useMemo(() => {
    if (!hasData) return null;
    const total = suppliers.length;
    const highProbability = suppliers.filter(s => s.health < 40).length;
    return { total, highProbability };
  }, [suppliers, hasData]);

  if (!hasData) return <EmptyState />;

  return (
    <AnalyticsLayout category="Predictive Models">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-panel p-6 text-center border-l-4 border-l-glow-blue">
          <h4 className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-2">Total Vectors Analyzed</h4>
          <p className="text-2xl font-header text-white">{metrics?.total}</p>
        </div>
        <div className="glass-panel p-6 text-center">
          <h4 className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-2">High-Probability Events</h4>
          <p className="text-2xl font-header text-critical">{metrics?.highProbability}</p>
        </div>
        <div className="glass-panel p-6 text-center">
          <h4 className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-2">Model Confidence</h4>
          <p className="text-2xl font-header text-glow-blue">94%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 glass-panel p-8 rounded-3xl">
           <h3 className="font-header text-sm text-white uppercase tracking-widest mb-6 flex items-center gap-2">
              <Radar className="w-4 h-4 text-glow-blue" /> Disruption Horizon
           </h3>
           <div className="space-y-4">
              {suppliers.slice(0, 6).map((s, i) => (
                 <div key={i} className="flex justify-between items-center p-4 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-4">
                       <Zap className={`w-5 h-5 ${s.health < 40 ? 'text-critical' : 'text-slate-500'}`} />
                       <div>
                          <p className="text-[11px] font-bold text-white uppercase tracking-tight">{s.name}</p>
                          <p className="text-[9px] text-slate-500 font-mono mt-1">Simulated Threat Vector</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-[9px] text-slate-400 uppercase font-bold">Probability</p>
                       <p className={`text-sm font-header ${s.health < 40 ? 'text-critical' : 'text-success'}`}>
                          {100 - s.health}%
                       </p>
                    </div>
                 </div>
              ))}
           </div>
        </div>

        <div className="lg:col-span-4 glass-panel p-8 rounded-3xl h-full">
           <h3 className="font-header text-sm text-white uppercase tracking-widest mb-6 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-glow-blue" /> Quantum Prediction Engine
           </h3>
           <div className="p-5 bg-glow-blue/5 border border-glow-blue/20 rounded-2xl mb-6">
              <p className="text-[11px] text-slate-300 leading-relaxed italic">
                 "Our predictive ensemble forecasts {metrics?.highProbability} significant disruptions in the next 14 days. Suggest activating contingency plans for flagged nodes."
              </p>
           </div>
           
           <div className="p-4 bg-white/5 border border-white/5 rounded-xl flex gap-4 items-start">
              <Radar className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
              <div>
                 <p className="text-[10px] text-white font-bold uppercase">Data Stream</p>
                 <p className="text-[9px] text-slate-400 mt-1">Ingesting live weather, sentiment, and traffic telemetry.</p>
              </div>
           </div>
        </div>
      </div>
    </AnalyticsLayout>
  );
}
