"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Globe, MapPin, Activity, Navigation, Shield, Database, AlertCircle, Clock, Anchor, Factory, Truck } from 'lucide-react';
import { useStore } from '@/store/useStore';

export default function GlobalOverviewPage() {
  const router = useRouter();
  const { suppliers, edges, activeSimulation } = useStore();
  const [regionFilter, setRegionFilter] = useState('ALL');

  const regions = ['ALL', 'APAC', 'EMEA', 'AMER'];
  
  const getRegion = (lat: number, lng: number) => {
    if (lng > 60) return 'APAC';
    if (lng > -30 && lng <= 60) return 'EMEA';
    return 'AMER';
  };

  const filteredSuppliers = suppliers.filter(s => regionFilter === 'ALL' || getRegion(s.lat, s.lng) === regionFilter);
  const activeNodes = (activeSimulation?.simulatedSuppliers || suppliers);
  const affectedNodes = activeNodes.filter(s => s.affectedBy);

  const regionStats = {
    APAC: suppliers.filter(s => getRegion(s.lat, s.lng) === 'APAC').length,
    EMEA: suppliers.filter(s => getRegion(s.lat, s.lng) === 'EMEA').length,
    AMER: suppliers.filter(s => getRegion(s.lat, s.lng) === 'AMER').length,
  };

  const activityLog = [
    { time: '2m ago', event: 'Shipment 8492 departed Port of Shanghai', icon: Anchor, color: 'text-glow-blue' },
    { time: '14m ago', event: 'Tier 2 manufacturing delayed (Node-84)', icon: Factory, color: 'text-warning' },
    { time: '42m ago', event: 'Customs cleared at Rotterdam Gateway', icon: Shield, color: 'text-success' },
    { time: '1h ago', event: 'Logistics rerouted due to severe weather', icon: Truck, color: 'text-critical' },
  ];

  return (
    <div className="space-y-8 pb-10">
      <div className="flex justify-between items-end gap-6 flex-wrap">
        <div>
          <h2 className="font-header text-4xl text-white tracking-tight uppercase italic mb-2">Global <span className="text-glow-blue">Overview</span></h2>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-tight">Macro-level intelligence of your global supply chain distribution.</p>
        </div>
        <div className="flex gap-2">
          {regions.map(r => (
            <button key={r} onClick={() => setRegionFilter(r)}
              className={`px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${regionFilter === r ? 'bg-glow-blue text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]' : 'bg-white/5 text-slate-400 hover:bg-white/10 border border-white/10'}`}>
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Active Facilities', val: filteredSuppliers.length.toLocaleString(), icon: Factory, color: 'text-glow-blue' },
          { label: 'Global Trade Routes', val: edges.length.toLocaleString(), icon: Navigation, color: 'text-purple-400' },
          { label: 'Affected Regions', val: new Set(affectedNodes.map(s => getRegion(s.lat, s.lng))).size.toString(), icon: AlertCircle, color: 'text-critical' },
          { label: 'Data Sync Status', val: 'LIVE', icon: Activity, color: 'text-success' },
        ].map((stat, i) => (
          <motion.div key={i} whileHover={{ y: -5 }} className="glass-panel p-6 rounded-3xl border border-white/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
               <stat.icon className="w-16 h-16 text-white" />
            </div>
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-[0.2em] mb-2">{stat.label}</p>
            <h3 className={`text-3xl font-header ${stat.color}`}>{stat.val}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-panel p-8 rounded-[2.5rem] border border-white/10 flex flex-col relative min-h-[500px]">
          <h3 className="text-white font-header text-xl uppercase italic tracking-tight mb-8">Regional <span className="text-glow-blue">Distribution</span></h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
            {[
              { name: 'APAC (Asia-Pacific)', count: regionStats.APAC, desc: 'Primary manufacturing & raw materials' },
              { name: 'EMEA (Europe/Middle East)', count: regionStats.EMEA, desc: 'Assembly & secondary suppliers' },
              { name: 'AMER (Americas)', count: regionStats.AMER, desc: 'Final distribution & main consumption' },
            ].map((r, i) => (
              <div key={i} className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 flex flex-col justify-between">
                <div>
                  <Globe className="w-8 h-8 text-glow-blue mb-4 opacity-50" />
                  <h4 className="text-sm font-bold text-white uppercase tracking-widest">{r.name}</h4>
                  <p className="text-[10px] text-slate-500 font-mono mt-2 h-8">{r.desc}</p>
                </div>
                <div className="mt-8 pt-6 border-t border-white/5 flex items-end justify-between">
                  <div>
                    <p className="text-[10px] text-slate-600 uppercase font-bold tracking-widest mb-1">Active Nodes</p>
                    <p className="text-3xl font-header text-white">{r.count}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel p-8 rounded-[2.5rem] border border-white/10 flex flex-col bg-white/[0.01]">
          <h3 className="text-white font-header text-sm uppercase tracking-widest mb-8 flex items-center gap-2">
             <Clock className="w-4 h-4 text-glow-blue" /> Live Operations Log
          </h3>
          <div className="space-y-6 flex-1 relative">
             <div className="absolute left-4 top-2 bottom-2 w-px bg-white/5" />
             {activityLog.map((log, i) => (
               <div key={i} className="relative flex items-start gap-4 z-10">
                 <div className="w-8 h-8 bg-[#0a0c10] border border-white/10 rounded-full flex items-center justify-center shrink-0 z-10 mt-1">
                   <log.icon className={`w-3.5 h-3.5 ${log.color}`} />
                 </div>
                 <div>
                   <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">{log.time}</p>
                   <p className="text-xs text-white leading-relaxed">{log.event}</p>
                 </div>
               </div>
             ))}
          </div>
          <button onClick={() => router.push('/admin/audit')} className="w-full mt-8 py-4 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all">
            View Full Audit Log
          </button>
        </div>
      </div>
    </div>
  );
}
