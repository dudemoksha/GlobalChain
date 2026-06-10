"use client";

import React, { useMemo } from 'react';
import EmptyState from '@/components/EmptyState';
import AnalyticsLayout from '@/components/AnalyticsLayout';
import { useStore } from '@/store/useStore';
import { DollarSign, Cpu, TrendingDown } from 'lucide-react';

export default function FinancialAnalytics() {
  const { suppliers } = useStore();
  const hasData = suppliers.length > 0;

  const metrics = useMemo(() => {
    if (!hasData) return null;
    const total = suppliers.length;
    // Mock financial KPIs
    const totalExposure = (total * 2.5).toFixed(1);
    const healthyFinances = suppliers.filter(s => s.health >= 70).length;
    return { total, totalExposure, healthyFinances };
  }, [suppliers, hasData]);

  if (!hasData) return <EmptyState />;

  return (
    <AnalyticsLayout category="Financial">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-panel p-6 text-center border-l-4 border-l-glow-blue">
          <h4 className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-2">Total Exposure</h4>
          <p className="text-2xl font-header text-white">${metrics?.totalExposure}M</p>
        </div>
        <div className="glass-panel p-6 text-center">
          <h4 className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-2">Stable Entities</h4>
          <p className="text-2xl font-header text-success">{metrics?.healthyFinances}</p>
        </div>
        <div className="glass-panel p-6 text-center">
          <h4 className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-2">Monitored Suppliers</h4>
          <p className="text-2xl font-header text-glow-blue">{metrics?.total}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 glass-panel p-8 rounded-3xl">
           <h3 className="font-header text-sm text-white uppercase tracking-widest mb-6 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-glow-blue" /> Exposure Distribution
           </h3>
           <div className="space-y-6">
              {suppliers.slice(0, 5).map((s, i) => {
                 const exposure = Math.floor(Math.random() * 500) + 100;
                 const riskPercent = Math.round(100 - s.health);
                 return (
                 <div key={i} className="flex justify-between items-end p-4 bg-white/5 border border-white/5 rounded-xl">
                    <div className="w-full">
                       <div className="flex justify-between items-center mb-3">
                          <div>
                             <p className="text-[11px] font-bold text-white uppercase tracking-tight">{s.name}</p>
                             <p className="text-[9px] text-slate-500 font-mono mt-1">Tier {s.tier}</p>
                          </div>
                          <div className="text-right">
                             <p className="text-[11px] text-white font-mono">${exposure}k</p>
                             <p className="text-[9px] text-critical uppercase font-bold">{riskPercent}% Value at Risk</p>
                          </div>
                       </div>
                       <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                          <div className="h-full bg-critical rounded-full" style={{ width: `${riskPercent}%` }} />
                       </div>
                    </div>
                 </div>
              )})}
           </div>
        </div>

        <div className="lg:col-span-4 glass-panel p-8 rounded-3xl h-full relative overflow-hidden">
           <h3 className="font-header text-sm text-white uppercase tracking-widest mb-6 flex items-center gap-2 relative z-10">
              <Cpu className="w-4 h-4 text-glow-blue" /> Financial Intel
           </h3>
           <div className="p-5 bg-glow-blue/5 border border-glow-blue/20 rounded-2xl mb-6 relative z-10">
              <p className="text-[11px] text-slate-300 leading-relaxed italic">
                 "Overall financial stability remains strong, though localized currency fluctuations pose a minor risk to Tier-2 suppliers."
              </p>
           </div>
           
           <div className="p-4 bg-warning/10 border border-warning/20 rounded-xl flex gap-4 items-start relative z-10">
              <TrendingDown className="w-5 h-5 text-warning shrink-0 mt-0.5" />
              <div>
                 <p className="text-[10px] text-white font-bold uppercase">Volatility Alert</p>
                 <p className="text-[9px] text-slate-400 mt-1">Exchange rate pressures may impact margins by 2-4% next quarter.</p>
              </div>
           </div>
        </div>
      </div>
    </AnalyticsLayout>
  );
}
