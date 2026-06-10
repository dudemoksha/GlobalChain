"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Database, HardDrive, Activity, 
  RefreshCcw, Layers, Zap, ShieldAlert,
  Terminal, CheckCircle2, Loader2, Play
} from 'lucide-react';
import { useStore } from '@/store/useStore';

export default function AdminDatabasePage() {
  const { addAuditLog } = useStore();
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationStep, setOptimizationStep] = useState<string | null>(null);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [avgQueryTime, setAvgQueryTime] = useState(14);
  const [storageLoad, setStorageLoad] = useState(84);
  const [fragmentation, setFragmentation] = useState(16.8);
  const [showConsole, setShowConsole] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [shardLoads, setShardLoads] = useState([
    { shard: 'SHARD_ASIA_01', load: 42, health: 'OK' },
    { shard: 'SHARD_EURO_04', load: 88, health: 'HEAVY' },
    { shard: 'SHARD_AMER_12', load: 14, health: 'OK' },
    { shard: 'SHARD_MARITIME', load: 56, health: 'OK' },
  ]);

  const runIndexOptimization = () => {
    setIsOptimizing(true);
    setShowConsole(true);
    setConsoleLogs([]);
    
    const logs = [
      "ESTABLISHING SUPERUSER SESSION TO CLUSTER...",
      "ACQUIRING SHARE ROW EXCLUSIVE LOCK ON 'organizations'...",
      "REINDEX TABLE public.organizations (Index size: 48KB) - DONE",
      "ACQUIRING SHARE ROW EXCLUSIVE LOCK ON 'suppliers'...",
      "REINDEX TABLE public.suppliers (Index size: 1.2MB) - DONE",
      "REBUILDING FOREIGN KEY CONSTRAINTS ON 'supply_edges'...",
      "REINDEX TABLE public.supply_edges (Index size: 4.8MB) - DONE",
      "ANALYZING TABLE STATISTICS FOR ALL SCHEMAS...",
      "VACUUM FULL DATABASE COMPLETE. FREEING SLOTS...",
      "FLUSHING SHARD DISPATCH CACHE..."
    ];

    let currentLogIndex = 0;
    
    const interval = setInterval(() => {
      if (currentLogIndex < logs.length) {
        const step = logs[currentLogIndex];
        setOptimizationStep(step);
        setConsoleLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${step}`]);
        currentLogIndex++;
      } else {
        clearInterval(interval);
        // Optimization finished!
        setIsOptimizing(false);
        setOptimizationStep(null);
        setConsoleLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] DATABASE OPTIMIZATION COMPLETE. STATUS: NOMINAL.`]);
        
        // Update stats
        setAvgQueryTime(7);
        setFragmentation(0.8);
        setStorageLoad(81);
        
        // Alleviate heavy load on Euro shard
        setShardLoads([
          { shard: 'SHARD_ASIA_01', load: 38, health: 'OK' },
          { shard: 'SHARD_EURO_04', load: 52, health: 'OK' }, // dropped load
          { shard: 'SHARD_AMER_12', load: 12, health: 'OK' },
          { shard: 'SHARD_MARITIME', load: 48, health: 'OK' },
        ]);

        addAuditLog({
          user: 'SYSTEM',
          action: 'DB_INDEX_OPTIMIZATION',
          result: 'SUCCESS',
          details: 'Defragmented tables and rebuilt B-Tree indexes across all regional shards.'
        });

        setToastMessage("Database optimized successfully.");
        setTimeout(() => setToastMessage(null), 4000);
      }
    }, 450);
  };

  return (
    <div className="space-y-8 font-mono">
      {/* Toast Alert */}
      {toastMessage && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-20 right-6 z-50 p-4 bg-[#0a0c10] border border-blue-500/40 rounded-xl shadow-2xl flex items-center gap-3"
        >
          <CheckCircle2 className="w-5 h-5 text-green-500" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">{toastMessage}</span>
        </motion.div>
      )}

      {/* Header Section */}
      <div className="flex justify-between items-end flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tighter uppercase flex items-center gap-3">
            <Database className="text-blue-500 w-6 h-6 animate-pulse" /> Cluster_Database_Monitor
          </h2>
          <p className="text-slate-500 text-xs mt-1 font-bold uppercase tracking-[0.2em]">Real-time Telemetry of Distributed Graph Nodes...</p>
        </div>
        <button 
          onClick={runIndexOptimization}
          disabled={isOptimizing}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold uppercase tracking-widest rounded flex items-center gap-2 disabled:bg-blue-800 disabled:text-slate-400 transition-all shadow-[0_0_20px_rgba(37,99,235,0.2)]"
        >
           {isOptimizing ? (
             <>
               <Loader2 className="w-4 h-4 animate-spin" /> Optimizing...
             </>
           ) : (
             <>
               <RefreshCcw className="w-4 h-4" /> Optimize_Indexes
             </>
           )}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: 'Total Records', value: '42.8M', trend: '+1.2k/m', color: 'text-green-500', icon: Layers },
          { label: 'Avg Query Time', value: `${avgQueryTime}ms`, trend: avgQueryTime < 10 ? 'EXCELLENT' : 'NOMINAL', color: avgQueryTime < 10 ? 'text-green-500' : 'text-blue-400', icon: Zap },
          { label: 'Index Fragmentation', value: `${fragmentation}%`, trend: fragmentation < 2 ? 'DEFRAGMENTED' : 'WARNING', color: fragmentation < 2 ? 'text-green-500' : 'text-yellow-500', icon: HardDrive },
        ].map((stat, i) => (
          <div key={i} className="p-8 bg-[#0a0c10] border border-blue-900/20 rounded-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-15 transition-opacity">
                <stat.icon className="w-12 h-12" />
             </div>
             <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-2">{stat.label}</p>
             <div className="flex items-end justify-between">
                <h3 className="text-3xl font-bold text-white tracking-tighter">{stat.value}</h3>
                <span className={`text-[9px] font-bold uppercase ${stat.color}`}>{stat.trend}</span>
             </div>
          </div>
        ))}
      </div>

      {/* Console Logging Drawer */}
      <AnimatePresence>
        {showConsole && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border border-blue-900/30 rounded-2xl bg-[#030712] overflow-hidden"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-blue-900/20 bg-blue-950/10">
              <span className="text-[10px] font-bold text-blue-400 flex items-center gap-2">
                <Terminal className="w-4 h-4" /> ENGINE INDEXING CONSOLE
              </span>
              <button 
                onClick={() => setShowConsole(false)}
                className="text-[9px] text-slate-500 hover:text-white uppercase font-bold"
              >
                Close Drawer
              </button>
            </div>
            <div className="p-6 max-h-60 overflow-y-auto text-[10px] text-slate-400 space-y-2 font-mono bg-black/40">
              {consoleLogs.map((log, idx) => (
                <div key={idx} className="flex gap-2">
                  <span className="text-blue-500/60">&gt;&gt;</span>
                  <span>{log}</span>
                </div>
              ))}
              {isOptimizing && (
                <div className="flex items-center gap-2 text-blue-400 font-bold animate-pulse mt-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>EXECUTING: {optimizationStep}</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Shard & Integrity Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Live Table Monitor */}
         <div className="p-8 bg-[#0a0c10] border border-blue-900/20 rounded-2xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-8 flex items-center gap-2">
               <Activity className="w-4 h-4 text-blue-500" /> Live_Shard_Performance
            </h3>
            <div className="space-y-6">
               {shardLoads.map((shard, i) => (
                 <div key={i}>
                    <div className="flex justify-between items-center mb-2">
                       <span className="text-[10px] text-slate-400 font-bold tracking-tight">{shard.shard}</span>
                       <span className={`text-[10px] font-bold ${shard.health === 'HEAVY' ? 'text-yellow-500' : 'text-green-500'}`}>{shard.health}</span>
                    </div>
                    <div className="h-1.5 w-full bg-blue-900/20 rounded-full overflow-hidden">
                       <motion.div 
                         initial={false}
                         animate={{ width: `${shard.load}%` }}
                         className={`h-full ${shard.health === 'HEAVY' ? 'bg-yellow-500' : 'bg-blue-500'}`} 
                       />
                    </div>
                 </div>
               ))}
            </div>
         </div>

         {/* Security Alerts */}
         <div className="p-8 bg-[#0a0c10] border border-blue-900/20 rounded-2xl relative overflow-hidden">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-8 flex items-center gap-2">
               <ShieldAlert className="w-4 h-4 text-red-500" /> Integrity_Alerts
            </h3>
            <div className="space-y-4">
               {[
                 { msg: 'Unauthorized connection attempt from unknown IP.', time: '14:22:04' },
                 { msg: 'Duplicate primary key detected in T3 node cluster.', time: '14:18:12' },
                 { msg: 'Index fragmentation above 15% in SHARD_EURO_04.', time: '13:44:09' },
               ].map((alert, i) => (
                 <div key={i} className="flex gap-4 p-3 border-l-2 border-red-500 bg-red-500/5 rounded-r">
                    <span className="text-slate-600 text-[9px] shrink-0">{alert.time}</span>
                    <p className="text-[10px] text-slate-300 font-bold uppercase tracking-tight">{alert.msg}</p>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}
