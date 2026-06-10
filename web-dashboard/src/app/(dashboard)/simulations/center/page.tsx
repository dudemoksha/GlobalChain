"use client";

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, AlertTriangle, Shield, Play, RotateCcw, Info, Settings, Activity, 
  ChevronRight, Globe, Layers, MapPin, Target, Clock, Radio, BarChart3, 
  ArrowRight, ShieldAlert, Droplets, Flame, Anchor, TrendingDown,
  DollarSign, Truck, History, LayoutPanelLeft, Box, X, BrainCircuit,
  AlertOctagon, CheckCircle2
} from 'lucide-react';
import { useStore, Simulation, Supplier } from '@/store/useStore';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const SimulationGlobe = dynamic(() => import('@/components/SimulationGlobe'), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-black/20 flex items-center justify-center rounded-[3rem] border border-white/5 border-dashed">
    <div className="flex flex-col items-center gap-4 text-slate-600">
      <div className="w-10 h-10 border-2 border-slate-700 border-t-glow-blue rounded-full animate-spin" />
      <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Calibrating War Room Globe...</span>
    </div>
  </div>
});

const SCENARIOS = [
  { id: 'Disaster', label: 'Natural Disaster', icon: Droplets, color: 'text-blue-400' },
  { id: 'Conflict', label: 'Geopolitical Conflict', icon: Globe, color: 'text-purple-400' },
  { id: 'Cyber', label: 'Cyber Infrastructure Attack', icon: ShieldAlert, color: 'text-red-500' },
  { id: 'Logistics', label: 'Major Port Shutdown', icon: Anchor, color: 'text-cyan-400' },
  { id: 'Industrial', label: 'Industrial Accident', icon: Flame, color: 'text-orange-500' },
];

