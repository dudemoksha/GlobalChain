"use client";

import { useStore, Supplier } from '@/store/useStore';
import Globe3D from '@/components/Globe3D';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Globe, Shield, Activity, Maximize2, 
  Map, Layers, Crosshair, Zap, Info, 
  Search, ShieldAlert, Target, RefreshCcw,
  Eye, EyeOff, LayoutPanelLeft, List, Gauge, Radio,
  AlertCircle, X, ChevronRight, MapPin, Navigation,
  Locate, Filter, Waves, History, ShieldCheck
} from 'lucide-react';
import Link from 'next/link';

export default function GlobeVisualizerPage() {
  const { suppliers, activeSimulation } = useStore();
  
  // Visibility & Control State
  const [showLayers, setShowLayers] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showInfo, setShowInfo] = useState(true);
  const [is2D, setIs2D] = useState(false);
  const [showSimOverlay, setShowSimOverlay] = useState(true);
  
  // Data Filtering & Focus
  const [focusNode, setFocusNode] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Layer toggles
  const [layers, setLayers] = useState({
    nodes: true,
    arcs: true,
    propagation: true,
    backups: true,
    heatmap: false,
    disasters: true
  });

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  const filteredSuppliers = useMemo(() => {
    if (!searchTerm) return [];
    return suppliers.filter(s => 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      s.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.city?.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 5);
  }, [suppliers, searchTerm]);

  const affectedCount = useMemo(() => 
    (activeSimulation?.simulatedSuppliers || suppliers).filter(s => s.affectedBy).length
  , [suppliers, activeSimulation]);

  const handleNodeFocus = (id: string) => {
    setFocusNode(id);
    setShowSearch(false);
    setSearchTerm('');
  };

  const autoFocusCritical = () => {
    const critical = (activeSimulation?.simulatedSuppliers || suppliers).find(s => s.health < 40);
    if (critical) setFocusNode(critical.id);
  };

  return (
    <div className="h-[calc(100vh-8rem)] w-full relative group overflow-hidden rounded-[3rem] border border-white/10 bg-[#020617] shadow-2xl">
      {/* ── Z-INDEX 10: ACTUAL GLOBE ── */}
      <div className="absolute inset-0 z-10 pointer-events-auto">
         <Globe3D 
            showLayers={layers.nodes} 
            showArcs={layers.arcs}
            is2D={is2D}
            focusNodeId={focusNode} 
            activeSimulation={showSimOverlay ? activeSimulation : null}
            showPropagation={layers.propagation}
         />
      </div>

      {/* ── Z-INDEX 20: INTERFACE OVERLAYS (NON-BLOCKING) ── */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        
        {/* Dynamic Header Info */}
        <AnimatePresence>
          {showInfo && (
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="absolute top-8 left-8 p-8 rounded-[2.5rem] border border-white/10 bg-black/60 backdrop-blur-3xl shadow-2xl pointer-events-auto"
            >
              <div className="flex items-center gap-5 mb-8">
                <div className="w-14 h-14 bg-glow-blue rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(59,130,246,0.4)]">
                  <Globe className="text-white w-7 h-7" />
                </div>
                <div>
                  <h2 className="font-header text-3xl text-white uppercase italic tracking-tighter leading-none">Geo<span className="text-glow-blue">Intelligence</span></h2>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-2 h-2 rounded-full bg-success animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.3em]">Operational Mesh: {is2D ? '2D_PROJECTION' : '3D_ORBIT'}</span>
                  </div>
                </div>
              </div>
    
              <div className="grid grid-cols-2 gap-10 pt-8 border-t border-white/5">
                <div>
                  <p className="text-[9px] text-slate-500 uppercase font-bold tracking-[0.2em] mb-2">Network Nodes</p>
                  <p className="text-3xl font-header text-white tracking-widest">{suppliers.length}</p>
                </div>
                <div>
                  <p className="text-[9px] text-slate-500 uppercase font-bold tracking-[0.2em] mb-2">Network Health</p>
                  <p className={`text-3xl font-header ${affectedCount > 0 ? 'text-critical' : 'text-success'}`}>
                    {affectedCount > 0 ? 'RISK' : 'SAFE'}
                  </p>
                </div>
              </div>

              {activeSimulation && showSimOverlay && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="mt-8 pt-6 border-t border-white/5 flex flex-col gap-4">
                   <div className="flex items-center justify-between">
                      <span className="text-[9px] text-warning font-bold uppercase tracking-widest flex items-center gap-2">
                         <Zap className="w-3 h-3" /> Active Simulation
                      </span>
                      <span className="text-[9px] text-slate-400 font-mono uppercase">{activeSimulation.type}</span>
                   </div>
                   <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${activeSimulation.impactReport?.resilienceScore}%` }} className="h-full bg-warning shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                   </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Legend Overlay */}
        <AnimatePresence>
          {showInfo && (
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ delay: 0.1 }}
              className="absolute bottom-32 left-8 p-6 rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl pointer-events-auto"
            >
              <div className="space-y-4">
                {[
                  { label: 'Strategic Tier 1', color: 'bg-white' },
                  { label: 'Warning Node', color: 'bg-warning shadow-[0_0_10px_rgba(245,158,11,0.5)]' },
                  { label: 'Critical Failure', color: 'bg-critical shadow-[0_0_10px_rgba(239,68,68,0.5)]' },
                  { label: 'Backup Route', color: 'bg-glow-blue border border-white/20' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 group">
                    <div className={`w-3 h-3 rounded-full ${item.color} group-hover:scale-125 transition-transform`} />
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest group-hover:text-white transition-colors">{item.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Z-INDEX 30: CONTROL TOOLS (BLOCKING) ── */}
        <div className="absolute top-8 right-8 z-30 flex flex-col gap-4 pointer-events-auto">
          {/* Main Visibility Toggles */}
          <button 
             onClick={() => setShowInfo(!showInfo)}
             className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all border shadow-2xl ${showInfo ? 'bg-glow-blue/10 border-glow-blue/30 text-glow-blue' : 'bg-white/5 border-white/10 text-slate-500 hover:text-white'}`}
          >
             {showInfo ? <Eye className="w-6 h-6" /> : <EyeOff className="w-6 h-6" />}
          </button>

          <div className="w-px h-6 bg-white/10 mx-auto" />

          {/* Functional Tool Belt */}
          <div className="flex flex-col gap-3">
             {/* Toggle Layers */}
             <button 
               onClick={() => setShowLayers(!showLayers)}
               className={`w-14 h-14 border rounded-2xl flex items-center justify-center transition-all group relative ${showLayers ? 'bg-glow-blue border-glow-blue text-white shadow-[0_0_20px_rgba(59,130,246,0.4)]' : 'bg-[#0a0c10]/80 border-white/10 text-slate-500 hover:text-white hover:bg-white/10'}`}
             >
                <Layers className="w-6 h-6" />
                <span className="absolute right-full mr-4 px-3 py-1.5 bg-black/90 border border-white/10 rounded-xl text-[9px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100 whitespace-nowrap pointer-events-none shadow-2xl">Toggle_Layers</span>
             </button>

             {/* Target Search */}
             <button 
               onClick={() => setShowSearch(!showSearch)}
               className={`w-14 h-14 border rounded-2xl flex items-center justify-center transition-all group relative ${showSearch ? 'bg-glow-blue border-glow-blue text-white shadow-[0_0_20px_rgba(59,130,246,0.4)]' : 'bg-[#0a0c10]/80 border-white/10 text-slate-500 hover:text-white hover:bg-white/10'}`}
             >
                <Search className="w-6 h-6" />
                <span className="absolute right-full mr-4 px-3 py-1.5 bg-black/90 border border-white/10 rounded-xl text-[9px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100 whitespace-nowrap pointer-events-none shadow-2xl">Locate_Node</span>
             </button>

             {/* 2D / 3D Mode */}
             <button 
               onClick={() => setIs2D(!is2D)}
               className={`w-14 h-14 border rounded-2xl flex items-center justify-center transition-all group relative ${is2D ? 'bg-purple-500 border-purple-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]' : 'bg-[#0a0c10]/80 border-white/10 text-slate-500 hover:text-white hover:bg-white/10'}`}
             >
                {is2D ? <LayoutPanelLeft className="w-6 h-6" /> : <Map className="w-6 h-6" />}
                <span className="absolute right-full mr-4 px-3 py-1.5 bg-black/90 border border-white/10 rounded-xl text-[9px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100 whitespace-nowrap pointer-events-none shadow-2xl">{is2D ? 'Flat_Projection' : 'Full_Globe'}</span>
             </button>

             {/* Active Simulation Toggle */}
             <button 
               onClick={() => setShowSimOverlay(!showSimOverlay)}
               disabled={!activeSimulation}
               className={`w-14 h-14 border rounded-2xl flex items-center justify-center transition-all group relative disabled:opacity-20 ${showSimOverlay && activeSimulation ? 'bg-warning border-warning text-white shadow-[0_0_20px_rgba(245,158,11,0.4)]' : 'bg-[#0a0c10]/80 border-white/10 text-slate-500 hover:text-white'}`}
             >
                <Zap className="w-6 h-6" />
                <span className="absolute right-full mr-4 px-3 py-1.5 bg-black/90 border border-white/10 rounded-xl text-[9px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100 whitespace-nowrap pointer-events-none shadow-2xl">Simulation_Overlay</span>
             </button>

             {/* Focus System */}
             <button 
               onClick={autoFocusCritical}
               className={`w-14 h-14 border rounded-2xl flex items-center justify-center transition-all group relative bg-[#0a0c10]/80 border-white/10 text-slate-500 hover:text-white hover:bg-glow-blue/20 hover:border-glow-blue/40`}
             >
                <Maximize2 className="w-6 h-6" />
                <span className="absolute right-full mr-4 px-3 py-1.5 bg-black/90 border border-white/10 rounded-xl text-[9px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100 whitespace-nowrap pointer-events-none shadow-2xl">Focus_Critical_Nodes</span>
             </button>
          </div>

          <div className="w-px h-6 bg-white/10 mx-auto" />

          <button 
             onClick={handleRefresh}
             className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-slate-500 hover:text-white transition-all shadow-xl"
          >
             <RefreshCcw className={`w-6 h-6 ${isRefreshing ? 'animate-spin text-glow-blue' : ''}`} />
          </button>
        </div>

        {/* ── SECONDARY OVERLAYS (Z-INDEX 40) ── */}
        
        {/* Layer Manager Modal */}
        <AnimatePresence>
           {showLayers && (
              <motion.div 
                 initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                 className="absolute top-24 right-28 z-40 w-72 glass-panel border border-white/10 rounded-[2.5rem] p-8 bg-black/80 backdrop-blur-3xl shadow-2xl pointer-events-auto"
              >
                 <div className="flex justify-between items-center mb-8">
                    <h3 className="text-[10px] text-white font-bold uppercase tracking-[0.2em] flex items-center gap-3">
                       <Layers className="w-4 h-4 text-glow-blue" /> Network Layers
                    </h3>
                    <button onClick={() => setShowLayers(false)}><X className="w-4 h-4 text-slate-500" /></button>
                 </div>
                 <div className="space-y-4">
                    {[
                       { id: 'nodes', label: 'Supplier Nodes', icon: MapPin },
                       { id: 'arcs', label: 'Shipping Arcs', icon: Navigation },
                       { id: 'propagation', label: 'Disruption Wave', icon: Waves },
                       { id: 'backups', label: 'Backup Routes', icon: ShieldCheck },
                       { id: 'heatmap', label: 'Density Map', icon: History },
                    ].map((l) => (
                       <div 
                         key={l.id} 
                         onClick={() => setLayers(prev => ({ ...prev, [l.id]: !prev[l.id as keyof typeof layers] }))}
                         className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all border ${layers[l.id as keyof typeof layers] ? 'bg-glow-blue/10 border-glow-blue/30 text-white' : 'bg-white/[0.02] border-white/5 text-slate-500 hover:bg-white/5'}`}
                       >
                          <div className="flex items-center gap-3">
                             <l.icon className="w-3.5 h-3.5" />
                             <span className="text-[10px] font-bold uppercase tracking-tight">{l.label}</span>
                          </div>
                          <div className={`w-8 h-4 rounded-full relative transition-colors ${layers[l.id as keyof typeof layers] ? 'bg-glow-blue' : 'bg-white/10'}`}>
                             <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${layers[l.id as keyof typeof layers] ? 'right-0.5' : 'left-0.5'}`} />
                          </div>
                       </div>
                    ))}
                 </div>
              </motion.div>
           )}
        </AnimatePresence>

        {/* Node Search Modal */}
        <AnimatePresence>
           {showSearch && (
              <motion.div 
                 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                 className="absolute top-24 right-28 z-40 w-80 glass-panel border border-white/10 rounded-[2.5rem] p-8 bg-black/80 backdrop-blur-3xl shadow-2xl pointer-events-auto"
              >
                 <div className="flex items-center gap-3 mb-6 bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus-within:border-glow-blue/50 transition-all">
                    <Search className="w-5 h-5 text-slate-500" />
                    <input 
                      autoFocus
                      type="text" 
                      placeholder="SEARCH NETWORK..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-transparent border-none outline-none text-white text-xs font-bold uppercase tracking-widest w-full placeholder:text-slate-700"
                    />
                 </div>
                 
                 <div className="space-y-2">
                    {filteredSuppliers.map(s => (
                       <button 
                         key={s.id} 
                         onClick={() => handleNodeFocus(s.id)}
                         className="w-full flex items-center justify-between p-4 bg-white/[0.02] hover:bg-glow-blue/10 border border-white/5 hover:border-glow-blue/20 rounded-2xl transition-all group"
                       >
                          <div className="text-left">
                             <p className="text-[10px] text-white font-bold uppercase group-hover:text-glow-blue transition-colors">{s.name}</p>
                             <p className="text-[8px] text-slate-500 font-mono mt-1 uppercase">{s.category} // {s.city || 'GLOBAL'}</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-glow-blue transition-colors" />
                       </button>
                    ))}
                    {searchTerm && filteredSuppliers.length === 0 && (
                       <p className="text-center py-6 text-[9px] text-slate-600 font-bold uppercase tracking-widest">No matching nodes detected</p>
                    )}
                 </div>
              </motion.div>
           )}
        </AnimatePresence>

        {/* Bottom Monitoring Strip */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 p-6 rounded-[2rem] border border-white/10 bg-black/60 backdrop-blur-3xl flex items-center justify-between px-10 shadow-2xl w-[90%] max-w-4xl pointer-events-auto">
          <div className="flex items-center gap-8">
             <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-glow-blue animate-pulse" />
                <div className="flex flex-col">
                   <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">Scanning Grid</span>
                   <span className="text-[10px] text-white font-mono uppercase tracking-widest">SECTOR_B14 // LIVE_TELEMETRY</span>
                </div>
             </div>
             <div className="w-px h-8 bg-white/10" />
             <div className="flex flex-col">
                <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">Global Drift</span>
                <span className="text-[10px] text-success font-mono font-bold tracking-widest">0.002MS</span>
             </div>
          </div>
          
          <div className="flex items-center gap-4 h-3 pr-4">
             {[...Array(12)].map((_, i) => (
               <div key={i} className={`w-1.5 h-full rounded-full transition-all duration-1000 ${i % 4 === 0 ? 'bg-glow-blue shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'bg-white/10'} animate-pulse`} style={{ animationDelay: `${i * 0.1}s` }} />
             ))}
          </div>

          <div className="flex items-center gap-4">
             <Link href="/data/upload">
                <button className="px-8 py-3 bg-white/5 border border-white/10 hover:border-white/30 text-white rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all shadow-lg hover:bg-white/10">Configure Mesh</button>
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
