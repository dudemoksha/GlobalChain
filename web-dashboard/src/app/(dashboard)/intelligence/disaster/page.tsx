"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Globe, AlertTriangle, Activity, 
  Search, Filter, ShieldAlert,
  Flame, CloudRain, Wind, Thermometer,
  Zap, Layers, Database, ArrowUpRight
} from 'lucide-react';

export default function DisasterIntelligencePage() {
  const activeThreats = [
    { title: 'Tectonic Shift [7.2]', region: 'Pacific Plate', status: 'Monitoring', risk: 'Extreme' },
    { title: 'Cyclone Vector v4', region: 'Indian Ocean', status: 'Tracking', risk: 'High' },
    { title: 'Wildfire Expansion', region: 'California', status: 'Alert', risk: 'Medium' },
    { title: 'Heatwave Stress', region: 'Western Europe', status: 'Stable', risk: 'Low' },
  ];

  return (
    <div className="space-y-8 font-mono">
      {/* Header */}
      <div className="flex justify-between items-start border-b border-white/10 pb-8">
        <div>
           <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center border border-orange-500/20">
                 <AlertTriangle className="w-5 h-5 text-orange-400" />
              </div>
              <span className="text-xs font-bold text-orange-400 uppercase tracking-[0.4em]">Environmental Threat Intelligence</span>
           </div>
           <h2 className="font-header text-5xl text-white tracking-tighter uppercase italic leading-[0.9] mb-4">
              Disaster <span className="text-orange-500">Intelligence</span>
           </h2>
           <p className="text-slate-500 text-sm max-w-xl font-bold uppercase tracking-tight">Consolidating real-time environmental data streams to project catastrophic impacts on the global nodal infrastructure.</p>
        </div>
        
        <div className="flex gap-4">
           <div className="px-8 py-6 glass-panel rounded-3xl border border-white/10 flex flex-col items-center">
              <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest mb-1">Alert Level</p>
              <p className="text-3xl font-header text-orange-500 tracking-widest">GUARD_2</p>
              <div className="flex items-center gap-1 text-[10px] font-bold text-orange-400 mt-1 uppercase">
                 <ShieldAlert className="w-3 h-3" /> 4 Active Vectors
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {activeThreats.map((threat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="glass-panel p-8 rounded-[2.5rem] border border-white/10 relative group overflow-hidden"
          >
             <div className="absolute top-0 right-0 w-24 h-24 bg-white/[0.02] rounded-bl-[4rem] group-hover:bg-orange-500/5 transition-all flex items-center justify-center translate-x-4 -translate-y-4">
                <Globe className="w-10 h-10 text-orange-500 opacity-10 group-hover:opacity-100 transition-opacity" />
             </div>
             
             <h3 className="text-2xl font-header text-white mb-2 uppercase italic leading-tight">{threat.title}</h3>
             <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-8">{threat.region}</p>
             
             <div className="space-y-6">
                <div className="flex justify-between items-end">
                   <div>
                      <p className="text-[8px] text-slate-600 uppercase font-bold tracking-widest mb-1">Risk Exposure</p>
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${
                        threat.risk === 'Extreme' ? 'text-critical' : threat.risk === 'High' ? 'text-orange-500' : 'text-success'
                      }`}>{threat.risk}</span>
                   </div>
                   <div className="text-right">
                      <p className="text-[8px] text-slate-600 uppercase font-bold tracking-widest mb-1">Status</p>
                      <p className="text-sm font-header text-white italic">{threat.status}</p>
                   </div>
                </div>
             </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         {/* Threat Visualization (Unique) */}
         <div className="lg:col-span-2 glass-panel p-10 rounded-[3rem] border border-white/10 bg-black/40 h-[500px] relative overflow-hidden group">
            <div className="absolute inset-0 bg-[url('https://cartodb-basemaps-a.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png')] opacity-20 grayscale invert" />
            
            <div className="relative z-10 h-full flex flex-col justify-between">
               <div className="flex justify-between items-start">
                  <div>
                     <h3 className="text-white font-header text-sm uppercase tracking-widest flex items-center gap-2">
                        <Activity className="w-4 h-4 text-orange-500" /> Live_Seismic_Stream
                     </h3>
                     <p className="text-[10px] text-slate-500 font-mono mt-1 uppercase">Monitoring: 14,204 SENSORS // GLOBAL_MESH_v4</p>
                  </div>
                  <div className="flex gap-2">
                     <button className="p-3 bg-black/40 border border-white/10 rounded-xl text-white hover:bg-orange-500 transition-all"><Wind className="w-4 h-4" /></button>
                     <button className="p-3 bg-black/40 border border-white/10 rounded-xl text-white hover:bg-orange-500 transition-all"><CloudRain className="w-4 h-4" /></button>
                  </div>
               </div>

               <div className="flex justify-between items-end">
                  <div className="p-8 bg-black/40 border border-white/10 rounded-[2.5rem] backdrop-blur-md max-w-sm">
                     <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                           <Zap className="text-orange-500 w-5 h-5 animate-pulse" />
                        </div>
                        <div>
                           <p className="text-xs font-bold text-white uppercase italic tracking-widest">Disruption Wave Detected</p>
                           <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1">Velocity: 840km/h // Target: APAC</p>
                        </div>
                     </div>
                     <button className="w-full py-4 bg-orange-600 text-white font-bold text-[10px] uppercase tracking-widest rounded-xl shadow-[0_0_20px_rgba(249,115,22,0.4)]">
                        Initialize Shielding
                     </button>
                  </div>
               </div>
            </div>
         </div>

         {/* Disaster Analytics */}
         <div className="glass-panel p-10 rounded-[3rem] border border-white/10 h-full">
            <h3 className="text-white font-header text-sm uppercase tracking-widest mb-10 flex items-center gap-2">
               <Database className="w-4 h-4 text-orange-500" /> Probabilistic Impact
            </h3>
            
            <div className="space-y-12">
               {[
                 { label: 'Infrastructure Breach', val: 72 },
                 { label: 'Logistics Severance', val: 94 },
                 { label: 'Workforce Attrition', val: 34 },
                 { label: 'Data Latency Spike', val: 56 },
               ].map((stat, i) => (
                 <div key={i}>
                    <div className="flex justify-between items-center mb-3 text-[10px] font-bold uppercase tracking-widest">
                       <span className="text-slate-400">{stat.label}</span>
                       <span className="text-white font-mono">{stat.val}%</span>
                    </div>
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                       <motion.div initial={{ width: 0 }} animate={{ width: `${stat.val}%` }} className="h-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
                    </div>
                 </div>
               ))}
            </div>

            <div className="mt-16 p-8 bg-orange-500/5 border border-orange-500/10 rounded-[2.5rem]">
               <p className="text-[10px] text-orange-400 font-bold uppercase tracking-widest mb-4">Tactical Disaster Advisory</p>
               <p className="text-[11px] text-slate-500 leading-relaxed uppercase font-mono italic">
                 Pacific tectonic activity is rising. Recommend 20% inventory buffer increase for West Coast nodes and Tier 2 maritime redirects.
               </p>
            </div>
         </div>
      </div>
    </div>
  );
}
