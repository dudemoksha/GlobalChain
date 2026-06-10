"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-panel border border-white/10 p-10 rounded-3xl shadow-2xl max-w-md w-full relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-warning/50"></div>
      
      <div className="flex flex-col items-center mb-10">
        <div className="w-16 h-16 bg-warning/10 border border-warning/20 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.2)] mb-6">
          <Shield className="text-warning w-8 h-8" />
        </div>
        <h1 className="font-header text-2xl text-white tracking-tighter uppercase italic mb-2">
          SECURITY<span className="text-warning"> RECOVERY</span>
        </h1>
        <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold text-center">Protocol: Key_Resync_Initiation</p>
      </div>

      {!submitted ? (
        <div className="space-y-6">
          <p className="text-[11px] text-slate-400 text-center leading-relaxed italic">
            Enter your enterprise email to receive a secure recovery token. All access keys will be rotated upon verification.
          </p>
          <div className="space-y-2">
            <label className="text-[10px] text-slate-400 uppercase font-bold tracking-widest ml-1">Enterprise Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="email" 
                placeholder="admin@organization.com" 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-warning/50 focus:bg-white/[0.08] transition-all"
              />
            </div>
          </div>
          <button 
            onClick={() => setSubmitted(true)}
            className="w-full py-4 bg-warning text-black font-header text-xs uppercase tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:scale-[1.02] flex items-center justify-center gap-2 group"
          >
            Send Recovery Token <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6"
        >
          <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
            <p className="text-xs text-slate-300 leading-relaxed italic mb-4">
              "A secure encrypted token has been dispatched to your email. Please check your inbox for the secondary sync protocol."
            </p>
            <div className="text-[10px] text-warning font-bold uppercase tracking-widest">Expires in: 14:59s</div>
          </div>
          <Link href="/auth/login" className="block">
            <button className="w-full py-4 bg-glow-blue text-white font-header text-xs uppercase tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)]">
              Return to Login
            </button>
          </Link>
        </motion.div>
      )}

      <div className="mt-10 pt-6 border-t border-white/5 text-center">
        <Link href="/auth/login" className="text-[10px] text-slate-500 hover:text-white uppercase tracking-widest font-bold flex items-center justify-center gap-2 transition-colors">
          <ArrowLeft className="w-3 h-3" /> Back to Access Portal
        </Link>
      </div>
    </motion.div>
  );
}
