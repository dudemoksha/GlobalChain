"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldAlert, 
  Globe, 
  Zap, 
  Activity, 
  Play, 
  Settings2, 
  AlertTriangle, 
  Layers, 
  Clock, 
  Sword,
  Maximize2
} from 'lucide-react';

export default function GeopoliticalWarSimulation() {
  const [tensionIndex, setTensionIndex] = useState(64);
  const [isSimulating, setIsSimulating] = useState(false);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase tracking-widest mb-2 font-mono">
            <span>Simulations</span>
            <span className="opacity-30">/</span>
            <span className="text-slate-300">Geopolitical Conflict</span>
          </div>
          <h2 className="font-header text-3xl text-white tracking-tight uppercase italic">
            Macro <span className="text-glow-blue">Tension Simulation</span>
          </h2>
        </div>
        <div className="flex gap-4 items-center">
           <div className="flex items-center gap-2 px-3 py-1 bg-critical/10 border border-critical/30 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-critical animate-pulse"></div>
              <span className="text-[9px] text-critical font-bold uppercase font-mono">Tension_Level_Elevated</span>
           </div>
           <button 
             onClick={() => setIsSimulating(!isSimulating)}
             className={`px-8 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${
               isSimulating ? 'bg-critical text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]' : 'bg-glow-blue text-white shadow-[0_0_20px_rgba(59,130,246,0.4)]'
             }`}
           >
              {isSimulating ? <Sword className="w-3 h-3" /> : <Play className="w-3 h-3 fill-current" />}
              {isSimulating ? 'Abort Simulation' : 'Execute Tension Scenario'}
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Scenario Configuration */}
        <div className="lg:col-span-4 space-y-8">
           <div className="glass-panel border border-white/10 rounded-3xl p-8 space-y-8">
              <h3 className="font-header text-sm text-white uppercase tracking-widest flex items-center gap-2">
                 <Settings2 className="w-4 h-4 text-glow-blue" /> Conflict Parameters
              </h3>

              <div className="space-y-6">
                 {/* Regional Focus */}
                 <div className="space-y-4">
                    <label className="text-[10px] text-slate-400 uppercase font-bold tracking-widest block">Primary Conflict Zone</label>
                    <div className="grid grid-cols-2 gap-2">
                       {['East_China_Sea', 'Eastern_Europe', 'Middle_East', 'South_America'].map(z => (
                         <button key={z} className={`py-2 px-3 border rounded-lg text-[9px] text-left transition-all ${z === 'East_China_Sea' ? 'bg-critical/20 border-critical text-white font-bold' : 'bg-white/5 border-white/5 text-slate-500 hover:border-white/20'}`}>
                           {z}
                         </button>
                       ))}
                    </div>
                 </div>

                 {/* Tension Intensity */}
                 <div className="space-y-4">
                    <div className="flex justify-between items-center">
                       <label className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Tension Index</label>
                       <span className="text-xs font-mono text-critical">{tensionIndex}/100</span>
                    </div>
                    <input 
                      type="range" value={tensionIndex} onChange={(e) => setTensionIndex(parseInt(e.target.value))}
                      className="w-full h-1 bg-white/5 rounded-full appearance-none cursor-pointer accent-critical"
                    />
                 </div>

                 {/* Restriction Types */}
                 <div className="space-y-4 pt-4 border-t border-white/5">
                    <label className="text-[10px] text-slate-400 uppercase font-bold tracking-widest block">Operational Restrictions</label>
                    <div className="grid grid-cols-2 gap-2">
                       {['Trade Embargo', 'BGP_Shutdown', 'Tariff Spike', 'Modal Ban'].map(r => (
                         <button key={r} className={`py-2 px-3 border rounded-lg text-[9px] text-left transition-all ${r === 'Trade Embargo' ? 'bg-critical/20 border-critical/40 text-critical font-bold' : 'bg-white/5 border-white/5 text-slate-500 hover:border-white/20'}`}>
                           {r}
                         </button>
                       ))}
                    </div>
                 </div>
              </div>
           </div>

           <div className="p-6 bg-critical/5 border border-critical/20 rounded-3xl">
              <div className="flex items-center gap-2 mb-3">
                 <AlertTriangle className="w-4 h-4 text-critical" />
                 <span className="text-[10px] font-bold text-critical uppercase tracking-wider">Geopolitical Forecast</span>
              </div>
              <p className="text-[10px] text-slate-300 leading-relaxed italic">
                 "Full trade embargo in the East China Sea corridor would affect 64% of high-tech manifests. Projected inflation drift for raw materials: +12.4%."
              </p>
           </div>
        </div>

        {/* Tension Visualizer */}
        <div className="lg:col-span-8 space-y-8">
           <div className="glass-panel border border-white/10 rounded-3xl p-8 h-[500px] relative overflow-hidden group bg-black/20">
              <div className="absolute top-6 left-6 z-10">
                 <div className="flex items-center gap-2 px-3 py-1 bg-background/80 backdrop-blur-md rounded-full border border-white/10">
                    <Globe className="w-3 h-3 text-glow-blue" />
                    <span className="text-[9px] text-white font-mono uppercase tracking-widest font-bold">MACRO_GEO_MAPPING_L4</span>
                 </div>
              </div>

              {/* Conflict Visual Mock */}
              <div className="w-full h-full bg-white/[0.01] border border-white/5 border-dashed rounded-2xl relative flex items-center justify-center">
                 {isSimulating ? (
                    <motion.div 
                      initial={{ scale: 0 }} animate={{ scale: [0, 1.2, 1.5], opacity: [0, 0.4, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 bg-critical/20"
                    />
                 ) : null}
                 
                 <div className="text-center z-10">
                    <Sword className={`w-24 h-24 ${isSimulating ? 'text-critical animate-pulse' : 'text-slate-800 opacity-20'} mb-6 mx-auto`} />
                    <p className="text-[10px] text-slate-600 uppercase font-mono tracking-[0.3em]">Neural_Tension_Replay...</p>
                 </div>
              </div>
           </div>

           {/* Metrics Grid */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Trade Impact', val: '-$12.4B', color: 'text-critical' },
                { label: 'Stability Index', val: '32%', color: 'text-critical' },
                { label: 'Risk Propagation', val: 'Global', color: 'text-warning' },
              ].map((stat, i) => (
                <div key={i} className="glass-panel border border-white/10 rounded-2xl p-6">
                   <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-2">{stat.label}</p>
                   <div className={`text-2xl font-header ${stat.color}`}>{stat.val}</div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
