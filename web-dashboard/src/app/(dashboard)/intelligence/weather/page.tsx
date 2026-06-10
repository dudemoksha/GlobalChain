"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Cloud, Sun, CloudRain, Wind, 
  CloudLightning, Thermometer, Droplets,
  Navigation, Map, Layers, Activity,
  CloudSnow, Globe
} from 'lucide-react';

export default function WeatherMonitoringPage() {
  const regions = [
    { name: 'North Atlantic', temp: '14°C', condition: 'Storm Warning', icon: CloudLightning, color: 'text-blue-400' },
    { name: 'South China Sea', temp: '28°C', condition: 'Typhoon Risk', icon: Wind, color: 'text-warning' },
    { name: 'European Corridor', temp: '8°C', condition: 'Heavy Rain', icon: CloudRain, color: 'text-blue-200' },
    { name: 'Pacific Rim', temp: '22°C', condition: 'Optimal', icon: Sun, color: 'text-success' },
  ];

  return (
    <div className="space-y-8">
      {/* Weather Header */}
      <div className="flex justify-between items-start">
        <div>
           <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
                 <Cloud className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-xs font-bold text-blue-400 uppercase tracking-[0.4em]">Meteorological Intel Matrix</span>
           </div>
           <h2 className="font-header text-5xl text-white tracking-tighter uppercase italic leading-[0.9] mb-4">
              Climate <span className="text-blue-500">Risk Overlay</span>
           </h2>
           <p className="text-slate-500 text-sm max-w-xl">Aggregating high-resolution satellite weather data to anticipate logistics delays and infrastructure stress in key transit corridors.</p>
        </div>
        
        <div className="flex gap-4">
           <div className="px-8 py-6 glass-panel rounded-3xl border border-white/10 flex flex-col items-center">
              <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest mb-1">Global Alerts</p>
              <p className="text-3xl font-header text-white">04</p>
              <div className="flex items-center gap-1 text-[10px] font-bold text-warning mt-1 uppercase">
                 <Activity className="w-3 h-3" /> Active Storms
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {regions.map((region, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -5 }}
            className="glass-panel p-8 rounded-[2.5rem] border border-white/10 relative group overflow-hidden"
          >
             <div className="absolute top-0 right-0 w-24 h-24 bg-white/[0.01] rounded-bl-[4rem] flex items-center justify-center translate-x-4 -translate-y-4">
                <region.icon className={`w-10 h-10 ${region.color} opacity-20 group-hover:opacity-100 transition-opacity`} />
             </div>
             
             <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-2">{region.name}</p>
             <div className="flex items-end justify-between mb-6">
                <h3 className="text-3xl font-header text-white">{region.temp}</h3>
                <span className={`text-[9px] font-bold uppercase tracking-widest ${region.color}`}>{region.condition}</span>
             </div>
             
             <div className="flex gap-4 pt-6 border-t border-white/5">
                <div className="flex items-center gap-2">
                   <Wind className="w-3 h-3 text-slate-600" />
                   <span className="text-[9px] text-slate-400 font-mono">42km/h</span>
                </div>
                <div className="flex items-center gap-2">
                   <Droplets className="w-3 h-3 text-slate-600" />
                   <span className="text-[9px] text-slate-400 font-mono">84%</span>
                </div>
             </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         {/* Main Atmospheric Map */}
         <div className="lg:col-span-2 glass-panel p-10 rounded-[3rem] border border-white/10 bg-white/[0.01] h-[500px] relative overflow-hidden group">
            <div className="absolute inset-0 bg-[url('https://cartodb-basemaps-a.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png')] opacity-10 grayscale invert" />
            
            {/* Animated Weather Blobs */}
            <div className="absolute inset-0">
               <motion.div 
                 animate={{ 
                   x: [0, 50, 0],
                   y: [0, 30, 0],
                   opacity: [0.1, 0.2, 0.1],
                   scale: [1, 1.2, 1]
                 }}
                 transition={{ duration: 10, repeat: Infinity }}
                 className="w-full h-full bg-blue-500/10 blur-[120px] rounded-full absolute top-0 left-0" 
               />
               <motion.div 
                 animate={{ 
                   x: [0, -40, 0],
                   y: [0, 20, 0],
                   opacity: [0.05, 0.15, 0.05]
                 }}
                 transition={{ duration: 8, repeat: Infinity }}
                 className="w-full h-full bg-warning/5 blur-[100px] rounded-full absolute bottom-0 right-0" 
               />
            </div>

            <div className="relative z-10 h-full flex flex-col justify-between">
               <div className="flex justify-between items-start">
                  <div>
                     <h3 className="text-white font-header text-sm uppercase tracking-widest flex items-center gap-2">
                        <Map className="w-4 h-4 text-blue-500" /> Atmospheric_Pressure_Overlay
                     </h3>
                     <p className="text-[10px] text-slate-500 font-mono mt-1">SATELLITE: GOES-16 // MODE: INFRARED // REALTIME</p>
                  </div>
                  <div className="flex gap-2">
                     <button className="p-3 bg-black/40 border border-white/10 rounded-xl text-white hover:bg-glow-blue transition-all"><Layers className="w-4 h-4" /></button>
                     <button className="p-3 bg-black/40 border border-white/10 rounded-xl text-white hover:bg-glow-blue transition-all"><Navigation className="w-4 h-4" /></button>
                  </div>
               </div>

               <div className="flex justify-between items-end">
                  <div className="p-6 bg-black/40 border border-white/10 rounded-[2rem] backdrop-blur-md">
                     <div className="flex items-center gap-3 mb-4">
                        <CloudLightning className="w-5 h-5 text-warning animate-pulse" />
                        <div>
                           <p className="text-xs font-bold text-white uppercase">Storm Front Alpha-9</p>
                           <p className="text-[9px] text-slate-500 font-mono uppercase mt-0.5">Moving NE @ 14KT // Impact: High</p>
                        </div>
                     </div>
                     <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-warning w-3/4" />
                     </div>
                  </div>
                  
                  <div className="glass-panel p-4 rounded-xl border border-white/10 flex flex-col gap-2">
                     <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <span className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">Precipitation</span>
                     </div>
                     <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-warning" />
                        <span className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">Turbulence</span>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* Weather Intelligence Feed */}
         <div className="space-y-8">
            <div className="glass-panel p-8 rounded-[3rem] border border-white/10 h-full">
               <h3 className="text-white font-header text-sm uppercase tracking-widest mb-10 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-500" /> Forecast Analysis
               </h3>
               
               <div className="space-y-8">
                  {[
                    { label: 'Maritime Visibility', val: 92 },
                    { label: 'Wind Stability', val: 44 },
                    { label: 'Temp Delta', val: 78 },
                  ].map((bar, i) => (
                    <div key={i}>
                       <div className="flex justify-between text-[10px] text-slate-300 uppercase mb-2">
                          <span>{bar.label}</span>
                          <span className="font-mono text-blue-400">{bar.val}%</span>
                       </div>
                       <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${bar.val}%` }} className="h-full bg-blue-500" />
                       </div>
                    </div>
                  ))}
               </div>

               <div className="mt-16 p-8 bg-blue-500/5 border border-blue-500/10 rounded-[2.5rem]">
                  <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mb-4">Tactical Meteorological Insight</p>
                  <p className="text-[11px] text-slate-400 leading-relaxed uppercase font-mono italic">
                    Increased turbulence in the Atlantic corridor will likely delay maritime arrivals by 12-18 hours. Recommend proactive rescheduling of port labor.
                  </p>
                  <button className="mt-8 w-full py-5 bg-blue-500 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-blue-600 transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                     Generate Schedule Adjustments
                  </button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
