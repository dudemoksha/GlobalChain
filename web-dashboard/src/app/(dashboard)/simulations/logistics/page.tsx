"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, Activity, AlertTriangle, 
  RefreshCw, Search, Filter,
  Box, Truck, Ship, Plane,
  Layers, Database, Globe
} from 'lucide-react';

export default function LogisticsFailureSimulationPage() {
  return (
    <div className="space-y-8 font-mono">
      {/* Header */}
      <div className="flex justify-between items-start border-b border-warning/20 pb-8">
        <div>
           <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-warning/10 rounded-xl flex items-center justify-center border border-warning/20">
                 <Truck className="w-5 h-5 text-warning" />
              </div>
              <span className="text-xs font-bold text-warning uppercase tracking-[0.4em]">Chain Severance Stress Test</span>
           </div>
           <h2 className="font-header text-5xl text-white tracking-tighter uppercase italic leading-[0.9] mb-4">
              Logistics <span className="text-warning">Failure</span> Simulation
           </h2>
           <p className="text-slate-500 text-sm max-w-xl font-bold uppercase tracking-tight">Simulating systemic transport breakdowns and delivery route severances to test just-in-time inventory resilience.</p>
        </div>
        
        <div className="flex gap-4">
           <div className="px-8 py-6 bg-warning/5 border border-warning/20 rounded-3xl flex flex-col items-center">
              <p className="text-[9px] text-warning/50 uppercase font-bold tracking-widest mb-1">Impact Depth</p>
              <p className="text-3xl font-header text-warning">SEVERE</p>
              <div className="flex items-center gap-1 text-[10px] font-bold text-warning mt-1 uppercase">
                 <AlertTriangle className="w-3 h-3" /> Systemic Risk
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         {/* Failure Map (Unique) */}
         <div className="lg:col-span-2 glass-panel p-10 rounded-[3rem] border border-warning/10 bg-black/40 h-[550px] relative overflow-hidden group">
            <div className="absolute inset-0 bg-[url('https://cartodb-basemaps-a.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png')] opacity-10 grayscale invert" />
            
            <div className="relative z-10 h-full flex flex-col justify-between">
               <div className="flex justify-between items-start">
                  <div>
                     <h3 className="text-white font-header text-sm uppercase tracking-widest flex items-center gap-2">
                        <Database className="w-4 h-4 text-warning" /> Route_Severance_Overlay
                     </h3>
                     <p className="text-[10px] text-slate-500 font-mono mt-1 uppercase">Tracking: 4,204 VECTORS // 82 SEVERED</p>
                  </div>
                  <div className="flex gap-2">
                     <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-warning transition-all"><Box className="w-4 h-4" /></button>
                     <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-warning transition-all"><RefreshCw className="w-4 h-4" /></button>
                  </div>
               </div>

               {/* Visual Severance Effect */}
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <motion.div 
                    animate={{ opacity: [0.1, 0.3, 0.1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-[80%] h-1 bg-gradient-to-r from-transparent via-warning/30 to-transparent rotate-45"
                  />
                  <motion.div 
                    animate={{ opacity: [0.1, 0.3, 0.1] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                    className="w-[80%] h-1 bg-gradient-to-r from-transparent via-warning/30 to-transparent -rotate-45"
                  />
               </div>

               <div className="p-8 bg-black/60 border border-white/10 rounded-[2.5rem] backdrop-blur-md max-w-md mx-auto mb-10">
                  <h4 className="text-sm font-bold text-white uppercase italic tracking-widest mb-4">Current Failure Scenario</h4>
                  <p className="text-[10px] text-slate-400 mb-6 font-bold uppercase tracking-widest leading-relaxed">
                     Total shutdown of the Suez Canal corridor combined with a 40% reduction in rail throughput across the Eurasian Land Bridge.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                     <button className="py-3 bg-warning text-black font-bold text-[9px] uppercase tracking-widest rounded-xl">Execute Redirect</button>
                     <button className="py-3 border border-white/10 text-white text-[9px] font-bold uppercase tracking-widest rounded-xl hover:bg-white/5">Stop Simulation</button>
                  </div>
               </div>
            </div>
         </div>

         {/* Failure Intelligence */}
         <div className="space-y-8">
            <div className="glass-panel p-10 rounded-[3rem] border border-warning/10 h-full">
               <h3 className="text-white font-header text-sm uppercase tracking-widest mb-10 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-warning" /> Disruption Metrics
               </h3>
               
               <div className="space-y-12">
                  {[
                    { label: 'Backlog Depth', val: 88, color: 'bg-warning' },
                    { label: 'Lead Time Delta', val: 74, color: 'bg-warning' },
                    { label: 'Carrier Attrition', val: 42, color: 'bg-warning' },
                    { label: 'Unfulfilled Demand', val: 92, color: 'bg-critical' },
                  ].map((stat, i) => (
                    <div key={i}>
                       <div className="flex justify-between items-center mb-3 text-[10px] font-bold uppercase tracking-widest">
                          <span className="text-slate-400">{stat.label}</span>
                          <span className="text-white">{stat.val}%</span>
                       </div>
                       <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${stat.val}%` }} className={`h-full ${stat.color} shadow-[0_0_10px_rgba(249,115,22,0.5)]`} />
                       </div>
                    </div>
                  ))}
               </div>

               <div className="mt-16 p-8 bg-warning/5 border border-warning/10 rounded-[2.5rem]">
                  <p className="text-[10px] text-warning font-bold uppercase tracking-widest mb-4">Failover Advisory</p>
                  <p className="text-[11px] text-slate-400 leading-relaxed uppercase font-mono italic">
                    Simulated failure indicates critical inventory depletion within 72 hours for high-precision components. Recommend air-freight pivot for Tier 1 nodes.
                  </p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
