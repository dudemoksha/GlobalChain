import React from 'react';
import Link from 'next/link';

interface EmptyStateProps {
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export default function EmptyState({
  title = 'No Data Available',
  subtitle = 'Upload a dataset to unlock analytics.',
  ctaLabel = 'Upload Data',
  ctaHref = '/data/upload',
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 space-y-4">
      <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-white/30"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 17v-2a2 2 0 00-2-2H5a2 2 0 00-2 2v2h6zm0 0h6m-6-6h6m-6-6h6m-6-6h6"
          />
        </svg>
      </div>
      <h2 className="text-2xl font-header text-white tracking-tighter">{title}</h2>
      <p className="text-sm text-slate-500 max-w-md text-center">{subtitle}</p>
      <Link
        href={ctaHref}
        className="px-6 py-2 bg-glow-blue text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-glow-blue/80 transition"
      >
        {ctaLabel}
      </Link>
    </div>
  );
}
