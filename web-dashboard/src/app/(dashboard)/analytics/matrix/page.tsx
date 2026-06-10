"use client";

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Target, Zap, Activity, Database, ArrowRight } from 'lucide-react';
import { useStore } from '@/store/useStore';
import Link from 'next/link';

export default function RiskMatrixAnalytics() {
  const { suppliers } = useStore();
  const hasData = suppliers.length > 0;

  const risks = useMemo(() => {
    if (!hasData) return [];
    return suppliers
      .filter(s => !s.isBackup)
      .map(s => ({
        id: s.id.slice(0, 6).toUpperCase(),
        title: s.name,
        impact: s.risk,
        prob: Math.round(100 - s.health),
        cat: s.risk > 75 ? 'Critical' : s.risk > 50 ? 'High' : 'Moderate',
        tier: s.tier,
      }))
      .sort((a, b) => (b.impact + b.prob) - (a.impact + a.prob))
      .slice(0, 20);
  }, [suppliers, hasData]);

  if (!hasData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-10 bg-[#0a0c10]/50 rounded-[3.5rem] border border-white/5 border-dashed">
        <Database className="w-16 h-16 text-slate-800 mb-6" />
        <h2 className="font-header text-3xl text-white uppercase italic mb-4">
          Risk Matrix <span className="text-glow-blue">Offline</span>
        </h2>
        <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed mb-8 font-bold uppercase tracking-tight">
          Upload your supply chain dataset to generate the impact vs probability risk matrix from real supplier data.
        </p>
        <Link href="/data/upload">
          <button className="px-10 py-5 bg-glow-blue text-white rounded-2xl font-bold uppercase tracking-widest text-xs shadow-[0_0_30px_rgba(59,130,246,0.3)]">
            Upload Dataset
          </button>
        </Link>
      </div>
    );
  }

  const criticalCount = risks.filter(r => r.cat === 'Critical').length;
  const highCount = risks.filter(r => r.cat === 'High').length;
  const moderateCount = risks.filter(r => r.cat === 'Moderate').length;

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase tracking-widest mb-2 font-mono">
          <span>Analytics</span><span className="opacity-30">/</span><span className="text-slate-300">Risk Matrix</span>
        </div>
        <h2 className="font-header text-3xl text-white tracking-tight uppercase italic">
          Impact vs <span className="text-glow-blue">Probability Matrix</span>
        </h2>
        <p className="text-slate-500 text-sm mt-2">Computed from {suppliers.filter(s=>!s.isBackup).length} active supplier nodes.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Matrix Visual */}
        <div className="lg:col-span-8 space-y-8">
          <div className="glass-panel border border-white/10 rounded-3xl p-10 h-[600px] relative overflow-hidden bg-black/20">
            {/* Quadrant labels */}
            <div className="absolute inset-10 z-0 pointer-events-none">
              <div className="w-full h-full relative border-l border-b border-white/10">
                <div className="absolute left-0 right-0 top-1/2 h-px bg-white/5" />
                <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/5" />
                <div className="absolute -left-12 top-0 bottom-0 flex flex-col justify-between py-4 text-[9px] text-slate-600 font-bold uppercase">
                  <span>HIGH IMPACT</span><span>LOW IMPACT</span>
                </div>
                <div className="absolute left-0 right-0 -bottom-8 flex justify-between px-4 text-[9px] text-slate-600 font-bold uppercase">
                  <span>Low Prob</span><span>High Prob</span>
                </div>
                {/* Quadrant shading */}
                <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-critical/[0.03] rounded-tr" />
                <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-success/[0.03] rounded-bl" />
              </div>
            </div>

            {/* Risk Points */}
            <div className="relative z-10 w-full h-full p-10">
              {risks.map((risk, i) => (
                <motion.div
                  key={risk.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="absolute cursor-pointer group"
                  style={{
                    bottom: `${Math.min(90, risk.impact)}%`,
                    left: `${Math.min(90, risk.prob)}%`,
                    transform: 'translate(-50%, 50%)'
                  }}
                >
                  <div className={`w-3.5 h-3.5 rounded-full border-2 border-background transition-all group-hover:scale-150 ${
                    risk.cat === 'Critical' ? 'bg-critical shadow-[0_0_10px_rgba(239,68,68,0.5)]' :
                    risk.cat === 'High' ? 'bg-warning shadow-[0_0_10px_rgba(245,158,11,0.5)]' :
                    'bg-glow-blue shadow-[0_0_10px_rgba(59,130,246,0.5)]'
                  }`} />
                  <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-background/90 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                    <div className="text-[10px] text-white font-bold uppercase italic truncate max-w-[160px]">{risk.title}</div>
                    <div className="text-[8px] text-slate-500 font-mono mt-0.5">Risk: {risk.impact} | Prob: {risk.prob}% | T{risk.tier}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { cat: 'Critical', count: criticalCount, color: 'text-critical', bg: 'bg-critical/10 border-critical/20' },
              { cat: 'High', count: highCount, color: 'text-warning', bg: 'bg-warning/10 border-warning/20' },
              { cat: 'Moderate', count: moderateCount, color: 'text-glow-blue', bg: 'bg-glow-blue/10 border-glow-blue/20' },
            ].map((c, i) => (
              <div key={i} className={`glass-panel border rounded-2xl p-6 flex items-center gap-4 ${c.bg}`}>
                <div className={`text-4xl font-header ${c.color}`}>{c.count}</div>
                <div>
                  <p className={`text-[10px] font-bold uppercase tracking-widest ${c.color}`}>{c.cat}</p>
                  <p className="text-[9px] text-slate-500 font-mono mt-1">Risk nodes</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Priority List */}
        <div className="lg:col-span-4 space-y-8">
          <div className="glass-panel border border-white/10 rounded-3xl p-8 h-full">
            <h3 className="font-header text-sm text-white uppercase tracking-widest mb-8 flex items-center gap-2">
              <Target className="w-4 h-4 text-glow-blue" /> Highest Priority
            </h3>
            <div className="space-y-4">
              {risks.slice(0, 6).map((risk, i) => (
                <div key={i} className="p-4 bg-white/5 border border-white/5 rounded-2xl group hover:bg-white/[0.08] transition-all cursor-pointer">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold text-white uppercase tracking-tighter truncate max-w-[140px]">{risk.title}</span>
                    <span className={`text-[8px] font-bold uppercase ${risk.cat === 'Critical' ? 'text-critical' : risk.cat === 'High' ? 'text-warning' : 'text-glow-blue'}`}>{risk.cat}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full ${risk.cat === 'Critical' ? 'bg-critical' : 'bg-warning'}`} style={{ width: `${risk.impact}%` }} />
                      </div>
                    </div>
                    <span className="text-[9px] text-slate-600 font-mono">T{risk.tier}</span>
                    <ArrowRight className="w-3 h-3 text-slate-600 group-hover:text-white transition-colors" />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-4 h-4 text-glow-blue" />
                <span className="text-[10px] font-bold text-glow-blue uppercase tracking-wider">Risk Summary</span>
              </div>
              <div className="space-y-2 text-[10px]">
                <div className="flex justify-between text-slate-400"><span>Analyzed nodes</span><span className="text-white font-mono">{risks.length}</span></div>
                <div className="flex justify-between text-slate-400"><span>Avg risk score</span><span className="text-white font-mono">{risks.length ? Math.round(risks.reduce((a,r)=>a+r.impact,0)/risks.length) : 0}%</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
