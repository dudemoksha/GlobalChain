"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Users, Activity, Database, Key, 
  Terminal, BarChart, Bell, Settings, LogOut, Menu, X,
  FileSearch, Lock, Globe, Server, CheckCircle2, AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { useEffect } from 'react';

interface NavItem {
  name: string;
  href: string;
  icon: any;
}

const adminNav: NavItem[] = [
  { name: 'System Overview', href: '/admin-portal', icon: Activity },
  { name: 'User Management', href: '/admin-portal/users', icon: Users },
  { name: 'Organization Approval', href: '/admin-portal/orgs', icon: Shield },
  { name: 'Database Monitor', href: '/admin-portal/database', icon: Database },
  { name: 'API Intelligence', href: '/admin-portal/api', icon: Server },
  { name: 'Disaster Management', href: '/admin-portal/disaster-feed', icon: Globe },
  { name: 'Access Controls', href: '/admin-portal/permissions', icon: Lock },
  { name: 'Audit Terminal', href: '/admin-portal/audit', icon: FileSearch },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { userRole, logout } = useStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (userRole !== 'Admin') {
      router.push('/admin/login');
    }
  }, [userRole, router]);

  const handleLogout = () => {
    logout();
    router.push('/welcome');
  };

  if (userRole !== 'Admin') return null;

  return (
    <div className="min-h-screen bg-[#05070a] text-slate-300 font-mono selection:bg-blue-500/30">
      {/* Top Security Bar */}
      <header className="h-16 border-b border-blue-900/30 bg-[#05070a]/80 backdrop-blur-md fixed top-0 w-full z-50 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-600/10 border border-blue-500/30 rounded flex items-center justify-center">
            <Shield className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h1 className="text-white font-bold tracking-tighter text-lg uppercase">
              GlobalChain <span className="text-blue-500">Root_Admin</span>
            </h1>
            <p className="text-[10px] text-blue-500/50 font-bold uppercase tracking-widest">Security Clearance: Level 5 (Override)</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
           <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-blue-500/5 border border-blue-500/20 rounded">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-xs font-bold text-blue-400">SYS_KERNEL: NOMINAL</span>
           </div>
           <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`text-slate-500 hover:text-white transition-colors p-2 rounded-lg ${showNotifications ? 'bg-blue-600/10 text-blue-400' : ''}`}
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              </button>
              
              <AnimatePresence>
                {showNotifications && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-80 bg-[#0a0c10] border border-blue-900/30 rounded-xl shadow-2xl p-4 z-[60]"
                  >
                    <h4 className="text-[10px] font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                       <Shield className="w-3 h-3 text-blue-500" /> Security_Audit_Alerts
                    </h4>
                    <div className="space-y-3">
                       {[
                         { icon: CheckCircle2, msg: 'Kernel integrity check passed.', color: 'text-success' },
                         { icon: AlertCircle, msg: 'New admin provisioned: GC-812', color: 'text-warning' },
                         { icon: Activity, msg: 'Backup shards synchronized.', color: 'text-blue-500' },
                       ].map((n, i) => (
                         <div key={i} className="flex gap-3 p-3 bg-white/[0.02] border border-blue-900/10 rounded-lg hover:bg-blue-500/5 transition-colors">
                            <n.icon className={`w-4 h-4 ${n.color} shrink-0`} />
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{n.msg}</span>
                         </div>
                       ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
           </div>

           <button 
             onClick={handleLogout}
             className="text-slate-500 hover:text-white transition-colors p-2 hover:bg-critical/10 rounded-lg group"
           >
             <LogOut className="w-5 h-5 group-hover:text-critical transition-colors" />
           </button>
        </div>
      </header>

      {/* Main Grid */}
      <div className="pt-16 flex min-h-screen">
        {/* Sidebar */}
        <aside className={`fixed left-0 top-16 bottom-0 w-64 bg-[#0a0c10] border-r border-blue-900/20 transition-all z-40 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <nav className="p-4 space-y-2">
            {adminNav.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link 
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded text-sm transition-all group ${
                    isActive ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' : 'hover:bg-white/5'
                  }`}
                >
                  <item.icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-blue-400'}`} />
                  <span className="font-bold tracking-tight">{item.name}</span>
                </Link>
              );
            })}
          </nav>
          
          <div className="absolute bottom-0 w-full p-6 border-t border-blue-900/10">
            <div className="p-4 bg-blue-500/5 rounded border border-blue-500/10">
              <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest mb-2">Memory Usage</p>
              <div className="h-1 w-full bg-blue-900/20 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-3/4" />
              </div>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className={`flex-1 transition-all ${isSidebarOpen ? 'ml-64' : 'ml-0'} p-8 bg-[#05070a]`}>
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Terminal Footer */}
      <footer className="fixed bottom-0 right-0 p-4 pointer-events-none opacity-40">
        <p className="text-[10px] text-blue-500 font-mono">GLOBALCHAIN_ADMIN_V4.2 // PID: 8204 // ENCRYPTED_LINK_ACTIVE</p>
      </footer>
    </div>
  );
}
