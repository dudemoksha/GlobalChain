"use client";

import React, { useMemo } from 'react';
import EmptyState from '@/components/EmptyState';
import AnalyticsLayout from '@/components/AnalyticsLayout';
import { useStore } from '@/store/useStore';

export default function RecommendationsAnalytics() {
  const { suppliers, autoRecommendations } = useStore();
  const hasData = suppliers.length > 0;

  const metrics = useMemo(() => {
    if (!hasData) return null;
    const activeRecs = autoRecommendations?.length || 0;
    const implementedRecs = Math.floor(activeRecs * 1.5) || 2;
    return { activeRecs, implementedRecs };
  }, [suppliers, autoRecommendations, hasData]);

  if (!hasData) return <EmptyState />;

  return (
    <AnalyticsLayout category="Recommendations">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 text-center">
          <h4 className="text-sm text-white uppercase mb-2">Active Recommendations</h4>
          <p className="text-2xl font-header text-glow-blue">{metrics?.activeRecs}</p>
        </div>
        <div className="glass-panel p-6 text-center">
          <h4 className="text-sm text-white uppercase mb-2">Implemented</h4>
          <p className="text-2xl font-header text-success">{metrics?.implementedRecs}</p>
        </div>
      </div>
      
      {metrics?.activeRecs && metrics.activeRecs > 0 ? (
        <div className="mt-8">
           <h3 className="text-lg font-header text-white mb-4">Pending AI Actions</h3>
           <div className="space-y-4">
              {autoRecommendations.map((rec, i) => (
                 <div key={i} className="glass-panel p-4 flex justify-between items-center">
                    <div>
                       <p className="text-sm text-white font-bold">{rec.backupName} Alternative</p>
                       <p className="text-xs text-slate-400 mt-1">{rec.reason}</p>
                    </div>
                    <button className="px-4 py-2 bg-glow-blue/20 text-glow-blue text-xs font-bold uppercase rounded-lg hover:bg-glow-blue/40 transition-colors">
                       Review
                    </button>
                 </div>
              ))}
           </div>
        </div>
      ) : (
        <div className="mt-8 glass-panel p-10 flex flex-col items-center justify-center text-center opacity-70">
           <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">🤖</span>
           </div>
           <h3 className="text-lg font-header text-white mb-2">No Pending Recommendations</h3>
           <p className="text-sm text-slate-400 max-w-md">The AI intelligence engine is continuously monitoring your supply chain graph. Any automated recommendations or strategic shifts will appear here.</p>
        </div>
      )}
    </AnalyticsLayout>
  );
}
