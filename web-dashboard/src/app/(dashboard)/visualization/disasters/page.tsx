"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CloudLightning, MapPin, Activity, AlertTriangle, Wind, Droplets, Flame, Search } from 'lucide-react';

const MOCK_DISASTERS = [
  { id: 'EVT-01', type: 'Typhoon', name: 'Typhoon Mawar', location: 'Philippine Sea', severity: 'CRITICAL', impactRadius: 800, lat: 15, lng: 130, status: 'ACTIVE' },
  { id: 'EVT-02', type: 'Earthquake', name: 'Magnitude 6.8', location: 'Off coast of Japan', severity: 'HIGH', impactRadius: 300, lat: 38, lng: 142, status: 'ACTIVE' },
  { id: 'EVT-03', type: 'Wildfire', name: 'California Complex', location: 'Northern California', severity: 'MEDIUM', impactRadius: 150, lat: 39, lng: -121, status: 'CONTAINED' },
  { id: 'EVT-04', type: 'Flood', name: 'Rhine Overflow', location: 'Western Germany', severity: 'HIGH', impactRadius: 200, lat: 51, lng: 7, status: 'ACTIVE' },
];

export default function DisasterOverlayPage() {
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDisasters = MOCK_DISASTERS.filter(d => 
    (activeFilter === 'ALL' || d.type.toUpperCase() === activeFilter) &&
    (d.name.toLowerCase().includes(searchQuery.toLowerCase()) || d.location.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getIcon = (type: string) => {
    switch (type) {
      case 'Typhoon': return Wind;
      case 'Earthquake': return Activity;
      case 'Wildfire': return Flame;
      case 'Flood': return Droplets;
      default: return AlertTriangle;
    }
  };

  const getColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'text-critical bg-critical/10 border-critical/30';
      case 'HIGH': return 'text-warning bg-warning/10 border-warning/30';
      case 'MEDIUM': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30';
      default: return 'text-slate-400 bg-white/5 border-white/10';
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex justify-between items-end gap-6 flex-wrap">
        <div>
          <h2 className="font-header text-4xl text-white tracking-tight uppercase italic mb-2">Disaster <span className="text-glow-blue">Overlay</span></h2>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-tight">Live meteorological and geophysical threat tracking.</p>
        </div>
        <div className="flex gap-2">
          {['ALL', 'TYPHOON', 'EARTHQUAKE', 'WILDFIRE', 'FLOOD'].map(f => (
            <button key={f} onClick={() => setActiveFilter(f)}
              className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeFilter === f ? 'bg-glow-blue text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]' : 'bg-white/5 text-slate-400 hover:bg-white/10 border border-white/10'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-panel p-0 rounded-[2.5rem] border border-white/10 relative overflow-hidden flex flex-col min-h-[600px]">
          <div className="p-8 border-b border-white/5 flex justify-between items-center z-10 bg-[#0a0c10]/80 backdrop-blur-md">
             <h3 className="text-white font-header text-xl uppercase italic tracking-tight">Live <span className="text-glow-blue">Threat Map</span></h3>
             <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="SEARCH EVENTS..." 
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-glow-blue/50 transition-all font-mono"
                />
             </div>
          </div>
          
          <div className="flex-1 relative bg-[#05070a] overflow-hidden">
             {/* Simple Map Background */}
             <div className="absolute inset-0 opacity-30 bg-[url('https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg')] bg-no-repeat bg-center bg-cover" style={{ filter: 'invert(1)' }} />
             
             {/* Map Grid */}
             <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />

             {/* Disaster Markers */}
             {filteredDisasters.map(d => {
               const Icon = getIcon(d.type);
               const isCritical = d.severity === 'CRITICAL';
               return (
                 <div key={d.id} className="absolute" style={{ left: `${((d.lng + 180) / 360) * 100}%`, top: `${((90 - d.lat) / 180) * 100}%`, transform: 'translate(-50%, -50%)' }}>
                    <div className="relative group">
                       {/* Impact Radius Ring */}
                       <motion.div 
                         initial={{ scale: 0.8, opacity: 0 }}
                         animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                         transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                         className={`absolute inset-0 rounded-full border-2 ${isCritical ? 'border-critical' : 'border-warning'} opacity-50`}
                         style={{ width: d.impactRadius, height: d.impactRadius, left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
                       />
                       
                       <div className={`w-8 h-8 rounded-full border flex items-center justify-center relative z-10 ${getColor(d.severity)} backdrop-blur-md`}>
                          <Icon className="w-4 h-4" />
                       </div>

                       {/* Tooltip */}
                       <div className="absolute top-10 left-1/2 -translate-x-1/2 w-48 p-3 bg-black/90 border border-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity z-20 shadow-2xl pointer-events-none">
                          <p className="text-xs font-bold text-white mb-1 uppercase tracking-tight">{d.name}</p>
                          <p className="text-[9px] text-slate-400 font-mono mb-2">{d.location}</p>
                          <div className={`text-[8px] font-bold px-2 py-1 rounded inline-block uppercase ${getColor(d.severity)}`}>{d.severity} IMPACT</div>
                       </div>
                    </div>
                 </div>
               );
             })}
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-panel p-8 rounded-[2.5rem] border border-white/10 h-full flex flex-col">
            <h3 className="text-white font-header text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
               <CloudLightning className="w-4 h-4 text-glow-blue" /> Active Threat Feed
            </h3>
            
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
              {filteredDisasters.map(d => {
                const Icon = getIcon(d.type);
                return (
                  <div key={d.id} className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.04] transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${getColor(d.severity)}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className={`text-[9px] font-bold px-2 py-1 rounded uppercase border ${getColor(d.severity)}`}>
                        {d.severity}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white mb-1">{d.name}</h4>
                    <p className="text-[10px] text-slate-500 flex items-center gap-1 font-mono uppercase">
                      <MapPin className="w-3 h-3" /> {d.location}
                    </p>
                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
                      <span className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">{d.id}</span>
                      <span className={`text-[9px] font-bold uppercase ${d.status === 'ACTIVE' ? 'text-critical animate-pulse' : 'text-success'}`}>{d.status}</span>
                    </div>
                  </div>
                );
              })}
              {filteredDisasters.length === 0 && (
                <div className="text-center py-10 opacity-50">
                  <CloudLightning className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">No active threats match criteria</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
