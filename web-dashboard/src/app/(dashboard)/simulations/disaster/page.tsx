"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CloudLightning, Play, AlertTriangle, Map, Navigation, ShieldAlert, Wind, Droplets, Flame, Activity } from 'lucide-react';
import { useStore } from '@/store/useStore';
import Link from 'next/link';

export default function NaturalDisasterSimulationPage() {
  const { suppliers } = useStore();
  const hasData = suppliers.length > 0;

  const [disasterType, setDisasterType] = useState<string>('Hurricane / Typhoon');
  const [intensity, setIntensity] = useState<number>(4);
  const [region, setRegion] = useState<string>('Southeast Asia');

  const disasterTypes = [
    { name: 'Hurricane / Typhoon', icon: Wind },
    { name: 'Earthquake', icon: Activity },
    { name: 'Wildfire', icon: Flame },
    { name: 'Severe Flood', icon: Droplets },
  ];

  const regions = ['Southeast Asia', 'North America (West Coast)', 'North America (East Coast)', 'Western Europe', 'Japan & Korea'];

  return (
    <div className="space-y-8 pb-10">
      <div className="flex justify-between items-end gap-6 flex-wrap">
        <div>
          <h2 className="font-header text-4xl text-white tracking-tight uppercase italic mb-2">Natural <span className="text-glow-blue">Disaster</span></h2>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-tight">Simulate severe weather events and geophysical shocks to evaluate network resilience.</p>
        </div>
      </div>

      {!hasData ? (
        <div className="glass-panel p-10 rounded-[2.5rem] border border-white/10 text-center flex flex-col items-center justify-center min-h-[400px]">
          <CloudLightning className="w-16 h-16 text-slate-700 mb-6" />
          <h3 className="text-xl font-header text-white uppercase italic mb-2">No Network Data Available</h3>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-widest max-w-md mb-8">Upload your supply chain graph to run natural disaster simulations.</p>
          <Link href="/data/upload">
            <button className="px-8 py-4 bg-glow-blue text-white rounded-xl text-[10px] font-bold uppercase tracking-[0.2em]">Go to Data Upload</button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 glass-panel p-8 rounded-[2.5rem] border border-white/10 flex flex-col min-h-[600px] relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-5"><CloudLightning className="w-64 h-64 text-white" /></div>
             
             <h3 className="text-white font-header text-xl uppercase italic tracking-tight mb-8 z-10">Event <span className="text-glow-blue">Parameters</span></h3>
             
             <div className="space-y-10 max-w-xl relative z-10 flex-1">
                <div>
                   <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-glow-blue" /> Disaster Classification
                   </label>
                   <div className="grid grid-cols-2 gap-3">
                     {disasterTypes.map(dt => (
                       <button key={dt.name} onClick={() => setDisasterType(dt.name)}
                         className={`p-4 rounded-xl border flex items-center justify-center gap-3 transition-all ${disasterType === dt.name ? 'bg-glow-blue/10 border-glow-blue/50 text-glow-blue shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'}`}>
                         <dt.icon className="w-4 h-4 shrink-0" />
                         <span className="text-[10px] font-bold uppercase tracking-widest">{dt.name}</span>
                       </button>
                     ))}
                   </div>
                </div>

                <div>
                   <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Map className="w-4 h-4 text-glow-blue" /> Target Region
                   </label>
                   <select 
                     value={region} onChange={(e) => setRegion(e.target.value)}
                     className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-4 text-xs font-mono text-white focus:outline-none focus:border-glow-blue/50"
                   >
                     {regions.map(r => <option key={r} value={r} className="bg-[#05070a]">{r}</option>)}
                   </select>
                </div>

                <div>
                   <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Activity className="w-4 h-4 text-glow-blue" /> Event Severity
                   </label>
                   <div className="flex gap-2">
                     {[1,2,3,4,5].map(lvl => (
                       <button key={lvl} onClick={() => setIntensity(lvl)}
                         className={`flex-1 py-3 border rounded-xl text-xs font-bold transition-all ${
                           intensity === lvl 
                           ? (lvl > 3 ? 'bg-critical/20 border-critical text-critical shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'bg-warning/20 border-warning text-warning shadow-[0_0_15px_rgba(245,158,11,0.3)]') 
                           : 'bg-white/5 border-white/10 text-slate-500 hover:bg-white/10'
                         }`}>
                         Category {lvl}
                       </button>
                     ))}
                   </div>
                </div>

                <div className={`p-6 border rounded-2xl flex items-start gap-4 ${intensity > 3 ? 'bg-critical/5 border-critical/20' : 'bg-warning/5 border-warning/20'}`}>
                   <AlertTriangle className={`w-6 h-6 shrink-0 ${intensity > 3 ? 'text-critical' : 'text-warning'}`} />
                   <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-1">Impact Preview</h4>
                      <p className="text-[10px] text-slate-400 leading-relaxed font-mono">
                        A Category {intensity} {disasterType} in {region} will result in catastrophic infrastructure failure, immediately halting operations for an estimated {intensity * 12} nodes and severing regional transit corridors for up to {intensity * 5} days.
                      </p>
                   </div>
                </div>
             </div>

             <div className="mt-8 pt-8 border-t border-white/5 flex justify-end relative z-10">
                <button className="px-10 py-5 bg-glow-blue text-white rounded-2xl text-xs font-bold uppercase tracking-widest shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:bg-blue-500 transition-all flex items-center gap-3">
                   <Play className="w-5 h-5 fill-current" /> Execute Simulation
                </button>
             </div>
          </div>

          <div className="glass-panel p-8 rounded-[2.5rem] border border-white/10 bg-white/[0.01]">
             <h3 className="text-white font-header text-sm uppercase tracking-widest mb-8 flex items-center gap-2">
                <Navigation className="w-4 h-4 text-glow-blue" /> Geographic Exposure
             </h3>
             <div className="space-y-6">
               <div className="p-5 bg-black/40 border border-white/5 rounded-xl text-center">
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Nodes in Blast Radius</p>
                  <p className="text-3xl font-header text-white">{(suppliers.length * (intensity * 0.08)).toFixed(0)}</p>
               </div>
               <div className="p-5 bg-black/40 border border-white/5 rounded-xl text-center">
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Estimated Recovery</p>
                  <p className="text-3xl font-header text-warning">{intensity * 5} Days</p>
               </div>
               <div className="p-5 bg-black/40 border border-white/5 rounded-xl text-center">
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Propagation Risk</p>
                  <p className={`text-3xl font-header ${intensity > 3 ? 'text-critical' : 'text-warning'}`}>
                    {intensity > 3 ? 'SEVERE' : 'HIGH'}
                  </p>
               </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
