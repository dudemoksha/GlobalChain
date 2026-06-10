"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Layers, Map, Activity, Filter, Box, Network, AlertCircle } from 'lucide-react';
import { useStore } from '@/store/useStore';

export default function NodeDensityPage() {
  const { suppliers } = useStore();
  const [activeTier, setActiveTier] = useState<number | 'ALL'>('ALL');

  const filteredSuppliers = activeTier === 'ALL' ? suppliers : suppliers.filter(s => s.tier === activeTier);
  
  // Group by rough lat/lng regions for a mock density map
  const regions = [
    { name: 'North America', lat: 40, lng: -100, count: filteredSuppliers.filter(s => s.lat > 15 && s.lng < -45).length },
    { name: 'Europe', lat: 50, lng: 15, count: filteredSuppliers.filter(s => s.lat > 35 && s.lng > -20 && s.lng < 40).length },
    { name: 'Asia', lat: 35, lng: 105, count: filteredSuppliers.filter(s => s.lat > -10 && s.lng > 60 && s.lng < 150).length },
    { name: 'South America', lat: -15, lng: -60, count: filteredSuppliers.filter(s => s.lat < 15 && s.lng < -30 && s.lng > -90).length },
    { name: 'Africa', lat: 0, lng: 20, count: filteredSuppliers.filter(s => s.lat < 35 && s.lat > -35 && s.lng > -20 && s.lng < 55).length },
  ].sort((a, b) => b.count - a.count);

  const maxCount = Math.max(...regions.map(r => r.count), 1);

  return (
    <div className="space-y-8 pb-10">
      <div className="flex justify-between items-end gap-6 flex-wrap">
        <div>
          <h2 className="font-header text-4xl text-white tracking-tight uppercase italic mb-2">Node <span className="text-glow-blue">Density</span></h2>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-tight">Geographic clustering and concentration risk analysis.</p>
        </div>
        <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/10">
          <Filter className="w-4 h-4 text-slate-500 ml-2" />
          <div className="flex gap-2">
            {['ALL', 1, 2, 3].map(t => (
              <button key={t} onClick={() => setActiveTier(t as number | 'ALL')}
                className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeTier === t ? 'bg-glow-blue text-white' : 'text-slate-400 hover:text-white'}`}>
                {t === 'ALL' ? 'All Tiers' : `Tier ${t}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-panel p-8 rounded-[2.5rem] border border-white/10 min-h-[600px] relative overflow-hidden flex flex-col">
          <h3 className="text-white font-header text-xl uppercase italic tracking-tight mb-8 z-10">Global Concentration <span className="text-glow-blue">Map</span></h3>
          
          <div className="flex-1 relative border border-white/5 bg-[#05070a] rounded-2xl overflow-hidden flex items-center justify-center">
             <div className="absolute inset-0 opacity-20 bg-[url('https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg')] bg-no-repeat bg-center bg-contain" style={{ filter: 'invert(1)' }} />
             
             {/* Mock Density Heat Blobs */}
             {regions.map((r, i) => {
               if (r.count === 0) return null;
               const intensity = r.count / maxCount;
               const size = Math.max(80, intensity * 200);
               return (
                 <motion.div key={i}
                   initial={{ opacity: 0, scale: 0 }}
                   animate={{ opacity: intensity * 0.8, scale: 1 }}
                   className="absolute rounded-full blur-2xl pointer-events-none"
                   style={{
                     width: size, height: size,
                     left: `${((r.lng + 180) / 360) * 100}%`,
                     top: `${((90 - r.lat) / 180) * 100}%`,
                     transform: 'translate(-50%, -50%)',
                     background: `radial-gradient(circle, ${intensity > 0.7 ? '#ef4444' : intensity > 0.4 ? '#f59e0b' : '#3b82f6'} 0%, transparent 70%)`
                   }}
                 />
               );
             })}

             {regions.length === 0 || maxCount === 0 ? (
               <div className="text-center z-10">
                 <Map className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                 <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">No data available for selected criteria</p>
               </div>
             ) : (
                <div className="absolute bottom-6 left-6 z-10 flex gap-4">
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-critical blur-[2px]" /><span className="text-[9px] text-slate-400 font-bold uppercase">High Density</span></div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-warning blur-[2px]" /><span className="text-[9px] text-slate-400 font-bold uppercase">Medium Density</span></div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-glow-blue blur-[2px]" /><span className="text-[9px] text-slate-400 font-bold uppercase">Low Density</span></div>
                </div>
             )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-panel p-8 rounded-[2.5rem] border border-white/10">
            <h3 className="text-white font-header text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
               <Layers className="w-4 h-4 text-glow-blue" /> Concentration Risk
            </h3>
            <div className="space-y-6">
              {regions.map((r, i) => (
                <div key={i}>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-xs font-bold text-slate-300">{r.name}</span>
                    <span className="text-xs font-mono text-white">{r.count} <span className="text-[9px] text-slate-500">({maxCount > 0 ? Math.round((r.count / filteredSuppliers.length) * 100) : 0}%)</span></span>
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${maxCount > 0 ? (r.count / maxCount) * 100 : 0}%` }}
                      className={`h-full ${r.count / maxCount > 0.7 ? 'bg-critical' : r.count / maxCount > 0.4 ? 'bg-warning' : 'bg-glow-blue'}`} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel p-8 rounded-[2.5rem] border border-white/10 bg-critical/[0.02] border-critical/10">
             <div className="flex items-start gap-4 mb-4">
                <AlertCircle className="w-6 h-6 text-critical shrink-0" />
                <div>
                   <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-1">Vulnerability Alert</h4>
                   <p className="text-[10px] text-slate-400 leading-relaxed font-mono">
                     {regions[0] && regions[0].count > 0 
                       ? `${Math.round((regions[0].count / filteredSuppliers.length) * 100)}% of your active network is concentrated in ${regions[0].name}. A localized disruption in this region would result in catastrophic supply chain failure.`
                       : 'Insufficient data to calculate vulnerability metrics.'}
                   </p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
