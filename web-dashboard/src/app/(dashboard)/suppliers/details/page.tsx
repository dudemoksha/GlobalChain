"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  ShieldCheck, 
  ShieldAlert,
  AlertTriangle, 
  Globe, 
  MapPin, 
  TrendingUp, 
  Zap, 
  History,
  Box,
  Truck,
  ArrowLeft,
  Settings,
  Maximize2
} from 'lucide-react';
import Link from 'next/link';

export default function SupplierDetails() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex gap-6">
           <Link href="/suppliers/tier1">
              <button className="p-3 bg-white/5 border border-white/10 rounded-2xl text-slate-400 hover:text-white transition-all">
                 <ArrowLeft className="w-5 h-5" />
              </button>
           </Link>
           <div>
              <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase tracking-widest mb-2 font-mono">
                 <span>Suppliers</span>
                 <span className="opacity-30">/</span>
                 <span>Tier 1</span>
                 <span className="opacity-30">/</span>
                 <span className="text-slate-300">NanoFab Dynamics</span>
              </div>
              <h2 className="font-header text-3xl text-white tracking-tight uppercase italic">
                NanoFab <span className="text-glow-blue">Dynamics</span>
              </h2>
              <div className="flex items-center gap-4 mt-2">
                 <div className="flex items-center gap-1.5 text-[10px] text-slate-500 uppercase font-bold">
                    <MapPin className="w-3 h-3" /> Hsinchu, Taiwan
                 </div>
                 <div className="h-3 w-px bg-white/10"></div>
                 <div className="flex items-center gap-1.5 text-[10px] text-glow-blue font-bold uppercase">
                    ID: S-002-BETA
                 </div>
              </div>
           </div>
        </div>
        <div className="flex gap-4">
           <button className="px-6 py-2 bg-critical text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg flex items-center gap-2 hover:scale-105 transition-all">
              <ShieldAlert className="w-3 h-3" /> Initiate Mitigation
           </button>
           <button className="p-2 border border-white/10 rounded-xl text-slate-400 hover:text-white transition-all"><Settings className="w-4 h-4" /></button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Core Performance */}
        <div className="lg:col-span-8 space-y-8">
           {/* Big Performance Chart */}
           <div className="glass-panel border border-white/10 rounded-3xl p-8 h-[400px]">
              <div className="flex justify-between items-center mb-8">
                 <h3 className="font-header text-sm text-white uppercase tracking-widest flex items-center gap-2">
                    <Activity className="w-4 h-4 text-glow-blue" /> Quality & Lead-Time Performance
                 </h3>
                 <div className="flex gap-4">
                    <div className="flex items-center gap-1.5 text-[9px] text-slate-500 uppercase font-bold">
                       <div className="w-2 h-2 rounded-full bg-success"></div> Quality
                    </div>
                    <div className="flex items-center gap-1.5 text-[9px] text-slate-500 uppercase font-bold">
                       <div className="w-2 h-2 rounded-full bg-glow-blue"></div> Lead Time
                    </div>
                 </div>
              </div>
              <div className="h-[250px] flex items-end gap-1 px-4">
                 {[80, 75, 90, 85, 40, 45, 50, 60, 70, 85, 95, 90].map((h, i) => (
                   <motion.div 
                     key={i} 
                     initial={{ height: 0 }} animate={{ height: `${h}%` }}
                     transition={{ delay: i * 0.05 }}
                     className={`flex-1 rounded-t border-t relative group ${h < 50 ? 'bg-critical/20 border-critical/40' : 'bg-glow-blue/10 border-glow-blue/30'}`}
                   />
                 ))}
              </div>
              <div className="flex justify-between mt-4 text-[10px] text-slate-600 font-mono uppercase tracking-widest px-4">
                 <span>JAN</span>
                 <span>LIVE</span>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Quality Accuracy', val: '98.4%', status: 'Nominal', color: 'text-success' },
                { label: 'Lead Time Avg', val: '12.4d', status: '+2.1d', color: 'text-warning' },
                { label: 'Order Fulfillment', val: '92%', status: 'Stable', color: 'text-glow-blue' },
              ].map((stat, i) => (
                <div key={i} className="glass-panel border border-white/10 rounded-2xl p-6">
                   <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest mb-1">{stat.label}</p>
                   <div className="text-xl font-header text-white">{stat.val}</div>
                   <div className={`text-[8px] font-bold uppercase mt-1 ${stat.color}`}>{stat.status}</div>
                </div>
              ))}
           </div>

           {/* Risk Audit History */}
           <div className="glass-panel border border-white/10 rounded-3xl p-8">
              <h3 className="font-header text-sm text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                 <History className="w-4 h-4 text-glow-blue" /> Systemic Audit Log
              </h3>
              <div className="space-y-4">
                 {[
                   { event: 'Risk Score Elevated (74/100)', time: '2h ago', detail: 'Regional power grid instability reported in Hsinchu.' },
                   { event: 'Quality Audit Passed', time: '1d ago', detail: 'Batch #9204 verified by AI vision systems.' },
                   { event: 'New Lead Time Projection: 14.5d', time: '3d ago', detail: 'Logistics corridor congestion affecting outgoing manifests.' },
                 ].map((log, i) => (
                   <div key={i} className="p-4 bg-white/5 border border-white/5 rounded-xl flex justify-between items-center group hover:bg-white/[0.08] transition-all">
                      <div>
                         <div className="text-[10px] text-white font-bold uppercase tracking-tight">{log.event}</div>
                         <p className="text-[9px] text-slate-500 italic mt-1">{log.detail}</p>
                      </div>
                      <div className="text-[9px] text-slate-600 font-mono uppercase">{log.time}</div>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Right Column: Health & Intelligence */}
        <div className="lg:col-span-4 space-y-8">
           <div className="glass-panel border border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-warning"></div>
              <h4 className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-6">Current Health Index</h4>
              <div className="relative w-40 h-40 mb-6">
                 <svg className="w-full h-full transform -rotate-90">
                    <circle cx="80" cy="80" r="75" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-white/5" />
                    <motion.circle 
                      cx="80" cy="80" r="75" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="471" 
                      initial={{ strokeDashoffset: 471 }}
                      animate={{ strokeDashoffset: 471 * (1 - 0.42) }}
                      transition={{ duration: 1.5 }}
                      className="text-warning" 
                    />
                 </svg>
                 <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-header text-white">42<span className="text-sm text-warning">%</span></span>
                 </div>
              </div>
              <div className="text-[10px] text-warning font-bold uppercase tracking-[0.2em] mb-4">Degraded Performance</div>
              <p className="text-[10px] text-slate-400 leading-relaxed max-w-xs mx-auto mb-6">
                 "Critical disruption detected in local infrastructure. Health score decreased by 18 points in the last 24 hours."
              </p>
              <button className="w-full py-3 bg-warning/10 border border-warning/30 text-warning rounded-xl text-[9px] font-bold uppercase tracking-widest hover:bg-warning/20 transition-all">
                 Generate Emergency Report
              </button>
           </div>

           <div className="glass-panel border border-white/10 rounded-3xl p-8">
              <h3 className="font-header text-sm text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                 <Zap className="w-4 h-4 text-glow-blue" /> AI Strategic Advice
              </h3>
              <div className="space-y-6">
                 <div className="p-4 bg-glow-blue/5 border border-glow-blue/20 rounded-xl">
                    <p className="text-[10px] text-slate-300 leading-relaxed italic">
                       "Alternative sourcing from Node-920 (Singapore) could reduce lead-time risk by 24% if NanoFab health drops below 35%."
                    </p>
                 </div>
                 <div className="space-y-4">
                    <h4 className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Dependency Weights</h4>
                    {[
                      { label: 'Chipset Flow', val: 92 },
                      { label: 'Logic Controllers', val: 64 },
                      { label: 'Thermal Shielding', val: 32 },
                    ].map((dep, i) => (
                      <div key={i}>
                         <div className="flex justify-between text-[9px] text-slate-400 uppercase mb-1.5">
                            <span>{dep.label}</span>
                            <span>{dep.val}%</span>
                         </div>
                         <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-glow-blue/60" style={{ width: `${dep.val}%` }}></div>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
