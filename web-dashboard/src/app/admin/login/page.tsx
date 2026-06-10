"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, ArrowRight, Server, Key, Terminal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { supabase } from '@/lib/supabase';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const login = useStore((state) => state.login);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (password !== 'admin123') {
        throw new Error('ACCESS_DENIED: INVALID_ROOT_KEY');
      }

      // Check DB for admin org
      const { data, error: dbError } = await supabase
        .from('organizations')
        .select('id, status')
        .eq('email', email.trim())
        .single();

      if (dbError || !data) {
        throw new Error('ACCESS_DENIED: UNKNOWN_ENTITY');
      }

      if (data.status !== 'Approved') {
        throw new Error('ACCESS_DENIED: ENTITY_NOT_APPROVED');
      }

      login('Admin');
      router.push('/admin-portal');
    } catch (err: any) {
      setError(err.message || 'ACCESS_DENIED: CONNECTION_FAILED');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05070a] flex items-center justify-center p-6 font-mono">
      <div className="absolute inset-0 bg-[url('https://cartodb-basemaps-a.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png')] opacity-10 grayscale invert" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-md"
      >
        <div className="glass-panel p-10 rounded-[2.5rem] border border-blue-500/20 shadow-2xl relative overflow-hidden bg-black/40 backdrop-blur-xl">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
           
           <div className="flex flex-col items-center mb-10">
              <div className="w-20 h-20 bg-blue-600/10 border border-blue-500/30 rounded-3xl flex items-center justify-center mb-6">
                 <Shield className="w-10 h-10 text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-white uppercase tracking-tighter">Secure Admin <span className="text-blue-500">Gateway</span></h2>
              <p className="text-[10px] text-blue-500/50 font-bold uppercase tracking-[0.3em] mt-2 text-center">Encryption Level: 4096-bit // AES-NI</p>
           </div>

           <form onSubmit={handleAdminLogin} className="space-y-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-4">Admin Email</label>
                 <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors">
                       <Terminal className="w-5 h-5" />
                    </div>
                    <input 
                       type="email" 
                       value={email}
                       onChange={(e) => setEmail(e.target.value)}
                       placeholder="admin@globalchain.intel"
                       required
                       className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-800"
                    />
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-4">Root Access Key</label>
                 <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors">
                       <Key className="w-5 h-5" />
                    </div>
                    <input 
                       type="password" 
                       value={password}
                       onChange={(e) => setPassword(e.target.value)}
                       placeholder="••••••••••••"
                       className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-800"
                    />
                 </div>
              </div>

              {error && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-critical text-[10px] font-bold uppercase tracking-widest text-center"
                >
                  {error}
                </motion.p>
              )}

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full py-5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold uppercase tracking-widest rounded-2xl shadow-[0_0_30px_rgba(37,99,235,0.3)] transition-all flex items-center justify-center gap-3 group"
              >
                 {isLoading ? 'Authenticating...' : (
                   <>Initialize Handshake <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
                 )}
              </button>
           </form>

           <div className="mt-10 pt-8 border-t border-white/5 flex flex-col gap-4">
              <div className="flex items-center gap-3 px-4 py-3 bg-white/[0.02] border border-white/5 rounded-xl">
                 <Terminal className="w-4 h-4 text-slate-600" />
                 <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tight">IP: 192.168.1.1 // LOC: SECURE_CORE</p>
              </div>
              <p className="text-[9px] text-slate-700 text-center uppercase tracking-widest leading-relaxed">
                 Unauthorized access to this terminal is a federal violation under section 8-102. All activity is logged.
              </p>
           </div>
        </div>
      </motion.div>
    </div>
  );
}
