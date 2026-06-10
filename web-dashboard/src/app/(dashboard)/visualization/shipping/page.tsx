"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Navigation, Anchor, Ship, Plane, 
  Map, Activity, Layers, ArrowRight,
  TrendingUp, Globe, Wind, Gauge
} from 'lucide-react';

export default function ShippingRoutesPage() {
  const activeRoutes = [
    { id: 'SH-01', from: 'Shanghai', to: 'Long Beach', status: 'On Time', type: 'Maritime', load: 84, color: 'text-success' },
    { id: 'SH-02', from: 'Rotterdam', to: 'Singapore', status: 'Delayed', type: 'Maritime', load: 92, color: 'text-warning' },
    { id: 'SH-03', from: 'Shenzhen', to: 'Frankfurt', status: 'On Time', type: 'Air', load: 68, color: 'text-success' },
    { id: 'SH-04', from: 'Busan', to: 'Sydney', status: 'Disrupted', type: 'Maritime', load: 12, color: 'text-critical' },
  ];

  return (
    <div className="space-y-8">
      {/* Shipping Header */}
      <div className="flex justify-between items-start">
        <div>
           <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-glow-blue/10 rounded-xl flex items-center justify-center border border-glow-blue/20">
                 <Ship className="w-5 h-5 text-glow-blue" />
              </div>
              <span className="text-xs font-bold text-glow-blue uppercase tracking-[0.4em]">Logistics Vector Matrix</span>
           </div>
           <h2 className="font-header text-5xl text-white tracking-tighter uppercase italic leading-[0.9] mb-4">
              Global <span className="text-glow-blue">Transit Corridors</span>
           </h2>
           <p className="text-slate-500 text-sm max-w-xl">Mapping and monitoring critical maritime and air freight lanes in real-time to optimize throughput and detect bottlenecks.</p>
        </div>
        
        <div className="flex gap-4">
           <div className="px-8 py-6 glass-panel rounded-3xl border border-white/10 flex flex-col items-center">
              <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest mb-1">Active Vessels</p>
              <p className="text-3xl font-header text-white">4,204</p>
              <div className="flex items-center gap-1 text-[10px] font-bold text-glow-blue mt-1 uppercase">
                 <Activity className="w-3 h-3" /> Transmitting
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         {/* Main Logistics Map */}
         <div className="lg:col-span-2 glass-panel p-0 rounded-[3rem] border border-white/10 bg-white/[0.01] h-[550px] relative overflow-hidden group">
            <div className="absolute inset-0 bg-[url('https://cartodb-basemaps-a.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png')] opacity-10 grayscale invert" />
            
            {/* Animated Shipping Arcs */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
               {[
                 { d: 'M200,200 Q500,100 800,400', color: '#3b82f6' },
                 { d: 'M100,400 Q400,300 700,100', color: '#3b82f6' },
                 { d: 'M300,500 Q600,400 900,200', color: '#ef4444' },
               ].map((path, i) => (
                 <motion.path 
                   key={i}
                   d={path.d}
                   fill="none"
                   stroke={path.color}
                   strokeWidth="2"
                   strokeDasharray="5,10"
                   className="animate-dash"
                   initial={{ pathLength: 0, opacity: 0 }}
                   animate={{ pathLength: 1, opacity: 0.3 }}
                   transition={{ duration: 4, repeat: Infinity }}
                 />
               ))}
            </svg>

            <div className="p-10 relative z-10 h-full flex flex-col justify-between">
               <div className="flex justify-between items-start">
                  <div>
                     <h3 className="text-white font-header text-sm uppercase tracking-widest flex items-center gap-2">
                        <Map className="w-4 h-4 text-glow-blue" /> Transit_Vector_Overlay
                     </h3>
                     <p className="text-[10px] text-slate-500 font-mono mt-1 uppercase">Tracking: 4,204 AIS_SIGNATURES // 1,102 FLIGHT_PATHS</p>
                  </div>
                  <div className="flex gap-2">
                     <button className="p-3 bg-black/40 border border-white/10 rounded-xl text-white hover:bg-glow-blue transition-all"><Plane className="w-4 h-4" /></button>
                     <button className="p-3 bg-black/40 border border-white/10 rounded-xl text-white hover:bg-glow-blue transition-all"><Ship className="w-4 h-4" /></button>
                  </div>
               </div>

               <div className="flex justify-between items-end">
                  <div className="p-6 bg-black/40 border border-white/10 rounded-[2.5rem] backdrop-blur-md max-w-sm">
                     <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-glow-blue/10 flex items-center justify-center border border-glow-blue/20">
                           <Anchor className="w-5 h-5 text-glow-blue" />
                        </div>
                        <div>
                           <p className="text-xs font-bold text-white uppercase">Port of Singapore</p>
                           <p className="text-[9px] text-slate-500 font-mono uppercase mt-0.5 italic">Congestion Level: 84% // Wait Time: 12h</p>
                        </div>
                     </div>
                     <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          animate={{ width: ['40%', '84%', '40%'] }}
                          transition={{ duration: 10, repeat: Infinity }}
                          className="h-full bg-glow-blue shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
                        />
                     </div>
                  </div>
                  
                  <div className="flex gap-4">
                     {[
                       { label: 'Maritime', val: '72%', icon: Ship },
                       { label: 'Air Freight', val: '28%', icon: Plane },
                     ].map((stat, i) => (
                       <div key={i} className="p-4 bg-black/40 border border-white/10 rounded-2xl flex items-center gap-4">
                          <stat.icon className="w-4 h-4 text-slate-500" />
                          <div>
                             <p className="text-[8px] text-slate-600 font-bold uppercase">{stat.label}</p>
                             <p className="text-sm font-header text-white">{stat.val}</p>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>

         {/* Active Route Intelligence */}
         <div className="space-y-6 overflow-y-auto max-h-[550px] pr-2">
            <h3 className="text-white font-header text-sm uppercase tracking-widest px-2">Strategic Transit Feed</h3>
            {activeRoutes.map((route, i) => (
              <motion.div
                key={route.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-panel p-6 rounded-3xl border border-white/5 hover:border-white/20 transition-all group"
              >
                 <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-600 group-hover:text-glow-blue group-hover:bg-glow-blue/10 transition-all border border-white/10">
                          {route.type === 'Maritime' ? <Ship className="w-4 h-4" /> : <Plane className="w-4 h-4" />}
                       </div>
                       <span className="text-[10px] text-slate-500 font-mono">ID: {route.id}</span>
                    </div>
                    <span className={`text-[9px] font-bold uppercase tracking-widest ${route.color}`}>{route.status}</span>
                 </div>
                 
                 <div className="flex items-center justify-between gap-4 mb-6">
                    <div className="text-left">
                       <p className="text-[8px] text-slate-600 uppercase font-bold tracking-widest mb-1">Origin</p>
                       <p className="text-sm text-white font-header uppercase italic">{route.from}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-800" />
                    <div className="text-right">
                       <p className="text-[8px] text-slate-600 uppercase font-bold tracking-widest mb-1">Dest</p>
                       <p className="text-sm text-white font-header uppercase italic">{route.to}</p>
                    </div>
                 </div>

                 <div className="space-y-2">
                    <div className="flex justify-between text-[8px] text-slate-600 uppercase font-bold">
                       <span>Payload Utilization</span>
                       <span className="text-white">{route.load}%</span>
                    </div>
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                       <div className="h-full bg-glow-blue/40 group-hover:bg-glow-blue transition-all" style={{ width: `${route.load}%` }} />
                    </div>
                 </div>
              </motion.div>
            ))}
         </div>
      </div>
    </div>
  );
}
