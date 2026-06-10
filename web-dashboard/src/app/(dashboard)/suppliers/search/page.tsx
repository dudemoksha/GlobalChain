"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Activity, 
  Globe, 
  MapPin, 
  ShieldCheck, 
  TrendingUp, 
  Zap, 
  Maximize2,
  ChevronRight,
  Plus
} from 'lucide-react';

const results = [
  { name: 'CoreChips Taiwan', location: 'Kaohsiung, TW', health: 94, risk: 'Low', capability: 'L4 Semi' },
  { name: 'EuroParts Logistics', location: 'Munich, DE', health: 78, risk: 'Moderate', capability: 'Heavy Fab' },
  { name: 'SeaLink Shenzhen', location: 'Shenzhen, CN', health: 85, risk: 'Critical', capability: 'Marine' },
  { name: 'AmeriCores Hub', location: 'Austin, US', health: 92, risk: 'Low', capability: 'R&D' },
];

export default function SupplierSearch() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase tracking-widest mb-2 font-mono">
            <span>Suppliers</span>
            <span className="opacity-30">/</span>
            <span className="text-slate-300">Discovery Engine</span>
          </div>
          <h2 className="font-header text-3xl text-white tracking-tight uppercase italic">
            Network <span className="text-glow-blue">Discovery Engine</span>
          </h2>
        </div>
        <div className="flex gap-4">
           <button className="px-6 py-2 bg-glow-blue text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg flex items-center gap-2 hover:scale-105 transition-all">
              <Plus className="w-3 h-3" /> Register New Partner
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Search & Filters */}
        <div className="lg:col-span-3 space-y-8">
           <div className="glass-panel border border-white/10 rounded-3xl p-8 space-y-8">
              <div className="space-y-4">
                 <label className="text-[10px] text-slate-400 uppercase font-bold tracking-widest block">Core Search</label>
                 <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input type="text" placeholder="Partner ID, Capability..." className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-[10px] text-white focus:outline-none focus:border-glow-blue/50 transition-all" />
                 </div>
              </div>

              <div className="space-y-4">
                 <label className="text-[10px] text-slate-400 uppercase font-bold tracking-widest block">Region Filter</label>
                 <div className="space-y-2">
                    {['North America', 'EMEA', 'Asia Pacific', 'Latin America'].map(r => (
                      <label key={r} className="flex items-center gap-3 cursor-pointer group">
                         <div className="w-4 h-4 border border-white/10 rounded bg-white/5 group-hover:border-glow-blue transition-all"></div>
                         <span className="text-[10px] text-slate-400 group-hover:text-white transition-all uppercase tracking-tighter">{r}</span>
                      </label>
                    ))}
                 </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/5">
                 <label className="text-[10px] text-slate-400 uppercase font-bold tracking-widest block">Min Health Index</label>
                 <div className="flex justify-between text-[10px] text-glow-blue font-mono mb-2">
                    <span>0%</span>
                    <span>75%</span>
                    <span>100%</span>
                 </div>
                 <div className="h-1 bg-white/5 rounded-full relative">
                    <div className="absolute left-0 right-1/4 h-full bg-glow-blue rounded-full"></div>
                    <div className="absolute right-1/4 top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-glow-blue rounded-full shadow-lg"></div>
                 </div>
              </div>

              <button className="w-full py-4 bg-white/5 border border-white/10 text-slate-400 hover:text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all">
                 Reset All Protocols
              </button>
           </div>
        </div>

        {/* Results Grid */}
        <div className="lg:col-span-9 space-y-8">
           {/* Summary Stats */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Network Reach', val: '1,284 Nodes' },
                { label: 'Discovery Coverage', val: '94.2%' },
                { label: 'AI Match Accuracy', val: '98%' },
              ].map((stat, i) => (
                <div key={i} className="glass-panel border border-white/10 rounded-2xl p-6">
                   <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest mb-1">{stat.label}</p>
                   <div className="text-xl font-header text-white">{stat.val}</div>
                </div>
              ))}
           </div>

           {/* Results List */}
           <div className="space-y-4">
              {results.map((res, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-panel border border-white/10 p-6 rounded-3xl hover:bg-white/[0.04] transition-all group cursor-pointer"
                >
                   <div className="flex justify-between items-center">
                      <div className="flex gap-6 items-center">
                         <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center group-hover:border-glow-blue/50 transition-all">
                            <Globe className="w-6 h-6 text-slate-500 group-hover:text-glow-blue transition-colors" />
                         </div>
                         <div>
                            <h3 className="text-lg font-header text-white uppercase italic tracking-tight">{res.name}</h3>
                            <div className="flex items-center gap-3 mt-1">
                               <div className="flex items-center gap-1.5 text-[9px] text-slate-500 uppercase font-bold">
                                  <MapPin className="w-3 h-3" /> {res.location}
                               </div>
                               <div className="h-3 w-px bg-white/10"></div>
                               <div className="text-[9px] text-glow-blue font-bold uppercase">{res.capability}</div>
                            </div>
                         </div>
                      </div>
                      
                      <div className="flex items-center gap-8">
                         <div className="text-right">
                            <div className="text-xs font-header text-white">{res.health}%</div>
                            <div className={`text-[8px] font-bold uppercase ${res.risk === 'Low' ? 'text-success' : 'text-critical'}`}>{res.risk} Risk</div>
                         </div>
                         <button className="p-3 bg-glow-blue/10 border border-glow-blue/20 rounded-xl text-glow-blue hover:bg-glow-blue hover:text-white transition-all">
                            <Plus className="w-4 h-4" />
                         </button>
                      </div>
                   </div>
                </motion.div>
              ))}
           </div>

           <div className="flex justify-center pt-8">
              <button className="px-10 py-4 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-all">
                 Load Next Cluster
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
