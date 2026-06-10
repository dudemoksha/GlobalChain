"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Search, 
  Filter, 
  Activity, 
  Zap, 
  ShieldCheck, 
  Globe, 
  Maximize2,
  ChevronRight,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Plus
} from 'lucide-react';

const partners = [
  { name: 'NanoFab Dynamics', health: 42, risk: 'Critical', latency: '14.2d', quality: 98, region: 'Taiwan' },
  { name: 'CoreChips Taiwan', health: 94, risk: 'Low', latency: '12.1d', quality: 99, region: 'Taiwan' },
  { name: 'LogiCore Systems', health: 85, risk: 'Low', latency: '15.4d', quality: 94, region: 'China' },
];

export default function SupplierComparison() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase tracking-widest mb-2 font-mono">
            <span>Suppliers</span>
            <span className="opacity-30">/</span>
            <span className="text-slate-300">Partner Comparison</span>
          </div>
          <h2 className="font-header text-3xl text-white tracking-tight uppercase italic">
            Network <span className="text-glow-blue">Performance Benchmark</span>
          </h2>
        </div>
        <div className="flex gap-4">
           <button className="px-6 py-2 bg-white/5 border border-white/10 text-slate-400 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:text-white transition-all flex items-center gap-2">
              <Plus className="w-3 h-3" /> Add Partner to Compare
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Comparison Grid */}
        <div className="lg:col-span-9 space-y-8">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {partners.map((p, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`glass-panel border rounded-3xl p-8 relative overflow-hidden group ${
                    p.health > 80 ? 'border-success/30' : p.health < 50 ? 'border-critical/30' : 'border-white/10'
                  }`}
                >
                   {p.health > 80 && (
                      <div className="absolute top-4 right-4 text-success animate-pulse">
                         <CheckCircle2 className="w-5 h-5" />
                      </div>
                   )}

                   <div className="text-[9px] text-slate-500 uppercase font-bold tracking-[0.2em] mb-2">{p.region}</div>
                   <h3 className="text-lg font-header text-white uppercase italic tracking-tight mb-8 group-hover:text-glow-blue transition-colors">{p.name}</h3>
                   
                   <div className="space-y-6">
                      <div>
                         <div className="flex justify-between text-[10px] text-slate-400 uppercase mb-2">
                            <span>Health Index</span>
                            <span className={p.health > 80 ? 'text-success' : p.health < 50 ? 'text-critical' : 'text-warning'}>{p.health}%</span>
                         </div>
                         <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className={`h-full ${p.health > 80 ? 'bg-success' : p.health < 50 ? 'bg-critical' : 'bg-warning'}`} style={{ width: `${p.health}%` }}></div>
                         </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                         <div>
                            <div className="text-[9px] text-slate-500 uppercase mb-1">Latency</div>
                            <div className="text-sm font-header text-white">{p.latency}</div>
                         </div>
                         <div>
                            <div className="text-[9px] text-slate-500 uppercase mb-1">Quality</div>
                            <div className="text-sm font-header text-white">{p.quality}%</div>
                         </div>
                      </div>

                      <div className="pt-4 border-t border-white/5">
                         <div className="text-[9px] text-slate-500 uppercase mb-1">Risk Profile</div>
                         <div className={`text-[10px] font-bold uppercase tracking-widest ${p.risk === 'Low' ? 'text-success' : 'text-critical'}`}>{p.risk} Exposure</div>
                      </div>
                   </div>
                </motion.div>
              ))}
           </div>

           {/* Comparative Intelligence Chart */}
           <div className="glass-panel border border-white/10 rounded-3xl p-10 h-[400px] relative overflow-hidden">
              <div className="flex justify-between items-center mb-8">
                 <h3 className="font-header text-sm text-white uppercase tracking-widest flex items-center gap-2">
                    <Zap className="w-4 h-4 text-glow-blue" /> Capability Spider Analysis
                 </h3>
              </div>
              <div className="flex-1 flex items-center justify-center border border-white/5 bg-white/[0.01] rounded-2xl border-dashed h-[250px]">
                 <div className="text-center">
                    <BarChart3 className="w-16 h-16 text-slate-800 mb-4 opacity-40 mx-auto" />
                    <p className="text-[10px] text-slate-600 uppercase font-mono tracking-[0.3em]">Neural_Benchmark_Mapping...</p>
                 </div>
              </div>
           </div>
        </div>

        {/* AI Selection Side Panel */}
        <div className="lg:col-span-3 space-y-8">
           <div className="glass-panel border border-white/10 rounded-3xl p-8 h-full">
              <h3 className="font-header text-sm text-white uppercase tracking-widest mb-8 flex items-center gap-2">
                 <Zap className="w-4 h-4 text-glow-blue" /> AI Selection Advice
              </h3>
              
              <div className="space-y-6">
                 <div className="p-4 bg-success/5 border border-success/20 rounded-xl">
                    <p className="text-[10px] text-success font-bold uppercase tracking-widest mb-2">Optimal Switch Found</p>
                    <p className="text-[10px] text-slate-300 leading-relaxed italic">
                       "Switching from NanoFab to CoreChips reduces regional risk by 74% while maintaining 99% quality parity."
                    </p>
                 </div>

                 <div className="space-y-4">
                    <h4 className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Network Impact</h4>
                    {[
                      { label: 'Latency Gain', val: '+2.1d', color: 'text-success' },
                      { label: 'Risk Reduction', val: '-54%', color: 'text-success' },
                      { label: 'Unit Cost Drfit', val: '+$0.12', color: 'text-warning' },
                    ].map((stat, i) => (
                      <div key={i} className="flex justify-between items-center text-[10px] pb-4 border-b border-white/5 last:border-0">
                         <span className="text-slate-500 uppercase tracking-tighter">{stat.label}</span>
                         <span className={`font-mono ${stat.color}`}>{stat.val}</span>
                      </div>
                    ))}
                 </div>
              </div>

              <button className="w-full py-4 mt-8 bg-glow-blue text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2 group">
                 Execute Switch Protocol <ArrowRight className="w-4 h-4" />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
