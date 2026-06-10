"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Map, Target, Shield, AlertTriangle, 
  Activity, BarChart, Info, Filter, Layers
} from 'lucide-react';

export default function HeatmapPage() {
  const regions = [
    { name: 'South East Asia', risk: 'HIGH', density: 84, trend: 'UP', color: 'text-critical' },
    { name: 'North America', risk: 'LOW', density: 42, trend: 'STABLE', color: 'text-success' },
    { name: 'Western Europe', risk: 'MEDIUM', density: 68, trend: 'DOWN', color: 'text-warning' },
    { name: 'Middle East', risk: 'CRITICAL', density: 92, trend: 'UP', color: 'text-critical' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="font-header text-4xl text-white tracking-tight uppercase italic mb-2">
            Regional <span className="text-glow-blue">Risk Heatmap</span>
          </h2>
          <p className="text-slate-500 text-sm">Quantifying risk concentration and node density across global logistics clusters.</p>
        </div>
        <div className="flex gap-4">
           <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-white uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2">
              <Filter className="w-4 h-4" /> Custom Layers
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Risk Metrics Cards */}
        {regions.map((region, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="glass-panel p-8 rounded-[2rem] border border-white/10 group hover:border-glow-blue/30 transition-all cursor-pointer relative overflow-hidden"
          >
             <div className="absolute top-0 right-0 w-20 h-20 bg-white/[0.02] rounded-bl-[3rem] flex items-center justify-center translate-x-2 -translate-y-2">
                <Target className="w-8 h-8 text-slate-700 group-hover:text-glow-blue transition-colors" />
             </div>
             
             <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-2">{region.name}</p>
             <h3 className={`text-2xl font-header ${region.color} italic mb-6`}>{region.risk}</h3>
             
             <div className="space-y-4">
                <div className="flex justify-between items-center text-[10px] uppercase font-bold">
                   <span className="text-slate-500">Density</span>
                   <span className="text-white">{region.density}%</span>
                </div>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: `${region.density}%` }}
                     className={`h-full ${region.risk === 'CRITICAL' || region.risk === 'HIGH' ? 'bg-critical' : region.risk === 'MEDIUM' ? 'bg-warning' : 'bg-success'}`}
                   />
                </div>
             </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Heatmap Visualization Area */}
        <div className="lg:col-span-2 glass-panel p-10 rounded-[2.5rem] border border-white/10 bg-white/[0.01] h-[500px] relative overflow-hidden">
           <div className="absolute inset-0 bg-[url('https://cartodb-basemaps-a.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png')] opacity-10 grayscale invert" />
           
           <div className="absolute inset-0 flex items-center justify-center">
              {/* Simulated Heatmap Blobs */}
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="w-64 h-64 bg-critical/40 blur-[80px] rounded-full absolute top-1/4 left-1/3" 
              />
              <motion.div 
                animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 6, repeat: Infinity }}
                className="w-48 h-48 bg-warning/30 blur-[60px] rounded-full absolute bottom-1/3 right-1/4" 
              />
              <motion.div 
                animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.3, 0.1] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="w-96 h-96 bg-glow-blue/20 blur-[100px] rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" 
              />
           </div>

           <div className="relative z-10 h-full flex flex-col justify-between">
              <div className="flex justify-between items-start">
                 <div>
                    <h3 className="text-white font-header text-sm uppercase tracking-widest flex items-center gap-2">
                       <Map className="w-4 h-4 text-glow-blue" /> Density_Vector_Overlay
                    </h3>
                    <p className="text-[10px] text-slate-500 font-mono mt-1">RESOLUTION: 0.05KM // UPDATED: 2 SEC AGO</p>
                 </div>
                 <div className="flex gap-2">
                    <button className="p-2 bg-black/40 border border-white/10 rounded-lg text-white hover:bg-glow-blue transition-all"><Layers className="w-4 h-4" /></button>
                 </div>
              </div>
              
              <div className="flex justify-between items-end">
                 <div className="p-4 bg-black/40 border border-white/10 rounded-xl backdrop-blur-md">
                    <div className="flex items-center gap-3 mb-2">
                       <div className="w-2 h-2 rounded-full bg-critical animate-pulse" />
                       <span className="text-[10px] text-white font-bold uppercase tracking-widest">Active Disruption Cluster</span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-mono italic">Sector_ID: SE_ASIA_09 // Impact: High</p>
                 </div>
                 <div className="flex items-center gap-4 bg-black/40 p-3 rounded-xl border border-white/10">
                    <div className="flex flex-col items-center">
                       <span className="text-[8px] text-slate-600 font-bold uppercase mb-1">Risk</span>
                       <div className="h-20 w-3 bg-gradient-to-t from-success via-warning to-critical rounded-full" />
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Intelligence Context Side */}
        <div className="space-y-8">
           <div className="glass-panel p-8 rounded-[2.5rem] border border-white/10 h-full">
              <h3 className="text-white font-header text-sm uppercase tracking-widest mb-8 flex items-center gap-2">
                 <Shield className="w-4 h-4 text-glow-blue" /> Sector Hardening
              </h3>
              
              <div className="space-y-8">
                 {[
                   { region: 'APAC Cluster', val: 94 },
                   { region: 'EMEA Terminal', val: 76 },
                   { region: 'AMER Gateway', val: 82 },
                 ].map((bar, i) => (
                   <div key={i}>
                      <div className="flex justify-between text-[10px] text-slate-300 uppercase mb-2">
                         <span>{bar.region}</span>
                         <span className="font-mono text-glow-blue">{bar.val}%</span>
                      </div>
                      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                         <motion.div initial={{ width: 0 }} animate={{ width: `${bar.val}%` }} className="h-full bg-glow-blue" />
                      </div>
                   </div>
                 ))}
              </div>

              <div className="mt-12 p-6 bg-glow-blue/5 border border-glow-blue/10 rounded-3xl">
                 <p className="text-[9px] text-glow-blue font-bold uppercase tracking-widest mb-2">Strategic Advisory</p>
                 <p className="text-[11px] text-slate-400 leading-relaxed uppercase font-mono italic">
                   Current risk concentration in the APAC cluster exceeds historical norms by 14.2%. Recommend immediate activation of backup supplier nodes in EMEA.
                 </p>
                 <button className="mt-6 w-full py-4 bg-glow-blue text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-blue-600 transition-all">
                    Initiate Rerouting
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
