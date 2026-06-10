"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, AlertTriangle, ShieldAlert, 
  Activity, Search, Filter,
  Globe, Zap, Clock, Terminal,
  MessageSquare, ArrowRight, XCircle, CheckCircle2
} from 'lucide-react';

export default function GlobalAlertsPage() {
  const [alerts, setAlerts] = useState([
    { id: 'AL-902', type: 'Critical', msg: 'PORT_SINGAPORE_SHUTDOWN_INBOUND', time: '2m ago', region: 'APAC' },
    { id: 'AL-894', type: 'Warning', msg: 'TIER_2_NODE_LATENCY_SPIKE', time: '14m ago', region: 'EMEA' },
    { id: 'AL-882', type: 'Info', msg: 'NEURAL_MODEL_RE-SYNC_COMPLETE', time: '1h ago', region: 'GLOBAL' },
    { id: 'AL-871', type: 'Critical', msg: 'CYBER_INFILTRATION_DETECTED_L3', time: '3h ago', region: 'NA-EAST' },
  ]);

  const [acknowledged, setAcknowledged] = useState(false);
  const [protocolInitiated, setProtocolInitiated] = useState(false);
  const [messageSent, setMessageSent] = useState<string | null>(null);

  const handleAcknowledge = () => {
    setAcknowledged(true);
    setTimeout(() => {
      setAlerts([]);
      setAcknowledged(false);
    }, 2000);
  };

  const handleProtocol = () => {
    setProtocolInitiated(true);
    setTimeout(() => setProtocolInitiated(false), 3000);
  };

  const handleMessage = (id: string) => {
    setMessageSent(id);
    setTimeout(() => setMessageSent(null), 2000);
  };

  return (
    <div className="space-y-8 font-mono">
      {/* Header */}
      <div className="flex justify-between items-start border-b border-critical/20 pb-8">
        <div>
           <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-critical/10 rounded-xl flex items-center justify-center border border-critical/20 animate-pulse">
                 <Bell className="w-5 h-5 text-critical" />
              </div>
              <span className="text-xs font-bold text-critical uppercase tracking-[0.4em]">High-Velocity Alert Stream</span>
           </div>
           <h2 className="font-header text-5xl text-white tracking-tighter uppercase italic leading-[0.9] mb-4">
              Global <span className="text-critical">Alerts</span>
           </h2>
           <p className="text-slate-500 text-sm max-w-xl font-bold uppercase tracking-tight">Real-time emergency broadcast system for global supply chain disruptions and cybersecurity threats.</p>
        </div>
        
        <div className="flex gap-4">
           <div className="px-8 py-6 bg-critical/5 border border-critical/20 rounded-3xl flex flex-col items-center">
              <p className="text-[9px] text-critical/50 uppercase font-bold tracking-widest mb-1">Active Threats</p>
              <p className="text-3xl font-header text-critical">{alerts.length > 0 ? '14' : '0'}</p>
              <div className="flex items-center gap-1 text-[10px] font-bold text-critical mt-1 uppercase">
                 <ShieldAlert className="w-3 h-3" /> Breach_Detected
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         {/* Alert Feed (Unique) */}
         <div className="lg:col-span-2 space-y-4">
            <h3 className="text-white font-header text-sm uppercase tracking-widest px-2 flex items-center gap-2">
               <Terminal className="w-4 h-4 text-critical" /> Live_Disruption_Log
            </h3>
            <div className="space-y-4">
               {alerts.length > 0 ? alerts.map((alert, i) => (
                 <motion.div 
                   key={alert.id}
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: i * 0.1 }}
                   className={`p-8 rounded-[2rem] border flex items-center justify-between group transition-all cursor-pointer relative overflow-hidden ${
                     alert.type === 'Critical' ? 'bg-critical/5 border-critical/20 hover:border-critical/50' : 
                     alert.type === 'Warning' ? 'bg-warning/5 border-warning/20 hover:border-warning/50' : 
                     'bg-white/[0.02] border-white/5 hover:border-white/20'
                   }`}
                 >
                    <div className="flex items-center gap-10 flex-1">
                       <div className="w-16 h-16 rounded-2xl bg-black/40 flex items-center justify-center shrink-0 border border-white/10 group-hover:scale-110 transition-transform">
                          {alert.type === 'Critical' ? <XCircle className="w-7 h-7 text-critical" /> : 
                           alert.type === 'Warning' ? <AlertTriangle className="w-7 h-7 text-warning" /> : 
                           <Activity className="w-7 h-7 text-glow-blue" />}
                       </div>
                       
                       <div className="flex-1">
                          <div className="flex items-center gap-4 mb-2">
                             <span className="text-[10px] text-slate-500 font-mono">{alert.id}</span>
                             <span className="text-[10px] text-slate-500 font-mono uppercase font-bold tracking-widest">Region: {alert.region}</span>
                          </div>
                          <h4 className={`text-lg font-header italic uppercase tracking-widest ${
                            alert.type === 'Critical' ? 'text-critical' : 'text-white'
                          }`}>{alert.msg}</h4>
                       </div>
                    </div>

                    <div className="text-right flex flex-col items-end gap-2">
                       <span className="text-xs text-slate-600 font-mono">{alert.time}</span>
                       <button 
                         onClick={() => handleMessage(alert.id)}
                         className={`p-4 rounded-xl transition-all flex items-center gap-2 ${messageSent === alert.id ? 'bg-glow-blue/20 text-glow-blue' : 'hover:bg-white/5 text-slate-600 hover:text-white'}`}
                       >
                          {messageSent === alert.id ? <span className="text-[10px] font-bold uppercase">Sent</span> : null}
                          <MessageSquare className="w-5 h-5" />
                       </button>
                    </div>
                 </motion.div>
               )) : (
                 <div className="p-8 text-center text-slate-500 font-bold uppercase tracking-widest">
                   All alerts acknowledged
                 </div>
               )}
            </div>
         </div>

         {/* Alert Intelligence */}
         <div className="space-y-8">
            <div className="glass-panel p-10 rounded-[3rem] border border-critical/10 h-full flex flex-col justify-between">
               <div>
                  <h3 className="text-white font-header text-sm uppercase tracking-widest mb-10 flex items-center gap-2">
                     <Zap className="w-4 h-4 text-critical" /> Impact Analysis
                  </h3>
                  
                  <div className="space-y-12">
                     {[
                       { label: 'Network Fragmentation', val: 74 },
                       { label: 'Sourcing Disruption', val: 92 },
                       { label: 'Revenue Exposure', val: 48 },
                       { label: 'Response Readiness', val: 32 },
                     ].map((stat, i) => (
                       <div key={i}>
                          <div className="flex justify-between items-center mb-3 text-[10px] font-bold uppercase tracking-widest">
                             <span className="text-slate-400">{stat.label}</span>
                             <span className="text-white">{stat.val}%</span>
                          </div>
                          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                             <motion.div initial={{ width: 0 }} animate={{ width: `${stat.val}%` }} className="h-full bg-critical shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                          </div>
                       </div>
                     ))}
                  </div>
               </div>

               <div className="mt-16 space-y-4">
                  <button 
                    onClick={handleAcknowledge}
                    disabled={alerts.length === 0}
                    className="w-full py-5 bg-critical text-white font-bold text-[10px] uppercase tracking-widest rounded-2xl shadow-[0_0_30px_rgba(239,68,68,0.3)] hover:bg-red-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                     {acknowledged ? <><CheckCircle2 className="w-4 h-4" /> Acknowledged</> : 'Acknowledge All Alerts'}
                  </button>
                  <button 
                    onClick={handleProtocol}
                    className="w-full py-5 border border-critical/30 text-critical text-[10px] font-bold uppercase tracking-widest rounded-2xl hover:bg-critical/5 transition-all flex items-center justify-center gap-2"
                  >
                     {protocolInitiated ? 'Protocol Initiated' : 'Initiate Emergency Protocol'}
                  </button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
