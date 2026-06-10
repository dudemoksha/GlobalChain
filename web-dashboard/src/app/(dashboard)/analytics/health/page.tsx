"use client";

import React, { useMemo } from 'react';
import EmptyState from '@/components/EmptyState';
import AnalyticsLayout from '@/components/AnalyticsLayout';
import { useStore } from '@/store/useStore';
import { HeartPulse, Cpu, ActivitySquare } from 'lucide-react';

export default function HealthAnalytics() {
  const { suppliers } = useStore();
  const hasData = suppliers.length > 0;

  const metrics = useMemo(() => {
    if (!hasData) return null;
    const total = suppliers.length;
    const critical = suppliers.filter(s => s.health < 40).length;
    const avgHealth = Math.round(suppliers.reduce((a, s) => a + s.health, 0) / total);
    return { total, critical, avgHealth };
  }, [suppliers, hasData]);

  if (!hasData) return <EmptyState />;

  return (
    <AnalyticsLayout category="Ecosystem Health">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-panel p-6 text-center border-l-4 border-l-glow-blue">
          <h4 className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-2">Network Average</h4>
          <p className="text-2xl font-header text-white">{metrics?.avgHealth}%</p>
        </div>
        <div className="glass-panel p-6 text-center">
          <h4 className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-2">Critical Nodes</h4>
          <p className="text-2xl font-header text-critical">{metrics?.critical}</p>
        </div>
        <div className="glass-panel p-6 text-center">
          <h4 className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-2">Monitored Entities</h4>
          <p className="text-2xl font-header text-glow-blue">{metrics?.total}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 glass-panel p-8 rounded-3xl">
           <h3 className="font-header text-sm text-white uppercase tracking-widest mb-6 flex items-center gap-2">
              <ActivitySquare className="w-4 h-4 text-glow-blue" /> Vital Signs Monitoring
           </h3>
           <div className="space-y-4">
              {suppliers.slice(0, 6).map((s, i) => (
                 <div key={i} className="flex justify-between items-center p-4 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-4">
                       <div className={`w-10 h-10 rounded-full flex items-center justify-center font-mono text-[10px] border ${s.health < 40 ? 'bg-critical/10 border-critical/30 text-critical' : s.health < 70 ? 'bg-warning/10 border-warning/30 text-warning' : 'bg-success/10 border-success/30 text-success'}`}>
                          {s.health}%
                       </div>
                       <div>
                          <p className="text-[11px] font-bold text-white uppercase tracking-tight">{s.name}</p>
                          <p className="text-[9px] text-slate-500 font-mono mt-1">Status: {s.health < 40 ? 'CRITICAL' : s.health < 70 ? 'AT RISK' : 'NOMINAL'}</p>
                       </div>
                    </div>
                 </div>
              ))}
           </div>
        </div>

        <div className="lg:col-span-4 glass-panel p-8 rounded-3xl h-full">
           <h3 className="font-header text-sm text-white uppercase tracking-widest mb-6 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-glow-blue" /> Diagnostics
           </h3>
           <div className="p-5 bg-glow-blue/5 border border-glow-blue/20 rounded-2xl mb-6">
              <p className="text-[11px] text-slate-300 leading-relaxed italic">
                 "Network health is hovering at {metrics?.avgHealth}%. We are tracking {metrics?.critical} nodes operating below baseline resilience parameters."
              </p>
           </div>
           
           <div className="p-4 bg-white/5 border border-white/5 rounded-xl flex gap-4 items-start">
              <HeartPulse className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
              <div>
                 <p className="text-[10px] text-white font-bold uppercase">System Heartbeat</p>
                 <p className="text-[9px] text-slate-400 mt-1">Continuous monitoring protocol engaged. Data stream is nominal.</p>
              </div>
           </div>
        </div>
      </div>
    </AnalyticsLayout>
  );
}
