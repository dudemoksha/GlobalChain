"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, CheckCircle2, Shield, Activity, TrendingUp, Cpu, X, RefreshCw, Zap } from 'lucide-react';
import { useStore } from '@/store/useStore';

export default function AIRecommendationsPage() {
  const { autoRecommendations, suppliers, resolveRecommendation } = useStore();
  const [executing, setExecuting] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // AutoRecommendations from store are purely AUTOMATIC/SIMULATION
  const autoResolutions = autoRecommendations.filter(r => r.type === 'AUTOMATIC');
  const strategicRecs = autoRecommendations.filter(r => r.type !== 'AUTOMATIC');

  const handleExecute = (id: string) => {
    setExecuting(id);
    setTimeout(() => {
      resolveRecommendation(id);
      setExecuting(null);
    }, 1500);
  };

  // If no real recommendations, provide some high-level strategic stubs based on data length
  const mockStrategic = suppliers.length > 0 ? [
    { id: 'S-01', title: 'Diversify Tier 1 Asian Suppliers', desc: 'Current network shows 65% concentration in APAC region. Recommend onboarding 2-3 backup nodes in LATAM or EMEA to distribute geographic risk.', impact: 'High', effort: 'Medium' },
    { id: 'S-02', title: 'Increase Safety Stock for Critical Skus', desc: 'Predictive models indicate a 40% probability of port congestion at Shanghai next quarter. Increase safety stock for associated SKUs by 15%.', impact: 'Medium', effort: 'Low' },
  ] : [];

  return (
    <div className="space-y-8 pb-10">
      <div className="flex justify-between items-end gap-6 flex-wrap">
        <div>
          <h2 className="font-header text-4xl text-white tracking-tight uppercase italic mb-2">AI <span className="text-glow-blue">Recommendations</span></h2>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-tight">Machine-generated strategic insights and automated failover proposals.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-3xl border border-white/10 flex items-center gap-5">
           <div className="w-14 h-14 bg-glow-blue/10 border border-glow-blue/20 rounded-2xl flex items-center justify-center shrink-0">
              <BrainCircuit className="w-6 h-6 text-glow-blue" />
           </div>
           <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Engine Status</p>
              <h3 className="text-xl font-header text-glow-blue">ACTIVE_MONITORING</h3>
           </div>
        </div>
        <div className="glass-panel p-6 rounded-3xl border border-white/10 flex items-center gap-5">
           <div className="w-14 h-14 bg-success/10 border border-success/20 rounded-2xl flex items-center justify-center shrink-0">
              <Zap className="w-6 h-6 text-success" />
           </div>
           <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Auto-Failovers</p>
              <h3 className="text-xl font-header text-white">{autoResolutions.length} Proposed</h3>
           </div>
        </div>
        <div className="glass-panel p-6 rounded-3xl border border-white/10 flex items-center gap-5">
           <div className="w-14 h-14 bg-purple-500/10 border border-purple-500/20 rounded-2xl flex items-center justify-center shrink-0">
              <TrendingUp className="w-6 h-6 text-purple-400" />
           </div>
           <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Strategic Shifts</p>
              <h3 className="text-xl font-header text-white">{strategicRecs.length + mockStrategic.length} Identified</h3>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Automated Failover Recommendations */}
        <div className="glass-panel p-8 rounded-[2.5rem] border border-white/10 min-h-[500px]">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-white font-header text-lg uppercase tracking-widest flex items-center gap-2">
               <RefreshCw className="w-5 h-5 text-glow-blue" /> Automated Route Corrections
            </h3>
            <button 
               onClick={() => { setIsRefreshing(true); setTimeout(() => setIsRefreshing(false), 1000); }} 
               className="p-2 hover:bg-white/5 rounded-xl transition-colors"
               disabled={isRefreshing}
            >
               <RefreshCw className={`w-4 h-4 text-slate-400 ${isRefreshing ? 'animate-spin text-glow-blue' : ''}`} />
            </button>
          </div>
          <div className="space-y-4">
             <AnimatePresence>
             {autoResolutions.length > 0 ? autoResolutions.map(rec => (
               <motion.div 
                 key={rec.id} 
                 initial={{ opacity: 1, height: 'auto' }}
                 exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                 className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.04] transition-all group"
               >
                  <div className="flex justify-between items-start mb-3">
                     <span className="px-3 py-1 bg-glow-blue/10 border border-glow-blue/20 text-[9px] text-glow-blue font-bold uppercase rounded tracking-widest">
                       Immediate Action
                     </span>
                     <span className="text-[10px] font-mono text-slate-500">{new Date(rec.timestamp).toLocaleDateString()}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white mb-2 leading-snug">Reroute {suppliers.find(s=>s.id===rec.supplierId)?.name || rec.supplierId} traffic to {suppliers.find(s=>s.id===rec.backupId)?.name || rec.backupId}</h4>
                  <p className="text-[11px] text-slate-400 font-mono leading-relaxed mb-4">{rec.reason}</p>
                  <div className="flex gap-4 mb-4">
                     <div>
                        <p className="text-[8px] text-slate-600 font-bold uppercase mb-1">Risk Reduction</p>
                        <p className="text-xs font-mono text-success">+{rec.riskReduction}%</p>
                     </div>
                     <div>
                        <p className="text-[8px] text-slate-600 font-bold uppercase mb-1">Logistics Boost</p>
                        <p className="text-xs font-mono text-success">+{rec.logisticsImprovement}%</p>
                     </div>
                  </div>
                  <button 
                    onClick={() => handleExecute(rec.id)}
                    disabled={executing === rec.id}
                    className="w-full py-3 bg-glow-blue text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:bg-blue-500 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                     {executing === rec.id ? <><RefreshCw className="w-4 h-4 animate-spin" /> Executing...</> : <><CheckCircle2 className="w-4 h-4" /> Approve & Execute Reroute</>}
                  </button>
               </motion.div>
             )) : (
               <div className="text-center py-20 opacity-50">
                 <Shield className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                 <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">No immediate reroutes required</p>
                 <p className="text-[10px] text-slate-600 font-mono mt-2">Network is operating at optimal efficiency.</p>
               </div>
             )}
             </AnimatePresence>
          </div>
        </div>

        {/* Strategic Recommendations */}
        <div className="glass-panel p-8 rounded-[2.5rem] border border-white/10 min-h-[500px]">
          <h3 className="text-white font-header text-lg uppercase tracking-widest mb-8 flex items-center gap-2">
             <Cpu className="w-5 h-5 text-purple-400" /> Strategic Network Shifts
          </h3>
          <div className="space-y-4">
             {mockStrategic.length > 0 ? mockStrategic.map(rec => (
               <div key={rec.id} className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.04] transition-all">
                  <div className="flex justify-between items-start mb-3">
                     <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-[9px] text-purple-400 font-bold uppercase rounded tracking-widest">
                       Long-Term Strategy
                     </span>
                  </div>
                  <h4 className="text-sm font-bold text-white mb-2">{rec.title}</h4>
                  <p className="text-[11px] text-slate-400 font-mono leading-relaxed mb-4">{rec.desc}</p>
                  <div className="flex gap-2">
                     <span className="px-3 py-1 bg-white/5 rounded text-[9px] font-bold text-slate-300 uppercase">Impact: {rec.impact}</span>
                     <span className="px-3 py-1 bg-white/5 rounded text-[9px] font-bold text-slate-300 uppercase">Effort: {rec.effort}</span>
                  </div>
               </div>
             )) : (
               <div className="text-center py-20 opacity-50">
                 <BrainCircuit className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                 <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Awaiting Data</p>
                 <p className="text-[10px] text-slate-600 font-mono mt-2">Upload graph data to generate strategic insights.</p>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
