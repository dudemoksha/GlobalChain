"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Truck, 
  Box, 
  Warehouse, 
  Clock, 
  Zap, 
  ArrowUpRight,
  TrendingUp,
  BarChart2
} from 'lucide-react';

const healthKPIs = [
  { label: 'Fleet Utilization', val: '92%', status: 'Nominal', color: 'text-success' },
  { label: 'Mfg. Uptime', val: '78%', status: 'Degraded', color: 'text-warning' },
  { label: 'Storage Capacity', val: '45%', status: 'Available', color: 'text-glow-blue' },
  { label: 'Avg. Turnaround', val: '4.2h', status: '+12%', color: 'text-critical' },
];

export default function OperationalHealthDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase tracking-widest mb-2 font-mono">
          <span>Dashboards</span>
          <span className="opacity-30">/</span>
          <span className="text-slate-300">Operational Health</span>
        </div>
        <h2 className="font-header text-3xl text-white tracking-tight uppercase italic">
          Operational <span className="text-glow-blue">Health Status</span>
        </h2>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {healthKPIs.map((kpi, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -5 }}
            className="glass-panel border border-white/10 p-6 rounded-2xl relative group"
          >
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
              <Activity className="w-12 h-12 text-white" />
            </div>
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">{kpi.label}</p>
            <div className="flex items-end gap-3">
              <h3 className="text-3xl font-header text-white">{kpi.val}</h3>
              <span className={`text-[10px] font-bold mb-1.5 ${kpi.color} uppercase`}>
                {kpi.status}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Logistics Performance */}
        <div className="lg:col-span-8 space-y-8">
           <div className="glass-panel border border-white/10 rounded-3xl p-8 h-[400px]">
              <div className="flex justify-between items-center mb-8">
                 <h3 className="font-header text-sm text-white uppercase tracking-widest flex items-center gap-2">
                    <Truck className="w-4 h-4 text-glow-blue" /> Logistics Flow Efficiency
                 </h3>
                 <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 uppercase font-bold">
                       <div className="w-2 h-2 rounded-full bg-glow-blue"></div> Air
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 uppercase font-bold">
                       <div className="w-2 h-2 rounded-full bg-warning"></div> Sea
                    </div>
                 </div>
              </div>
              <div className="h-[250px] flex items-end gap-1">
                 {[40, 60, 45, 80, 50, 90, 70, 85, 60, 100, 75, 95].map((h, i) => (
                   <div key={i} className="flex-1 bg-glow-blue/10 border-t border-glow-blue/30 relative group">
                      <motion.div 
                        initial={{ height: 0 }} animate={{ height: `${h}%` }}
                        className="w-full bg-glow-blue/20 absolute bottom-0 transition-all group-hover:bg-glow-blue/40"
                      />
                   </div>
                 ))}
              </div>
              <div className="flex justify-between mt-4 text-[10px] text-slate-600 font-mono uppercase tracking-widest">
                 <span>T-24H</span>
                 <span>LIVE_SYNC</span>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="glass-panel border border-white/10 rounded-2xl p-6">
                 <h4 className="font-header text-[10px] text-slate-400 uppercase tracking-widest mb-4">Manufacturing Status</h4>
                 <div className="space-y-4">
                    {[
                      { label: 'Plant Alpha (TW)', status: 'Active', uptime: 98 },
                      { label: 'Plant Beta (CN)', status: 'Degraded', uptime: 42 },
                      { label: 'Plant Gamma (VN)', status: 'Active', uptime: 89 },
                    ].map((plant, i) => (
                      <div key={i} className="flex items-center justify-between">
                         <div>
                            <div className="text-[10px] text-white font-bold uppercase">{plant.label}</div>
                            <div className={`text-[8px] font-mono ${plant.status === 'Active' ? 'text-success' : 'text-critical'}`}>{plant.status}</div>
                         </div>
                         <div className="text-right">
                            <div className="text-xs font-header text-white">{plant.uptime}%</div>
                            <div className="w-24 h-1 bg-white/5 rounded-full mt-1 overflow-hidden">
                               <div className={`h-full ${plant.uptime > 80 ? 'bg-success' : 'bg-critical'}`} style={{ width: `${plant.uptime}%` }}></div>
                            </div>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="glass-panel border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
                 <div>
                    <h4 className="font-header text-[10px] text-slate-400 uppercase tracking-widest mb-4">Critical Maintenance</h4>
                    <div className="flex items-center gap-4 mb-4">
                       <Clock className="w-8 h-8 text-warning" />
                       <div>
                          <div className="text-[10px] text-white font-bold uppercase">Corridor 7 Maintenance</div>
                          <div className="text-[8px] text-slate-500 uppercase font-mono">Scheduled in 4.5 hours</div>
                       </div>
                    </div>
                 </div>
                 <button className="w-full py-2 bg-white/5 border border-white/10 rounded-lg text-[9px] font-bold text-slate-400 uppercase tracking-widest hover:text-white hover:bg-white/10 transition-all">
                    View Maintenance Log
                 </button>
              </div>
           </div>
        </div>

        {/* Intelligence Overlays */}
        <div className="lg:col-span-4 space-y-8">
           <div className="glass-panel border border-white/10 rounded-3xl p-8 h-full">
              <h3 className="font-header text-sm text-white uppercase tracking-widest mb-8 flex items-center gap-2">
                 <Zap className="w-4 h-4 text-glow-blue" /> Health Intelligence
              </h3>
              
              <div className="space-y-6">
                 <div className="p-4 bg-glow-blue/5 border border-glow-blue/20 rounded-xl">
                    <p className="text-[10px] text-glow-blue font-bold uppercase tracking-widest mb-2">Efficiency Spike Detected</p>
                    <p className="text-[10px] text-slate-300 leading-relaxed italic">
                       "Atlantic route automation has improved Tier-1 throughput by 14.5% in the last 12 hours. Recommend re-balancing Tier-2 allocations accordingly."
                    </p>
                 </div>

                 <div className="space-y-4">
                    <h4 className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Global Stability</h4>
                    <div className="flex items-center justify-center h-32 relative">
                       <div className="w-24 h-24 rounded-full border-4 border-success border-t-transparent animate-spin"></div>
                       <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-xl font-header text-white">92.4</span>
                          <span className="text-[8px] text-success font-bold uppercase tracking-widest">Score</span>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-3 pt-6">
                    <h4 className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Performance Indices</h4>
                    {[
                      { label: 'Delivery Accuracy', val: 98 },
                      { label: 'Quality Control', val: 94 },
                      { label: 'Packaging Efficiency', val: 88 },
                    ].map((idx, i) => (
                      <div key={i} className="flex items-center justify-between text-[10px]">
                         <span className="text-slate-400 uppercase tracking-tighter">{idx.label}</span>
                         <span className="text-white font-mono">{idx.val}%</span>
                      </div>
                    ))}
                 </div>
              </div>

              <button className="w-full py-4 mt-8 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-white hover:bg-white/5 transition-all">
                 Generate Performance Audit
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
