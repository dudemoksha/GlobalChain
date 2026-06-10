"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, Map, Navigation, 
  Search, Filter, Globe, 
  ArrowUpRight, Gauge, Car,
  Anchor, Plane, Train
} from 'lucide-react';

export default function TrafficIntelligencePage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
           <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
                 <Navigation className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-xs font-bold text-blue-400 uppercase tracking-[0.4em]">Global Logistics Flow Audit</span>
           </div>
           <h2 className="font-header text-5xl text-white tracking-tighter uppercase italic leading-[0.9] mb-4">
              Traffic <span className="text-blue-500">Intelligence</span>
           </h2>
           <p className="text-slate-500 text-sm max-w-xl">Real-time monitoring of maritime, air, and ground freight density to identify logistics bottlenecks before they impact delivery timelines.</p>
        </div>
        
        <div className="flex gap-4">
           <div className="px-8 py-6 glass-panel rounded-3xl border border-white/10 flex flex-col items-center">
              <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest mb-1">Global Flow</p>
              <p className="text-3xl font-header text-white">82%</p>
              <div className="flex items-center gap-1 text-[10px] font-bold text-success mt-1 uppercase">
                 <Gauge className="w-3 h-3" /> Nominal Speed
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         {/* Traffic Map Viewport (Unique) */}
         <div className="lg:col-span-2 glass-panel p-0 rounded-[3rem] border border-white/10 bg-black/40 h-[550px] relative overflow-hidden group">
            <div className="absolute inset-0 bg-[url('https://cartodb-basemaps-a.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png')] opacity-10 grayscale invert" />
            
            {/* Animated Traffic Particles */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
               {[...Array(30)].map((_, i) => (
                 <motion.circle
                   key={i}
                   cx={Math.random() * 100 + "%"}
                   cy={Math.random() * 100 + "%"}
                   r="1"
                   fill="#3b82f6"
                   initial={{ opacity: 0 }}
                   animate={{ opacity: [0, 1, 0], x: [0, 20], y: [0, -20] }}
                   transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2 }}
                 />
               ))}
            </svg>

            <div className="p-10 relative z-10 h-full flex flex-col justify-between">
               <div className="flex justify-between items-start">
                  <div>
                     <h3 className="text-white font-header text-sm uppercase tracking-widest flex items-center gap-2">
                        <Map className="w-4 h-4 text-blue-500" /> Transit_Density_Overlay
                     </h3>
                     <p className="text-[10px] text-slate-500 font-mono mt-1 uppercase">AIS_LIVE // ADSB_LIVE // GROUND_TELEM</p>
                  </div>
                  <div className="flex gap-2">
                     <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-blue-500 transition-all"><Plane className="w-4 h-4" /></button>
                     <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-blue-500 transition-all"><Anchor className="w-4 h-4" /></button>
                  </div>
               </div>

               <div className="flex justify-between items-end">
                  <div className="p-8 bg-black/40 border border-white/10 rounded-[2.5rem] backdrop-blur-md max-w-sm">
                     <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-4">Congestion Alert</p>
                     <div className="flex items-center gap-4 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                           <Train className="text-blue-400 w-5 h-5 animate-pulse" />
                        </div>
                        <div>
                           <p className="text-xs font-bold text-white uppercase italic">Central Rail Hub</p>
                           <p className="text-[9px] text-slate-600 font-mono uppercase tracking-widest">Wait Time: 4.2h // Peak</p>
                        </div>
                     </div>
                     <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div animate={{ x: ['-100%', '100%'] }} transition={{ duration: 3, repeat: Infinity }} className="h-full bg-blue-500 w-1/4" />
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* Logistics Intelligence */}
         <div className="space-y-8">
            <div className="glass-panel p-10 rounded-[3rem] border border-white/10 h-full">
               <h3 className="text-white font-header text-sm uppercase tracking-widest mb-10 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-500" /> Lane Analytics
               </h3>
               
               <div className="space-y-12">
                  {[
                    { label: 'Maritime Latency', val: 74, color: 'bg-blue-500' },
                    { label: 'Air Freight Speed', val: 92, color: 'bg-blue-500' },
                    { label: 'Ground Congestion', val: 34, color: 'bg-critical' },
                    { label: 'Port Throughput', val: 56, color: 'bg-warning' },
                  ].map((stat, i) => (
                    <div key={i}>
                       <div className="flex justify-between items-center mb-3 text-[10px] font-bold uppercase tracking-widest">
                          <span className="text-slate-400">{stat.label}</span>
                          <span className="text-white">{stat.val}%</span>
                       </div>
                       <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${stat.val}%` }} className={`h-full ${stat.color}`} />
                       </div>
                    </div>
                  ))}
               </div>

               <div className="mt-16 p-8 bg-blue-500/5 border border-blue-500/10 rounded-[2.5rem]">
                  <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mb-4">Traffic Advisory</p>
                  <p className="text-[11px] text-slate-400 leading-relaxed uppercase font-mono italic">
                    Ground congestion in North America is rising due to regional holidays. Reroute 12% of upcoming freight to rail corridors.
                  </p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
