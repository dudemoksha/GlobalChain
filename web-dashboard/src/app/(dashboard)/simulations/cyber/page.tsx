"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldAlert, Shield, Lock, Unlock, Terminal, 
  Network, Cpu, Zap, AlertCircle,
  Eye, EyeOff, Key, Server, Bug
} from 'lucide-react';

export default function CyberSimulationPage() {
  const [breachLevel, setBreachLevel] = useState(42);

  return (
    <div className="space-y-8 font-mono">
      {/* Simulation Header */}
      <div className="flex justify-between items-start border-b border-critical/20 pb-8">
        <div>
           <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-critical/10 rounded-xl flex items-center justify-center border border-critical/20 animate-pulse">
                 <ShieldAlert className="w-5 h-5 text-critical" />
              </div>
              <span className="text-xs font-bold text-critical uppercase tracking-[0.4em]">Infiltration Stress Protocol</span>
           </div>
           <h2 className="font-header text-5xl text-white tracking-tighter uppercase italic leading-[0.9] mb-4">
              Network <span className="text-critical">Hardening</span> Simulation
           </h2>
           <p className="text-slate-500 text-sm max-w-xl font-mono uppercase tracking-tight">Simulating coordinated ransomware and DDoS vectors against the GlobalChain node mesh and partner API gateways.</p>
        </div>
        
        <div className="flex gap-4">
           <div className="px-8 py-6 bg-critical/5 border border-critical/20 rounded-3xl flex flex-col items-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-critical to-transparent animate-scan" />
              <p className="text-[9px] text-critical/50 uppercase font-bold tracking-widest mb-1">Threat Level</p>
              <p className="text-3xl font-header text-critical">CLASS 4</p>
              <div className="flex items-center gap-1 text-[10px] font-bold text-critical mt-1 uppercase">
                 <AlertCircle className="w-3 h-3" /> Compromised
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         {/* Network Node Viewport */}
         <div className="lg:col-span-2 glass-panel p-8 rounded-[3rem] border border-critical/10 bg-black/40 relative h-[600px] overflow-hidden">
            <div className="absolute top-0 left-0 p-6 flex items-center gap-3">
               <Terminal className="w-4 h-4 text-critical" />
               <span className="text-[10px] text-critical font-bold uppercase tracking-widest">Live_Infiltration_Map</span>
            </div>

            {/* Simulated Node Mesh */}
            <div className="relative w-full h-full flex items-center justify-center">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.05)_0%,transparent_70%)]" />
               
               {/* Center Node */}
               <motion.div 
                 animate={{ scale: [1, 1.1, 1], rotate: 360 }}
                 transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                 className="w-48 h-48 border border-critical/30 rounded-full flex items-center justify-center border-dashed"
               >
                  <div className="w-32 h-32 bg-critical/5 border border-critical/50 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(239,68,68,0.2)]">
                     <Lock className="w-10 h-10 text-critical" />
                  </div>
               </motion.div>

               {/* Satellite Nodes */}
               {[...Array(8)].map((_, i) => (
                 <motion.div
                   key={i}
                   className="absolute"
                   initial={{ rotate: i * 45 }}
                   animate={{ rotate: (i * 45) + 360 }}
                   transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                   style={{ transformOrigin: 'center center', width: '400px' }}
                 >
                    <div 
                      className={`w-6 h-6 rounded-lg ml-auto mr-0 flex items-center justify-center border ${
                        i % 3 === 0 ? 'bg-critical border-critical shadow-[0_0_15px_rgba(239,68,68,0.6)]' : 'bg-black border-white/20'
                      }`}
                    >
                       <Bug className={`w-3 h-3 ${i % 3 === 0 ? 'text-white' : 'text-slate-600'}`} />
                    </div>
                 </motion.div>
               ))}
            </div>

            {/* Bottom Terminal Feed */}
            <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black to-transparent">
               <div className="space-y-1 font-mono text-[10px] text-critical/60">
                  <p>{'>'} INJECTING PACKET_VOIDS INTO NODE_SHANGHAI_A1...</p>
                  <p>{'>'} BYPASSING PARTNER_FIREWALL_v2.4 [SUCCESS]</p>
                  <p className="text-white/80 animate-pulse">{'>'} COMPROMISING TIER 2 API KEYS [42% COMPLETE]</p>
               </div>
            </div>
         </div>

         {/* Attack Controls */}
         <div className="space-y-8">
            <div className="glass-panel p-10 rounded-[3rem] border border-critical/10 h-full flex flex-col justify-between">
               <div>
                  <h3 className="text-white font-header text-sm uppercase tracking-widest mb-10 flex items-center gap-2">
                     <Zap className="w-4 h-4 text-critical" /> Attack Vectors
                  </h3>
                  
                  <div className="space-y-10">
                     {[
                       { label: 'Ransomware Propagation', val: 74, color: 'bg-critical' },
                       { label: 'DDoS Intensity', val: 88, color: 'bg-critical' },
                       { label: 'Key Extraction Rate', val: 32, color: 'bg-white/20' },
                     ].map((stat, i) => (
                       <div key={i}>
                          <div className="flex justify-between items-center mb-3">
                             <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tight">{stat.label}</span>
                             <span className="text-xs font-bold text-white font-mono">{stat.val}%</span>
                          </div>
                          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                             <motion.div 
                               initial={{ width: 0 }}
                               animate={{ width: `${stat.val}%` }}
                               className={`h-full ${stat.color} shadow-[0_0_10px_rgba(239,68,68,0.5)]`}
                             />
                          </div>
                       </div>
                     ))}
                  </div>
               </div>

               <div className="mt-12 space-y-4">
                  <button className="w-full py-5 bg-critical text-white font-header text-xs uppercase tracking-widest rounded-2xl transition-all shadow-[0_0_30px_rgba(239,68,68,0.3)] flex items-center justify-center gap-3">
                     <Bug className="w-4 h-4" /> Initiate Breach
                  </button>
                  <button className="w-full py-5 border border-critical/30 text-critical font-header text-xs uppercase tracking-widest rounded-2xl transition-all hover:bg-critical/5 flex items-center justify-center gap-3">
                     <Shield className="w-4 h-4" /> Patch Vulnerability
                  </button>
               </div>

               <div className="mt-8 p-6 bg-white/[0.02] border border-white/5 rounded-3xl text-[10px] text-slate-600 font-mono italic">
                  WARNING: This simulation uses real network signatures to test actual partner gateway resilience. Unauthorized use is prohibited.
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
