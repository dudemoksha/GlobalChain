"use client";

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, ShieldCheck, AlertTriangle, Zap, Target, Globe, 
  ArrowUpRight, TrendingUp, Upload, Database
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import Link from 'next/link';

export default function ResilienceAnalytics() {
  const { suppliers } = useStore();
  const hasData = suppliers.length > 0;

  const metrics = useMemo(() => {
    if (!hasData) return null;
    const tier1 = suppliers.filter(s => s.tier === 1 && !s.isBackup);
    const tier2 = suppliers.filter(s => s.tier === 2 && !s.isBackup);
    const tier3 = suppliers.filter(s => s.tier === 3 && !s.isBackup);
    const avg = (arr: typeof suppliers) =>
      arr.length ? Math.round(arr.reduce((a, s) => a + s.health, 0) / arr.length) : 0;
    const overallHealth = avg(suppliers);
    const t1Health = avg(tier1);
    const t2Health = avg(tier2);
    const t3Health = avg(tier3);
    const criticalNodes = suppliers.filter(s => s.health < 30).length;
    const atRiskNodes = suppliers.filter(s => s.health >= 30 && s.health < 60).length;
    const backupRatio = suppliers.length
      ? Math.round((suppliers.filter(s => s.isBackup).length / suppliers.length) * 100)
      : 0;
    return { overallHealth, t1Health, t2Health, t3Health, criticalNodes, atRiskNodes, backupRatio };
  }, [suppliers, hasData]);

  if (!hasData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-10 bg-[#0a0c10]/50 rounded-[3.5rem] border border-white/5 border-dashed">
        <Database className="w-16 h-16 text-slate-800 mb-6" />
        <h2 className="font-header text-3xl text-white uppercase italic mb-4">
          Resilience Index <span className="text-glow-blue">Offline</span>
        </h2>
        <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed mb-8 font-bold uppercase tracking-tight">
          Upload your supply chain dataset to calculate real resilience metrics, tier vulnerability, and health scores.
        </p>
        <Link href="/data/upload">
          <button className="px-10 py-5 bg-glow-blue text-white rounded-2xl font-bold uppercase tracking-widest text-xs shadow-[0_0_30px_rgba(59,130,246,0.3)]">
            Upload Dataset
          </button>
        </Link>
      </div>
    );
  }

  const statusLabel = (metrics!.overallHealth >= 80) ? 'Optimal' : (metrics!.overallHealth >= 60) ? 'At Risk' : 'Critical';

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase tracking-widest mb-2 font-mono">
          <span>Analytics</span><span className="opacity-30">/</span><span className="text-slate-300">Resilience Index</span>
        </div>
        <h2 className="font-header text-3xl text-white tracking-tight uppercase italic">
          Operational <span className="text-glow-blue">Resilience</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Main Index Gauge */}
        <div className="lg:col-span-5 space-y-8">
          <div className="glass-panel border border-white/10 rounded-3xl p-10 flex flex-col items-center justify-center relative overflow-hidden h-[500px]">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-success via-glow-blue to-warning"></div>
            
            <div className="relative w-64 h-64 mb-8">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="128" cy="128" r="120" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                <motion.circle 
                  cx="128" cy="128" r="120" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray="753.6" 
                  initial={{ strokeDashoffset: 753.6 }}
                  animate={{ strokeDashoffset: 753.6 * (1 - metrics!.overallHealth / 100) }}
                  transition={{ duration: 2, ease: "easeOut" }}
                  className={metrics!.overallHealth >= 80 ? 'text-success' : metrics!.overallHealth >= 60 ? 'text-warning' : 'text-critical'}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-6xl font-header text-white">{metrics!.overallHealth}<span className="text-2xl text-glow-blue">%</span></span>
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-[0.3em] mt-2">{statusLabel}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-10 w-full px-4">
              {[
                { label: 'Total Suppliers', val: suppliers.length, unit: '', color: 'text-white' },
                { label: 'Critical Nodes', val: metrics!.criticalNodes, unit: '', color: 'text-critical' },
                { label: 'At Risk', val: metrics!.atRiskNodes, unit: '', color: 'text-warning' },
                { label: 'Backup Ratio', val: metrics!.backupRatio, unit: '%', color: 'text-glow-blue' },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest mb-1">{stat.label}</p>
                  <div className="flex items-center justify-center gap-1">
                    <span className={`text-xl font-header ${stat.color}`}>{stat.val}{stat.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 bg-white/[0.03] border border-white/10 rounded-3xl flex items-center justify-between group hover:bg-white/[0.05] transition-all cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-warning/10 rounded-xl flex items-center justify-center border border-warning/20">
                <AlertTriangle className="w-5 h-5 text-warning" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-widest">Fragility Analysis</h4>
                <p className="text-[9px] text-slate-500 uppercase font-mono">Single points of failure identified</p>
              </div>
            </div>
            <ArrowUpRight className="w-5 h-5 text-slate-600 group-hover:text-white transition-all" />
          </div>
        </div>

        {/* Right: Tier Analysis */}
        <div className="lg:col-span-7 space-y-8">
          <div className="glass-panel border border-white/10 rounded-3xl p-8">
            <h3 className="font-header text-sm text-white uppercase tracking-widest mb-8 flex items-center gap-2">
              <Target className="w-4 h-4 text-glow-blue" /> Vulnerability By Tier
            </h3>
            <div className="space-y-8">
              {[
                { tier: 'Tier 1 / Primary', health: metrics!.t1Health, count: suppliers.filter(s=>s.tier===1&&!s.isBackup).length },
                { tier: 'Tier 2 / Secondary', health: metrics!.t2Health, count: suppliers.filter(s=>s.tier===2&&!s.isBackup).length },
                { tier: 'Tier 3 / Materials', health: metrics!.t3Health, count: suppliers.filter(s=>s.tier===3&&!s.isBackup).length },
              ].map((t, i) => {
                const color = t.health >= 80 ? 'bg-success' : t.health >= 60 ? 'bg-warning' : 'bg-critical';
                const status = t.health >= 80 ? 'STABLE' : t.health >= 60 ? 'AT RISK' : 'CRITICAL';
                return (
                  <div key={i} className="group">
                    <div className="flex justify-between items-end mb-3">
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">{t.tier}</span>
                        <div className="text-sm font-header text-white mt-0.5">{status} ({t.count} nodes)</div>
                      </div>
                      <span className="text-2xl font-header text-white">{t.health}%</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }} animate={{ width: `${t.health}%` }}
                        className={`h-full ${color}`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="glass-panel border border-white/10 rounded-3xl p-8">
            <h3 className="font-header text-sm text-white uppercase tracking-widest mb-8 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-glow-blue" /> Health Distribution
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Healthy (≥80%)', count: suppliers.filter(s=>s.health>=80).length, color: 'bg-success' },
                { label: 'At Risk (60–79%)', count: suppliers.filter(s=>s.health>=60&&s.health<80).length, color: 'bg-warning' },
                { label: 'Critical (<60%)', count: suppliers.filter(s=>s.health<60).length, color: 'bg-critical' },
              ].map((cat, i) => {
                const pct = suppliers.length ? Math.round((cat.count / suppliers.length) * 100) : 0;
                return (
                  <div key={i}>
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-2">
                      <span className="text-slate-400">{cat.label}</span>
                      <span className="text-white">{cat.count} <span className="text-slate-600">({pct}%)</span></span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} className={`h-full ${cat.color}`} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
