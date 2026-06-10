"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, Download, Calendar, Zap, CheckCircle2, 
  Clock, BarChart3, Shield, Globe, Activity, Plus
} from 'lucide-react';

const reportTemplates = [
  { id: 'RPT-EXEC', name: 'Executive Summary', desc: 'High-level KPIs, risk scores & AI recommendations for C-suite.', format: 'PDF', icon: BarChart3 },
  { id: 'RPT-RISK', name: 'Risk Intelligence Report', desc: 'Full matrix, propagation scores, and mitigation status.', format: 'PDF', icon: Shield },
  { id: 'RPT-SUPP', name: 'Partner Network Audit', desc: 'Health scores, lead-times, and compliance across all tiers.', format: 'XLSX', icon: Globe },
  { id: 'RPT-LOG', name: 'Full Audit Log Bundle', desc: 'Cryptographically-signed event chain with hashes.', format: 'JSON', icon: FileText },
  { id: 'RPT-SIM', name: 'Simulation Outcomes Report', desc: 'All executed scenarios with impact scores and recovery metrics.', format: 'PDF', icon: Activity },
];

const scheduled = [
  { name: 'Weekly Executive Brief', freq: 'Every Monday 08:00', next: 'MON 18 MAY', status: 'Active' },
  { name: 'Monthly Partner Audit', freq: 'First of Month', next: '01 JUN 2026', status: 'Active' },
];

export default function ReportsExportCenter() {
  const [generating, setGenerating] = useState<string | null>(null);

  const handleGenerate = (id: string) => {
    setGenerating(id);
    setTimeout(() => setGenerating(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase tracking-widest mb-2 font-mono">
            <span>Intelligence</span><span className="opacity-30">/</span><span className="text-slate-300">Reports & Export</span>
          </div>
          <h2 className="font-header text-3xl text-white tracking-tight uppercase italic">
            Intelligence <span className="text-glow-blue">Report Center</span>
          </h2>
        </div>
        <button className="px-6 py-2 bg-white/5 border border-white/10 text-slate-400 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:text-white transition-all flex items-center gap-2">
          <Plus className="w-3 h-3" /> Custom Report Builder
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Report Templates */}
        <div className="lg:col-span-8 space-y-8">
          <div className="glass-panel border border-white/10 rounded-3xl p-8">
            <h3 className="font-header text-sm text-white uppercase tracking-widest mb-6 flex items-center gap-2">
              <FileText className="w-4 h-4 text-glow-blue" /> Report Templates
            </h3>
            <div className="space-y-4">
              {reportTemplates.map((tpl, i) => (
                <motion.div key={tpl.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                  className="p-6 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between group hover:bg-white/[0.08] transition-all">
                  <div className="flex items-center gap-5">
                    <div className="w-10 h-10 rounded-xl bg-glow-blue/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <tpl.icon className="w-5 h-5 text-glow-blue" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="text-[11px] font-bold text-white uppercase tracking-tight">{tpl.name}</h4>
                        <span className="text-[8px] font-bold uppercase px-2 py-0.5 bg-white/10 border border-white/10 rounded text-slate-400">{tpl.format}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 italic">{tpl.desc}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleGenerate(tpl.id)}
                    className={`shrink-0 px-5 py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${
                      generating === tpl.id
                        ? 'bg-success text-white'
                        : 'bg-glow-blue/10 border border-glow-blue/30 text-glow-blue hover:bg-glow-blue hover:text-white'
                    }`}
                  >
                    {generating === tpl.id ? (
                      <><CheckCircle2 className="w-3 h-3" /> Ready</>
                    ) : (
                      <><Download className="w-3 h-3" /> Generate</>
                    )}
                  </button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Scheduled Reports */}
          <div className="glass-panel border border-white/10 rounded-3xl p-8">
            <h3 className="font-header text-sm text-white uppercase tracking-widest mb-6 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-glow-blue" /> Automated Schedule
            </h3>
            <div className="space-y-4">
              {scheduled.map((s, i) => (
                <div key={i} className="p-5 bg-white/5 border border-white/5 rounded-2xl flex justify-between items-center">
                  <div>
                    <p className="text-[11px] font-bold text-white uppercase tracking-tight">{s.name}</p>
                    <p className="text-[9px] text-slate-500 font-mono mt-1 uppercase">{s.freq}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] text-success font-bold uppercase">{s.status}</p>
                    <p className="text-[9px] text-slate-500 font-mono mt-1">Next: {s.next}</p>
                  </div>
                </div>
              ))}
              <button className="w-full py-3 border border-dashed border-white/10 rounded-2xl text-[9px] font-bold text-slate-500 hover:text-white hover:border-white/20 transition-all flex items-center justify-center gap-2">
                <Plus className="w-3 h-3" /> Add Schedule
              </button>
            </div>
          </div>
        </div>

        {/* Side Stats */}
        <div className="lg:col-span-4">
          <div className="glass-panel border border-white/10 rounded-3xl p-8 h-full">
            <h3 className="font-header text-sm text-white uppercase tracking-widest mb-8 flex items-center gap-2">
              <Zap className="w-4 h-4 text-glow-blue" /> Export Intelligence
            </h3>
            <div className="space-y-5">
              {[
                { label: 'Reports Generated (30D)', val: '42' },
                { label: 'Last Export', val: '2h ago' },
                { label: 'Scheduled Reports', val: '2 Active' },
                { label: 'Total Data Exported', val: '4.2 GB' },
              ].map((s, i) => (
                <div key={i} className="flex justify-between items-center pb-4 border-b border-white/5 last:border-0">
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">{s.label}</span>
                  <span className="text-sm font-header text-white">{s.val}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 p-5 bg-glow-blue/5 border border-glow-blue/20 rounded-2xl">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-glow-blue" />
                <span className="text-[10px] font-bold text-glow-blue uppercase">Next Scheduled</span>
              </div>
              <p className="text-sm font-header text-white">MON 18 MAY</p>
              <p className="text-[9px] text-slate-500 font-mono mt-1">Weekly Executive Brief // 08:00 UTC</p>
            </div>
            <button className="w-full py-4 mt-8 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-white hover:bg-white/5 transition-all">
              Configure Delivery Channels
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
