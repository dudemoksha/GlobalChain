"use client";

import React, { useMemo } from 'react';
import EmptyState from '@/components/EmptyState';
import AnalyticsLayout from '@/components/AnalyticsLayout';
import { useStore } from '@/store/useStore';
import { Globe, Cpu, AlertTriangle } from 'lucide-react';

export default function GeopoliticalAnalytics() {
  const { suppliers } = useStore();
  const hasData = suppliers.length > 0;

  const metrics = useMemo(() => {
    if (!hasData) return null;
    const total = suppliers.length;
    const locations = new Set(suppliers.map(s => s.city || `${s.lat},${s.lng}`)).size;
    const highRiskRegions = Math.floor(locations * 0.2) || 1;
    return { total, locations, highRiskRegions };
  }, [suppliers, hasData]);

  if (!hasData) return <EmptyState />;

  return (
    <AnalyticsLayout category="Geopolitical">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-panel p-6 text-center border-l-4 border-l-glow-blue">
          <h4 className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-2">Active Regions</h4>
          <p className="text-2xl font-header text-white">{metrics?.locations}</p>
        </div>
        <div className="glass-panel p-6 text-center">
          <h4 className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-2">High-Risk Zones</h4>
          <p className="text-2xl font-header text-warning">{metrics?.highRiskRegions}</p>
        </div>
        <div className="glass-panel p-6 text-center">
          <h4 className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-2">Total Nodes</h4>
          <p className="text-2xl font-header text-glow-blue">{metrics?.total}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 glass-panel p-8 rounded-3xl">
           <h3 className="font-header text-sm text-white uppercase tracking-widest mb-6 flex items-center gap-2">
              <Globe className="w-4 h-4 text-glow-blue" /> Regional Threat Mapping
           </h3>
           <div className="space-y-4">
              {suppliers.slice(0, 6).map((s, i) => (
                 <div key={i} className="flex justify-between items-center p-4 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-4">
                       <Globe className={`w-5 h-5 ${s.health < 40 ? 'text-critical' : 'text-slate-500'}`} />
                       <div>
                          <p className="text-[11px] font-bold text-white uppercase tracking-tight">{s.city || 'Global Zone'}</p>
                          <p className="text-[9px] text-slate-500 font-mono mt-1">{s.name}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-[9px] text-slate-400 uppercase font-bold">Policy Risk</p>
                       <p className={`text-sm font-header ${s.health < 40 ? 'text-critical' : 'text-success'}`}>
                          {s.health < 40 ? 'Elevated' : 'Stable'}
                       </p>
                    </div>
                 </div>
              ))}
           </div>
        </div>

        <div className="lg:col-span-4 glass-panel p-8 rounded-3xl h-full">
           <h3 className="font-header text-sm text-white uppercase tracking-widest mb-6 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-glow-blue" /> Strategic Intel
           </h3>
           <div className="p-5 bg-glow-blue/5 border border-glow-blue/20 rounded-2xl mb-6">
              <p className="text-[11px] text-slate-300 leading-relaxed italic">
                 "Monitoring policy shifts across {metrics?.locations} unique jurisdictions. Trade tension indicators remain moderate for {metrics?.highRiskRegions} zones."
              </p>
           </div>
           
           <div className="p-4 bg-warning/10 border border-warning/20 rounded-xl flex gap-4 items-start">
              <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
              <div>
                 <p className="text-[10px] text-white font-bold uppercase">Regulatory Shift</p>
                 <p className="text-[9px] text-slate-400 mt-1">Pending export control policies may affect nodes in impacted regions.</p>
              </div>
           </div>
        </div>
      </div>
    </AnalyticsLayout>
  );
}
