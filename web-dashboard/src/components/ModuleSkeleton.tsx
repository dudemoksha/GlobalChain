"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon, Shield, Activity, Zap, TrendingUp, BarChart3, Globe } from 'lucide-react';

interface ModuleSkeletonProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  stats?: { label: string; value: string; trend?: string; color?: string }[];
}

export default function ModuleSkeleton({ title, subtitle, icon: Icon, stats = [] }: ModuleSkeletonProps) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="font-header text-3xl text-white tracking-tight uppercase italic mb-2">
            {title.split(' ')[0]} <span className="text-glow-blue">{title.split(' ').slice(1).join(' ')}</span>
          </h2>
          <p className="text-slate-500 text-sm">{subtitle}</p>
        </div>
        <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-slate-500">
           <Icon className="w-6 h-6" />
        </div>
      </div>

      {/* KPI Grid */}
      {stats.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -5 }}
              className="glass-panel border border-white/10 p-6 rounded-2xl relative group overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                <Icon className="w-12 h-12 text-white" />
              </div>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">{s.label}</p>
              <div className="flex items-end gap-3">
                <h3 className="text-3xl font-header text-white">{s.value}</h3>
                {s.trend && (
                  <span className={`text-[10px] font-bold mb-1.5 uppercase ${s.color || 'text-success'}`}>
                    {s.trend}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Main Analytics Canvas */}
          <div className="glass-panel border border-white/10 rounded-3xl p-8 bg-white/[0.01] relative overflow-hidden group">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-white font-header text-sm uppercase tracking-widest flex items-center gap-2">
                  <Activity className="w-4 h-4 text-glow-blue" /> Live Operation Stream
                </h3>
                <p className="text-[10px] text-slate-500 font-mono mt-1">SECURE_CHANNEL_ID: {title.toUpperCase()}_ALPHA_9</p>
              </div>
              <div className="flex gap-2">
                <div className="px-2 py-1 bg-glow-blue/10 border border-glow-blue/20 rounded text-[9px] text-glow-blue font-bold uppercase tracking-tighter">Real-Time</div>
                <div className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[9px] text-slate-400 font-bold uppercase tracking-tighter italic">Encrypted</div>
              </div>
            </div>

            {/* Simulated Data Grid / Chart Area */}
            <div className="h-[300px] flex items-end gap-2 px-4">
              {[...Array(24)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${20 + Math.random() * 80}%` }}
                  transition={{ duration: 1.5, delay: i * 0.05, repeat: Infinity, repeatType: 'reverse' }}
                  className={`flex-1 rounded-t-sm ${i % 3 === 0 ? 'bg-glow-blue' : i % 5 === 0 ? 'bg-critical' : 'bg-white/10'}`}
                />
              ))}
            </div>
            
            <div className="mt-8 pt-8 border-t border-white/5 grid grid-cols-3 gap-4">
               {[
                 { l: 'Mean Latency', v: '142ms', t: 'OPTIMAL' },
                 { l: 'Throughput', v: '4.2GB/s', t: 'HIGH' },
                 { l: 'Sync Status', v: '100%', t: 'VERIFIED' }
               ].map((m, i) => (
                 <div key={i} className="text-center">
                    <p className="text-[8px] text-slate-500 uppercase font-bold tracking-widest mb-1">{m.l}</p>
                    <p className="text-sm font-header text-white">{m.v}</p>
                    <p className="text-[8px] text-glow-blue font-bold uppercase tracking-tighter mt-1">{m.t}</p>
                 </div>
               ))}
            </div>
          </div>

          {/* Secondary Data Table */}
          <div className="glass-panel border border-white/10 rounded-3xl p-6 overflow-hidden">
            <h4 className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-6 px-2">Recent Intelligence Events</h4>
            <div className="space-y-1">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-500 group-hover:text-glow-blue transition-colors">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[11px] text-white font-medium">Network Event ID-0x{i}F9A</p>
                      <p className="text-[9px] text-slate-500 font-mono">TIMESTAMP: 2024-05-16 12:44:0{i}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-success font-bold uppercase tracking-tighter">Verified</div>
                    <div className="text-[9px] text-slate-600 font-mono">P-LEVEL: 0{i}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
           <div className="glass-panel border border-white/10 rounded-3xl p-8 h-full">
              <h4 className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-8 flex items-center gap-2">
                <Shield className="w-4 h-4 text-glow-blue" /> Sector Security Analysis
              </h4>
              <div className="space-y-8">
                 {[
                   { label: 'Asset Integrity', val: 94 },
                   { label: 'Personnel Clearance', val: 82 },
                   { label: 'Network Hardening', val: 76 }
                 ].map((bar, i) => (
                   <div key={i}>
                      <div className="flex justify-between text-[10px] text-slate-300 uppercase mb-2">
                         <span>{bar.label}</span>
                         <span className="font-mono text-glow-blue">{bar.val}%</span>
                      </div>
                      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                         <motion.div initial={{ width: 0 }} animate={{ width: `${bar.val}%` }} className="h-full bg-glow-blue shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                      </div>
                   </div>
                 ))}
              </div>
              
              <div className="mt-12 p-6 bg-glow-blue/5 border border-glow-blue/10 rounded-2xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-16 h-16 bg-glow-blue/10 rounded-bl-full flex items-center justify-center translate-x-4 -translate-y-4">
                    <TrendingUp className="w-6 h-6 text-glow-blue rotate-45" />
                 </div>
                 <p className="text-[9px] text-glow-blue font-bold uppercase tracking-widest mb-2">AI Forecasting</p>
                 <p className="text-[10px] text-slate-400 leading-relaxed uppercase font-mono italic">Positive trend detected in regional logistics cluster. Anticipating 4.2% resilience increase over next 72 hours.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
