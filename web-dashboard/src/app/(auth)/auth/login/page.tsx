"use client";

import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, User, Globe, ArrowRight, Activity, Terminal, Key } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useStore } from '@/store/useStore';

export default function LoginPage() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState('');
  const router = useRouter();
  const { login, setOrgId } = useStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      // Logic for tracking login attempt (Simulated for this implementation)
      const loginAttempt = {
        email: email.trim(),
        timestamp: new Date().toISOString(),
        device: navigator.userAgent,
        status: 'FAILED'
      };

      const { data, error } = await supabase
        .from('organizations')
        .select('id, status')
        .eq('email', email.trim())
        .single();

      if (error || !data) throw new Error('Organization email not found.');
      if (data.status === 'Pending') throw new Error('Your organization is pending Admin approval.');
      if (data.status === 'Suspended') throw new Error('Access Suspended. Contact GlobalChain Admin.');
      if (data.status === 'Rejected') throw new Error('Your organization access request was rejected.');

      if (data.status === 'Approved') {
        login('MainCompany');
        setOrgId(data.id);
        
        // Track successful login
        const logs = JSON.parse(localStorage.getItem('gc_login_history') || '[]');
        logs.unshift({ ...loginAttempt, status: 'SUCCESS' });
        localStorage.setItem('gc_login_history', JSON.stringify(logs.slice(0, 50)));

        router.push('/dashboard/executive');
      }

    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed.');
      // Track failed attempt
      const logs = JSON.parse(localStorage.getItem('gc_login_history') || '[]');
      logs.unshift({ email: email.trim(), timestamp: new Date().toISOString(), device: 'Desktop / Chrome', status: 'FAILED' });
      localStorage.setItem('gc_login_history', JSON.stringify(logs.slice(0, 50)));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel border border-white/10 p-10 rounded-[3rem] shadow-2xl relative bg-black/40 backdrop-blur-3xl overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-glow-blue to-transparent" />
        
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-glow-blue rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.4)] mb-6 group hover:scale-110 transition-transform">
            <Shield className="text-white w-8 h-8" />
          </div>
          <h1 className="font-header text-2xl text-white tracking-tighter uppercase italic mb-2">
            GLOBAL<span className="text-glow-blue">CHAIN</span>
          </h1>
          <p className="text-[10px] text-slate-500 uppercase tracking-[0.3em] font-bold">Secure Access Portal</p>
        </div>

        <form className="space-y-6" onSubmit={handleLogin}>
          <div className="space-y-2">
            <label className="text-[10px] text-slate-400 uppercase font-bold tracking-widest ml-1">Organization Email</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-glow-blue transition-colors" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ops@yourcompany.com" 
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-glow-blue/50 focus:bg-white/[0.08] transition-all font-mono"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Access Key</label>
              <Link href="/auth/forgot-password" className="text-[9px] text-glow-blue hover:underline uppercase font-bold">Forgot?</Link>
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-glow-blue transition-colors" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-glow-blue/50 focus:bg-white/[0.08] transition-all font-mono"
              />
            </div>
          </div>

          <AnimatePresence>
            {errorMsg && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-3 bg-critical/10 border border-critical/20 rounded-xl text-critical text-[10px] font-bold uppercase tracking-widest text-center"
              >
                {errorMsg}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="pt-4 flex flex-col gap-4">
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-5 bg-glow-blue hover:bg-blue-600 disabled:opacity-50 text-white font-header text-xs uppercase tracking-widest rounded-2xl transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] flex items-center justify-center gap-2 group"
            >
              {isLoading ? (
                <span className="flex items-center gap-2"><Activity className="w-4 h-4 animate-spin" /> Authenticating...</span>
              ) : (
                <>Establish Secure Connection <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
            
            <Link href="/admin/login" className="w-full">
               <button 
                 type="button"
                 className="w-full py-4 border border-white/10 text-slate-400 hover:text-white rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 hover:bg-white/5"
               >
                  <Key className="w-4 h-4" /> Login as Administrator
               </button>
            </Link>
          </div>
        </form>

        <div className="mt-10 pt-8 border-t border-white/5 text-center">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest">
            No access credentials? <Link href="/auth/signup" className="text-glow-blue hover:underline font-bold">Register Organization</Link>
          </p>
        </div>
      </motion.div>

      <div className="absolute -bottom-24 left-0 right-0 flex items-center justify-center gap-4 opacity-30 grayscale pointer-events-none">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-white" />
          <span className="text-[8px] text-white uppercase font-mono">Quantum_Sync</span>
        </div>
        <div className="h-3 w-px bg-white/20"></div>
        <div className="text-[8px] text-white uppercase font-mono">BGP_Tunneled</div>
        <div className="h-3 w-px bg-white/20"></div>
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-white" />
          <span className="text-[8px] text-white uppercase font-mono">v4.5_L4_Auth</span>
        </div>
      </div>
    </div>
  );
}
