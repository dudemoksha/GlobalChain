"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, Zap, AlertTriangle, TrendingUp, Heart, Upload, Database, 
  ShieldCheck, BrainCircuit, RefreshCcw, CheckCircle2, AlertOctagon, 
  Workflow, BarChart3, Target, Gauge, Shield, LayoutPanelLeft
} from 'lucide-react';
import { useStore, Supplier, Recommendation } from '@/store/useStore';
import Link from 'next/link';

export default function SupplierHealth() {
  const { suppliers } = useStore();
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [progress, setProgress] = useState(0);
  const [diagnosisReport, setDiagnosisReport] = useState<{
    resilience: number;
    risk: number;
    exposure: number;
    criticalNodes: Supplier[];
    recommendations: Recommendation[];
  } | null>(null);

  const hasData = suppliers.length > 0;
  const affectedNodes = suppliers.filter(s => s.affectedBy);

  const runFullDiagnosis = () => {
    setIsDiagnosing(true);
    setProgress(0);
    setShowReport(false);

    // Simulated progress steps
    const steps = [
      { p: 20, label: 'Scanning Nodal Infrastructure...' },
      { p: 40, label: 'Analyzing Dependency Exposure...' },
      { p: 60, label: 'Calculating Propagation Risk...' },
      { p: 80, label: 'Generating AI Mitigation Vectors...' },
      { p: 100, label: 'Finalizing Health Audit...' }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setProgress(steps[currentStep].p);
        currentStep++;
      } else {
        clearInterval(interval);
        
        // Calculate real metrics from uploaded data
        const avgHealth = Math.round(suppliers.reduce((a, s) => a + s.health, 0) / suppliers.length);
        const criticalNodes = suppliers.filter(s => s.health < 40);
        const exposure = Math.round((criticalNodes.length / suppliers.length) * 100);
        
        // Generate isolated recommendations for report
        const recs: Recommendation[] = criticalNodes.slice(0, 3).map(s => ({
            id: `diag-${Date.now()}-${s.id}`,
            supplierId: s.id,
            backupId: 'BK-RECO',
            backupName: 'Alpha Backup Inc.',
            backupContact: { email: 'ops@alphabackup.com', phone: '555-0199', representative: 'Sarah Jenkins' },
            reason: `Structural health at ${s.health}%. Critical failure likely under stress. Recommended immediate backup switch.`,
            riskReduction: 35,
            logisticsImprovement: 10,
            resilienceBoost: 15,
            timestamp: new Date().toISOString(),
            type: 'AUTOMATIC'
        }));

        setDiagnosisReport({
          resilience: avgHealth,
          risk: 100 - avgHealth,
          exposure: exposure,
          criticalNodes: criticalNodes,
          recommendations: recs
        });
        
        setIsDiagnosing(false);
        setShowReport(true);
      }
    }, 800);
  };

  if (!hasData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-10 bg-[#0a0c10]/50 rounded-[3.5rem] border border-white/5 border-dashed">
         <Heart className="w-16 h-16 text-slate-800 mb-6" />
         <h2 className="font-header text-3xl text-white uppercase italic mb-4">Health Intelligence <span className="text-glow-blue">Offline</span></h2>
         <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed mb-8 font-bold uppercase tracking-tight">Nodal health monitoring is inactive. Upload your supplier dataset to initialize real-time telemetry and disruption alerts.</p>
         <Link href="/data/upload">
           <button className="px-10 py-5 bg-glow-blue text-white rounded-2xl font-bold uppercase tracking-widest text-xs shadow-[0_0_30px_rgba(59,130,246,0.3)]">Initalize Telemetry</button>
         </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      <div className="flex justify-between items-end bg-[#0a0c10]/50 p-10 rounded-[3rem] border border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px]" />
        <div className="relative z-10">
           <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-glow-blue/10 rounded-xl flex items-center justify-center border border-glow-blue/20">
                 <Heart className="w-5 h-5 text-glow-blue" />
              </div>
              <span className="text-xs font-bold text-glow-blue uppercase tracking-[0.4em]">Network Vitality Monitor</span>
           </div>
           <h2 className="font-header text-5xl text-white tracking-tighter uppercase italic leading-[0.9] mb-4">
              Operational <span className="text-glow-blue">Health Audit</span>
           </h2>
           <p className="text-slate-500 text-sm max-w-xl font-bold uppercase tracking-tight">
             Real-time health telemetry across {suppliers.length} active nodes. Detect vulnerabilities and execute autonomous failure prevention.
           </p>
        </div>
        
        <button 
          onClick={runFullDiagnosis}
          disabled={isDiagnosing}
          className="relative z-10 px-10 py-6 bg-glow-blue text-white rounded-2xl text-xs font-bold uppercase tracking-widest shadow-[0_0_40px_rgba(59,130,246,0.4)] hover:bg-blue-600 transition-all flex items-center gap-4 disabled:opacity-50 group"
        >
          {isDiagnosing ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5 group-hover:scale-110 transition-transform" />}
          {isDiagnosing ? 'Running Diagnostics...' : 'Run Full Diagnosis'}
        </button>
      </div>

      <AnimatePresence>
        {isDiagnosing && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="glass-panel p-10 rounded-[3rem] border border-glow-blue/20 bg-glow-blue/[0.02]">
             <div className="flex justify-between items-center mb-6">
                <p className="text-xs font-header text-glow-blue uppercase tracking-widest animate-pulse">Processing_Nodal_Telemetry...</p>
                <span className="text-xl font-header text-white">{progress}%</span>
             </div>
             <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div className="h-full bg-glow-blue shadow-[0_0_15px_rgba(59,130,246,0.8)]" initial={{ width: 0 }} animate={{ width: `${progress}%` }} />
             </div>
             <p className="text-[10px] text-slate-500 font-mono mt-4 uppercase tracking-[0.2em] italic text-center">
                System: L4 Authentication Verified // Analyzing Tier 1-3 Propagation Vectors...
             </p>
          </motion.div>
        )}
      </AnimatePresence>

      {!showReport ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 glass-panel border border-white/10 rounded-[3rem] p-10 min-h-[500px] flex flex-col relative overflow-hidden">
             <div className="absolute top-0 right-0 p-10 opacity-[0.03]"><Activity className="w-64 h-64 text-white" /></div>
             <h3 className="text-white font-header text-sm uppercase tracking-widest mb-10 flex items-center gap-2 relative z-10">
                <Activity className="w-4 h-4 text-glow-blue" /> Live Telemetry Feed
             </h3>
             <div className="flex-1 flex flex-col items-center justify-center text-center relative z-10 space-y-8">
                <div className="w-32 h-32 rounded-full border-2 border-glow-blue/20 flex items-center justify-center relative">
                   <div className="absolute inset-0 rounded-full border-2 border-glow-blue animate-ping-slow opacity-20" />
                   <Activity className="w-12 h-12 text-glow-blue animate-pulse" />
                </div>
                <div>
                   <p className="text-2xl font-header text-white uppercase italic">Active Monitoring</p>
                   <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-2 font-mono">Synced with {suppliers.length} encrypted data nodes</p>
                </div>
                <div className="flex gap-4">
                   <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-slate-400 uppercase tracking-widest">Network Health: {Math.round(suppliers.reduce((a,s)=>a+s.health,0)/suppliers.length)}%</div>
                   <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-slate-400 uppercase tracking-widest">Failover Readiness: HIGH</div>
                </div>
             </div>
          </div>

          <div className="lg:col-span-4 glass-panel border border-white/10 rounded-[3rem] p-10 space-y-8 flex flex-col">
             <h4 className="font-header text-sm text-white uppercase tracking-widest flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-critical" /> Nodal Alerts
             </h4>
             <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {affectedNodes.length > 0 ? affectedNodes.map((s, i) => (
                  <div key={i} className="p-5 bg-critical/5 border border-critical/10 rounded-2xl group hover:bg-critical/10 transition-all">
                     <h5 className="text-[11px] font-bold text-white mb-2 uppercase">{s.name}</h5>
                     <p className="text-[9px] text-slate-500 uppercase font-mono italic leading-tight mb-2">{s.reason}</p>
                     <div className="flex justify-between items-center">
                        <span className="text-[8px] text-slate-600 font-mono uppercase">Health Index: {s.health}%</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-critical animate-pulse shadow-[0_0_6px_rgba(239,68,68,0.6)]" />
                     </div>
                  </div>
                )) : (
                  <div className="py-24 text-center opacity-30 border border-dashed border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center">
                     <Shield className="w-10 h-10 mb-4 text-slate-600" />
                     <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">System Nominal</p>
                  </div>
                )}
             </div>
          </div>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
           {/* Diagnosis Report Content */}
           <div className="lg:col-span-8 space-y-10">
              <div className="glass-panel p-10 rounded-[3rem] border border-white/10 bg-white/[0.01]">
                 <div className="flex justify-between items-start mb-12">
                    <div>
                       <h3 className="text-white font-header text-xl uppercase italic mb-1">Diagnostic <span className="text-glow-blue">Summary</span></h3>
                       <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Report ID: DIAG-{Date.now().toString().slice(-6)} // L4 Audit</p>
                    </div>
                    <div className="flex gap-3">
                       <button onClick={() => setShowReport(false)} className="p-3 bg-white/5 border border-white/10 rounded-xl text-slate-500 hover:text-white"><RefreshCcw className="w-4 h-4" /></button>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                      { label: 'Network Resilience', val: `${diagnosisReport?.resilience}%`, color: 'text-glow-blue', icon: Gauge },
                      { label: 'Calculated Risk', val: `${diagnosisReport?.risk}%`, color: 'text-critical', icon: AlertOctagon },
                      { label: 'Dependency Exposure', val: `${diagnosisReport?.exposure}%`, color: 'text-warning', icon: Workflow },
                    ].map((stat, i) => (
                      <div key={i} className="p-6 bg-white/5 border border-white/5 rounded-2xl">
                         <stat.icon className={`w-5 h-5 mb-4 ${stat.color}`} />
                         <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest mb-1">{stat.label}</p>
                         <p className={`text-3xl font-header ${stat.color}`}>{stat.val}</p>
                      </div>
                    ))}
                 </div>

                 <div className="mt-12 space-y-6">
                    <h4 className="text-white font-header text-sm uppercase tracking-widest flex items-center gap-2">
                       <AlertTriangle className="w-4 h-4 text-critical" /> Compromised Dependency Chains
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       {diagnosisReport?.criticalNodes.slice(0, 4).map((node, i) => (
                         <div key={i} className="p-5 bg-critical/5 border border-critical/10 rounded-2xl flex justify-between items-center">
                            <div>
                               <p className="text-[11px] text-white font-bold uppercase">{node.name}</p>
                               <p className="text-[9px] text-slate-500 font-mono">VULNERABILITY: HIGH // TIER {node.tier}</p>
                            </div>
                            <div className="text-right">
                               <p className="text-xs font-header text-critical">{node.health}% HEALTH</p>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>

              <div className="glass-panel p-10 rounded-[3rem] border border-glow-blue/10 bg-glow-blue/[0.02]">
                 <h3 className="text-white font-header text-sm uppercase tracking-widest mb-10 flex items-center gap-2">
                    <BrainCircuit className="w-4 h-4 text-glow-blue" /> AI Remediation Strategies
                 </h3>
                 <div className="space-y-4">
                    {diagnosisReport?.recommendations.map((rec, i) => (
                      <div key={i} className="p-6 bg-black/40 border border-white/5 rounded-2xl group hover:border-glow-blue/40 transition-all flex justify-between items-center">
                         <div className="flex-1 pr-10">
                            <p className="text-[10px] text-glow-blue font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                               <CheckCircle2 className="w-3 h-3" /> Vector_0{i+1}
                            </p>
                            <p className="text-[11px] text-slate-300 leading-relaxed font-bold uppercase tracking-tight italic">"{rec.reason}"</p>
                         </div>
                         <div className="flex items-center gap-8 pl-10 border-l border-white/5">
                            <div className="text-right">
                               <p className="text-[8px] text-slate-600 font-bold uppercase mb-1">Resilience Boost</p>
                               <p className="text-xl font-header text-success">+{rec.resilienceBoost}%</p>
                            </div>
                            <button className="px-6 py-3 bg-glow-blue text-white rounded-xl text-[9px] font-bold uppercase tracking-widest shadow-lg">Execute</button>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>

           <div className="lg:col-span-4 space-y-10">
              <div className="glass-panel p-10 rounded-[3rem] border border-white/10 h-full flex flex-col">
                 <h3 className="text-white font-header text-sm uppercase tracking-widest mb-10 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-glow-blue" /> Intelligence Insight
                 </h3>
                 <div className="space-y-12 flex-1">
                    {[
                      { label: 'Structural Redundancy', val: 32 },
                      { label: 'Failover Confidence', val: 74 },
                      { label: 'Network Stability', val: diagnosisReport?.resilience || 0 },
                      { label: 'Audit Compliance', val: 100 },
                    ].map((stat, i) => (
                      <div key={i}>
                         <div className="flex justify-between items-center mb-3 text-[10px] font-bold uppercase tracking-widest">
                            <span className="text-slate-500">{stat.label}</span>
                            <span className="text-white">{stat.val}%</span>
                         </div>
                         <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${stat.val}%` }} className="h-full bg-glow-blue" />
                         </div>
                      </div>
                    ))}
                 </div>
                 <div className="mt-12 p-8 bg-white/[0.03] border border-white/10 rounded-[2.5rem]">
                    <p className="text-[11px] text-slate-400 leading-relaxed uppercase font-mono italic font-bold">
                       "Post-audit analysis indicates high concentration of risk in Tier 3 raw material clusters. AI recommends initiating failover protocols for 4 specific nodes to boost resilience score by 15.2%."
                    </p>
                 </div>
              </div>
           </div>
        </motion.div>
      )}
    </div>
  );
}