export default function SimulationCenterPage() {
  const { suppliers, runSimulation, clearSimulation, activeSimulation, simulationHistory, userRole } = useStore();
  
  const [selectedType, setSelectedType] = useState(SCENARIOS[0].id);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [severity, setSeverity] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('Medium');
  const [radius, setRadius] = useState(800);
  const [duration, setDuration] = useState('1 Month');
  const [showHistory, setShowHistory] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Extract unique cities from suppliers for the dropdown
  const cities = useMemo(() => {
    const cityMap: Record<string, { lat: number; lng: number }> = {};
    suppliers.forEach(s => {
      if (s.city) {
        if (!cityMap[s.city]) cityMap[s.city] = { lat: s.lat, lng: s.lng };
      } else {
        const regionName = `${s.category} Cluster`;
        if (!cityMap[regionName]) cityMap[regionName] = { lat: s.lat, lng: s.lng };
      }
    });
    return Object.entries(cityMap).map(([name, coords]) => ({ name, ...coords }));
  }, [suppliers]);

  const handleRun = () => {
    setIsProcessing(true);
    const city = cities.find(c => c.name === selectedCity);
    const sim: Simulation = {
      id: `sim-${Date.now()}`,
      type: selectedType,
      locationName: selectedCity || 'Global Distribution',
      location: city ? { lat: city.lat, lng: city.lng } : undefined,
      severity,
      radius,
      duration,
      active: true,
      timestamp: new Date().toISOString(),
    };
    
    // Artificial delay for cinematic effect
    setTimeout(() => {
      runSimulation(sim);
      setIsProcessing(false);
    }, 2000);
  };

  if (suppliers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-10 bg-[#0a0c10]/50 rounded-[3.5rem] border border-white/5 border-dashed">
         <Radio className="w-16 h-16 text-slate-800 mb-6 animate-pulse" />
         <h2 className="font-header text-3xl text-white uppercase italic mb-4">Simulation Engine <span className="text-glow-blue">Offline</span></h2>
         <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed mb-8 font-bold uppercase tracking-tight">
           No supply chain data detected. Ingest a dataset via the Data Engine to activate the high-fidelity stress test environment.
         </p>
         <button onClick={() => window.location.href = '/data/upload'} className="px-10 py-5 bg-glow-blue text-white rounded-2xl font-bold uppercase tracking-widest text-xs shadow-[0_0_30px_rgba(59,130,246,0.3)]">
           Initialize Ingestion
         </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Simulation Command Header */}
      <div className="flex justify-between items-end bg-[#0a0c10]/70 p-12 rounded-[3.5rem] border border-white/10 relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4 text-glow-blue">
             <Radio className="w-5 h-5 animate-pulse" />
             <span className="text-xs font-bold uppercase tracking-[0.5em]">Real-Time War Room Interface</span>
          </div>
          <h2 className="font-header text-6xl text-white tracking-tighter uppercase italic leading-[0.8] mb-4">
            Stress <span className="text-glow-blue">Simulation Lab</span>
          </h2>
          <p className="text-slate-500 text-sm max-w-2xl leading-relaxed font-bold uppercase tracking-tight">
            Execute isolated high-fidelity stress tests on the global supply graph. Forecast cascading impacts, financial exposure, and logistics bottlenecks without affecting operational data.
          </p>
        </div>
        
        <div className="flex items-center gap-4 relative z-10">
           <button 
             onClick={() => setShowHistory(true)}
             className="px-8 py-5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-3"
           >
              <History className="w-4 h-4" /> View History
           </button>
           <button 
             onClick={clearSimulation}
             className="px-8 py-5 bg-critical/10 border border-critical/20 rounded-2xl text-[10px] font-bold text-critical uppercase tracking-widest hover:bg-critical/20 transition-all flex items-center gap-3"
           >
              <RotateCcw className="w-4 h-4" /> Purge Active Sim
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Isolated Simulation Configuration */}
        <div className="lg:col-span-4 space-y-8">
           <div className="glass-panel p-10 rounded-[3rem] border border-white/10 flex flex-col gap-8 relative overflow-hidden">
              {isProcessing && (
                <div className="absolute inset-0 z-20 bg-[#0a0c10]/90 backdrop-blur-sm flex flex-col items-center justify-center gap-6">
                   <div className="w-16 h-16 border-2 border-glow-blue border-t-transparent rounded-full animate-spin" />
                   <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-glow-blue animate-pulse">Calculating Propagation Matrix...</p>
                </div>
              )}
              
              <h3 className="text-white font-header text-sm uppercase tracking-widest flex items-center gap-2">
                 <Settings className="w-4 h-4 text-glow-blue" /> Vector parameters
              </h3>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest ml-1">Scenario Prototype</label>
                  <div className="grid grid-cols-5 gap-2">
                    {SCENARIOS.map(s => (
                      <button 
                        key={s.id} 
                        onClick={() => setSelectedType(s.id)}
                        className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${selectedType === s.id ? 'bg-glow-blue/20 border-glow-blue text-white' : 'bg-white/5 border-white/10 text-slate-500 hover:bg-white/10'}`}
                      >
                        <s.icon className="w-5 h-5" />
                        <span className="text-[8px] font-bold uppercase tracking-tighter text-center">{s.label.split(' ')[0]}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest ml-1">Epicenter City</label>
                  <select 
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-xs text-white focus:outline-none focus:border-glow-blue font-bold uppercase tracking-widest appearance-none"
                  >
                    <option value="" className="bg-[#020617]">Global Pulse Mode</option>
                    {cities.map(c => (
                       <option key={c.name} value={c.name} className="bg-[#020617]">{c.name} (Supplier Cluster)</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest ml-1">Severity Level</label>
                    <select value={severity} onChange={(e)=>setSeverity(e.target.value as any)} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-glow-blue font-bold uppercase tracking-widest appearance-none">
                      {['Low', 'Medium', 'High', 'Critical'].map(v => <option key={v} value={v} className="bg-[#020617]">{v}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest ml-1">Projected Time</label>
                    <select value={duration} onChange={(e)=>setDuration(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-glow-blue font-bold uppercase tracking-widest appearance-none">
                      {['1 Week', '2 Weeks', '1 Month', '3 Months'].map(v => <option key={v} value={v} className="bg-[#020617]">{v}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                   <div className="flex justify-between items-center px-1">
                      <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Impact Radius</label>
                      <span className="text-xs font-mono text-glow-blue font-bold">{radius}km</span>
                   </div>
                   <input type="range" min="100" max="5000" step="100" value={radius} onChange={(e)=>setRadius(parseInt(e.target.value))} className="w-full h-1 bg-white/5 rounded-full appearance-none cursor-pointer accent-glow-blue" />
                </div>
              </div>

              <button 
                onClick={handleRun}
                className="w-full py-6 bg-glow-blue hover:bg-blue-600 text-white font-header text-sm uppercase tracking-widest rounded-2xl transition-all shadow-[0_0_30px_rgba(59,130,246,0.4)] flex items-center justify-center gap-4 mt-4"
              >
                 <Play className="w-5 h-5 fill-current" /> Initialize Stress Test
              </button>
           </div>

           {/* Propagation Analysis Feed */}
           <AnimatePresence>
             {activeSimulation && activeSimulation.simulatedSuppliers && (
               <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-panel p-8 rounded-[3rem] border border-white/10 max-h-[600px] flex flex-col">
                  <h3 className="text-white font-header text-sm uppercase tracking-widest mb-8 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-critical" /> Disruption Propagation
                  </h3>
                  <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                    {activeSimulation.simulatedSuppliers.filter(s => s.health < 100).sort((a,b)=>a.health-b.health).map((s, i) => (
                      <div key={i} className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl group hover:border-glow-blue/30 transition-all">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-white font-header text-base uppercase italic leading-none">{userRole === 'MainCompany' && s.tier > 1 ? `Tier ${s.tier} Indirect Partner` : s.name}</h4>
                          <span className={`text-[8px] font-bold px-2 py-0.5 rounded ${s.health < 40 ? 'bg-critical text-white' : 'bg-warning text-black'}`}>{s.health < 40 ? 'CRITICAL' : 'WARNING'}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-mono uppercase italic leading-relaxed">{s.reason}</p>
                        <div className="flex items-center gap-4 mt-4">
                          <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                            <motion.div initial={{ width: '100%' }} animate={{ width: `${s.health}%` }} className={`h-full ${s.health < 40 ? 'bg-critical' : 'bg-warning'}`} />
                          </div>
                          <span className="text-[10px] font-mono text-white">{s.health}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
               </motion.div>
             )}
           </AnimatePresence>
        </div>

        {/* Dynamic Simulation Intelligence Globe & Analytics */}
        <div className="lg:col-span-8 space-y-10">
           <div className="h-[650px] relative">
              <SimulationGlobe />
              
              {/* Overlay Analytics (Dynamic) */}
              <AnimatePresence>
                {activeSimulation && activeSimulation.impactReport && (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="absolute bottom-10 left-10 right-10 grid grid-cols-4 gap-6 pointer-events-none">
                     {[
                       { label: 'Network Resilience', val: `${activeSimulation.impactReport.resilienceScore}%`, icon: Shield, color: 'text-glow-blue' },
                       { label: 'Nodes Impacted', val: activeSimulation.impactReport.totalAffected, icon: AlertTriangle, color: 'text-critical' },
                       { label: 'Financial Exposure', val: `$${(activeSimulation.impactReport.financialLoss / 1000000).toFixed(1)}M`, icon: DollarSign, color: 'text-warning' },
                       { label: 'Logistics Delay', val: activeSimulation.impactReport.logisticsDelay, icon: Truck, color: 'text-cyan-400' },
                     ].map((stat, i) => (
                       <div key={i} className="glass-panel p-6 rounded-[2.5rem] border border-white/10 backdrop-blur-3xl shadow-2xl flex flex-col items-center text-center pointer-events-auto group hover:scale-105 transition-all">
                          <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-3 ${stat.color}`}>
                             <stat.icon className="w-5 h-5" />
                          </div>
                          <p className="text-[8px] text-slate-500 uppercase font-bold tracking-widest mb-1">{stat.label}</p>
                          <p className="text-2xl font-header text-white">{stat.val}</p>
                       </div>
                     ))}
                  </motion.div>
                )}
              </AnimatePresence>
           </div>

           {/* AI Recommendation Engine Dashboard */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="glass-panel p-10 rounded-[3rem] border border-white/10 flex flex-col bg-glow-blue/[0.01]">
                 <div className="flex justify-between items-center mb-10">
                    <h3 className="text-white font-header text-sm uppercase tracking-widest flex items-center gap-2">
                       <BrainCircuit className="w-4 h-4 text-glow-blue" /> Simulation AI Mitigation
                    </h3>
                    {activeSimulation?.simulatedRecommendations?.length && (
                      <div className="px-3 py-1 bg-success/10 border border-success/20 rounded-full flex items-center gap-2">
                         <CheckCircle2 className="w-3 h-3 text-success" />
                         <span className="text-[8px] font-bold text-success uppercase">Staged</span>
                      </div>
                    )}
                 </div>
                 <div className="space-y-6 flex-1 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
                    {activeSimulation?.simulatedRecommendations?.length ? activeSimulation.simulatedRecommendations.map((rec, i) => (
                      <div key={i} className="p-6 bg-white/[0.03] border border-white/5 rounded-2xl relative group overflow-hidden hover:border-glow-blue/30 transition-all">
                        <div className="absolute top-0 right-0 p-4 opacity-[0.03]"><BrainCircuit className="w-12 h-12 text-glow-blue" /></div>
                        <div className="flex items-center gap-3 mb-4">
                           <div className="w-8 h-8 bg-glow-blue/10 rounded-lg flex items-center justify-center"><AlertOctagon className="w-4 h-4 text-glow-blue" /></div>
                           <div>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mb-1">Mitigation_Vector_0{i+1}</p>
                              <h4 className="text-[12px] text-glow-blue font-header uppercase italic">{rec.backupName}</h4>
                           </div>
                        </div>
                        <p className="text-[11px] text-white leading-relaxed font-bold uppercase tracking-tight mb-4 italic">
                           "{rec.reason}"
                        </p>
                        
                        {/* Contact Details */}
                        <div className="mb-6 p-4 bg-white/5 rounded-xl space-y-2 border border-white/5">
                           <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-tighter">
                              <span className="text-slate-500">Representative</span>
                              <span className="text-white">{rec.backupContact.representative}</span>
                           </div>
                           <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-tighter">
                              <span className="text-slate-500">Contact Email</span>
                              <span className="text-glow-blue">{rec.backupContact.email}</span>
                           </div>
                           <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-tighter">
                              <span className="text-slate-500">Direct Line</span>
                              <span className="text-white">{rec.backupContact.phone}</span>
                           </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                           <div>
                              <div className="text-[8px] text-slate-600 font-bold uppercase mb-1">Risk Reduction</div>
                              <div className="text-xl font-header text-success">-{rec.riskReduction}%</div>
                           </div>
                           <div className="text-right">
                              <div className="text-[8px] text-slate-600 font-bold uppercase mb-1">Logistics Opt.</div>
                              <div className="text-xl font-header text-glow-blue">+{rec.logisticsImprovement}%</div>
                           </div>
                        </div>
                        <button 
                           onClick={() => window.location.href = `/suppliers/backups?highlight=${rec.backupId}`}
                           className="w-full mt-6 py-3 bg-glow-blue hover:bg-blue-600 text-white font-bold uppercase tracking-widest text-[9px] rounded-xl transition-all shadow-lg"
                        >
                           Initialize Failover Protocol
                        </button>
                      </div>
                    )) : (
                      <div className="flex-1 flex flex-col items-center justify-center text-center opacity-30 py-20">
                         <LayoutPanelLeft className="w-12 h-12 text-slate-700 mb-6" />
                         <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest px-10 leading-relaxed">
                            Awaiting scenario execution to generate mitigation vectors.
                         </p>
                      </div>
                    )}
                 </div>
              </div>

              <div className="glass-panel p-10 rounded-[3rem] border border-white/10">
                 <h3 className="text-white font-header text-sm uppercase tracking-widest mb-10 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-glow-blue" /> Resiliency Intelligence
                 </h3>
                 <div className="space-y-12">
                   {[
                     { label: 'Supply Redundancy', val: activeSimulation ? 42 : 0, target: 80 },
                     { label: 'Nodal Diversification', val: activeSimulation ? 68 : 0, target: 90 },
                     { label: 'Logistics Buffer', val: activeSimulation ? 24 : 0, target: 50 },
                     { label: 'Operational Uptime', val: activeSimulation?.impactReport?.resilienceScore || 0, target: 100 },
                   ].map((stat, i) => (
                     <div key={i}>
                        <div className="flex justify-between items-center mb-3">
                           <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tight">{stat.label}</span>
                           <span className="text-lg font-header text-white">{stat.val}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden relative">
                           <motion.div initial={{ width: 0 }} animate={{ width: `${stat.val}%` }} className="h-full bg-glow-blue relative z-10" />
                           <div className="absolute top-0 bottom-0 border-l border-white/20 z-20" style={{ left: `${stat.target}%` }} />
                        </div>
                     </div>
                   ))}
                 </div>
                 
                 <div className="mt-16 p-8 bg-white/[0.03] border border-white/10 rounded-[2.5rem]">
                    <div className="flex items-center gap-3 mb-4">
                       <TrendingDown className="w-4 h-4 text-warning" />
                       <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Post-Scenario Insight</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed uppercase font-mono italic font-bold">
                       {activeSimulation 
                         ? "GlobalChain AI predicts high structural fragility in the selected cluster. Recovery without failover measures is estimated at 42 business days. Execution of mitigation vectors is critical."
                         : "Select a simulation vector to generate deep-layer operational forecasting and resilience estimations."}
                    </p>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* History Modal */}
      <AnimatePresence>
        {showHistory && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowHistory(false)} className="absolute inset-0 bg-black/80 backdrop-blur-xl" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="glass-panel w-full max-w-5xl h-[80vh] rounded-[4rem] border border-white/10 relative z-10 flex flex-col overflow-hidden bg-[#0a0c10]">
               <div className="p-10 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                  <div>
                    <h3 className="font-header text-2xl text-white uppercase italic mb-1">Simulation <span className="text-glow-blue">Vault</span></h3>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest font-mono">Historical Scenario Repository // {simulationHistory.length} ENTRIES</p>
                  </div>
                  <button onClick={() => setShowHistory(false)} className="p-3 bg-white/5 rounded-2xl text-slate-500 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
               </div>
               <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {simulationHistory.map((sim, i) => (
                      <div key={i} className="p-8 bg-white/5 border border-white/5 rounded-[2.5rem] group hover:border-glow-blue/40 transition-all cursor-pointer" onClick={() => { runSimulation(sim); setShowHistory(false); }}>
                        <div className="flex justify-between items-start mb-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-glow-blue/10 rounded-2xl flex items-center justify-center text-glow-blue">
                              <History className="w-6 h-6" />
                            </div>
                            <div>
                              <h4 className="text-white font-header text-lg uppercase italic leading-none">{sim.type}</h4>
                              <p className="text-[10px] text-slate-500 font-mono mt-1">{new Date(sim.timestamp).toLocaleString()}</p>
                            </div>
                          </div>
                          <span className={`text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-widest ${sim.severity === 'Critical' ? 'bg-critical/20 text-critical' : 'bg-warning/20 text-warning'}`}>{sim.severity}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 border-t border-white/5 pt-6">
                          <div>
                            <p className="text-[8px] text-slate-600 font-bold uppercase mb-1">Region</p>
                            <p className="text-xs text-white font-bold truncate">{sim.locationName}</p>
                          </div>
                          <div>
                            <p className="text-[8px] text-slate-600 font-bold uppercase mb-1">Impacted</p>
                            <p className="text-xs text-critical font-bold">{sim.impactReport?.totalAffected} Nodes</p>
                          </div>
                          <div>
                            <p className="text-[8px] text-slate-600 font-bold uppercase mb-1">Loss</p>
                            <p className="text-xs text-warning font-bold">${(sim.impactReport?.financialLoss || 0) / 1000000}M</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
