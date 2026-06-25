"use client";

import React, { useState, useMemo, useCallback } from 'react';
import { useStore, Supplier } from '@/store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, AlertTriangle, Shield, ChevronDown, X,
  Zap, CheckCircle2, ArrowRight, Search, Radio,
  RefreshCcw, ShieldAlert
} from 'lucide-react';

// ─── Utility ─────────────────────────────────────────────────────────────────

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Known city/country coordinates for the region selector
const KNOWN_LOCATIONS: Record<string, { lat: number; lng: number; label: string }> = {
  'Tokyo, Japan':       { lat: 35.6762, lng: 139.6503, label: 'Tokyo, Japan' },
  'Shanghai, China':    { lat: 31.2304, lng: 121.4737, label: 'Shanghai, China' },
  'Shenzhen, China':    { lat: 22.5431, lng: 114.0579, label: 'Shenzhen, China' },
  'Mumbai, India':      { lat: 19.0760, lng: 72.8777,  label: 'Mumbai, India' },
  'Seoul, South Korea': { lat: 37.5665, lng: 126.9780, label: 'Seoul, South Korea' },
  'Singapore':          { lat: 1.3521,  lng: 103.8198, label: 'Singapore' },
  'Los Angeles, USA':   { lat: 34.0522, lng: -118.2437, label: 'Los Angeles, USA' },
  'Chicago, USA':       { lat: 41.8781, lng: -87.6298,  label: 'Chicago, USA' },
  'New York, USA':      { lat: 40.7128, lng: -74.0060,  label: 'New York, USA' },
  'Hamburg, Germany':   { lat: 53.5753, lng: 10.0153,  label: 'Hamburg, Germany' },
  'Rotterdam, Netherlands': { lat: 51.9244, lng: 4.4777, label: 'Rotterdam, Netherlands' },
  'London, UK':         { lat: 51.5074, lng: -0.1278,  label: 'London, UK' },
  'São Paulo, Brazil':  { lat: -23.5505, lng: -46.6333, label: 'São Paulo, Brazil' },
  'Dubai, UAE':         { lat: 25.2048, lng: 55.2708,  label: 'Dubai, UAE' },
  'Sydney, Australia':  { lat: -33.8688, lng: 151.2093, label: 'Sydney, Australia' },
  'Taipei, Taiwan':     { lat: 25.0330, lng: 121.5654, label: 'Taipei, Taiwan' },
  'Mexico City, Mexico':{ lat: 19.4326, lng: -99.1332, label: 'Mexico City, Mexico' },
  'Guangzhou, China':   { lat: 23.1291, lng: 113.2644, label: 'Guangzhou, China' },
};

// ─── Types ───────────────────────────────────────────────────────────────────

interface RiskZoneResult {
  location: string;
  lat: number;
  lng: number;
  radius: number;
  affectedSuppliers: Supplier[];
  safeAlternatives: { supplier: Supplier; alternative: Supplier | null }[];
}

// ─── Component ───────────────────────────────────────────────────────────────

interface RegionRiskAnalysisProps {
  compact?: boolean;
}

