"use client";

import React, { useMemo } from 'react';
import { useStore, Supplier } from '@/store/useStore';
import EmptyState from '@/components/EmptyState';
import Link from 'next/link';
import {
  Activity, AlertTriangle, Shield, TrendingUp, Globe,
  BarChart3, Users, Map, Zap, ArrowUpRight, CheckCircle2,
  XCircle, AlertCircle, Package, Radio
} from 'lucide-react';

// ─── Micro Components ────────────────────────────────────────────────────────

function KpiCard({ label, value, sub, color, icon: Icon }: { label: string; value: string | number; sub?: string; color: string; icon: any }) {
  return (
    <div className={`glass-panel p-6 rounded-3xl border border-white/10 flex flex-col gap-3 hover:border-white/20 transition-all group`}>
      <div className="flex items-center justify-between">
        <span className="text-[9px] text-slate-500 uppercase font-bold tracking-[0.3em]">{label}</span>
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${color} bg-opacity-10`}>
          <Icon className={`w-4 h-4 ${color.replace('bg-', 'text-')}`} />
        </div>
      </div>
      <p className={`text-3xl font-header tracking-tighter ${color.replace('bg-', 'text-')}`}>{value}</p>
      {sub && <p className="text-[9px] text-slate-600 uppercase font-bold tracking-widest">{sub}</p>}
    </div>
  );
}

function HBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-4 py-2">
      <span className="text-[10px] text-slate-400 font-bold uppercase w-32 shrink-0 truncate">{label}</span>
      <div className="flex-1 bg-white/5 rounded-full h-2 overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className={`text-[10px] font-bold font-mono w-8 text-right ${color.replace('bg-', 'text-')}`}>{value}</span>
    </div>
  );
}

function DonutSegment({ pct, offset, color }: { pct: number; offset: number; color: string }) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  const colorMap: Record<string, string> = {
    'text-red-400': '#f87171', 'text-orange-400': '#fb923c',
    'text-yellow-400': '#facc15', 'text-green-400': '#4ade80'
  };
  return (
    <circle
      cx="50" cy="50" r={r}
      fill="none"
      stroke={colorMap[color] || '#6b7280'}
      strokeWidth="14"
      strokeDasharray={`${dash} ${circ - dash}`}
      strokeDashoffset={-offset * circ / 100}
      strokeLinecap="round"
      style={{ transition: 'stroke-dasharray 0.8s ease' }}
    />
  );
}

// ─── Main AnalyticsHub ───────────────────────────────────────────────────────

export default function AnalyticsHub() {
  const { suppliers } = useStore();

  const stats = useMemo(() => {
    if (suppliers.length === 0) return null;

    const total = suppliers.length;
    const avgHealth = Math.round(suppliers.reduce((a, s) => a + s.health, 0) / total);
    const avgRisk = Math.round(suppliers.reduce((a, s) => a + s.risk, 0) / total);

    const critical = suppliers.filter(s => s.health < 40 || s.risk > 70).length;
    const atRisk   = suppliers.filter(s => (s.health >= 40 && s.health < 80) || (s.risk >= 30 && s.risk <= 70)).length;
    const healthy  = suppliers.filter(s => s.health >= 80 && s.risk < 30).length;
    const backups  = suppliers.filter(s => s.isBackup).length;

    const tier1 = suppliers.filter(s => s.tier === 1).length;
    const tier2 = suppliers.filter(s => s.tier === 2).length;
    const tier3 = suppliers.filter(s => s.tier === 3).length;

    // Regional breakdown by city/category
    const byRegion = suppliers.reduce((acc, s) => {
      const key = s.city || s.category || 'Unknown';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const topRegions = Object.entries(byRegion).sort((a, b) => b[1] - a[1]).slice(0, 8);

    // Category breakdown
    const byCategory = suppliers.reduce((acc, s) => {
      acc[s.category] = (acc[s.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const topCategories = Object.entries(byCategory).sort((a, b) => b[1] - a[1]).slice(0, 6);

    // Health score distribution
    const healthBands = [
      { label: '0–20', count: suppliers.filter(s => s.health < 20).length },
      { label: '20–40', count: suppliers.filter(s => s.health >= 20 && s.health < 40).length },
      { label: '40–60', count: suppliers.filter(s => s.health >= 40 && s.health < 60).length },
      { label: '60–80', count: suppliers.filter(s => s.health >= 60 && s.health < 80).length },
      { label: '80–100', count: suppliers.filter(s => s.health >= 80).length },
    ];

    // Disrupted suppliers
    const disrupted = suppliers
      .filter(s => s.health < 70)
      .sort((a, b) => a.health - b.health)
      .slice(0, 6);

    // Top performing
    const topPerforming = suppliers
      .filter(s => s.health >= 80)
      .sort((a, b) => b.health - a.health)
      .slice(0, 5);

    // Donut risk segments
    const critPct  = Math.round((critical / total) * 100);
    const riskPct  = Math.round((atRisk / total) * 100);
    const healPct  = Math.round((healthy / total) * 100);
    const backPct  = Math.round((backups / total) * 100);

    return {
      total, avgHealth, avgRisk, critical, atRisk, healthy, backups,
      tier1, tier2, tier3, topRegions, topCategories, healthBands,
      disrupted, topPerforming, critPct, riskPct, healPct, backPct
    };
  }, [suppliers]);

  if (!stats) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="w-20 h-20 rounded-3xl bg-white/[0.02] border border-white/10 flex items-center justify-center mb-6">
          <BarChart3 className="w-10 h-10 text-slate-600" />
        </div>
        <h2 className="font-header text-2xl text-white uppercase italic mb-3">No Data Loaded</h2>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-8 max-w-xs">
          Upload a supplier dataset to generate enterprise analytics
        </p>
        <Link href="/data/upload">
          <button className="px-8 py-4 bg-glow-blue text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-blue-500 transition-all shadow-lg">
            Upload Dataset
          </button>
        </Link>
      </div>
    );
  }

  const { total, avgHealth, avgRisk, critical, atRisk, healthy, backups,
    tier1, tier2, tier3, topRegions, topCategories, healthBands,
    disrupted, topPerforming, critPct, riskPct, healPct, backPct } = stats;

  const chainScore = Math.round(
    avgHealth * 0.5 + Math.max(0, 100 - avgRisk) * 0.3 + (healthy / total) * 100 * 0.2
  );

  return (
    <div className="space-y-8 pb-20">

      {/* ── KPI Row ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        <KpiCard label="Total Suppliers" value={total} sub={`${tier1}T1 · ${tier2}T2 · ${tier3}T3`} color="bg-glow-blue" icon={Users} />
        <KpiCard label="Avg Health Score" value={`${avgHealth}%`} sub={avgHealth >= 70 ? 'Operational' : 'Degraded'} color={avgHealth >= 70 ? 'bg-green-500' : 'bg-red-500'} icon={Activity} />
        <KpiCard label="Avg Risk Score" value={`${avgRisk}%`} sub={avgRisk < 30 ? 'Low Exposure' : avgRisk < 60 ? 'Moderate' : 'High Alert'} color={avgRisk < 30 ? 'bg-green-500' : avgRisk < 60 ? 'bg-yellow-500' : 'bg-red-500'} icon={Shield} />
        <KpiCard label="Critical Nodes" value={critical} sub={`${atRisk} at risk · ${healthy} healthy`} color="bg-red-500" icon={AlertTriangle} />
      </div>

      {/* ── Chain Health Score + Risk Distribution ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Chain Health Gauge */}
        <div className="glass-panel p-8 rounded-3xl border border-white/10">
          <h3 className="font-header text-xs text-white uppercase tracking-widest mb-6 flex items-center gap-2">
            <Radio className="w-4 h-4 text-glow-blue animate-pulse" /> Supply Chain Health Index
          </h3>
          <div className="flex flex-col items-center justify-center py-4">
            <div className="relative w-40 h-40">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
                <circle
                  cx="50" cy="50" r="40" fill="none"
                  stroke={chainScore >= 70 ? '#22c55e' : chainScore >= 40 ? '#f59e0b' : '#ef4444'}
                  strokeWidth="12"
                  strokeDasharray={`${(chainScore / 100) * 251.2} 251.2`}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dasharray 1s ease' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-4xl font-header ${chainScore >= 70 ? 'text-green-400' : chainScore >= 40 ? 'text-yellow-400' : 'text-red-400'}`}>{chainScore}</span>
                <span className="text-[8px] text-slate-600 uppercase tracking-widest font-bold">/ 100</span>
              </div>
            </div>
            <p className={`mt-4 text-xs font-bold uppercase tracking-widest ${chainScore >= 70 ? 'text-green-400' : chainScore >= 40 ? 'text-yellow-400' : 'text-red-400'}`}>
              {chainScore >= 70 ? 'Network Healthy' : chainScore >= 40 ? 'Network At Risk' : 'Critical Alert'}
            </p>
            <div className="mt-6 grid grid-cols-3 gap-4 w-full text-center text-[9px]">
              <div><p className="text-slate-600 uppercase mb-1">Healthy</p><p className="text-green-400 font-bold font-mono">{healthy}</p></div>
              <div><p className="text-slate-600 uppercase mb-1">At Risk</p><p className="text-yellow-400 font-bold font-mono">{atRisk}</p></div>
              <div><p className="text-slate-600 uppercase mb-1">Critical</p><p className="text-red-400 font-bold font-mono">{critical}</p></div>
            </div>
          </div>
        </div>

        {/* Risk Distribution Donut */}
        <div className="glass-panel p-8 rounded-3xl border border-white/10">
          <h3 className="font-header text-xs text-white uppercase tracking-widest mb-6 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-warning" /> Risk Level Distribution
          </h3>
          <div className="flex items-center gap-8">
            <svg viewBox="0 0 100 100" className="w-36 h-36 shrink-0 -rotate-90">
              <circle cx="50" cy="50" r="36" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="14" />
              <DonutSegment pct={critPct} offset={0} color="text-red-400" />
              <DonutSegment pct={riskPct} offset={critPct} color="text-orange-400" />
              <DonutSegment pct={healPct} offset={critPct + riskPct} color="text-green-400" />
              <DonutSegment pct={backPct} offset={critPct + riskPct + healPct} color="text-yellow-400" />
            </svg>
            <div className="flex-1 space-y-3">
              {[
                { label: 'Critical', pct: critPct, count: critical, color: 'text-red-400', dot: 'bg-red-400' },
                { label: 'At Risk', pct: riskPct, count: atRisk, color: 'text-orange-400', dot: 'bg-orange-400' },
                { label: 'Healthy', pct: healPct, count: healthy, color: 'text-green-400', dot: 'bg-green-400' },
                { label: 'Backup', pct: backPct, count: backups, color: 'text-yellow-400', dot: 'bg-yellow-400' },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${item.dot} shrink-0`} />
                  <span className="text-[10px] text-slate-400 flex-1 uppercase font-bold">{item.label}</span>
                  <span className={`text-[10px] font-mono font-bold ${item.color}`}>{item.count} <span className="text-slate-600">({item.pct}%)</span></span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Tier Distribution + Category Breakdown ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="glass-panel p-8 rounded-3xl border border-white/10">
          <h3 className="font-header text-xs text-white uppercase tracking-widest mb-6 flex items-center gap-2">
            <Package className="w-4 h-4 text-glow-blue" /> Supplier Tier Distribution
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Tier 1 — Critical Partners', value: tier1, color: 'bg-red-500' },
              { label: 'Tier 2 — Strategic Partners', value: tier2, color: 'bg-orange-400' },
              { label: 'Tier 3 — Support Partners', value: tier3, color: 'bg-green-400' },
              { label: 'Backup / Contingency', value: backups, color: 'bg-glow-blue' },
            ].map(row => (
              <HBar key={row.label} label={row.label} value={row.value} max={total} color={row.color} />
            ))}
          </div>
        </div>

        <div className="glass-panel p-8 rounded-3xl border border-white/10">
          <h3 className="font-header text-xs text-white uppercase tracking-widest mb-6 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-purple-400" /> Category Breakdown
          </h3>
          <div className="space-y-3">
            {topCategories.map(([cat, count]) => (
              <HBar key={cat} label={cat} value={count} max={total} color="bg-purple-400" />
            ))}
            {topCategories.length === 0 && <p className="text-[10px] text-slate-600 italic">No category data available.</p>}
          </div>
        </div>
      </div>

      {/* ── Health Score Distribution ── */}
      <div className="glass-panel p-8 rounded-3xl border border-white/10">
        <h3 className="font-header text-xs text-white uppercase tracking-widest mb-6 flex items-center gap-2">
          <Activity className="w-4 h-4 text-glow-blue" /> Health Score Distribution
        </h3>
        <div className="grid grid-cols-5 gap-3">
          {healthBands.map((band, i) => {
            const colors = ['bg-red-500', 'bg-orange-400', 'bg-yellow-400', 'bg-blue-400', 'bg-green-400'];
            const textColors = ['text-red-400', 'text-orange-400', 'text-yellow-400', 'text-blue-400', 'text-green-400'];
            const maxCount = Math.max(...healthBands.map(b => b.count), 1);
            const heightPct = Math.round((band.count / maxCount) * 100);
            return (
              <div key={band.label} className="flex flex-col items-center gap-2">
                <span className={`text-lg font-header font-bold ${textColors[i]}`}>{band.count}</span>
                <div className="w-full bg-white/5 rounded-xl overflow-hidden h-24 flex items-end">
                  <div className={`w-full ${colors[i]} rounded-xl transition-all duration-700`} style={{ height: `${heightPct}%` }} />
                </div>
                <span className="text-[8px] text-slate-600 uppercase font-bold tracking-widest">{band.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Regional Breakdown + Disruption Impact ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="glass-panel p-8 rounded-3xl border border-white/10">
          <h3 className="font-header text-xs text-white uppercase tracking-widest mb-6 flex items-center gap-2">
            <Map className="w-4 h-4 text-glow-blue" /> Regional Supplier Count
          </h3>
          <div className="space-y-2">
            {topRegions.map(([region, count], i) => (
              <div key={region} className="flex items-center gap-4 py-1.5">
                <span className="text-[9px] text-slate-600 font-mono w-4">{i + 1}</span>
                <span className="text-[10px] text-slate-300 font-bold uppercase flex-1 truncate">{region}</span>
                <div className="w-24 bg-white/5 rounded-full h-1.5 overflow-hidden">
                  <div className="h-full bg-glow-blue rounded-full" style={{ width: `${(count / topRegions[0][1]) * 100}%` }} />
                </div>
                <span className="text-[10px] text-glow-blue font-mono font-bold w-6 text-right">{count}</span>
              </div>
            ))}
            {topRegions.length === 0 && <p className="text-[10px] text-slate-600 italic">No regional data available.</p>}
          </div>
        </div>

        <div className="glass-panel p-8 rounded-3xl border border-white/10">
          <h3 className="font-header text-xs text-white uppercase tracking-widest mb-6 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400" /> Disruption Impact Analysis
          </h3>
          {disrupted.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <CheckCircle2 className="w-8 h-8 text-green-400 mb-3" />
              <p className="text-xs text-green-400 font-bold uppercase tracking-widest">No Disruptions Detected</p>
              <p className="text-[9px] text-slate-600 mt-1">All suppliers operating above 70% health</p>
            </div>
          ) : (
            <div className="space-y-3">
              {disrupted.map(s => (
                <div key={s.id} className="flex items-center gap-4 py-2 border-b border-white/5 last:border-0">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${s.health < 40 ? 'bg-red-500' : 'bg-orange-400'} animate-pulse`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-white font-bold uppercase truncate">{s.name}</p>
                    <p className="text-[8px] text-slate-600 uppercase font-bold">{s.category} · Tier {s.tier}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`text-sm font-header font-bold ${s.health < 40 ? 'text-red-400' : 'text-orange-400'}`}>{s.health}%</p>
                    <p className="text-[7px] text-slate-600 uppercase">Health</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Top Performing Suppliers ── */}
      <div className="glass-panel p-8 rounded-3xl border border-white/10">
        <h3 className="font-header text-xs text-white uppercase tracking-widest mb-6 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-green-400" /> Top Performing Suppliers
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
          {topPerforming.map(s => (
            <div key={s.id} className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 flex flex-col gap-2 hover:border-green-400/20 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[8px] text-slate-600 uppercase font-bold">Tier {s.tier}</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
              </div>
              <p className="text-[10px] text-white font-bold uppercase truncate">{s.name}</p>
              <p className="text-[8px] text-slate-600 font-mono">{s.category}</p>
              <div className="mt-auto">
                <div className="flex justify-between mb-1">
                  <span className="text-[7px] text-slate-600 uppercase">Health</span>
                  <span className="text-[9px] text-green-400 font-bold">{s.health}%</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-1 overflow-hidden">
                  <div className="h-full bg-green-400 rounded-full" style={{ width: `${s.health}%` }} />
                </div>
              </div>
            </div>
          ))}
          {topPerforming.length === 0 && (
            <p className="text-[10px] text-slate-600 italic col-span-5">No high-performing suppliers found in current dataset.</p>
          )}
        </div>
      </div>

      {/* ── Navigate to Globe CTA ── */}
      <div className="glass-panel p-8 rounded-3xl border border-glow-blue/20 bg-glow-blue/[0.02] flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-glow-blue/10 border border-glow-blue/20 rounded-2xl flex items-center justify-center">
            <Globe className="w-7 h-7 text-glow-blue" />
          </div>
          <div>
            <p className="font-header text-lg text-white uppercase italic">View on Globe</p>
            <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Visualize supplier locations and route connections in 3D</p>
          </div>
        </div>
        <Link href="/visualization/globe">
          <button className="px-8 py-4 bg-glow-blue text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-blue-500 transition-all shadow-lg">
            Open Globe <ArrowUpRight className="w-4 h-4" />
          </button>
        </Link>
      </div>

    </div>
  );
}
