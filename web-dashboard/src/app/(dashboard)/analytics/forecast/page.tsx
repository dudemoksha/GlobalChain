"use client";

import React, { useMemo } from 'react';
import EmptyState from '@/components/EmptyState';
import AnalyticsLayout from '@/components/AnalyticsLayout';
import { useStore } from '@/store/useStore';
import { LineChart, Cpu, CalendarClock } from 'lucide-react';

export default function ForecastAnalytics() {
  const { suppliers } = useStore();
  const hasData = suppliers.length > 0;

  const metrics = useMemo(() => {
    if (!hasData) return null;
    const total = suppliers.length;
    const onTrack = suppliers.filter(s => s.health >= 50).length;
    const atRisk = total - onTrack;
    return { total, onTrack, atRisk };
  }, [suppliers, hasData]);

  if (!hasData) return <EmptyState />;

  return (
    <AnalyticsLayout category="Forecast">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-panel p-6 text-center border-l-4 border-l-glow-blue">
          <h4 className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-2">Projected Deliveries</h4>
          <p className="text-2xl font-header text-white">{metrics?.onTrack}</p>
        </div>
        <div className="glass-panel p-6 text-center">
          <h4 className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-2">At-Risk Shipments</h4>
          <p className="text-2xl font-header text-critical">{metrics?.atRisk}</p>
        </div>
        <div className="glass-panel p-6 text-center">
          <h4 className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-2">Total Monitored</h4>
          <p className="text-2xl font-header text-glow-blue">{metrics?.total}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-panel p-8 rounded-3xl">
           <h3 className="font-header text-sm text-white uppercase tracking-widest mb-6 flex items-center gap-2">
              <LineChart className="w-4 h-4 text-glow-blue" /> Delivery Horizon (Q3)
           </h3>
           <div className="space-y-5">
              {suppliers.slice(0, 5).map((s, i) => (
                 <div key={i}>
                    <div className="flex justify-between items-center mb-2">
                       <span className="text-[10px] font-bold text-white uppercase tracking-tight">{s.name}</span>
                       <span className={`text-[9px] font-mono font-bold uppercase ${s.health < 50 ? 'text-critical' : 'text-success'}`}>
                          {s.health < 50 ? 'Delayed' : 'On Schedule'}
                       </span>
                    </div>
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden flex">
                       <div className="h-full bg-glow-blue/40" style={{ width: '40%' }} />
                       <div className={`h-full ${s.health < 50 ? 'bg-critical' : 'bg-success'}`} style={{ width: `${s.health / 2}%` }} />
                    </div>
                 </div>
              ))}
           </div>
        </div>

        <div className="glass-panel p-8 rounded-3xl h-full">
           <h3 className="font-header text-sm text-white uppercase tracking-widest mb-6 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-glow-blue" /> Projection Engine
           </h3>
           <div className="p-5 bg-glow-blue/5 border border-glow-blue/20 rounded-2xl mb-6">
              <p className="text-[11px] text-slate-300 leading-relaxed italic">
                 "Advanced modeling indicates {metrics?.onTrack} shipments will arrive within their target windows. {metrics?.atRisk} nodes show elevated risk of missing deadlines."
              </p>
           </div>
           
           <div className="p-4 bg-white/5 border border-white/5 rounded-xl flex gap-4 items-start">
              <CalendarClock className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
              <div>
                 <p className="text-[10px] text-white font-bold uppercase">Logistics Horizon</p>
                 <p className="text-[9px] text-slate-400 mt-1">Next macro assessment scheduled in 14 days.</p>
              </div>
           </div>
        </div>
      </div>
    </AnalyticsLayout>
  );
}
