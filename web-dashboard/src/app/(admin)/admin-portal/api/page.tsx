"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Server, Activity, Zap, Network, Globe, Lock,
  RefreshCw, CheckCircle2, XCircle, Loader2, Copy, Check, AlertTriangle
} from 'lucide-react';
import { useStore } from '@/store/useStore';

const INITIAL_ENDPOINTS = [
  { id: 'EP-001', name: 'Supply Chain Sync API', url: '/api/v2/supply/sync', method: 'POST', latency: 12, status: 'UP', calls: 14820, errors: 2 },
  { id: 'EP-002', name: 'Risk Score Engine', url: '/api/v2/risk/evaluate', method: 'GET', latency: 8, status: 'UP', calls: 9450, errors: 0 },
  { id: 'EP-003', name: 'Organization Auth Gate', url: '/api/v2/org/auth', method: 'POST', latency: 34, status: 'DEGRADED', calls: 5210, errors: 87 },
  { id: 'EP-004', name: 'Simulation Dispatch', url: '/api/v2/simulation/run', method: 'POST', latency: 220, status: 'UP', calls: 1040, errors: 5 },
  { id: 'EP-005', name: 'Partner Node Handshake', url: '/api/v2/partner/handshake', method: 'GET', latency: 6, status: 'UP', calls: 32100, errors: 1 },
  { id: 'EP-006', name: 'Disaster Feed Ingest', url: '/api/v2/disaster/ingest', method: 'POST', latency: 18, status: 'DOWN', calls: 880, errors: 880 },
];

type EndpointStatus = 'UP' | 'DEGRADED' | 'DOWN';

