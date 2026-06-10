"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, Activity, Zap, Shield, AlertCircle, 
  Search, Filter, Play, Square, RefreshCcw, Wifi,
  Cpu, Database, Network, Send, Command, Power,
  ChevronRight, BrainCircuit, ShieldCheck, Settings,
  Eye, EyeOff, LayoutPanelLeft, List, Gauge, Radio
} from 'lucide-react';

export default function RealtimeMonitoringDashboard() {
  const [logs, setLogs] = useState<{ id: string; time: string; type: string; msg: string; status: string }[]>([]);
  const [command, setCommand] = useState('');
  const [isAutoScroll, setIsAutoScroll] = useState(true);
  const [showConsole, setShowConsole] = useState(true);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Commands system
  const executeCommand = (cmd: string) => {
    const time = new Date().toLocaleTimeString();
    const id = Math.random().toString(36).substr(2, 9);
    
    let response = { id, time, type: 'EXEC', msg: `Command [${cmd}] not recognized.`, status: 'ERROR' };

    const normalizedCmd = cmd.toLowerCase().trim();

    if (normalizedCmd === 'clear') {
      setLogs([]);
      return;
    }

    if (normalizedCmd === 'optimize') {
      handleOptimize();
      response = { id, time, type: 'SYS_OPT', msg: 'Initiating global link node optimization protocols...', status: 'PROCESSING' };
    } else if (normalizedCmd === 'status') {
      response = { id, time, type: 'SYS_STAT', msg: 'All L4 clusters operational. Network stability: 99.98%.', status: 'SUCCESS' };
    } else if (normalizedCmd === 'ping') {
      response = { id, time, type: 'SYS_PING', msg: 'Global gateway response: 4ms latency.', status: 'SUCCESS' };
    } else if (normalizedCmd === 'help') {
      response = { id, time, type: 'HELP', msg: 'Available: OPTIMIZE, STATUS, PING, CLEAR, REBOOT', status: 'INFO' };
    } else if (normalizedCmd === 'reboot') {
        response = { id, time, type: 'SEC_AUTH', msg: 'System reboot requires L5 biometric clearance.', status: 'DENIED' };
    }

    setLogs(prev => [response, ...prev].slice(0, 50));
    setCommand('');
  };

  const handleOptimize = () => {
    setIsOptimizing(true);
    const id = Math.random().toString(36).substr(2, 9);
    const time = new Date().toLocaleTimeString();
    
    setLogs(prev => [{ id, time, type: 'SYS_OPT', msg: 'Optimizing high-latency nodal links...', status: 'PROCESSING' }, ...prev]);
    
    setTimeout(() => {
      const finishId = Math.random().toString(36).substr(2, 9);
      setLogs(prev => [{ id: finishId, time: new Date().toLocaleTimeString(), type: 'SYS_OPT', msg: 'Nodal synchronization finalized. Link stability maximized.', status: 'SUCCESS' }, ...prev]);
      setIsOptimizing(false);
    }, 3000);
  };

  // Simulate incoming live data
  useEffect(() => {
    const logPool = [
      { type: 'BGP_ROUTING', msg: 'Updated path for Node-CN-402 via Hong Kong gateway.', status: 'SUCCESS' },
      { type: 'SEC_AUTH', msg: 'Biometric signature verified for level 4 user GC-001.', status: 'AUTHORIZED' },
      { type: 'SYS_SYNC', msg: 'Distributed ledger synchronized across 12 clusters.', status: 'SYNCED' },
      { type: 'DATA_INGEST', msg: 'Processing real-time meteorological overlay for Atlantic corridor.', status: 'PROCESSING' },
      { type: 'ALERT_MON', msg: 'Minor latency detected in EMEA maritime sensors.', status: 'WARNING' },
    ];

    const interval = setInterval(() => {
      const newLog = {
        id: Math.random().toString(36).substr(2, 9),
        time: new Date().toLocaleTimeString(),
        ...logPool[Math.floor(Math.random() * logPool.length)]
      };
      setLogs(prev => [newLog, ...prev].slice(0, 50));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8 pb-20">
      {/* Realtime Terminal Header */}
      <div className="flex justify-between items-end bg-[#0a0c10]/70 p-10 rounded-[3rem] border border-white/10 relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
             <div className="w-2 h-2 rounded-full bg-success animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
             <span className="text-[10px] text-success font-bold uppercase tracking-[0.4em]">Live System Heartbeat</span>
          </div>
          <h2 className="font-header text-5xl text-white tracking-tighter uppercase italic leading-[0.8] mb-4">
            Mission <span className="text-glow-blue">Control Center</span>
          </h2>
          <p className="text-slate-500 text-sm font-mono tracking-tight uppercase max-w-2xl">Monitoring 1,402 Global Nodes // 42 Intelligence Clusters // Level-4 Encryption Active</p>
        </div>
        
        <div className="flex gap-4 relative z-10">
           <button 
             onClick={() => setShowConsole(!showConsole)}
             className={`px-8 py-5 border rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-3 ${showConsole ? 'bg-glow-blue/10 border-glow-blue/30 text-glow-blue shadow-[0_0_20px_rgba(59,130,246,0.2)]' : 'bg-white/5 border-white/10 text-slate-500'}`}
           >
              {showConsole ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              {showConsole ? 'Hide Interface' : 'Show Interface'}
           </button>
           <div className="flex items-center gap-6 px-8 py-5 bg-white/[0.03] border border-white/10 rounded-2xl">
              <div>
                 <p className="text-[8px] text-slate-600 uppercase font-bold tracking-widest mb-1">Packet Latency</p>
                 <p className="text-2xl font-header text-white">4.2ms</p>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div>
                 <p className="text-[8px] text-slate-600 uppercase font-bold tracking-widest mb-1">Integrity</p>
                 <p className="text-2xl font-header text-success">100%</p>
              </div>
           </div>
        </div>
      </div>

      <AnimatePresence>
        {showConsole && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-10"
          >
            {/* Live Terminal Stream */}
            <div className="lg:col-span-8 glass-panel p-0 rounded-[3rem] border border-white/10 overflow-hidden flex flex-col h-[700px] shadow-2xl relative">
               <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.03] relative z-10">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 bg-glow-blue/10 rounded-xl flex items-center justify-center border border-glow-blue/20">
                        <Terminal className="w-5 h-5 text-glow-blue" />
                     </div>
                     <div>
                        <h3 className="text-xs font-bold text-white uppercase tracking-widest">Global_Mission_Log_Stream</h3>
                        <p className="text-[8px] text-slate-500 font-mono mt-1">PROTOCOL: L4_DECENTRALIZED_AUDIT</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-4">
                     <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                        <button onClick={() => setLogs([])} className="px-4 py-2 rounded-lg text-[9px] font-bold text-slate-500 hover:text-white uppercase tracking-widest transition-all">Clear Terminal</button>
                        <button className="px-4 py-2 rounded-lg text-[9px] font-bold text-slate-500 hover:text-white uppercase tracking-widest transition-all">Export Dump</button>
                     </div>
                  </div>
               </div>

               <div className="flex-1 overflow-y-auto p-8 space-y-4 font-mono text-[11px] custom-scrollbar bg-black/40">
                  <AnimatePresence initial={false}>
                    {logs.map((log) => (
                      <motion.div 
                        key={log.id}
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex gap-6 p-4 rounded-2xl hover:bg-white/[0.03] transition-all group border border-transparent hover:border-white/5"
                      >
                        <span className="text-slate-600 shrink-0 select-none">[{log.time}]</span>
                        <div className="flex flex-col gap-1 flex-1">
                           <div className="flex items-center gap-3">
                              <span className={`font-bold uppercase tracking-tight ${
                                log.type === 'EXEC' ? 'text-purple-400' :
                                log.status === 'WARNING' || log.status === 'ERROR' ? 'text-critical' : 'text-glow-blue'
                              }`}>
                                {log.type}
                              </span>
                              <span className={`text-[8px] font-bold px-2 py-0.5 rounded uppercase ${
                                log.status === 'SUCCESS' || log.status === 'SYNCED' || log.status === 'AUTHORIZED' 
                                ? 'bg-success/10 text-success' : 
                                log.status === 'PROCESSING' ? 'bg-glow-blue/10 text-glow-blue animate-pulse' :
                                'bg-critical/10 text-critical'
                              }`}>
                                {log.status}
                              </span>
                           </div>
                           <span className="text-slate-300 leading-relaxed italic">
                             {log.type === 'EXEC' && <span className="text-slate-600 mr-2">$ {command}</span>}
                             {log.msg}
                           </span>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {logs.length === 0 && (
                     <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
                        <Terminal className="w-16 h-16 mb-4 text-slate-600" />
                        <p className="text-[10px] font-bold uppercase tracking-[0.3em]">Listening for incoming telemetry...</p>
                     </div>
                  )}
               </div>
               
               <form 
                  onSubmit={(e) => { e.preventDefault(); if (command.trim()) executeCommand(command); }}
                  className="p-6 bg-[#05070a] border-t border-white/5 flex items-center gap-6 group"
               >
                  <div className="flex items-center gap-3 text-glow-blue">
                     <Command className="w-4 h-4" />
                     <span className="text-sm font-bold">$</span>
                  </div>
                  <input 
                    type="text" 
                    value={command}
                    onChange={(e) => setCommand(e.target.value)}
                    placeholder="TYPE COMMAND (e.g. OPTIMIZE, STATUS, CLEAR, HELP)..."
                    className="bg-transparent border-none outline-none text-white font-mono text-sm flex-1 placeholder:text-slate-800 focus:placeholder:text-slate-700 transition-all"
                  />
                  <div className="flex gap-4">
                     <div className="flex gap-1.5 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10">
                        <div className="w-1.5 h-1.5 rounded-full bg-glow-blue animate-pulse" />
                        <div className="w-1.5 h-1.5 rounded-full bg-glow-blue/40" />
                        <div className="w-1.5 h-1.5 rounded-full bg-glow-blue/20" />
                     </div>
                     <button type="submit" className="p-2 text-slate-500 hover:text-glow-blue transition-all">
                        <Send className="w-4 h-4" />
                     </button>
                  </div>
               </form>
            </div>

            {/* Hardware & Cluster Stats */}
            <div className="space-y-10">
               <div className="glass-panel p-10 rounded-[3rem] border border-white/10 bg-white/[0.01]">
                  <h3 className="text-white font-header text-sm uppercase tracking-widest mb-10 flex items-center gap-3">
                     <Cpu className="w-5 h-5 text-glow-blue" /> L4 Hardware Status
                  </h3>
                  
                  <div className="space-y-12">
                     {[
                       { label: 'Compute Allocation', val: 74, icon: Activity },
                       { label: 'Neural Link Latency', val: 12, icon: Wifi },
                       { label: 'Database Sharding', val: 98, icon: Database },
                       { label: 'Network Hardening', val: 86, icon: Shield },
                     ].map((stat, i) => (
                       <div key={i}>
                          <div className="flex justify-between items-center mb-3">
                             <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase font-bold tracking-tight">
                                <stat.icon className="w-3.5 h-3.5" /> {stat.label}
                             </div>
                             <span className="text-xs font-bold text-white font-mono">{stat.val}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden relative">
                             <motion.div 
                               initial={{ width: 0 }}
                               animate={{ width: `${stat.val}%` }}
                               className={`h-full bg-glow-blue shadow-[0_0_15px_rgba(59,130,246,0.5)] relative z-10`}
                             />
                             <div className="absolute top-0 bottom-0 left-[90%] border-l border-white/20 z-0" />
                          </div>
                       </div>
                     ))}
                  </div>

                  <div className="mt-20 p-10 bg-glow-blue/[0.03] border border-glow-blue/10 rounded-[2.5rem] text-center relative overflow-hidden group">
                     <div className="absolute inset-0 bg-gradient-to-b from-glow-blue/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                     <p className="text-[10px] text-slate-500 uppercase font-bold tracking-[0.3em] mb-6 relative z-10">Synchronization Pulse</p>
                     <div className="flex justify-center gap-4 mb-8 relative z-10">
                        {[...Array(8)].map((_, i) => (
                          <div key={i} className={`w-2.5 h-12 rounded-full ${i < 6 ? 'bg-glow-blue' : 'bg-white/10'} ${isOptimizing ? 'animate-bounce' : 'animate-pulse'}`} style={{ animationDelay: `${i * 0.1}s` }} />
                        ))}
                     </div>
                     <button 
                        onClick={handleOptimize}
                        disabled={isOptimizing}
                        className="relative z-10 w-full py-5 bg-glow-blue text-white rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:bg-blue-600 disabled:opacity-50 flex items-center justify-center gap-3"
                     >
                        {isOptimizing ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                        {isOptimizing ? 'Optimizing Protocols...' : 'Optimize Link Nodes'}
                     </button>
                  </div>
               </div>

               <div className="glass-panel p-8 rounded-[2.5rem] border border-white/10 flex items-center gap-6 group cursor-pointer hover:bg-white/[0.03] transition-all">
                  <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-slate-500 group-hover:text-glow-blue group-hover:border-glow-blue/30 transition-all">
                     <Radio className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                     <p className="text-[11px] text-white font-bold uppercase tracking-widest">Global Comms</p>
                     <p className="text-[9px] text-slate-600 font-bold uppercase mt-1">Satellite Link: ENCRYPTED</p>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-success shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!showConsole && (
        <div className="h-[400px] flex flex-col items-center justify-center text-center space-y-6 bg-white/[0.02] border border-dashed border-white/5 rounded-[4rem]">
           <EyeOff className="w-16 h-16 text-slate-800" />
           <div>
              <p className="text-xl font-header text-white uppercase italic">Monitoring Interface Hidden</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2">Telemetry streaming in background. Reactivate via command center header.</p>
           </div>
           <button onClick={() => setShowConsole(true)} className="px-10 py-4 bg-glow-blue/10 border border-glow-blue/20 text-glow-blue rounded-xl text-[10px] font-bold uppercase tracking-[0.2em]">Re-engage Interface</button>
        </div>
      )}
    </div>
  );
}
