"use client";

import React, { useMemo } from 'react';
import EmptyState from '@/components/EmptyState';
import AnalyticsLayout from '@/components/AnalyticsLayout';
import { useStore } from '@/store/useStore';
import { TrendingUp, Package, AlertTriangle } from 'lucide-react';

export default function DemandAnalytics() {
  const { suppliers } = useStore();
  const hasData = suppliers.length > 0;

  const metrics = useMemo(() => {
    if (!hasData) return null;
    const total = suppliers.length;
    // Mock demand KPIs
    const highDemand = suppliers.filter(s => s.health > 70).length;
    const supplyGaps = suppliers.filter(s => s.health < 40).length;
    const projectedGrowth = '+14.2%';
    return { total, highDemand, supplyGaps, projectedGrowth };
  }, [suppliers, hasData]);

  if (!hasData) return <EmptyState />;

  return (
    <AnalyticsLayout category="Demand Forecast">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="glass-panel p-6 text-center border-l-4 border-l-glow-blue">
          <h4 className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-2">Total Monitored</h4>
          <p className="text-2xl font-header text-white">{metrics?.total}</p>
        </div>
        <div className="glass-panel p-6 text-center">
          <h4 className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-2">High Demand Nodes</h4>
          <p className="text-2xl font-header text-glow-blue">{metrics?.highDemand}</p>
        </div>
        <div className="glass-panel p-6 text-center">
          <h4 className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-2">Supply Gaps Detected</h4>
          <p className="text-2xl font-header text-critical">{metrics?.supplyGaps}</p>
        </div>
        <div className="glass-panel p-6 text-center">
          <h4 className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-2">Projected Q3 Growth</h4>
          <p className="text-2xl font-header text-success">{metrics?.projectedGrowth}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-panel p-8 rounded-3xl">
           <h3 className="font-header text-sm text-white uppercase tracking-widest mb-6 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-glow-blue" /> Demand Trajectory
           </h3>
           <div className="space-y-4">
              {suppliers.slice(0, 5).map((s, i) => (
                 <div key={i} className="flex justify-between items-center p-4 bg-white/5 border border-white/5 rounded-xl">
                    <div>
                       <p className="text-[11px] font-bold text-white uppercase tracking-tight">{s.name}</p>
                       <p className="text-[9px] text-slate-500 font-mono mt-1">{s.category}</p>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] text-slate-400 uppercase">Demand vs Supply</p>
                       <p className={`text-lg font-header ${s.health < 40 ? 'text-critical' : 'text-success'}`}>
                          {s.health < 40 ? 'Gap Risk' : 'Balanced'}
                       </p>
                    </div>
                 </div>
              ))}
           </div>
        </div>

        <div className="glass-panel p-8 rounded-3xl h-full">
           <h3 className="font-header text-sm text-white uppercase tracking-widest mb-6 flex items-center gap-2">
              <Package className="w-4 h-4 text-glow-blue" /> AI Analysis
           </h3>
           <div className="p-5 bg-glow-blue/5 border border-glow-blue/20 rounded-2xl mb-6">
              <p className="text-[11px] text-slate-300 leading-relaxed italic">
                 "Based on current data, demand is projected to exceed supply capacity for {metrics?.supplyGaps} key nodes. Recommend allocating additional inventory buffering for these critical paths."
              </p>
           </div>
           
           {metrics?.supplyGaps && metrics.supplyGaps > 0 && (
             <div className="p-4 bg-critical/10 border border-critical/20 rounded-xl flex gap-4 items-start">
                <AlertTriangle className="w-5 h-5 text-critical shrink-0 mt-0.5" />
                <div>
                   <p className="text-[10px] text-white font-bold uppercase">Action Required</p>
                   <p className="text-[9px] text-slate-400 mt-1">Review alternative suppliers to bridge the projected supply gap.</p>
                </div>
             </div>
           )}
        </div>
      </div>
    </AnalyticsLayout>
  );
}
