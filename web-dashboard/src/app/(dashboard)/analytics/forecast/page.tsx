"use client";

import AnalyticsHub from '@/components/AnalyticsHub';
import RegionRiskAnalysis from '@/components/RegionRiskAnalysis';
import { useStore } from '@/store/useStore';

export default function ForecastAnalytics() {
  const { suppliers } = useStore();

  return (
    <div className="space-y-8 pb-10">
      {/* Analytics Hub — all KPIs, charts, distributions */}
      <AnalyticsHub />

      {/* Region Risk Analysis — only if data is loaded */}
      {suppliers.length > 0 && (
        <RegionRiskAnalysis />
      )}
    </div>
  );
}