export default function RegionRiskAnalysis({ compact = false }: RegionRiskAnalysisProps) {
  const { suppliers, updateSupplier } = useStore();
  const [selectedLocation, setSelectedLocation] = useState('');
  const [customSearch, setCustomSearch] = useState('');
  const [radius, setRadius] = useState(500);
  const [result, setResult] = useState<RiskZoneResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [riskActive, setRiskActive] = useState(false);

  const filteredLocations = useMemo(() => {
    const query = customSearch.toLowerCase();
    if (!query) return Object.values(KNOWN_LOCATIONS).slice(0, 8);
    return Object.values(KNOWN_LOCATIONS).filter(l => l.label.toLowerCase().includes(query)).slice(0, 8);
  }, [customSearch]);

  const runRiskAnalysis = useCallback(() => {
    const loc = KNOWN_LOCATIONS[selectedLocation];
    if (!loc || suppliers.length === 0) return;

    setIsRunning(true);
    setTimeout(() => {
      const affected = suppliers.filter(s => {
        if (!s.lat || !s.lng) return false;
        return getDistance(loc.lat, loc.lng, s.lat, s.lng) <= radius;
      });

      // Flag affected suppliers in the global store (triggers Globe re-render)
      affected.forEach(s => {
        updateSupplier(s.id, { risk: Math.min(100, s.risk + 40), health: Math.max(0, s.health - 35) });
      });

      // Build alternatives for each affected supplier
      const alternatives = affected.map(s => {
        const alternative = suppliers.find(b =>
          b.id !== s.id &&
          b.category === s.category &&
          !affected.find(a => a.id === b.id) &&
          b.health > 70
        ) || null;
        return { supplier: s, alternative };
      });

      setResult({
        location: loc.label,
        lat: loc.lat,
        lng: loc.lng,
        radius,
        affectedSuppliers: affected,
        safeAlternatives: alternatives,
      });
      setRiskActive(true);
      setIsRunning(false);
    }, 800);
  }, [selectedLocation, suppliers, radius, updateSupplier]);

  const clearRiskZone = useCallback(() => {
    // Restore supplier health/risk to original values (approximate reset)
    if (result) {
      result.affectedSuppliers.forEach(s => {
        updateSupplier(s.id, {
          risk: Math.max(0, (s.risk || 0) - 40),
          health: Math.min(100, (s.health || 0) + 35),
        });
      });
    }
    setResult(null);
    setRiskActive(false);
    setSelectedLocation('');
    setCustomSearch('');
  }, [result, updateSupplier]);

  const hasData = suppliers.length > 0;

  return (
    <div className={`space-y-5 ${compact ? '' : 'glass-panel p-8 rounded-3xl border border-white/10'}`}>
      {!compact && (
        <div className="flex items-center justify-between">
          <h3 className="font-header text-sm text-white uppercase tracking-widest flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-warning" /> Region Risk Analysis
          </h3>
          {riskActive && (
            <button
              onClick={clearRiskZone}
              className="flex items-center gap-2 text-[9px] text-slate-500 hover:text-white font-bold uppercase tracking-widest px-4 py-2 bg-white/5 border border-white/10 rounded-xl transition-all hover:bg-white/10"
            >
              <RefreshCcw className="w-3 h-3" /> Clear Zone
            </button>
          )}
        </div>
      )}

      {!hasData && (
        <div className="flex items-center gap-3 p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
          <AlertTriangle className="w-4 h-4 text-slate-600 shrink-0" />
          <p className="text-[10px] text-slate-600 uppercase font-bold tracking-widest">Upload a dataset to run region risk analysis.</p>
        </div>
      )}

      {hasData && (
        <>
          {/* Location Selector */}
          <div className="relative">
            <div
              onClick={() => setShowDropdown(!showDropdown)}
              className={`flex items-center gap-3 p-4 bg-white/[0.03] border rounded-2xl cursor-pointer transition-all ${
                showDropdown ? 'border-glow-blue/40 bg-glow-blue/5' : 'border-white/10 hover:border-white/20'
              }`}
            >
              <MapPin className="w-4 h-4 text-slate-500 shrink-0" />
              <span className={`flex-1 text-[10px] font-bold uppercase tracking-widest ${selectedLocation ? 'text-white' : 'text-slate-600'}`}>
                {selectedLocation || 'Select Risk Zone Location'}
              </span>
              <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
            </div>

            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  className="absolute top-full left-0 right-0 mt-2 z-50 bg-[#0a0c10] border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
                >
                  <div className="p-3 border-b border-white/5">
                    <div className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2">
                      <Search className="w-3.5 h-3.5 text-slate-500" />
                      <input
                        autoFocus
                        type="text"
                        placeholder="Search city or country..."
                        value={customSearch}
                        onChange={e => setCustomSearch(e.target.value)}
                        className="bg-transparent text-white text-[10px] font-bold uppercase tracking-widest outline-none flex-1 placeholder:text-slate-700"
                      />
                    </div>
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    {filteredLocations.map(loc => (
                      <button
                        key={loc.label}
                        onClick={() => { setSelectedLocation(loc.label); setShowDropdown(false); setCustomSearch(''); }}
                        className="w-full text-left px-5 py-3 text-[10px] text-slate-400 hover:bg-glow-blue/10 hover:text-white font-bold uppercase tracking-widest transition-all flex items-center gap-3"
                      >
                        <MapPin className="w-3 h-3 shrink-0" /> {loc.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Radius Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Risk Radius</span>
              <span className="text-[10px] text-glow-blue font-mono font-bold">{radius} km</span>
            </div>
            <input
              type="range"
              min={100} max={2000} step={100}
              value={radius}
              onChange={e => setRadius(Number(e.target.value))}
              className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-[8px] text-slate-700 font-mono">
              <span>100km</span><span>1000km</span><span>2000km</span>
            </div>
          </div>

          {/* Run Button */}
          <button
            onClick={runRiskAnalysis}
            disabled={!selectedLocation || isRunning}
            className="w-full py-4 bg-warning/10 border border-warning/30 text-warning rounded-2xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-warning/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            {isRunning ? (
              <><div className="w-3.5 h-3.5 border-2 border-warning/40 border-t-warning rounded-full animate-spin" /> Analyzing...</>
            ) : (
              <><Zap className="w-3.5 h-3.5" /> Run Risk Analysis</>
            )}
          </button>
        </>
      )}

      {/* ── Results ── */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="space-y-4"
          >
            {/* Summary */}
            <div className={`p-5 rounded-2xl border flex items-start gap-4 ${
              result.affectedSuppliers.length > 0
                ? 'bg-red-500/5 border-red-500/20'
                : 'bg-green-500/5 border-green-500/20'
            }`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                result.affectedSuppliers.length > 0 ? 'bg-red-500/10' : 'bg-green-500/10'
              }`}>
                {result.affectedSuppliers.length > 0
                  ? <AlertTriangle className="w-5 h-5 text-red-400" />
                  : <CheckCircle2 className="w-5 h-5 text-green-400" />}
              </div>
              <div className="flex-1">
                <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${result.affectedSuppliers.length > 0 ? 'text-red-400' : 'text-green-400'}`}>
                  {result.affectedSuppliers.length > 0
                    ? `${result.affectedSuppliers.length} Supplier${result.affectedSuppliers.length > 1 ? 's' : ''} in Risk Zone`
                    : 'Zone Clear — No Suppliers Affected'}
                </p>
                <p className="text-[9px] text-slate-500 uppercase font-bold">
                  {result.location} · {result.radius} km radius
                </p>
              </div>
              <button onClick={() => setResult(null)} className="text-slate-600 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Affected Suppliers + Recommendations */}
            {result.safeAlternatives.length > 0 && (
              <div className="space-y-3">
                <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">
                  {result.safeAlternatives.filter(a => a.alternative).length} Alternatives Available
                </p>
                {result.safeAlternatives.map(({ supplier: s, alternative }) => (
                  <div key={s.id} className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-white font-bold uppercase truncate">{s.name}</p>
                        <p className="text-[8px] text-slate-600 uppercase">{s.category} · Tier {s.tier}</p>
                      </div>
                      <span className="text-[9px] text-red-400 font-mono font-bold shrink-0">AFFECTED</span>
                    </div>
                    {alternative ? (
                      <div className="ml-5 pl-4 border-l border-green-500/20 flex items-center gap-3">
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-[9px] text-green-400 font-bold uppercase">Recommended: {alternative.name}</p>
                          <p className="text-[8px] text-slate-600 uppercase">{alternative.category} · Health {alternative.health}% · {alternative.city || 'Global'}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="ml-5 pl-4 border-l border-slate-800 flex items-center gap-3">
                        <AlertTriangle className="w-3.5 h-3.5 text-yellow-600 shrink-0" />
                        <p className="text-[9px] text-slate-600 uppercase font-bold">No available alternative in same category</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
