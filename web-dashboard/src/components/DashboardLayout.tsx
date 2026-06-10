"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';

import {
  LayoutDashboard, Globe, Users, Database, Zap, BarChart3, Bell,
  Shield, Search, ChevronRight, LogOut,
  User, Activity, AlertTriangle, Play, Map, Package,
  Building2, Factory, TrendingUp, Cpu, Upload, Layers, Workflow,
  BrainCircuit, RefreshCcw, Menu, X
} from 'lucide-react';

type NavItem = { name: string; href: string };
type NavSection = { title: string; icon: React.ElementType; items: NavItem[] };

const navSections: NavSection[] = [
  {
    title: 'Command Center',
    icon: LayoutDashboard,
    items: [
      { name: 'Executive Dashboard', href: '/dashboard/executive' },
      { name: 'Global Overview', href: '/dashboard/global' },
      { name: 'Risk Intelligence', href: '/dashboard/risk' },
      { name: 'My Profile', href: '/dashboard/profile' },
    ],
  },
  {
    title: 'Data Engine',
    icon: Database,
    items: [
      { name: 'Upload Dataset', href: '/data/upload' },
    ],
  },
  {
    title: 'Visual Intelligence',
    icon: Globe,
    items: [
      { name: '3D Globe Visualizer', href: '/visualization/globe' },
      { name: 'Dependency Mapping', href: '/suppliers/mapping' },
    ],
  },
  {
    title: 'Supplier Ecosystem',
    icon: Users,
    items: [
      { name: 'Tier 1 Partners', href: '/suppliers/tier1' },
      { name: 'Tier 2 Network', href: '/suppliers/tier2' },
      { name: 'Tier 3 Materials', href: '/suppliers/tier3' },
      { name: 'Backup Readiness', href: '/suppliers/backups' },
    ],
  },
  {
    title: 'Tactical War Room',
    icon: Play,
    items: [
      { name: 'Simulation Center', href: '/simulations/center' },
      { name: 'Simulation History', href: '/simulations/history' },
    ],
  },
  {
    title: 'Analytics Engine',
    icon: BarChart3,
    items: [
      { name: 'Resilience Score', href: '/analytics/resilience' },
      { name: 'Risk Matrix', href: '/analytics/matrix' },
      { name: 'Cyber', href: '/analytics/cyber' },
      { name: 'Demand', href: '/analytics/demand' },
      { name: 'Dependency', href: '/analytics/dependency' },
      { name: 'Financial', href: '/analytics/financial' },
      { name: 'Forecast', href: '/analytics/forecast' },
      { name: 'Geopolitical', href: '/analytics/geopolitical' },
      { name: 'Health', href: '/analytics/health' },
      { name: 'Inventory', href: '/analytics/inventory' },
      { name: 'Logistics', href: '/analytics/logistics' },
      { name: 'Manufacturing', href: '/analytics/manufacturing' },
      { name: 'Predictive', href: '/analytics/predictive' },
      { name: 'Recommendations', href: '/analytics/recommendations' },
      { name: 'Recovery', href: '/analytics/recovery' },
    ],
  },
  {
    title: 'Intelligence Feed',
    icon: Activity,
    items: [
      { name: 'Active Alerts', href: '/intelligence/alerts' },
      { name: 'AI Recommendations', href: '/intelligence/recommendations' },
    ],
  },
  {
    title: 'Platform Settings',
    icon: Cpu,
    items: [
      { name: 'General Settings', href: '/settings/general' },
    ],
  },
];


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    'Command Center': true, 'Supplier Ecosystem': false,
  });
  const pathname = usePathname();
  const router = useRouter();
  const { logout, suppliers, activeSimulation, reevaluateIntelligence, autoRecommendations, userRole } = useStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [reevaluating, setReevaluating] = useState(false);

  // ── AI Reevaluation Engine: Every 5 Minutes ──────────────────
  useEffect(() => {
    if (suppliers.length === 0) return;
    
    const interval = setInterval(() => {
      setReevaluating(true);
      reevaluateIntelligence();
      setTimeout(() => setReevaluating(false), 2000);
    }, 300000); // 5 minutes

    // Initial run
    reevaluateIntelligence();

    return () => clearInterval(interval);
  }, [suppliers.length, reevaluateIntelligence]);

  const handleLogout = () => {
    logout();
    router.push('/welcome');
  };

  const toggleSection = (title: string) => {
    setOpenSections(prev => ({ ...prev, [title]: !prev[title] }));
  };

  const affectedNodes = (activeSimulation?.simulatedSuppliers || suppliers).filter(s => s.affectedBy);

  return (
    <div className="flex h-screen bg-background overflow-hidden text-foreground">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="md:hidden fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* ── Sidebar ── */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed && !mobileOpen ? 72 : 268, x: mobileOpen ? 0 : (typeof window !== 'undefined' && window.innerWidth < 768 ? -300 : 0) }}
        transition={{ type: 'spring', damping: 28, stiffness: 200 }}
        className={`glass-panel border-r border-white/5 flex flex-col z-[70] absolute md:relative inset-y-0 left-0 shrink-0 transform md:transform-none ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        <div className="h-16 flex items-center px-4 border-b border-white/5 gap-3 shrink-0">
          <div className="w-8 h-8 bg-glow-blue rounded-lg flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(59,130,246,0.5)]">
            <Shield className="text-white w-4 h-4" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }}>
                <h1 className="font-header text-base tracking-tighter text-white leading-none">
                  GLOBAL<span className="text-glow-blue">CHAIN</span>
                </h1>
                <p className="text-[8px] text-slate-600 font-mono uppercase tracking-[0.2em]">Intelligence v4.5</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5 custom-scrollbar">
          {navSections.map((section) => {
            const isAnyActive = section.items.some(i => pathname === i.href);
            const isOpen = openSections[section.title] ?? isAnyActive;

            return (
              <div key={section.title}>
                <button
                  onClick={() => !collapsed && toggleSection(section.title)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all group ${
                    isAnyActive ? 'text-glow-blue' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <section.icon className={`w-4 h-4 shrink-0 transition-colors ${isAnyActive ? 'text-glow-blue' : 'group-hover:text-glow-blue'}`} />
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="flex-1 text-left text-[10px] font-bold uppercase tracking-[0.15em]">
                        {section.title}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {!collapsed && (
                    <motion.div animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.15 }}>
                      <ChevronRight className="w-3 h-3 shrink-0" />
                    </motion.div>
                  )}
                </button>

                <AnimatePresence>
                  {(isOpen || collapsed) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className={`space-y-0.5 ${!collapsed ? 'pl-4 pr-1 pb-2' : 'px-1 pb-2'}`}>
                        {section.items.map((item) => {
                          const isActive = pathname === item.href;
                          return (
                            <Link key={item.href} href={item.href}
                              className={`flex items-center gap-3 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all group relative ${
                                isActive
                                  ? 'bg-glow-blue/15 text-glow-blue font-bold border border-glow-blue/20'
                                  : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'
                              }`}>
                              {isActive && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-glow-blue rounded-full shadow-[0_0_6px_rgba(59,130,246,0.8)]" />
                              )}
                              {collapsed ? (
                                <section.icon className="w-4 h-4 shrink-0" />
                              ) : (
                                <span className="truncate">{item.name}</span>
                              )}
                              {isActive && !collapsed && (
                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-glow-blue shadow-[0_0_6px_rgba(59,130,246,0.6)]" />
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>

        {/* AI Engine Status Sidebar */}
        {!collapsed && suppliers.length > 0 && (
          <div className="mx-4 mb-4 p-4 bg-glow-blue/5 border border-glow-blue/10 rounded-2xl">
             <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                   <BrainCircuit className={`w-3.5 h-3.5 ${reevaluating ? 'text-glow-blue animate-pulse' : 'text-slate-500'}`} />
                   <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">AI Intelligence</span>
                </div>
                {reevaluating && <RefreshCcw className="w-3 h-3 text-glow-blue animate-spin" />}
             </div>
             <p className="text-[8px] text-slate-600 font-mono uppercase italic mb-2">Reevaluating network every 5m...</p>
             <div className="flex items-center justify-between">
                <span className="text-[8px] text-slate-500 font-bold uppercase">Auto Recs</span>
                <span className="text-[10px] font-header text-glow-blue">{autoRecommendations.length}</span>
             </div>
          </div>
        )}

        <div className="p-3 border-t border-white/5 space-y-2 shrink-0">
          {!collapsed && (
            <div className="px-3 py-2 bg-white/[0.03] rounded-xl flex items-center gap-3 border border-white/5">
              <div className="w-7 h-7 rounded-lg bg-glow-blue/20 border border-glow-blue/30 flex items-center justify-center shrink-0">
                <User className="w-3.5 h-3.5 text-glow-blue" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold text-white uppercase tracking-tight truncate">
                  {userRole === 'Admin' ? 'Administrator' : userRole === 'MainCompany' ? 'Company User' : 'User'}
                </p>
                <p className="text-[8px] text-slate-600 font-mono uppercase">GlobalChain Platform</p>
              </div>
              <LogOut
                onClick={handleLogout}
                className="w-3.5 h-3.5 text-slate-600 hover:text-critical cursor-pointer transition-colors shrink-0"
              />
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-white/5 text-slate-500 hover:text-white transition-all"
          >
            <motion.div animate={{ rotate: collapsed ? 0 : 180 }}>
              <ChevronRight className="w-4 h-4" />
            </motion.div>
          </button>
        </div>
      </motion.aside>

      <div className="flex-1 flex flex-col min-w-0 relative overflow-hidden">
        <header className="h-16 glass-panel border-b border-white/5 flex items-center justify-between px-4 md:px-6 z-40 shrink-0">
          <div className="flex items-center gap-4 flex-1">
            <button 
              className="md:hidden p-2 text-slate-400 hover:text-white"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center gap-1.5 text-[10px] text-slate-500 font-mono uppercase tracking-widest">
              <span>GlobalChain</span>
              {pathname.split('/').filter(Boolean).map((seg, i, arr) => (
                <React.Fragment key={i}>
                  <span className="opacity-30">/</span>
                  <span className={i === arr.length - 1 ? 'text-slate-300' : ''}>{seg.replace(/-/g, ' ')}</span>
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-5">
            {reevaluating && (
              <div className="flex items-center gap-2 px-3 py-1 bg-glow-blue/10 border border-glow-blue/20 rounded-full">
                 <RefreshCcw className="w-3 h-3 text-glow-blue animate-spin" />
                 <span className="text-[9px] font-mono font-bold text-glow-blue uppercase tracking-widest">REEVALUATING_NETWORK</span>
              </div>
            )}

            <div className={`hidden md:flex items-center gap-2 px-3 py-1 ${affectedNodes.length > 0 ? 'bg-critical/10 border-critical/20 text-critical' : 'bg-success/10 border-success/20 text-success'} rounded-full border`}>
              <div className={`w-1.5 h-1.5 rounded-full ${affectedNodes.length > 0 ? 'bg-critical animate-pulse' : 'bg-success'}`} />
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest">{affectedNodes.length > 0 ? `${affectedNodes.length}_NODES_IMPACTED` : 'ALL_SYSTEMS_NOMINAL'}</span>
            </div>

            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative text-slate-400 hover:text-white transition-colors p-1 rounded-lg ${showNotifications ? 'bg-glow-blue/10 text-glow-blue' : ''}`}
              >
                <Bell className="w-4 h-4" />
                {(affectedNodes.length > 0 || autoRecommendations.length > 0) && <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-critical rounded-full shadow-[0_0_6px_rgba(239,68,68,0.6)]" />}
              </button>
              
              <AnimatePresence>
                {showNotifications && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-80 glass-panel border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-5 z-[60] bg-black/60 backdrop-blur-2xl"
                  >
                    <div className="flex justify-between items-center mb-6">
                       <h4 className="text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-2">
                          <Bell className="w-3 h-3 text-glow-blue" /> Network Alerts
                       </h4>
                    </div>
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                       {/* AI Auto-Recommendations first */}
                       {autoRecommendations.slice(0, 3).map((rec, i) => (
                         <div key={i} className="flex gap-4 p-3 bg-glow-blue/10 border border-glow-blue/20 rounded-xl">
                            <BrainCircuit className="w-4 h-4 text-glow-blue mt-1 shrink-0" />
                            <div>
                               <p className="text-[10px] text-white font-bold uppercase">Better Option Detected</p>
                               <p className="text-[9px] text-slate-300 font-mono mt-1 leading-tight">{rec.reason}</p>
                            </div>
                         </div>
                       ))}
                       
                       {/* Affected Nodes */}
                       {affectedNodes.slice(0, 3).map((n, i) => (
                         <div key={i} className="flex gap-4 p-3 bg-critical/10 border border-critical/20 rounded-xl">
                            <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 bg-critical shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                            <div>
                               <p className="text-[11px] text-white font-medium">{n.name} Disrupted</p>
                               <p className="text-[9px] text-slate-500 font-mono mt-1 uppercase italic leading-tight">{n.reason}</p>
                            </div>
                         </div>
                       ))}
                       
                       {affectedNodes.length === 0 && autoRecommendations.length === 0 && (
                         <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest text-center py-4">No active alerts</p>
                       )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 custom-scrollbar relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="max-w-[1600px] mx-auto"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <div className="fixed inset-0 pointer-events-none z-[-1] opacity-[0.025] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
    </div>
  );
}
