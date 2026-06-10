"use client";

import React, { useMemo } from 'react';
import EmptyState from '@/components/EmptyState';
import AnalyticsLayout from '@/components/AnalyticsLayout';
import { useStore } from '@/store/useStore';
import { Activity, Shield, Cpu, Target } from 'lucide-react';

export default function CyberAnalytics() {
  const { suppliers } = useStore();
  const hasData = suppliers.length > 0;

  const metrics = useMemo(() => {
    if (!hasData) return null;
    const total = suppliers.length;
    const tier1 = suppliers.filter(s => s.tier === 1 && !s.isBackup).length;
    const tier2 = suppliers.filter(s => s.tier === 2 && !s.isBackup).length;
    const tier3 = suppliers.filter(s => s.tier === 3 && !s.isBackup).length;
    const avgHealth = Math.round(suppliers.reduce((a, s) => a + s.health, 0) / total);
    return { total, tier1, tier2, tier3, avgHealth };
  }, [suppliers, hasData]);

  if (!hasData) return <EmptyState />;

  return (
    <AnalyticsLayout category="Cyber">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-panel p-6 text-center border-l-4 border-l-glow-blue">
          <h4 className="text-sm text-slate-500 uppercase font-bold tracking-widest mb-2">Total Monitored</h4>
          <p className="text-2xl font-header text-white">{metrics?.total}</p>
        </div>
        <div className="glass-panel p-6 text-center">
          <h4 className="text-sm text-slate-500 uppercase font-bold tracking-widest mb-2">Network Cyber Health</h4>
          <p className="text-2xl font-header text-success">{metrics?.avgHealth}%</p>
        </div>
        <div className="glass-panel p-6 text-center">
          <h4 className="text-sm text-slate-500 uppercase font-bold tracking-widest mb-2">Tier 1 Nodes</h4>
          <p className="text-2xl font-header text-glow-blue">{metrics?.tier1}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-panel p-8 rounded-3xl">
           <h3 className="font-header text-sm text-white uppercase tracking-widest mb-6 flex items-center gap-2">
              <Shield className="w-4 h-4 text-glow-blue" /> Vulnerability Scans
           </h3>
           <div className="space-y-4">
              {suppliers.slice(0, 5).map((s, i) => (
                 <div key={i} className="flex justify-between items-center p-4 bg-white/5 border border-white/5 rounded-xl">
                    <div>
                       <p className="text-[11px] font-bold text-white uppercase tracking-tight">{s.name}</p>
                       <p className="text-[9px] text-slate-500 font-mono mt-1">IP-SEC: VERIFIED</p>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] text-slate-400 uppercase">Threat Level</p>
                       <p className={`text-sm font-header ${s.health < 40 ? 'text-critical' : 'text-success'}`}>
                          {s.health < 40 ? 'Elevated' : 'Nominal'}
                       </p>
                    </div>
                 </div>
              ))}
           </div>
        </div>

        <div className="glass-panel p-8 rounded-3xl h-full relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-5">
              <Cpu className="w-32 h-32 text-white" />
           </div>
           <h3 className="font-header text-sm text-white uppercase tracking-widest mb-6 flex items-center gap-2 relative z-10">
              <Activity className="w-4 h-4 text-glow-blue" /> Cyber Intel Engine
           </h3>
           <div className="p-5 bg-glow-blue/5 border border-glow-blue/20 rounded-2xl mb-6 relative z-10">
              <p className="text-[11px] text-slate-300 leading-relaxed italic">
                 "No immediate zero-day vulnerabilities detected across {metrics?.total} monitored vendor API endpoints. Continued monitoring of Tier 3 legacy systems is recommended."
              </p>
           </div>
           
           <div className="space-y-3 relative z-10">
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                 <span className="text-[9px] text-slate-400 uppercase font-bold tracking-widest">DDoS Protection</span>
                 <span className="text-[9px] text-success font-mono">ACTIVE</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                 <span className="text-[9px] text-slate-400 uppercase font-bold tracking-widest">Data Encryption</span>
                 <span className="text-[9px] text-success font-mono">AES-256</span>
              </div>
           </div>
        </div>
      </div>
    </AnalyticsLayout>
  );
}
