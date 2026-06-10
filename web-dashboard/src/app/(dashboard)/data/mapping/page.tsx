"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  GitBranch, 
  Search, 
  Filter, 
  Activity, 
  ShieldCheck, 
  AlertTriangle,
  Zap,
  Box,
  Maximize2,
  ChevronRight
} from 'lucide-react';

const dependencies = [
  { from: 'Plant-Alpha', to: 'Supplier-492', weight: 85, tier: 1, status: 'Critical' },
  { from: 'Supplier-492', to: 'Raw-Mat-Zone-1', weight: 42, tier: 2, status: 'Warning' },
  { from: 'Plant-Alpha', to: 'Supplier-104', weight: 64, tier: 1, status: 'Normal' },
  { from: 'Supplier-104', to: 'Raw-Mat-Zone-2', weight: 92, tier: 2, status: 'Normal' },
];

export default function DependencyMapping() {
  const [activeNode, setActiveNode] = useState(dependencies[0]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase tracking-widest mb-2 font-mono">
            <span>Data Management</span>
            <span className="opacity-30">/</span>
            <span className="text-slate-300">Dependency Mapping</span>
          </div>
          <h2 className="font-header text-3xl text-white tracking-tight uppercase italic">
            Network <span className="text-glow-blue">Dependency Graph</span>
          </h2>
        </div>
        <div className="flex gap-4">
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input type="text" placeholder="Search node..." className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-[10px] text-white focus:outline-none focus:border-glow-blue/50 transition-all w-48" />
           </div>
           <button className="px-6 py-2 bg-glow-blue text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg flex items-center gap-2 hover:scale-105 transition-all">
              <Activity className="w-3 h-3" /> Run Criticality Analysis
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Graph Visual Panel */}
        <div className="lg:col-span-8 space-y-8">
           <div className="glass-panel border border-white/10 rounded-3xl p-8 h-[600px] relative overflow-hidden group">
              <div className="absolute top-6 left-6 z-10 flex gap-2">
                 <div className="flex items-center gap-2 px-3 py-1 bg-background/80 backdrop-blur-md rounded-full border border-white/10">
                    <GitBranch className="w-3 h-3 text-glow-blue" />
                    <span className="text-[9px] text-white font-mono uppercase tracking-widest font-bold">GRAPH_TRAVERSAL_ACTIVE</span>
                 </div>
              </div>
              
              <button className="absolute top-6 right-6 z-10 p-2 bg-background/80 backdrop-blur-md rounded-xl border border-white/10 hover:bg-white/5 transition-all">
                 <Maximize2 className="w-4 h-4 text-slate-400" />
              </button>

              {/* Graph Visualization Mock */}
              <div className="w-full h-full bg-white/[0.01] border border-white/5 border-dashed rounded-2xl relative flex items-center justify-center">
                 <div className="absolute inset-0 z-0">
                    {/* Mock SVG Graph Lines */}
                    <svg className="w-full h-full opacity-20">
                       <line x1="30%" y1="50%" x2="50%" y2="50%" stroke="currentColor" strokeWidth="1" strokeDasharray="4" className="text-glow-blue" />
                       <line x1="50%" y1="50%" x2="70%" y2="30%" stroke="currentColor" strokeWidth="1" strokeDasharray="4" className="text-critical" />
                       <line x1="50%" y1="50%" x2="70%" y2="70%" stroke="currentColor" strokeWidth="1" strokeDasharray="4" className="text-success" />
                    </svg>
                 </div>
                 
                 {/* Floating Nodes */}
                 <div className="relative z-10 flex gap-24 items-center">
                    <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity }} className="w-16 h-16 bg-glow-blue/20 border border-glow-blue/50 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                       <Box className="w-8 h-8 text-glow-blue" />
                    </motion.div>
                    <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 5, repeat: Infinity }} className="w-20 h-20 bg-critical/20 border border-critical/50 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.2)] relative">
                       <Zap className="w-10 h-10 text-critical" />
                       <div className="absolute -top-2 -right-2 w-6 h-6 bg-critical text-white rounded-full flex items-center justify-center text-[10px] font-bold">!</div>
                    </motion.div>
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 3, repeat: Infinity }} className="w-16 h-16 bg-success/20 border border-success/50 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.2)]">
                       <ShieldCheck className="w-8 h-8 text-success" />
                    </motion.div>
                 </div>

                 <p className="absolute bottom-12 text-[10px] text-slate-600 uppercase font-mono tracking-[0.3em]">Neural_Dependency_Weighting...</p>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="glass-panel border border-white/10 rounded-2xl p-6">
                 <h4 className="font-header text-[10px] text-slate-400 uppercase tracking-widest mb-4">Critical Path Summary</h4>
                 <div className="space-y-3">
                    {[
                      { label: 'Longest Dependency Chain', val: '4 Nodes' },
                      { label: 'Single Points of Failure', val: '3 Detected' },
                      { label: 'Network Redundancy', val: '64%' },
                    ].map((stat, i) => (
                      <div key={i} className="flex justify-between items-center text-[10px]">
                         <span className="text-slate-500 uppercase tracking-tighter">{stat.label}</span>
                         <span className="text-white font-mono">{stat.val}</span>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="glass-panel border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
                 <div>
                    <h4 className="font-header text-[10px] text-slate-400 uppercase tracking-widest mb-4">AI Sourcing Recommendation</h4>
                    <p className="text-[10px] text-slate-400 leading-relaxed italic">
                       "Supplier-492 has 85% dependency weight for Tier-1 flow. Diversifying to Node-104 reduces single-point failure risk by 28%."
                    </p>
                 </div>
                 <button className="w-full py-2 bg-glow-blue/10 border border-glow-blue/20 rounded-lg text-[9px] font-bold text-glow-blue uppercase tracking-widest hover:bg-glow-blue/20 transition-all">
                    Generate Redundancy Plan
                 </button>
              </div>
           </div>
        </div>

        {/* Node Details / List */}
        <div className="lg:col-span-4 space-y-8">
           <div className="glass-panel border border-white/10 rounded-3xl p-8 h-full">
              <h3 className="font-header text-sm text-white uppercase tracking-widest mb-8 flex items-center gap-2">
                 <GitBranch className="w-4 h-4 text-glow-blue" /> Relationship Feed
              </h3>
              
              <div className="space-y-4">
                 {dependencies.map((dep, i) => (
                   <div 
                     key={i} 
                     className={`p-4 border rounded-2xl cursor-pointer transition-all bg-white/5 border-white/5 hover:bg-white/[0.08] group`}
                   >
                      <div className="flex justify-between items-center mb-3">
                         <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-white uppercase tracking-tighter">{dep.from}</span>
                            <ChevronRight className="w-3 h-3 text-slate-600" />
                            <span className="text-[10px] font-bold text-glow-blue uppercase tracking-tighter">{dep.to}</span>
                         </div>
                         <span className={`text-[8px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded border ${
                            dep.status === 'Critical' ? 'text-critical border-critical/30 bg-critical/10' :
                            dep.status === 'Warning' ? 'text-warning border-warning/30 bg-warning/10' :
                            'text-success border-success/30 bg-success/10'
                         }`}>{dep.status}</span>
                      </div>
                      <div className="flex items-center justify-between">
                         <div className="text-[9px] text-slate-500 font-mono uppercase">Tier {dep.tier} Dependency</div>
                         <div className="text-[9px] text-slate-300 font-mono uppercase">Weight: {dep.weight}%</div>
                      </div>
                      <div className="mt-2 h-1 bg-white/5 rounded-full overflow-hidden">
                         <motion.div initial={{ width: 0 }} animate={{ width: `${dep.weight}%` }} className={`h-full ${dep.status === 'Critical' ? 'bg-critical' : 'bg-glow-blue'}`} />
                      </div>
                   </div>
                 ))}
              </div>

              <button className="w-full py-4 mt-8 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-white hover:bg-white/5 transition-all">
                 Full Graph Audit (Temporal)
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
