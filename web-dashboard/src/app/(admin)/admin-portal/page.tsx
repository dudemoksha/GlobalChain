"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Terminal as TerminalIcon, Shield, Database, Users, Server, 
  Cpu, HardDrive, Network, AlertCircle, CheckCircle2,
  Download, Trash2, RefreshCcw, Loader2
} from 'lucide-react';
import { useStore } from '@/store/useStore';

export default function AdminOverviewPage() {
  const { auditLogs, clearAuditLogs, addAuditLog } = useStore();
  const [isExporting, setIsExporting] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleClearTerminal = () => {
    setIsClearing(true);
    setTimeout(() => {
      clearAuditLogs();
      addAuditLog({
        user: 'ROOT_ADMIN',
        action: 'CLEAR_TERMINAL',
        result: 'SUCCESS',
        details: 'Admin cleared the local stream terminal view.'
      });
      setIsClearing(false);
      showFeedback('Terminal logs cleared successfully.');
    }, 600);
  };

  const handleExportLogs = () => {
    setIsExporting(true);
    setTimeout(() => {
      if (auditLogs.length === 0) {
        showFeedback('No logs available to export.');
        setIsExporting(false);
        return;
      }
      
      const headers = ['ID', 'Timestamp', 'User', 'Action', 'Result', 'Details'];
      const rows = auditLogs.map(log => [
        log.id,
        log.timestamp,
        log.user,
        log.action,
        log.result,
        log.details.replace(/"/g, '""')
      ]);
      
      const csvContent = "data:text/csv;charset=utf-8," 
        + [headers.join(','), ...rows.map(e => e.map(val => `"${val}"`).join(','))].join('\n');
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `globalchain_audit_logs_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      addAuditLog({
        user: 'ROOT_ADMIN',
        action: 'EXPORT_AUDIT_LOGS',
        result: 'SUCCESS',
        details: `Exported ${auditLogs.length} activity logs to CSV format.`
      });

      setIsExporting(false);
      showFeedback('Audit logs exported successfully.');
    }, 800);
  };

  const showFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 4000);
  };

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toTimeString().split(' ')[0];
    } catch (e) {
      return '00:00:00';
    }
  };

  return (
    <div className="space-y-8">
      {feedback && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-20 right-6 z-50 p-4 bg-[#0a0c10] border border-blue-500/40 rounded-xl shadow-2xl flex items-center gap-3"
        >
          <CheckCircle2 className="w-5 h-5 text-green-500" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">{feedback}</span>
        </motion.div>
      )}

      {/* Header Section */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tighter uppercase flex items-center gap-3">
            <TerminalIcon className="text-blue-500 w-6 h-6 animate-pulse" /> System_Integrity_Dashboard
          </h2>
          <p className="text-slate-500 text-xs mt-1 font-bold uppercase tracking-[0.2em]">Cross-Referencing Global_Link_Nodes...</p>
        </div>
        <div className="flex gap-2">
           <div className="px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
              <span className="text-[10px] font-bold text-blue-400">ENCRYPTION: AES-256-GCM</span>
           </div>
        </div>
      </div>

      {/* Hardware / Load Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { icon: Cpu, label: 'Compute Load', value: '14.2%', trend: 'NOMINAL', color: 'text-blue-400' },
          { icon: HardDrive, label: 'DB Storage', value: '42.8TB', trend: 'OK', color: 'text-green-500' },
          { icon: Network, label: 'Network Bandwidth', value: '1.2GB/s', trend: 'STABLE', color: 'text-blue-400' },
          { icon: Server, label: 'Active Clusters', value: '12/12', trend: 'ALL_UP', color: 'text-green-500' },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 bg-blue-500/[0.02] border border-blue-900/20 rounded-xl relative group overflow-hidden"
          >
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-all">
                <stat.icon className="w-12 h-12" />
             </div>
             <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-2">{stat.label}</p>
             <div className="flex items-end justify-between">
                <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
                <span className={`text-[9px] font-bold uppercase ${stat.color}`}>{stat.trend}</span>
             </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Core System Log */}
        <div className="lg:col-span-2 p-8 bg-[#0a0c10] border border-blue-900/20 rounded-2xl relative">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
              <Database className="w-4 h-4 text-blue-500" /> Global_Link_Audit_Stream
            </h3>
            <span className="text-[9px] text-slate-500 font-mono">CHANNEL_402_RECV</span>
          </div>

          <div className="space-y-4 font-mono text-[11px] min-h-[175px] max-h-[300px] overflow-y-auto pr-2">
            {auditLogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 border border-dashed border-blue-900/20 rounded-lg bg-black/20 text-slate-500 uppercase font-bold text-[10px]">
                <AlertCircle className="w-8 h-8 text-slate-600 mb-2" />
                <span>[LOGS_STREAM_VACANT]</span>
              </div>
            ) : (
              auditLogs.slice(0, 7).map((log) => (
                <div key={log.id} className="flex gap-4 p-2 border-l border-blue-500/20 hover:bg-blue-500/5 transition-all">
                  <span className="text-slate-600 shrink-0">[{formatTime(log.timestamp)}]</span>
                  <span className={`font-bold shrink-0 w-20 ${log.result === 'FAILED' ? 'text-red-500' : 'text-blue-400'}`}>{log.user}</span>
                  <span className="text-slate-300 flex-1">{log.details}</span>
                  <span className="font-bold text-green-500">{log.result}</span>
                </div>
              ))
            )}
          </div>
          
          <div className="mt-8 pt-6 border-t border-blue-900/10">
            <div className="flex gap-4">
              <button 
                onClick={handleExportLogs}
                disabled={isExporting}
                className="px-4 py-2 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest rounded hover:bg-blue-700 disabled:bg-blue-800 transition-all flex items-center gap-2"
              >
                {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                Export Log Audit
              </button>
              <button 
                onClick={handleClearTerminal}
                disabled={isClearing}
                className="px-4 py-2 border border-blue-500/20 text-slate-400 text-[10px] font-bold uppercase tracking-widest rounded hover:bg-white/5 transition-colors flex items-center gap-2"
              >
                {isClearing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                Clear Terminal
              </button>
            </div>
          </div>
        </div>

        {/* Realtime Health Monitor */}
        <div className="p-8 bg-[#0a0c10] border border-blue-900/20 rounded-2xl">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-8 flex items-center gap-2">
            <Server className="w-4 h-4 text-blue-500" /> Node_Health_Matrix
          </h3>
          <div className="grid grid-cols-4 gap-2">
             {[...Array(24)].map((_, i) => (
               <motion.div 
                 key={i}
                 initial={{ scale: 0 }}
                 animate={{ scale: 1 }}
                 transition={{ delay: i * 0.02 }}
                 className={`h-4 rounded-sm ${i === 14 ? 'bg-red-500' : i % 7 === 0 ? 'bg-yellow-500' : 'bg-green-500/40'} border border-black/20`}
                 title={`Node_Cluster_ID: ${i+100}`}
               />
             ))}
          </div>
          <div className="mt-12 space-y-4">
             <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded">
                <div className="flex justify-between items-center mb-2">
                   <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Global Stability</span>
                   <span className="text-xs font-bold text-success">98.2%</span>
                </div>
                <div className="h-1 w-full bg-blue-900/20 rounded-full overflow-hidden">
                   <div className="h-full bg-blue-500 w-[98%]" />
                </div>
             </div>
             <div className="flex items-center gap-3 text-[10px] text-slate-500 uppercase font-bold">
                <AlertCircle className="w-4 h-4 text-warning" />
                <span>1 Minor Cluster Warning</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
