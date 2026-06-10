"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Anchor, Ship, Activity, 
  RefreshCw, Search, Filter,
  Waves, Wind, Thermometer,
  Layers, Database, Globe,
  AlertTriangle, Gauge
} from 'lucide-react';

export default function PortShutdownSimulationPage() {
  return (
    <div className="space-y-8 font-mono">
      {/* Header */}
      <div className="flex justify-between items-start border-b border-blue-500/20 pb-8">
        <div>
           <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
                 <Anchor className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-xs font-bold text-blue-400 uppercase tracking-[0.4em]">Maritime Entry Point Stress Test</span>
           </div>
           <h2 className="font-header text-5xl text-white tracking-tighter uppercase italic leading-[0.9] mb-4">
              Port <span className="text-blue-500">Shutdown</span> Simulation
           </h2>
           <p className="text-slate-500 text-sm max-w-xl font-bold uppercase tracking-tight">Simulating total operational cessation at key global maritime hubs to analyze cascading delays in raw material flow.</p>
        </div>
        
        <div className="flex gap-4">
           <div className="px-8 py-6 bg-blue-500/5 border border-blue-500/20 rounded-3xl flex flex-col items-center">
              <p className="text-[9px] text-blue-400/50 uppercase font-bold tracking-widest mb-1">Queue Depth</p>
              <p className="text-3xl font-header text-blue-400">+114%</p>
              <div className="flex items-center gap-1 text-[10px] font-bold text-critical mt-1 uppercase">
                 <AlertTriangle className="w-3 h-3" /> Critical_Block
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         {/* Port Map (Unique) */}
         <div className="lg:col-span-2 glass-panel p-10 rounded-[3rem] border border-blue-500/10 bg-black/40 h-[550px] relative overflow-hidden group">
            <div className="absolute inset-0 bg-[url('https://cartodb-basemaps-a.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png')] opacity-10 grayscale invert" />
            
            {/* Animated Port Ripples */}
            <div className="absolute inset-0 flex items-center justify-center">
               {[...Array(3)].map((_, i) => (
                 <motion.div
                   key={i}
                   animate={{ scale: [1, 2], opacity: [0.3, 0] }}
                   transition={{ duration: 4, delay: i * 1.3, repeat: Infinity }}
                   className="absolute w-64 h-64 border border-blue-500/20 rounded-full"
                 />
               ))}
            </div>

            <div className="p-10 relative z-10 h-full flex flex-col justify-between">
               <div className="flex justify-between items-start">
                  <div>
                     <h3 className="text-white font-header text-sm uppercase tracking-widest flex items-center gap-2">
                        <Waves className="w-4 h-4 text-blue-500" /> Maritime_Halt_Overlay
                     </h3>
                     <p className="text-[10px] text-slate-500 font-mono mt-1 uppercase">Hub: PORT_OF_SINGAPORE // Mode: TOTAL_SHUTDOWN</p>
                  </div>
                  <div className="flex gap-2">
                     <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-blue-500 transition-all"><Gauge className="w-4 h-4" /></button>
                     <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-blue-500 transition-all"><Ship className="w-4 h-4" /></button>
                  </div>
               </div>

               <div className="p-8 bg-blue-900/40 border border-blue-500/20 rounded-[2.5rem] backdrop-blur-md max-w-sm ml-auto">
                  <div className="flex items-center gap-4 mb-4">
                     <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center border border-blue-500/30">
                        <Anchor className="w-6 h-6 text-blue-400" />
                     </div>
                     <div>
                        <p className="text-xs font-bold text-white uppercase italic tracking-widest">Global Pivot Needed</p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Status: 82 Ships Idling</p>
                     </div>
                  </div>
                  <button className="w-full py-4 bg-blue-600 text-white font-bold text-[10px] uppercase tracking-widest rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                     Reroute to Secondary Hubs
                  </button>
               </div>
            </div>
         </div>

         {/* Port Analytics */}
         <div className="space-y-8">
            <div className="glass-panel p-10 rounded-[3rem] border border-blue-500/10 h-full">
               <h3 className="text-white font-header text-sm uppercase tracking-widest mb-10 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-500" /> Impact Analytics
               </h3>
               
               <div className="space-y-12">
                  {[
                    { label: 'Unloading Latency', val: 94 },
                    { label: 'Berth Availability', val: 8 },
                    { label: 'Feeder Sync Gap', val: 72 },
                    { label: 'Daily Cost Burn', val: 88 },
                  ].map((stat, i) => (
                    <div key={i}>
                       <div className="flex justify-between items-center mb-3 text-[10px] font-bold uppercase tracking-widest">
                          <span className="text-slate-400">{stat.label}</span>
                          <span className="text-white">{stat.val}%</span>
                       </div>
                       <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${stat.val}%` }} className="h-full bg-blue-500" />
                       </div>
                    </div>
                  ))}
               </div>

               <div className="mt-16 p-8 bg-blue-500/5 border border-blue-500/10 rounded-[2.5rem]">
                  <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mb-4">Recovery Forecast</p>
                  <p className="text-[11px] text-slate-400 leading-relaxed uppercase font-mono italic">
                    Estimated 14-day backlog normalization period following terminal reopening. Recommend priority slot booking for Tier 1 materials.
                  </p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
