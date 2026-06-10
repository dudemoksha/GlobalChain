"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Map as MapIcon, 
  Zap, 
  Search, 
  Filter,
  Maximize2,
  Play,
  Settings2,
  AlertTriangle,
  Waves,
  Building2,
  Clock
} from 'lucide-react';

export default function EarthquakeSimulation() {
  const [magnitude, setMagnitude] = useState(7.4);
  const [isSimulating, setIsSimulating] = useState(false);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase tracking-widest mb-2 font-mono">
            <span>Simulations</span>
            <span className="opacity-30">/</span>
            <span className="text-slate-300">Natural Disasters</span>
          </div>
          <h2 className="font-header text-3xl text-white tracking-tight uppercase italic">
            Seismic <span className="text-glow-blue">Impact Simulation</span>
          </h2>
        </div>
        <div className="flex gap-4 items-center">
           <div className="flex items-center gap-2 px-3 py-1 bg-warning/10 border border-warning/30 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-warning animate-pulse"></div>
              <span className="text-[9px] text-warning font-bold uppercase font-mono">Tectonic_Monitor_Active</span>
           </div>
           <button 
             onClick={() => setIsSimulating(!isSimulating)}
             className={`px-8 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${
               isSimulating ? 'bg-critical text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]' : 'bg-glow-blue text-white shadow-[0_0_20px_rgba(59,130,246,0.4)]'
             }`}
           >
              {isSimulating ? <Activity className="w-3 h-3" /> : <Play className="w-3 h-3 fill-current" />}
              {isSimulating ? 'Abort Simulation' : 'Execute Seismic Scenario'}
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Scenario Configuration */}
        <div className="lg:col-span-4 space-y-8">
           <div className="glass-panel border border-white/10 rounded-3xl p-8 space-y-8">
              <h3 className="font-header text-sm text-white uppercase tracking-widest flex items-center gap-2">
                 <Settings2 className="w-4 h-4 text-glow-blue" /> Seismic Parameters
              </h3>

              <div className="space-y-6">
                 {/* Magnitude */}
                 <div className="space-y-4">
                    <div className="flex justify-between items-center">
                       <label className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Magnitude (Richter)</label>
                       <span className="text-xs font-mono text-glow-blue">{magnitude} Mw</span>
                    </div>
                    <input 
                      type="range" min="4.0" max="9.5" step="0.1" value={magnitude} onChange={(e) => setMagnitude(parseFloat(e.target.value))}
                      className="w-full h-1 bg-white/5 rounded-full appearance-none cursor-pointer accent-glow-blue"
                    />
                 </div>

                 {/* Epicenter Zone */}
                 <div className="space-y-4">
                    <label className="text-[10px] text-slate-400 uppercase font-bold tracking-widest block">Epicenter Cluster</label>
                    <div className="grid grid-cols-2 gap-2">
                       {['Hsinchu_TW', 'Tokyo_JP', 'San_Fran_US', 'Istanbul_TR'].map(z => (
                         <button key={z} className={`py-2 px-3 border rounded-lg text-[9px] text-left transition-all ${z === 'Hsinchu_TW' ? 'bg-glow-blue/20 border-glow-blue text-white font-bold' : 'bg-white/5 border-white/5 text-slate-500 hover:border-white/20'}`}>
                           {z}
                         </button>
                       ))}
                    </div>
                 </div>

                 {/* Secondary Effects */}
                 <div className="space-y-4">
                    <label className="text-[10px] text-slate-400 uppercase font-bold tracking-widest block">Cascading Effects</label>
                    <div className="space-y-2">
                       {[
                         { icon: Waves, label: 'Tsunami Risk', val: 'Low' },
                         { icon: Building2, label: 'Power Grid Failure', val: 'High' },
                         { icon: Clock, label: 'Recovery Estimate', val: '14 Days' },
                       ].map((eff, i) => (
                         <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                            <div className="flex items-center gap-2">
                               <eff.icon className="w-3 h-3 text-slate-500" />
                               <span className="text-[9px] text-white font-bold uppercase tracking-tighter">{eff.label}</span>
                            </div>
                            <span className="text-[9px] text-glow-blue font-mono">{eff.val}</span>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>

           <div className="p-6 bg-glow-blue/5 border border-glow-blue/20 rounded-3xl">
              <div className="flex items-center gap-2 mb-3">
                 <AlertTriangle className="w-4 h-4 text-glow-blue" />
                 <span className="text-[10px] font-bold text-glow-blue uppercase tracking-wider">Predictive Damage</span>
              </div>
              <p className="text-[10px] text-slate-300 leading-relaxed italic">
                 "Magnitude {magnitude} seismic event at Hsinchu cluster would affect 14.5% of Tier-1 semiconductor output. Projected recovery time: 14.2 days."
              </p>
           </div>
        </div>

        {/* Impact Visualizer */}
        <div className="lg:col-span-8 space-y-8">
           <div className="glass-panel border border-white/10 rounded-3xl p-8 h-[500px] relative overflow-hidden group bg-black/20">
              <div className="absolute top-6 left-6 z-10">
                 <div className="flex items-center gap-2 px-3 py-1 bg-background/80 backdrop-blur-md rounded-full border border-white/10">
                    <MapIcon className="w-3 h-3 text-glow-blue" />
                    <span className="text-[9px] text-white font-mono uppercase tracking-widest font-bold">IMPACT_GEOMETRY_L4</span>
                 </div>
              </div>

              {/* Impact Visual Mock */}
              <div className="w-full h-full bg-white/[0.01] border border-white/5 border-dashed rounded-2xl relative flex items-center justify-center">
                 {isSimulating ? (
                    <motion.div 
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: [0, 1.5, 2], opacity: [0, 0.5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute w-64 h-64 border-4 border-glow-blue rounded-full"
                    />
                 ) : null}
                 
                 <div className="text-center z-10">
                    <Activity className={`w-24 h-24 ${isSimulating ? 'text-glow-blue animate-pulse' : 'text-slate-800 opacity-20'} mb-6 mx-auto`} />
                    <p className="text-[10px] text-slate-600 uppercase font-mono tracking-[0.3em]">Neural_Seismic_Mapping...</p>
                 </div>
              </div>
           </div>

           {/* Metrics Grid */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Structural Damage', val: 'Medium', color: 'text-warning' },
                { label: 'Logistics Blockage', val: '84%', color: 'text-critical' },
                { label: 'Resilience Score', val: '62%', color: 'text-glow-blue' },
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
