"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  History, 
  Search, 
  Filter, 
  Activity, 
  Zap, 
  ShieldAlert, 
  Calendar,
  ChevronRight,
  BarChart3,
  TrendingUp,
  Maximize2
} from 'lucide-react';

const historyLogs = [
  { supplier: 'NanoFab Dynamics', event: 'Critical Disruption', impact: 84, date: '14 MAY 2026', type: 'Geopolitical' },
  { supplier: 'LogiCore Systems', event: 'Efficiency Spike', impact: 12, date: '12 MAY 2026', type: 'Operational' },
  { supplier: 'Global Aero-Parts', event: 'Lead-Time Drift', impact: 45, date: '10 MAY 2026', type: 'Logistics' },
  { supplier: 'Quantum Logistics', event: 'Security Breach', impact: 92, date: '08 MAY 2026', type: 'Cyber' },
];

export default function SupplierRiskHistory() {
  const [selectedRange, setSelectedRange] = useState('90D');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase tracking-widest mb-2 font-mono">
            <span>Suppliers</span>
            <span className="opacity-30">/</span>
            <span className="text-slate-300">Risk History</span>
          </div>
          <h2 className="font-header text-3xl text-white tracking-tight uppercase italic">
            Partner <span className="text-glow-blue">Risk History</span>
          </h2>
        </div>
        <div className="flex gap-4">
           <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
              {['30D', '90D', '1Y', 'ALL'].map(d => (
                <button key={d} onClick={() => setSelectedRange(d)} className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all uppercase tracking-widest ${selectedRange === d ? 'bg-glow-blue text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>{d}</button>
              ))}
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Risk Trend Chart */}
        <div className="lg:col-span-8 space-y-8">
           <div className="glass-panel border border-white/10 rounded-3xl p-8 min-h-[400px]">
              <div className="flex justify-between items-center mb-8">
                 <h3 className="font-header text-sm text-white uppercase tracking-widest flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-glow-blue" /> Network Volatility Index ({selectedRange})
                 </h3>
                 <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                    <TrendingUp className="w-3 h-3 text-critical" />
                    <span className="text-[9px] text-slate-400 font-bold uppercase font-mono">Trend: Volatile (+12%)</span>
                 </div>
              </div>
              <div className="h-[250px] flex items-end gap-2 px-4 relative">
                 {[40, 30, 85, 45, 60, 20, 95, 50, 70, 40, 80, 65].map((h, i) => (
                   <motion.div 
                     key={i} 
                     initial={{ height: 0 }} animate={{ height: `${h}%` }}
                     transition={{ delay: i * 0.05 }}
                     className={`flex-1 rounded-t-sm relative group ${h > 75 ? 'bg-critical/30 border-t border-critical' : 'bg-glow-blue/20 border-t border-glow-blue/40'}`}
                   >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-background border border-white/10 px-2 py-1 rounded text-[8px] text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                         Risk: {h}
                      </div>
                   </motion.div>
                 ))}
              </div>
              <div className="flex justify-between mt-4 text-[10px] text-slate-600 font-mono uppercase tracking-widest px-4">
                 <span>Q1_2026</span>
                 <span>LIVE</span>
              </div>
           </div>

           <div className="glass-panel border border-white/10 rounded-3xl p-8">
              <h3 className="font-header text-sm text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                 <History className="w-4 h-4 text-glow-blue" /> Historical Disruption Log
              </h3>
              <div className="space-y-4">
                 {historyLogs.map((log, i) => (
                   <div key={i} className="p-4 bg-white/5 border border-white/5 rounded-xl flex justify-between items-center group hover:bg-white/[0.08] transition-all cursor-pointer">
                      <div className="flex gap-4 items-center">
                         <div className={`w-1 h-10 rounded-full ${log.impact > 80 ? 'bg-critical' : log.impact > 40 ? 'bg-warning' : 'bg-success'}`}></div>
                         <div>
                            <div className="text-[10px] text-white font-bold uppercase tracking-tight">{log.supplier}</div>
                            <div className="text-[9px] text-slate-500 uppercase font-mono">{log.event} // {log.type}</div>
                         </div>
                      </div>
                      <div className="text-right">
                         <div className="text-[10px] text-white font-mono uppercase">{log.date}</div>
                         <div className={`text-[8px] font-bold uppercase mt-1 ${log.impact > 80 ? 'text-critical' : 'text-warning'}`}>Impact: {log.impact}%</div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Temporal Side Panel */}
        <div className="lg:col-span-4 space-y-8">
           <div className="glass-panel border border-white/10 rounded-3xl p-8 h-full">
              <h3 className="font-header text-sm text-white uppercase tracking-widest mb-8 flex items-center gap-2">
                 <Zap className="w-4 h-4 text-glow-blue" /> Volatility Intelligence
              </h3>
              
              <div className="space-y-6">
                 <div className="p-4 bg-glow-blue/5 border border-glow-blue/20 rounded-xl">
                    <p className="text-[10px] text-slate-300 leading-relaxed italic">
                       "Historical data suggests a 42% risk cycle every 6 months for Tier-1 partners in E. Asia. Next cycle projected to begin in 18 days."
                    </p>
                 </div>

                 <div className="space-y-4">
                    <h4 className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Risk Type Concentration</h4>
                    {[
                      { label: 'Geopolitical', val: 64, color: 'bg-critical' },
                      { label: 'Operational', val: 45, color: 'bg-warning' },
                      { label: 'Logistics', val: 78, color: 'bg-glow-blue' },
                      { label: 'Cyber', val: 32, color: 'bg-success' },
                    ].map((type, i) => (
                      <div key={i}>
                         <div className="flex justify-between text-[9px] text-slate-400 uppercase mb-1.5">
                            <span>{type.label}</span>
                            <span>{type.val}%</span>
                         </div>
                         <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className={`h-full ${type.color}`} style={{ width: `${type.val}%` }}></div>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="mt-10 p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                 <div className="flex items-center gap-2 mb-3">
                    <Activity className="w-4 h-4 text-glow-blue" />
                    <span className="text-[10px] font-bold text-glow-blue uppercase tracking-wider">Predictive Volatility</span>
                 </div>
                 <div className="text-2xl font-header text-white mb-2">High</div>
                 <p className="text-[10px] text-slate-400 leading-relaxed italic">
                    "Volatility index is 24% higher than the historical baseline for this quarter."
                 </p>
              </div>

              <button className="w-full py-4 mt-8 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-white hover:bg-white/5 transition-all">
                 Generate Full Network Audit (3Y)
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
