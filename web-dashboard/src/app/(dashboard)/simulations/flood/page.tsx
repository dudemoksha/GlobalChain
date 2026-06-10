"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Droplets, Waves, AlertTriangle, Wind, 
  Map, Activity, Shield, ArrowRight,
  TrendingUp, Anchor, Navigation
} from 'lucide-react';

export default function FloodSimulationPage() {
  const [waterLevel, setWaterLevel] = useState(0);

  return (
    <div className="space-y-8">
      {/* Simulation Header */}
      <div className="flex justify-between items-start">
        <div>
           <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
                 <Waves className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-xs font-bold text-blue-400 uppercase tracking-[0.4em]">Hydrological Stress Protocol</span>
           </div>
           <h2 className="font-header text-5xl text-white tracking-tighter uppercase italic leading-[0.9] mb-4">
              Coastal <span className="text-blue-500">Inundation</span> Model
           </h2>
           <p className="text-slate-500 text-sm max-w-xl">Simulating extreme weather events and sea-level rise impacts on maritime port infrastructure and coastal warehouse clusters.</p>
        </div>
        
        <div className="flex gap-4">
           <div className="px-8 py-6 glass-panel rounded-3xl border border-white/10 flex flex-col items-center">
              <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest mb-1">Ports at Risk</p>
              <p className="text-3xl font-header text-white">12 Zone</p>
              <div className="flex items-center gap-1 text-[10px] font-bold text-blue-400 mt-1 uppercase">
                 <Activity className="w-3 h-3" /> Monitoring
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         {/* Simulation Viewport */}
         <div className="lg:col-span-2 glass-panel p-0 rounded-[3rem] border border-white/10 relative overflow-hidden bg-[#0a0c10] group">
            {/* Background Water Pattern */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
               <svg width="100%" height="100%">
                  <pattern id="water-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                     <path d="M0 20 Q 10 10 20 20 T 40 20" fill="none" stroke="#3b82f6" strokeWidth="1" />
                  </pattern>
                  <rect width="100%" height="100%" fill="url(#water-pattern)" />
               </svg>
            </div>

            <div className="p-10 relative z-10 flex flex-col h-[500px]">
               <div className="flex justify-between items-start">
                  <div>
                     <h3 className="text-white font-header text-sm uppercase tracking-widest flex items-center gap-2">
                        <Map className="w-4 h-4 text-blue-500" /> Terrain_Vulnerability_Map
                     </h3>
                     <p className="text-[10px] text-slate-500 font-mono mt-1 uppercase">Satellite_Source: SENTINEL-2 // RESOLUTION: 10M</p>
                  </div>
                  <div className="flex gap-2">
                     <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded text-[9px] text-blue-400 font-bold uppercase">Dynamic_Modeling</div>
                  </div>
               </div>

               {/* Simulated Inundation Overlay */}
               <div className="flex-1 flex items-center justify-center relative">
                  <motion.div 
                    animate={{ 
                      scale: [1, 1.05, 1],
                      opacity: [0.3, 0.4, 0.3]
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="w-[400px] h-[400px] bg-blue-500/20 blur-[100px] rounded-full" 
                  />
                  
                  {/* Port Markers */}
                  {[
                    { x: '25%', y: '40%', status: 'Warning', name: 'Shanghai Port' },
                    { x: '65%', y: '60%', status: 'Critical', name: 'Rotterdam Terminal' },
                    { x: '45%', y: '30%', status: 'Safe', name: 'LA Gateway' },
                  ].map((port, i) => (
                    <motion.div 
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5 + i * 0.2 }}
                      className="absolute"
                      style={{ left: port.x, top: port.y }}
                    >
                       <div className="relative group cursor-pointer">
                          <div className={`w-4 h-4 rounded-full ${port.status === 'Critical' ? 'bg-critical' : port.status === 'Warning' ? 'bg-warning' : 'bg-success'} animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)]`} />
                          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 p-2 rounded border border-white/10 whitespace-nowrap">
                             <p className="text-[8px] font-bold text-white uppercase">{port.name}</p>
                             <p className="text-[7px] text-slate-400 font-mono">STATUS: {port.status.toUpperCase()}</p>
                          </div>
                       </div>
                    </motion.div>
                  ))}
               </div>

               <div className="p-6 bg-black/40 border border-white/5 rounded-2xl backdrop-blur-md flex justify-between items-center">
                  <div className="flex items-center gap-6">
                     <div>
                        <p className="text-[8px] text-slate-500 uppercase font-bold tracking-widest mb-1">Current Surge</p>
                        <p className="text-xl font-header text-blue-400">+2.4m</p>
                     </div>
                     <div className="w-px h-8 bg-white/5" />
                     <div>
                        <p className="text-[8px] text-slate-500 uppercase font-bold tracking-widest mb-1">Time to Peak</p>
                        <p className="text-xl font-header text-white">4h 12m</p>
                     </div>
                  </div>
                  <button className="px-6 py-2 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-blue-700 transition-all">Advance Simulation</button>
               </div>
            </div>
         </div>

         {/* Parameters & Analysis */}
         <div className="space-y-8">
            <div className="glass-panel p-8 rounded-[3rem] border border-white/10 h-full">
               <h3 className="text-white font-header text-sm uppercase tracking-widest mb-10 flex items-center gap-2">
                  <Wind className="w-4 h-4 text-blue-500" /> Environmental Variables
               </h3>
               
               <div className="space-y-10">
                  {[
                    { label: 'Precipitation Intensity', val: 82, unit: 'mm/h' },
                    { label: 'Tidal Coefficient', val: 94, unit: 'coeff' },
                    { label: 'Ground Saturation', val: 64, unit: '%' },
                  ].map((slider, i) => (
                    <div key={i}>
                       <div className="flex justify-between items-center mb-3">
                          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">{slider.label}</span>
                          <span className="text-xs font-bold text-white font-mono">{slider.val}{slider.unit}</span>
                       </div>
                       <div className="h-1.5 w-full bg-white/5 rounded-full relative">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: `${slider.val}%` }} />
                          <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border-2 border-blue-500 cursor-pointer" style={{ left: `${slider.val}%` }} />
                       </div>
                    </div>
                  ))}
               </div>

               <div className="mt-16 p-6 bg-blue-500/5 border border-blue-500/10 rounded-3xl">
                  <div className="flex items-center gap-3 mb-4">
                     <Anchor className="w-4 h-4 text-blue-400" />
                     <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Logistics Advisory</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed uppercase font-mono italic">
                    Forecasted inundation at Rotterdam Terminal will likely halt Tier 1 sourcing for 48-72 hours. Divert maritime traffic to secondary hubs in Northern Europe.
                  </p>
                  <button className="mt-6 flex items-center gap-2 text-[9px] text-blue-400 font-bold uppercase hover:underline">
                     Identify Backup Ports <ArrowRight className="w-3 h-3" />
                  </button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
