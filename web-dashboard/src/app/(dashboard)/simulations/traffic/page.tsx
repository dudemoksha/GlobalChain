"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Play, Settings, AlertTriangle, Navigation, Map, Navigation2, Network, TrafficCone } from 'lucide-react';
import { useStore } from '@/store/useStore';
import Link from 'next/link';

export default function TrafficSimulationPage() {
  const { suppliers } = useStore();
  const hasData = suppliers.length > 0;

  const [intensity, setIntensity] = useState<number>(50);
  const [chokePoint, setChokePoint] = useState<string>('Suez Canal');

  const chokePoints = [
    'Suez Canal', 'Panama Canal', 'Strait of Malacca', 'Strait of Hormuz', 'Bab el-Mandeb'
  ];

  return (
    <div className="space-y-8 pb-10">
      <div className="flex justify-between items-end gap-6 flex-wrap">
        <div>
          <h2 className="font-header text-4xl text-white tracking-tight uppercase italic mb-2">Traffic <span className="text-glow-blue">Disruption</span></h2>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-tight">Simulate severe maritime and aerial logistics route closures.</p>
        </div>
      </div>

      {!hasData ? (
        <div className="glass-panel p-10 rounded-[2.5rem] border border-white/10 text-center flex flex-col items-center justify-center min-h-[400px]">
          <TrafficCone className="w-16 h-16 text-slate-700 mb-6" />
          <h3 className="text-xl font-header text-white uppercase italic mb-2">No Network Data Available</h3>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-widest max-w-md mb-8">Upload your supply chain graph to run traffic disruption simulations.</p>
          <Link href="/data/upload">
            <button className="px-8 py-4 bg-glow-blue text-white rounded-xl text-[10px] font-bold uppercase tracking-[0.2em]">Go to Data Upload</button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 glass-panel p-8 rounded-[2.5rem] border border-white/10 flex flex-col min-h-[600px] relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-5"><Navigation className="w-64 h-64 text-white" /></div>
             
             <h3 className="text-white font-header text-xl uppercase italic tracking-tight mb-8 z-10">Simulation <span className="text-glow-blue">Parameters</span></h3>
             
             <div className="space-y-10 max-w-xl relative z-10 flex-1">
                <div>
                   <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Map className="w-4 h-4 text-glow-blue" /> Target Maritime Chokepoint
                   </label>
                   <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                     {chokePoints.map(cp => (
                       <button key={cp} onClick={() => setChokePoint(cp)}
                         className={`p-4 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all text-center ${chokePoint === cp ? 'bg-glow-blue/10 border-glow-blue/50 text-glow-blue shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'}`}>
                         {cp}
                       </button>
                     ))}
                   </div>
                </div>

                <div>
                   <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Activity className="w-4 h-4 text-glow-blue" /> Closure Intensity (Delay Duration)
                   </label>
                   <input 
                     type="range" min="10" max="100" step="10"
                     value={intensity} onChange={(e) => setIntensity(Number(e.target.value))}
                     className="w-full accent-glow-blue h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                   />
                   <div className="flex justify-between mt-3">
                     <span className="text-[10px] font-mono text-slate-500">2 Days (Minor)</span>
                     <span className="text-[10px] font-mono text-glow-blue font-bold">{Math.round(intensity * 0.3)} Days Closure</span>
                     <span className="text-[10px] font-mono text-slate-500">30+ Days (Severe)</span>
                   </div>
                </div>

                <div className="p-6 bg-warning/5 border border-warning/20 rounded-2xl flex items-start gap-4">
                   <AlertTriangle className="w-6 h-6 text-warning shrink-0" />
                   <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-1">Impact Preview</h4>
                      <p className="text-[10px] text-slate-400 leading-relaxed font-mono">
                        A {Math.round(intensity * 0.3)}-day closure at the {chokePoint} will trigger immediate rerouting protocols, increasing average freight transit time by an estimated {Math.round(intensity * 0.15)} days and spiking shipping costs globally.
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
                <Network className="w-4 h-4 text-glow-blue" /> Network Exposure
             </h3>
             <div className="space-y-6">
               <div className="p-5 bg-black/40 border border-white/5 rounded-xl text-center">
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Dependent Routes</p>
                  <p className="text-3xl font-header text-white">{(suppliers.length * 0.4).toFixed(0)}</p>
               </div>
               <div className="p-5 bg-black/40 border border-white/5 rounded-xl text-center">
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Est. Revenue at Risk</p>
                  <p className="text-3xl font-header text-warning">$84M</p>
               </div>
               <div className="p-5 bg-black/40 border border-white/5 rounded-xl text-center">
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Secondary Chokepoints</p>
                  <p className="text-3xl font-header text-critical">2</p>
               </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
