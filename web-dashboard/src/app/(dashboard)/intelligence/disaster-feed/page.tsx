"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, Globe, Activity, Zap, 
  MapPin, Clock, Filter, Search,
  Bell, AlertTriangle, Info, ChevronRight,
  TrendingUp, Wind, Droplets, Flame
} from 'lucide-react';

export default function DisasterFeedPage() {
  const [activeTab, setActiveTab] = useState('ALL');
  
  const events = [
    { id: 1, type: 'Flood', severity: 'HIGH', region: 'SE ASIA', msg: 'Severe flooding detected in Vietnam logistics cluster. 12 partner nodes reporting downtime.', time: '2 MIN AGO', icon: Droplets, color: 'text-blue-400' },
    { id: 2, type: 'Earthquake', severity: 'CRITICAL', region: 'JAPAN', msg: '7.2 Magnitude seismic event near Tokyo. Port of Yokohama operations suspended.', time: '14 MIN AGO', icon: Activity, color: 'text-warning' },
    { id: 3, type: 'Cyber', severity: 'MODERATE', region: 'GLOBAL', msg: 'Coordinated DDoS attempt against Tier 2 API gateways. Shield protocols active.', time: '22 MIN AGO', icon: ShieldAlert, color: 'text-critical' },
    { id: 4, type: 'Storm', severity: 'LOW', region: 'ATLANTIC', msg: 'Tropical storm forming in Atlantic corridor. Rerouting maritime traffic.', time: '48 MIN AGO', icon: Wind, color: 'text-blue-200' },
    { id: 5, type: 'Fire', severity: 'HIGH', region: 'CALIFORNIA', msg: 'Wildfire nearing major distribution hub. Evacuation protocols initiated.', time: '1 HOUR AGO', icon: Flame, color: 'text-critical' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
           <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-critical/10 rounded-xl flex items-center justify-center border border-critical/20">
                 <Globe className="w-5 h-5 text-critical" />
              </div>
              <span className="text-xs font-bold text-critical uppercase tracking-[0.4em]">Global Event Stream</span>
           </div>
           <h2 className="font-header text-5xl text-white tracking-tighter uppercase italic leading-[0.9] mb-4">
              Disaster <span className="text-critical">Intelligence</span>
           </h2>
           <p className="text-slate-500 text-sm max-w-xl">Real-time monitoring of global geological, environmental, and security events impacting the enterprise node mesh.</p>
        </div>
        
        <div className="flex gap-4">
           <div className="px-6 py-4 glass-panel rounded-2xl border border-white/10 flex items-center gap-6">
              <div>
                 <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest mb-1">Active Events</p>
                 <p className="text-2xl font-header text-white">08</p>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div>
                 <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest mb-1">Impact Level</p>
                 <p className="text-2xl font-header text-critical font-bold uppercase italic">SEVERE</p>
              </div>
           </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex gap-6 items-center">
         <div className="flex-1 relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="FILTER_INTELLIGENCE_EVENTS..."
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-sm text-white focus:outline-none focus:border-critical/50 transition-all font-mono"
            />
         </div>
         <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
            {['ALL', 'CRITICAL', 'HIGH', 'LOW'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                  activeTab === tab ? 'bg-white/10 text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {tab}
              </button>
            ))}
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         {/* Live Feed Stream */}
         <div className="lg:col-span-2 space-y-4">
            <AnimatePresence initial={false}>
               {events.map((event, i) => (
                 <motion.div
                   key={event.id}
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: i * 0.1 }}
                   className="glass-panel p-8 rounded-[2.5rem] border border-white/5 hover:border-white/20 transition-all group relative overflow-hidden"
                 >
                    <div className="flex items-start gap-8">
                       <div className={`w-16 h-16 rounded-3xl bg-white/[0.02] flex items-center justify-center shrink-0 border border-white/5 group-hover:border-white/10 transition-all relative overflow-hidden`}>
                          <event.icon className={`w-7 h-7 ${event.color}`} />
                          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                       </div>
                       
                       <div className="flex-1">
                          <div className="flex justify-between items-center mb-4">
                             <div className="flex items-center gap-4">
                                <span className={`px-3 py-1 rounded text-[9px] font-bold uppercase tracking-widest ${
                                  event.severity === 'CRITICAL' ? 'bg-critical text-white' : 
                                  event.severity === 'HIGH' ? 'bg-warning text-black' : 'bg-blue-500/20 text-blue-400'
                                }`}>
                                   {event.severity}
                                </span>
                                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2">
                                   <MapPin className="w-3 h-3" /> {event.region}
                                </span>
                             </div>
                             <span className="text-[9px] text-slate-600 font-mono flex items-center gap-2">
                                <Clock className="w-3 h-3" /> {event.time}
                             </span>
                          </div>
                          <p className="text-white text-lg font-medium leading-relaxed group-hover:text-glow-blue transition-colors italic">
                            "{event.msg}"
                          </p>
                          <div className="mt-6 pt-6 border-t border-white/5 flex gap-6">
                             <button className="text-[9px] text-slate-500 hover:text-white font-bold uppercase tracking-widest transition-colors flex items-center gap-2">
                                Review Simulation <Zap className="w-3 h-3" />
                             </button>
                             <button className="text-[9px] text-slate-500 hover:text-white font-bold uppercase tracking-widest transition-colors flex items-center gap-2">
                                Impact Analysis <Activity className="w-3 h-3" />
                             </button>
                          </div>
                       </div>
                    </div>
                 </motion.div>
               ))}
            </AnimatePresence>
         </div>

         {/* Event Insights Side Column */}
         <div className="space-y-8">
            <div className="glass-panel p-10 rounded-[3rem] border border-white/10 h-full">
               <h3 className="text-white font-header text-sm uppercase tracking-widest mb-10 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-critical" /> Impact Distribution
               </h3>
               
               <div className="space-y-10">
                  {[
                    { label: 'Maritime Delays', val: 78, color: 'bg-blue-500' },
                    { label: 'Sourcing Shutdowns', val: 42, color: 'bg-critical' },
                    { label: 'Financial Volatility', val: 64, color: 'bg-warning' },
                    { label: 'Network Integrity', val: 92, color: 'bg-success' },
                  ].map((item, i) => (
                    <div key={i}>
                       <div className="flex justify-between items-center mb-3">
                          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">{item.label}</span>
                          <span className="text-xs font-bold text-white font-mono">{item.val}%</span>
                       </div>
                       <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${item.val}%` }}
                            className={`h-full ${item.color} shadow-[0_0_15px_rgba(239,68,68,0.2)]`} 
                          />
                       </div>
                    </div>
                  ))}
               </div>

               <div className="mt-16 p-8 bg-critical/5 border border-critical/10 rounded-[2.5rem] relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-100 transition-opacity">
                     <AlertTriangle className="w-12 h-12 text-critical" />
                  </div>
                  <p className="text-[10px] text-critical font-bold uppercase tracking-widest mb-4">Strategic Advisory</p>
                  <p className="text-[12px] text-slate-400 leading-relaxed uppercase font-mono italic">
                    Coordinated seismic and meteorological events in the APAC corridor require immediate activation of Resilience Protocol 9-A.
                  </p>
                  <button className="mt-8 w-full py-5 bg-critical text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-red-700 transition-all shadow-[0_0_20px_rgba(239,68,68,0.3)]">
                     Activate Emergency Protocol
                  </button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
