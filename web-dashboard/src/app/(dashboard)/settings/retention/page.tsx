"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Database, 
  Trash2, 
  Archive, 
  Zap, 
  Shield, 
  Activity, 
  Clock, 
  RefreshCcw,
  ArrowRight,
  ShieldAlert,
  Save
} from 'lucide-react';

export default function DataRetentionSettings() {
  const [retentionDays, setRetentionDays] = useState(90);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase tracking-widest mb-2 font-mono">
            <span>Settings</span>
            <span className="opacity-30">/</span>
            <span className="text-slate-300">Data Retention</span>
          </div>
          <h2 className="font-header text-3xl text-white tracking-tight uppercase italic">
            Lifecycle <span className="text-glow-blue">Management</span>
          </h2>
        </div>
        <div className="flex gap-4">
           <button className="px-10 py-2 bg-glow-blue text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg flex items-center gap-2 hover:scale-105 transition-all">
              <Save className="w-3 h-3" /> Commit Policy
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Retention Config Area */}
        <div className="lg:col-span-8 space-y-8">
           <div className="glass-panel border border-white/10 rounded-3xl p-8 space-y-10">
              <h3 className="font-header text-sm text-white uppercase tracking-widest flex items-center gap-2">
                 <Clock className="w-4 h-4 text-glow-blue" /> Temporal Retention Policy
              </h3>

              <div className="space-y-12">
                 {/* Live Data Retention */}
                 <div className="space-y-4">
                    <div className="flex justify-between items-center">
                       <label className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Live Telemetry Retention</label>
                       <span className="text-xs font-mono text-glow-blue">{retentionDays} Days</span>
                    </div>
                    <input 
                      type="range" min="30" max="365" step="30" value={retentionDays} onChange={(e) => setRetentionDays(parseInt(e.target.value))}
                      className="w-full h-1 bg-white/5 rounded-full appearance-none cursor-pointer accent-glow-blue"
                    />
                    <div className="flex justify-between text-[8px] text-slate-600 font-mono">
                       <span>30D (Minimal)</span>
                       <span>90D (Standard)</span>
                       <span>365D (Deep)</span>
                    </div>
                 </div>

                 {/* Archiving Protocol */}
                 <div className="space-y-6 pt-10 border-t border-white/5">
                    <h4 className="text-[10px] text-slate-500 uppercase font-bold tracking-widest flex items-center gap-2">
                       <Archive className="w-4 h-4" /> Automated Archiving Cycles
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       {[
                         { label: 'Archive Historical Risk Logs', status: true, freq: 'Monthly' },
                         { label: 'Archive Finished Missions', status: true, freq: 'Quarterly' },
                         { label: 'Cloud Mirroring Sync', status: true, freq: 'Daily' },
                         { label: 'Local PII Scrapping', status: false, freq: 'Immediate' },
                       ].map((item, i) => (
                         <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/5 flex justify-between items-center group hover:bg-white/[0.08] transition-all">
                            <div>
                               <div className="text-[10px] text-white font-bold uppercase tracking-tighter">{item.label}</div>
                               <div className="text-[8px] text-slate-600 font-mono mt-1">FREQ: {item.freq}</div>
                            </div>
                            <div className={`w-10 h-5 rounded-full relative transition-all ${item.status ? 'bg-glow-blue' : 'bg-white/10'}`}>
                               <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${item.status ? 'right-1' : 'left-1'}`}></div>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>

           {/* Purge Controls */}
           <div className="p-8 bg-critical/5 border border-critical/20 rounded-3xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform">
                 <Trash2 className="w-32 h-32 text-critical" />
              </div>
              <div className="relative z-10">
                 <h4 className="text-[11px] font-bold text-critical uppercase tracking-widest mb-3 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4" /> Strategic Data Purge
                 </h4>
                 <p className="text-[10px] text-slate-300 leading-relaxed italic max-w-2xl mb-8">
                    "Immediately wipe all non-essential historical audit data across distributed nodes. This action is irreversible and cryptographically enforced."
                 </p>
                 <button className="px-10 py-3 bg-critical/10 border border-critical/40 text-critical rounded-xl text-[9px] font-bold uppercase tracking-widest hover:bg-critical hover:text-white transition-all">
                    Initialize Systemic Purge
                 </button>
              </div>
           </div>
        </div>

        {/* Storage Summary Side Panel */}
        <div className="lg:col-span-4 space-y-8">
           <div className="glass-panel border border-white/10 rounded-3xl p-8 h-full">
              <h3 className="font-header text-sm text-white uppercase tracking-widest mb-8 flex items-center gap-2">
                 <Database className="w-4 h-4 text-glow-blue" /> Storage Architecture
              </h3>
              
              <div className="space-y-6">
                 {[
                   { label: 'Primary Cluster Use', val: '4.2 TB', status: 'Healthy' },
                   { label: 'Archive Storage', val: '12.8 TB', status: 'Active' },
                   { label: 'Data Growth Rate', val: '+42 GB/D', status: 'Rising' },
                   { label: 'Storage Resilience', val: 'Triple-Mirror', status: 'Secure' },
                 ].map((stat, i) => (
                   <div key={i} className="pb-4 border-b border-white/5 last:border-0">
                      <div className="flex justify-between items-center mb-1">
                         <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">{stat.label}</span>
                         <span className="text-[9px] text-glow-blue font-bold font-mono">{stat.status}</span>
                      </div>
                      <div className="text-lg font-header text-white">{stat.val}</div>
                   </div>
                 ))}
              </div>

              <div className="mt-10 p-6 bg-glow-blue/5 border border-glow-blue/20 rounded-2xl">
                 <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-4 h-4 text-glow-blue" />
                    <span className="text-[10px] font-bold text-glow-blue uppercase tracking-wider">AI Optimization Intel</span>
                 </div>
                 <p className="text-[10px] text-slate-300 leading-relaxed italic">
                    "Current retention policy for Tier-3 foundation data suggests a 12% storage efficiency gain if archiving is shifted to Quarterly cycles."
                 </p>
              </div>

              <button className="w-full py-4 mt-8 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center gap-2 group">
                 View Storage Audit <Activity className="w-4 h-4" />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
