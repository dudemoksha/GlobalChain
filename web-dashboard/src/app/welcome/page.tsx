"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Globe, Shield, Zap, ArrowRight, Activity, Terminal } from 'lucide-react';

export default function WelcomeScreen() {
  const router = useRouter();

  const pillars = [
    { icon: Globe, title: 'Global Visualization', desc: 'Real-time 3D monitoring of every node in your supply chain.' },
    { icon: Zap, title: 'Propagation Logic', desc: 'Predictive intelligence to calculate cascading risk impacts.' },
    { icon: Shield, title: 'Tier Privacy', desc: 'Identity masking for Tier 2 and Tier 3 suppliers.' },
  ];

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-glow-blue/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-glow-blue/20 rounded-xl flex items-center justify-center border border-glow-blue/30 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
               <Shield className="w-5 h-5 text-glow-blue" />
            </div>
            <span className="text-xs font-bold text-glow-blue uppercase tracking-[0.4em]">Intelligence Matrix</span>
          </div>
          
          <h1 className="font-header text-7xl text-white tracking-tighter uppercase italic mb-8 leading-[0.9]">
            The Future of <span className="text-glow-blue">Supply Chain</span> Resilience.
          </h1>
          
          <p className="text-lg text-slate-400 mb-12 max-w-xl leading-relaxed">
            Harness the power of graph-based intelligence to predict disruptions, protect partner identities, and automate global resilience protocols.
          </p>

          <div className="flex gap-6">
            <button 
              onClick={() => router.push('/auth/login')}
              className="px-8 py-5 bg-glow-blue hover:bg-blue-600 text-white font-header text-xs uppercase tracking-widest rounded-2xl transition-all shadow-[0_0_30px_rgba(59,130,246,0.3)] flex items-center gap-3"
            >
              Initialize System <ArrowRight className="w-4 h-4" />
            </button>
            <button 
              onClick={() => router.push('/admin-portal')}
              className="px-8 py-5 bg-white/5 hover:bg-white/10 text-white font-header text-xs uppercase tracking-widest rounded-2xl transition-all border border-white/10 flex items-center gap-3"
            >
              Admin Access <Terminal className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-6">
          {pillars.map((pillar, i) => (
            <motion.div
              key={i}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 * i, duration: 0.8 }}
              className="glass-panel p-8 rounded-3xl border border-white/10 group hover:border-glow-blue/50 transition-all cursor-pointer relative overflow-hidden"
            >
               <div className="absolute top-0 right-0 w-24 h-24 bg-glow-blue/5 rounded-bl-full flex items-center justify-center translate-x-4 -translate-y-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Activity className="text-glow-blue w-8 h-8 opacity-20" />
               </div>
               <div className="flex items-start gap-6">
                 <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-slate-500 group-hover:text-glow-blue group-hover:bg-glow-blue/10 transition-all border border-white/10 group-hover:border-glow-blue/30">
                    <pillar.icon className="w-6 h-6" />
                 </div>
                 <div>
                   <h3 className="text-white font-header text-xl uppercase italic mb-2">{pillar.title}</h3>
                   <p className="text-sm text-slate-500 leading-relaxed max-w-sm">{pillar.desc}</p>
                 </div>
               </div>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-12 flex items-center gap-8 text-[10px] text-slate-600 font-bold uppercase tracking-[0.2em]"
      >
        <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-success" /> End-to-End Encryption</span>
        <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-success" /> Global Node Mesh</span>
        <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-success" /> 99.9% Uptime SLA</span>
      </motion.div>
    </div>
  );
}
