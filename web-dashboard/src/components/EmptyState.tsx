"use client";

import React from 'react';
import Link from 'next/link';
import { Upload, Globe, BarChart3, Zap, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  variant?: 'default' | 'globe' | 'analytics' | 'simulation';
  title?: string;
  message?: string;
}

const VARIANTS = {
  default: {
    icon: AlertTriangle,
    title: 'No Data Available',
    message: 'Upload a supplier dataset to power this module.',
    color: 'text-slate-500',
    border: 'border-white/10',
  },
  globe: {
    icon: Globe,
    title: 'Globe Awaiting Data',
    message: 'Upload a dataset to visualize your global supply chain in 3D.',
    color: 'text-glow-blue',
    border: 'border-glow-blue/20',
  },
  analytics: {
    icon: BarChart3,
    title: 'Analytics Unavailable',
    message: 'No supplier data has been ingested this session. Upload a dataset to generate enterprise analytics.',
    color: 'text-purple-400',
    border: 'border-purple-500/20',
  },
  simulation: {
    icon: Zap,
    title: 'Simulation Standby',
    message: 'Simulations require an active supplier dataset. Upload your operational graph to begin.',
    color: 'text-warning',
    border: 'border-warning/20',
  },
};

export default function EmptyState({ variant = 'default', title, message }: EmptyStateProps) {
  const cfg = VARIANTS[variant];
  const Icon = cfg.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`flex flex-col items-center justify-center py-28 text-center border ${cfg.border} rounded-[3rem] bg-white/[0.01] backdrop-blur-sm`}
    >
      <div className={`w-24 h-24 rounded-3xl bg-white/[0.03] border ${cfg.border} flex items-center justify-center mb-8`}>
        <Icon className={`w-12 h-12 ${cfg.color}`} />
      </div>

      <h2 className="font-header text-2xl text-white uppercase italic tracking-tight mb-3">
        {title || cfg.title}
      </h2>
      <p className="text-slate-500 text-xs font-bold uppercase tracking-widest max-w-sm leading-relaxed mb-10">
        {message || cfg.message}
      </p>

      <div className="flex items-center gap-4">
        <Link href="/data/upload">
          <button className="px-8 py-4 bg-glow-blue text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20">
            <Upload className="w-4 h-4" /> Upload Dataset
          </button>
        </Link>
        <Link href="/visualization/globe">
          <button className="px-8 py-4 bg-white/5 border border-white/10 text-slate-400 rounded-2xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-white/10 hover:text-white transition-all">
            <Globe className="w-4 h-4" /> View Globe
          </button>
        </Link>
      </div>

      <div className="mt-12 flex items-center gap-6 text-[9px] text-slate-700 font-bold uppercase tracking-widest">
        <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-slate-700" /> Session-Only Storage</span>
        <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-slate-700" /> No Persistent Cache</span>
        <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-slate-700" /> Upload Each Session</span>
      </div>
    </motion.div>
  );
}
