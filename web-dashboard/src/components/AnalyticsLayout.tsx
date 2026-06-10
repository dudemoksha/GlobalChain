import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface LayoutProps {
  category: string;
  children: React.ReactNode;
}

export default function AnalyticsLayout({ category, children }: LayoutProps) {
  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase tracking-widest mb-2 font-mono">
        <span>Analytics</span>
        <span className="opacity-30">/</span>
        <span className="text-slate-300">{category}</span>
      </div>
      {/* Header */}
      <h2 className="font-header text-3xl text-white tracking-tight uppercase italic">
        {category} <span className="text-glow-blue">Analytics</span>
      </h2>
      {/* Content */}
      <div className="glass-panel border border-white/10 rounded-3xl p-8">
        {children}
      </div>
    </div>
  );
}
