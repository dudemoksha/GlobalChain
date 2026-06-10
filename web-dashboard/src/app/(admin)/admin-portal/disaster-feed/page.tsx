"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, AlertTriangle, Radio, MapPin, Zap, CheckCircle2, Loader2, X, ShieldAlert } from 'lucide-react';
import { useStore } from '@/store/useStore';

const INCIDENT_TYPES = [
  'Geopolitical Conflict', 'Port Closure', 'Typhoon / Hurricane',
  'Cyber Attack', 'Earthquake', 'Labor Strike', 'Pandemic Alert', 'Sanctions Imposed'
];

const SEVERITY_LEVELS = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const;
type SeverityLevel = typeof SEVERITY_LEVELS[number];

interface Incident {
  id: string;
  type: string;
  region: string;
  severity: SeverityLevel;
  message: string;
  timestamp: string;
  status: 'ACTIVE' | 'RESOLVED';
}

export default function AdminDisasterFeedPage() {
  const { addAuditLog } = useStore();
  const [incidents, setIncidents] = useState<Incident[]>([
    { id: 'INC-001', type: 'Port Closure', region: 'Singapore (SG-02)', severity: 'HIGH', message: 'Singapore port SG-02 closed due to maritime labor dispute. Rerouting in progress.', timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), status: 'ACTIVE' },
    { id: 'INC-002', type: 'Geopolitical Conflict', region: 'Eastern Europe', severity: 'CRITICAL', message: 'Trade route suspension across Eastern European corridor. 14 nodes affected.', timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), status: 'ACTIVE' },
  ]);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const [form, setForm] = useState({
    type: INCIDENT_TYPES[0],
    region: '',
    severity: 'HIGH' as SeverityLevel,
    message: '',
  });

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  const handleBroadcast = () => {
    if (!form.region.trim() || !form.message.trim()) {
      showToast('Region and message are required.');
      return;
    }
    setIsBroadcasting(true);
    setTimeout(() => {
      const newIncident: Incident = {
        id: `INC-${String(incidents.length + 1).padStart(3, '0')}`,
        type: form.type,
        region: form.region,
        severity: form.severity,
        message: form.message,
        timestamp: new Date().toISOString(),
        status: 'ACTIVE',
      };
      setIncidents(prev => [newIncident, ...prev]);
      addAuditLog({
        user: 'ROOT_ADMIN',
        action: 'BROADCAST_EMERGENCY_ALERT',
        result: 'SUCCESS',
        details: `Emergency alert broadcasted: ${form.type} in ${form.region}. Severity: ${form.severity}.`
      });
      setIsBroadcasting(false);
      setShowForm(false);
      setForm({ type: INCIDENT_TYPES[0], region: '', severity: 'HIGH', message: '' });
      showToast(`Alert broadcasted to all ${form.severity} priority nodes.`);
    }, 1200);
  };

  const handleResolve = (id: string) => {
    const inc = incidents.find(i => i.id === id);
    setIncidents(prev => prev.map(i => i.id === id ? { ...i, status: 'RESOLVED' } : i));
    addAuditLog({
      user: 'ROOT_ADMIN',
      action: 'INCIDENT_RESOLVED',
      result: 'SUCCESS',
      details: `Incident ${id} (${inc?.type} in ${inc?.region}) marked as resolved.`
    });
    showToast(`Incident ${id} resolved.`);
  };

  const severityColor = (s: SeverityLevel) => ({
    LOW: 'text-green-500 bg-green-500/10 border-green-500/20',
    MEDIUM: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
    HIGH: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
    CRITICAL: 'text-red-500 bg-red-500/10 border-red-500/20',
  }[s]);

  const activeCount = incidents.filter(i => i.status === 'ACTIVE').length;

  return (
    <div className="space-y-8 font-mono">
      {toast && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="fixed top-20 right-6 z-50 p-4 bg-[#0a0c10] border border-blue-500/40 rounded-xl shadow-2xl flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-500" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">{toast}</span>
        </motion.div>
      )}

      {/* Header */}
      <div className="flex justify-between items-end flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tighter uppercase flex items-center gap-3">
            <Globe className="text-blue-500 w-6 h-6 animate-pulse" /> Disaster_Protocol_Override
          </h2>
          <p className="text-slate-500 text-xs mt-1 font-bold uppercase tracking-[0.2em]">
            High-Level Incident Authorization and Global Alerts...
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl">
          <Radio className="w-4 h-4 text-red-500 animate-pulse" />
          <span className="text-[10px] font-bold text-red-400 uppercase">{activeCount} Active Incident{activeCount !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Broadcast Panel */}
      <div className="p-8 bg-red-500/5 border border-red-500/20 rounded-3xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.06)_0%,transparent_70%)] pointer-events-none" />
        <div className="flex flex-col md:flex-row justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <ShieldAlert className="w-10 h-10 text-red-500/60 shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-bold text-white uppercase tracking-widest mb-1">Incident_Broadcast_Terminal</h3>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest max-w-md">
                Authorized level 5 only. Trigger global alerts, reroute shipping lanes, and initiate emergency node shutdowns.
              </p>
            </div>
          </div>
          <div className="flex gap-3 shrink-0">
            <button onClick={() => setShowForm(!showForm)}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl shadow-[0_0_20px_rgba(239,68,68,0.25)] transition-all flex items-center gap-2">
              <Radio className="w-4 h-4" /> {showForm ? 'Cancel Alert' : 'Broadcast_Emergency_Alert'}
            </button>
          </div>
        </div>

        {/* Broadcast Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="mt-8 pt-8 border-t border-red-500/20 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-2 block">Incident Type</label>
                <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                  className="w-full bg-black/40 border border-red-900/30 rounded-lg p-3 text-xs text-white font-mono focus:outline-none focus:border-red-500/50">
                  {INCIDENT_TYPES.map(t => <option key={t} value={t} className="bg-[#0d1117]">{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-2 block">Affected Region</label>
                <input value={form.region} onChange={e => setForm(f => ({ ...f, region: e.target.value }))}
                  placeholder="e.g. Singapore Port, Eastern Europe..."
                  className="w-full bg-black/40 border border-red-900/30 rounded-lg p-3 text-xs text-white font-mono focus:outline-none focus:border-red-500/50" />
              </div>
              <div>
                <label className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-2 block">Severity Level</label>
                <div className="flex gap-2">
                  {SEVERITY_LEVELS.map(s => (
                    <button key={s} onClick={() => setForm(f => ({ ...f, severity: s }))}
                      className={`flex-1 py-2 text-[9px] font-bold uppercase rounded border transition-all ${form.severity === s ? severityColor(s) + ' ring-1' : 'border-red-900/20 text-slate-500 hover:bg-white/5'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-2 block">Broadcast Message</label>
                <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  placeholder="Enter alert message for all nodes..."
                  rows={2}
                  className="w-full bg-black/40 border border-red-900/30 rounded-lg p-3 text-xs text-white font-mono focus:outline-none focus:border-red-500/50 resize-none" />
              </div>
              <div className="md:col-span-2 flex justify-end">
                <button onClick={handleBroadcast} disabled={isBroadcasting}
                  className="px-8 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl flex items-center gap-2 transition-all">
                  {isBroadcasting ? <><Loader2 className="w-4 h-4 animate-spin" /> Broadcasting...</> : <><Zap className="w-4 h-4" /> Transmit Alert</>}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Active Incidents */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
          <MapPin className="w-4 h-4 text-blue-500" /> Live Incident Register
        </h3>
        <AnimatePresence>
          {incidents.map(inc => (
            <motion.div key={inc.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
              className={`p-6 bg-[#0a0c10] border rounded-2xl flex flex-col md:flex-row justify-between gap-4 ${inc.status === 'RESOLVED' ? 'opacity-40 border-blue-900/10' : 'border-red-500/20'}`}>
              <div className="flex items-start gap-5">
                <AlertTriangle className={`w-6 h-6 shrink-0 mt-0.5 ${inc.severity === 'CRITICAL' ? 'text-red-500 animate-pulse' : inc.severity === 'HIGH' ? 'text-orange-500' : 'text-yellow-500'}`} />
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-1">
                    <span className="text-sm font-bold text-white">{inc.type}</span>
                    <span className={`px-2 py-0.5 border text-[8px] font-bold uppercase rounded ${severityColor(inc.severity)}`}>{inc.severity}</span>
                    {inc.status === 'RESOLVED' && <span className="px-2 py-0.5 border text-[8px] font-bold uppercase rounded text-green-500 bg-green-500/10 border-green-500/20">RESOLVED</span>}
                  </div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold mb-1 flex items-center gap-1"><MapPin className="w-3 h-3" />{inc.region}</p>
                  <p className="text-xs text-slate-300 max-w-xl">{inc.message}</p>
                  <p className="text-[9px] text-slate-600 mt-2 font-mono">{inc.id} // {new Date(inc.timestamp).toLocaleString()}</p>
                </div>
              </div>
              {inc.status === 'ACTIVE' && (
                <button onClick={() => handleResolve(inc.id)}
                  className="px-5 py-2 bg-green-500/10 border border-green-500/20 text-green-500 text-[9px] font-bold uppercase tracking-widest rounded-xl hover:bg-green-500 hover:text-white transition-all self-start md:self-center flex items-center gap-2 shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Resolve
                </button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
