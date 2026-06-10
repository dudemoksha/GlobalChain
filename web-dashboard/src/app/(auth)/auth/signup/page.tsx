"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Shield, ArrowRight, ArrowLeft, Mail, AlertCircle, Loader2, Lock, Globe } from 'lucide-react';
import { createOrganization } from '@/lib/api';

export default function OrgRegistrationPage() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '', domain: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      setIsSubmitting(false);
      return;
    }

    try {
      const org = await createOrganization(formData.name, formData.email);
      if (!org) throw new Error('Registration failed. The email might already be registered.');
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-panel border border-white/10 p-10 rounded-3xl shadow-2xl relative w-full max-w-xl mx-auto"
    >
      <div className="flex flex-col items-center mb-8 text-center">
        <div className="w-16 h-16 bg-glow-blue rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.4)] mb-4">
          <Building2 className="text-white w-8 h-8" />
        </div>
        <h1 className="font-header text-2xl text-white tracking-tighter uppercase italic mb-1">
          Register <span className="text-glow-blue">Organization</span>
        </h1>
        <p className="text-[10px] text-slate-500 uppercase tracking-[0.3em] font-bold">Secure Access Provisioning</p>
      </div>

      <AnimatePresence mode="wait">
        {!isSuccess ? (
          <motion.form 
            key="form"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div className="space-y-2">
              <label className="text-[10px] text-slate-400 uppercase font-bold tracking-widest ml-1">Organization Name *</label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. Global Logistics Corp" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-glow-blue/50 transition-all" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-slate-400 uppercase font-bold tracking-widest ml-1">Admin Email *</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="admin@corp.com" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-glow-blue/50 transition-all" 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] text-slate-400 uppercase font-bold tracking-widest ml-1">Password *</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input 
                    type="password" 
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="••••••••" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-glow-blue/50 transition-all" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-slate-400 uppercase font-bold tracking-widest ml-1">Confirm Password *</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input 
                    type="password" 
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    placeholder="••••••••" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-glow-blue/50 transition-all" 
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-slate-400 uppercase font-bold tracking-widest ml-1">Company Details (Optional)</label>
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="text" 
                  value={formData.domain}
                  onChange={(e) => setFormData({...formData, domain: e.target.value})}
                  placeholder="Website domain, industry, etc." 
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-glow-blue/50 transition-all" 
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-critical/10 border border-critical/30 text-critical text-[10px] font-bold uppercase tracking-widest">
                <AlertCircle className="w-4 h-4" /> {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={isSubmitting} 
              className="w-full py-4 mt-2 bg-glow-blue text-white font-header text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 hover:bg-blue-600 disabled:opacity-50"
            >
              {isSubmitting ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</>
              ) : (
                <>Register Organization</>
              )}
            </button>
            
            <div className="text-center pt-2">
               <Link href="/auth/login" className="text-[10px] text-slate-500 uppercase tracking-widest hover:text-white transition-colors">
                  Already have an account? Login here
               </Link>
            </div>
          </motion.form>
        ) : (
          <motion.div 
            key="success"
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="space-y-6 text-center py-6"
          >
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-warning/10 border border-warning/30 flex items-center justify-center">
                <Shield className="w-10 h-10 text-warning" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-header text-white uppercase italic tracking-tight mb-3">
                Pending Approval
              </h3>
              <p className="text-sm text-slate-400 max-w-sm mx-auto">
                Your organization registration request has been submitted for admin approval.
              </p>
              <p className="text-[10px] text-slate-500 mt-4 uppercase tracking-widest font-mono">
                You will be able to log in once your request is approved.
              </p>
            </div>
            <Link href="/auth/login" className="block pt-4">
              <button className="w-full py-4 bg-white/5 border border-white/10 text-slate-400 font-header text-xs uppercase tracking-widest rounded-xl transition-all hover:bg-white/10 flex items-center justify-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Return to Login
              </button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