export default function AdminAPIPage() {
  const { addAuditLog } = useStore();
  const [endpoints, setEndpoints] = useState(INITIAL_ENDPOINTS);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  // Simulate live latency fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setEndpoints(prev => prev.map(ep => ep.status === 'DOWN' ? ep : {
        ...ep,
        latency: Math.max(2, ep.latency + Math.floor((Math.random() - 0.5) * 6)),
        calls: ep.calls + Math.floor(Math.random() * 5),
      }));
      setTick(t => t + 1);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3500); };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setEndpoints(INITIAL_ENDPOINTS.map(ep => ({
        ...ep,
        latency: Math.max(2, ep.latency + Math.floor((Math.random() - 0.4) * 8)),
        errors: Math.max(0, ep.errors + Math.floor((Math.random() - 0.7) * 3)),
      })));
      addAuditLog({ user: 'ROOT_ADMIN', action: 'API_HEALTH_REFRESH', result: 'SUCCESS', details: 'Admin manually refreshed API gateway health telemetry.' });
      setIsRefreshing(false);
      showToast('API gateway health refreshed.');
    }, 1000);
  };

  const handleToggle = (id: string) => {
    const ep = endpoints.find(e => e.id === id);
    if (!ep) return;
    const newStatus: EndpointStatus = ep.status === 'UP' || ep.status === 'DEGRADED' ? 'DOWN' : 'UP';
    setEndpoints(prev => prev.map(e => e.id === id ? { ...e, status: newStatus, errors: newStatus === 'DOWN' ? e.calls : e.errors } : e));
    addAuditLog({ user: 'ROOT_ADMIN', action: `ENDPOINT_${newStatus}`, result: 'SUCCESS', details: `${ep.name} (${ep.url}) status changed to ${newStatus} by admin.` });
    showToast(`${ep.name} is now ${newStatus}.`);
    setSelectedId(null);
  };

  const handleCopy = (url: string, id: string) => {
    navigator.clipboard.writeText(`https://api.globalchain.intel${url}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const statusColor = (s: EndpointStatus) => ({ UP: 'text-green-500', DEGRADED: 'text-yellow-500', DOWN: 'text-red-500' }[s]);
  const statusBg = (s: EndpointStatus) => ({ UP: 'bg-green-500/10 border-green-500/20', DEGRADED: 'bg-yellow-500/10 border-yellow-500/20', DOWN: 'bg-red-500/10 border-red-500/20' }[s]);
  const latencyColor = (l: number) => l < 20 ? 'text-green-500' : l < 100 ? 'text-yellow-500' : 'text-red-500';

  const upCount = endpoints.filter(e => e.status === 'UP').length;
  const downCount = endpoints.filter(e => e.status === 'DOWN').length;
  const totalCalls = endpoints.reduce((a, e) => a + e.calls, 0);

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
            <Server className="text-blue-500 w-6 h-6 animate-pulse" /> API_Intelligence_Gateway
          </h2>
          <p className="text-slate-500 text-xs mt-1 font-bold uppercase tracking-[0.2em]">Monitoring External Integrations and Partner Handshakes...</p>
        </div>
        <button onClick={handleRefresh} disabled={isRefreshing}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white text-[10px] font-bold uppercase tracking-widest rounded flex items-center gap-2 transition-all">
          {isRefreshing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          Refresh Health
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Endpoints Online', value: `${upCount}/${endpoints.length}`, color: 'text-green-500', icon: Globe },
          { label: 'Down / Degraded', value: `${downCount + endpoints.filter(e=>e.status==='DEGRADED').length}`, color: 'text-red-500', icon: AlertTriangle },
          { label: 'Total API Calls', value: totalCalls.toLocaleString(), color: 'text-blue-400', icon: Activity },
          { label: 'Avg Latency', value: `${Math.round(endpoints.filter(e=>e.status!=='DOWN').reduce((a,e)=>a+e.latency,0)/Math.max(1,endpoints.filter(e=>e.status!=='DOWN').length))}ms`, color: 'text-blue-400', icon: Zap },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="p-6 bg-[#0a0c10] border border-blue-900/20 rounded-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-15 transition-opacity"><s.icon className="w-10 h-10" /></div>
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-2">{s.label}</p>
            <h3 className={`text-2xl font-bold tracking-tighter ${s.color}`}>{s.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Endpoint Table */}
      <div className="bg-[#0a0c10] border border-blue-900/20 rounded-2xl overflow-hidden">
        <div className="px-8 py-5 border-b border-blue-900/10 flex items-center justify-between bg-blue-500/[0.02]">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
            <Network className="w-4 h-4 text-blue-500" /> Live Endpoint Registry
          </h3>
          <span className="text-[9px] text-slate-500 font-mono animate-pulse">LIVE TELEMETRY ACTIVE</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-blue-900/10">
                {['Endpoint', 'Method', 'URL', 'Latency', 'Total Calls', 'Errors', 'Status', 'Action'].map(h => (
                  <th key={h} className="px-6 py-4 text-[9px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-900/10">
              {endpoints.map(ep => (
                <tr key={ep.id} className="hover:bg-blue-500/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${ep.status === 'UP' ? 'bg-green-500 animate-pulse' : ep.status === 'DEGRADED' ? 'bg-yellow-500 animate-pulse' : 'bg-red-500'}`} />
                      <span className="text-xs font-bold text-white">{ep.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${ep.method === 'POST' ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'}`}>{ep.method}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <code className="text-[10px] text-slate-400 font-mono">{ep.url}</code>
                      <button onClick={() => handleCopy(ep.url, ep.id)} className="text-slate-600 hover:text-white transition-colors">
                        {copiedId === ep.id ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold ${latencyColor(ep.latency)}`}>{ep.status === 'DOWN' ? '—' : `${ep.latency}ms`}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-slate-400 font-mono">{ep.calls.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold ${ep.errors > 0 ? 'text-red-400' : 'text-green-400'}`}>{ep.errors}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[9px] font-bold px-2 py-1 rounded border ${statusBg(ep.status as EndpointStatus)} ${statusColor(ep.status as EndpointStatus)}`}>{ep.status}</span>
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => handleToggle(ep.id)}
                      className={`px-3 py-1.5 text-[9px] font-bold uppercase rounded border transition-all ${ep.status === 'DOWN' ? 'border-green-500/20 text-green-400 hover:bg-green-500/10' : 'border-red-500/20 text-red-400 hover:bg-red-500/10'}`}>
                      {ep.status === 'DOWN' ? 'Enable' : 'Disable'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
