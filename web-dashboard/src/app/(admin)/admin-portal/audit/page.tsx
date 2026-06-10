"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileSearch, Search, Download, ShieldCheck, 
  Database, History, Play, Pause, ChevronLeft, ChevronRight, Loader2, RefreshCw
} from 'lucide-react';
import { useStore } from '@/store/useStore';

export default function AdminAuditPage() {
  const { auditLogs, addAuditLog, clearAuditLogs } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [userFilter, setUserFilter] = useState('ALL');
  const [resultFilter, setResultFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLiveStream, setIsLiveStream] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Live Stream Simulator Interval
  const streamIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const mockLogs = [
    { user: 'SYSTEM', action: 'CRON_LATENCY_CHECK', result: 'SUCCESS', details: 'Ping latency to Singapore SG-02 cluster: 12ms.' },
    { user: 'AUTH_GATE', action: 'API_AUTHENTICATION', result: 'SUCCESS', details: 'User verified via token exchange protocol.' },
    { user: 'SYSTEM', action: 'MEM_CLEANUP', result: 'COMPLETE', details: 'Flushed node cache buffers from shared buffer pool.' },
    { user: 'NETWORK_SHARD', action: 'ROUTE_LATENCY_ALERT', result: 'WARNING', details: 'Increased package loss detected on North Atlantic fiber line.' },
    { user: 'SYSTEM', action: 'METRIC_SYNC', result: 'SUCCESS', details: 'Syncing telemetry metrics with regional secondary nodes.' }
  ];

  useEffect(() => {
    if (isLiveStream) {
      streamIntervalRef.current = setInterval(() => {
        const randomLog = mockLogs[Math.floor(Math.random() * mockLogs.length)];
        addAuditLog({
          user: randomLog.user,
          action: randomLog.action,
          result: randomLog.result,
          details: randomLog.details
        });
      }, 15000); // add a log every 15s
    } else {
      if (streamIntervalRef.current) {
        clearInterval(streamIntervalRef.current);
      }
    }

    return () => {
      if (streamIntervalRef.current) {
        clearInterval(streamIntervalRef.current);
      }
    };
  }, [isLiveStream]);

  // Extract unique users for the filter dropdown
  const uniqueUsers = ['ALL', ...Array.from(new Set(auditLogs.map(l => l.user)))];
  const uniqueResults = ['ALL', 'SUCCESS', 'COMPLETE', 'VALIDATED', 'WARNING', 'FAILED'];

  // Filtering logic
  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = 
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.result.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesUser = userFilter === 'ALL' || log.user === userFilter;
    const matchesResult = resultFilter === 'ALL' || log.result === resultFilter;

    return matchesSearch && matchesUser && matchesResult;
  });

  // Pagination calculations
  const totalLogs = filteredLogs.length;
  const totalPages = Math.max(1, Math.ceil(totalLogs / pageSize));
  
  // Ensure current page is valid when logs change
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedLogs = filteredLogs.slice(startIndex, startIndex + pageSize);

  const handleExportFiltered = () => {
    setIsExporting(true);
    setTimeout(() => {
      if (filteredLogs.length === 0) {
        setToastMessage("No logs matching filters to export.");
        setIsExporting(false);
        return;
      }

      const headers = ['ID', 'Timestamp', 'User', 'Action', 'Result', 'Details'];
      const rows = filteredLogs.map(log => [
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
      link.setAttribute("download", `globalchain_audit_export_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      addAuditLog({
        user: 'ROOT_ADMIN',
        action: 'EXPORT_FILTERED_AUDIT',
        result: 'SUCCESS',
        details: `Exported ${filteredLogs.length} filtered audit logs.`
      });

      setIsExporting(false);
      setToastMessage(`Exported ${filteredLogs.length} entries successfully.`);
      setTimeout(() => setToastMessage(null), 3000);
    }, 800);
  };

  const handleClearLogs = () => {
    if (confirm("Are you sure you want to purge all cached logs from the UI terminal? This does not alter the PostgreSQL database.")) {
      clearAuditLogs();
      addAuditLog({
        user: 'ROOT_ADMIN',
        action: 'PURGE_SYSTEM_LOGS',
        result: 'SUCCESS',
        details: 'Admin purged system log buffer.'
      });
      setToastMessage("Logs cleared.");
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  return (
    <div className="space-y-8 font-mono">
      {/* Toast Alert */}
      {toastMessage && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-20 right-6 z-50 p-4 bg-[#0a0c10] border border-blue-500/40 rounded-xl shadow-2xl flex items-center gap-3"
        >
          <ShieldCheck className="w-5 h-5 text-green-500 animate-bounce" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">{toastMessage}</span>
        </motion.div>
      )}

      {/* Header Section */}
      <div className="flex justify-between items-end flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tighter uppercase flex items-center gap-3">
            <FileSearch className="text-blue-500 w-6 h-6 animate-pulse" /> Audit_Compliance_Terminal
          </h2>
          <p className="text-slate-500 text-xs mt-1 font-bold uppercase tracking-[0.2em]">Full Historical Replay of All Node Mutants and API Handshakes...</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleClearLogs}
            className="px-4 py-2.5 border border-red-500/20 text-red-400 text-[10px] font-bold uppercase tracking-widest rounded hover:bg-red-500/10 transition-all flex items-center gap-2"
          >
             Clear Logs
          </button>
          <button 
            onClick={handleExportFiltered}
            disabled={isExporting}
            className="px-6 py-3 bg-white/5 border border-white/10 text-slate-400 text-[10px] font-bold uppercase tracking-widest rounded flex items-center gap-2 hover:bg-white/10 disabled:opacity-50 transition-all"
          >
             {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
             Export_Filtered_Audit
          </button>
        </div>
      </div>

      {/* Terminal View Wrapper */}
      <div className="bg-[#0a0c10] border border-blue-900/20 rounded-3xl overflow-hidden flex flex-col h-[600px]">
          {/* Controls Bar */}
          <div className="p-6 border-b border-blue-900/10 flex flex-col lg:flex-row gap-4 justify-between items-center bg-blue-500/[0.02]">
            <div className="flex flex-wrap gap-3">
               <button 
                 onClick={() => setIsLiveStream(!isLiveStream)}
                 className={`px-4 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 transition-all ${
                   isLiveStream 
                     ? 'bg-green-500/10 border border-green-500/30 text-green-400' 
                     : 'bg-yellow-500/10 border border-yellow-500/30 text-yellow-400'
                 }`}
               >
                 {isLiveStream ? (
                   <>
                     <Play className="w-3.5 h-3.5 animate-pulse text-green-400" /> LIVE_LOGS_ON
                   </>
                 ) : (
                   <>
                     <Pause className="w-3.5 h-3.5 text-yellow-400" /> STREAM_PAUSED
                   </>
                 )}
               </button>
               
               {/* Filters */}
               <div className="flex items-center gap-2 bg-black/40 border border-blue-900/20 rounded px-3 py-1 text-[10px] text-slate-500 font-bold uppercase">
                 <span>User:</span>
                 <select 
                   value={userFilter}
                   onChange={(e) => { setUserFilter(e.target.value); setCurrentPage(1); }}
                   className="bg-transparent text-white focus:outline-none cursor-pointer"
                 >
                   {uniqueUsers.map(user => (
                     <option key={user} value={user} className="bg-[#0a0c10]">{user}</option>
                   ))}
                 </select>
               </div>

               <div className="flex items-center gap-2 bg-black/40 border border-blue-900/20 rounded px-3 py-1 text-[10px] text-slate-500 font-bold uppercase">
                 <span>Result:</span>
                 <select 
                   value={resultFilter}
                   onChange={(e) => { setResultFilter(e.target.value); setCurrentPage(1); }}
                   className="bg-transparent text-white focus:outline-none cursor-pointer"
                 >
                   {uniqueResults.map(res => (
                     <option key={res} value={res} className="bg-[#0a0c10]">{res}</option>
                   ))}
                 </select>
               </div>
            </div>
            
            {/* Search Input */}
            <div className="flex items-center gap-3 relative w-full lg:w-64">
               <Search className="absolute left-3 w-3 h-3 text-slate-600" />
               <input 
                 type="text" 
                 value={searchQuery}
                 onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                 placeholder="FILTER_LOGS..." 
                 className="w-full bg-black/40 border border-blue-900/20 rounded py-1.5 pl-8 pr-4 text-[10px] text-white focus:outline-none focus:border-blue-500/50 font-mono" 
               />
            </div>
          </div>

          {/* Logs Stream Panel */}
          <div className="flex-1 overflow-y-auto p-8 space-y-4 font-mono text-[11px] bg-black/20">
             {paginatedLogs.length === 0 ? (
               <div className="flex flex-col items-center justify-center h-full text-slate-500 text-[10px] uppercase font-bold">
                 <Database className="w-8 h-8 text-slate-600 mb-2" />
                 <span>[NO_MATCHING_TELEMETRY_RECORDED]</span>
               </div>
             ) : (
               paginatedLogs.map((log) => (
                 <div key={log.id} className="flex gap-8 p-3 border-b border-blue-900/5 hover:bg-blue-500/[0.03] transition-all rounded">
                    <span className="text-slate-600 shrink-0">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                    <span className="text-blue-500 font-bold w-32 shrink-0 truncate" title={log.user}>{log.user}</span>
                    <span className="text-slate-300 flex-1">{log.details || log.action}</span>
                    <span className={`font-bold shrink-0 text-right w-20 ${
                      log.result === 'SUCCESS' || log.result === 'COMPLETE' || log.result === 'VALIDATED' 
                        ? 'text-green-500' 
                        : log.result === 'WARNING' ? 'text-yellow-500' : 'text-red-500'
                    }`}>{log.result}</span>
                 </div>
               ))
             )}
          </div>

          {/* Pagination Footer */}
          <div className="p-4 bg-black/40 border-t border-blue-900/10 flex flex-col md:flex-row gap-4 items-center justify-between">
             <span className="text-[9px] text-slate-600 uppercase font-bold italic tracking-widest">
               Showing {startIndex + 1} - {Math.min(startIndex + pageSize, totalLogs)} of {totalLogs} transactions // Page {currentPage} of {totalPages}
             </span>
             <div className="flex items-center gap-4">
                {/* Page Size selector */}
                <div className="flex items-center gap-1.5 text-[9px] text-slate-500 font-bold uppercase">
                  <span>Show:</span>
                  <select 
                    value={pageSize} 
                    onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                    className="bg-transparent text-white border border-blue-900/20 rounded px-1.5 focus:outline-none cursor-pointer"
                  >
                    {[5, 10, 20, 50].map(sz => (
                      <option key={sz} value={sz} className="bg-[#0a0c10]">{sz}</option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-2">
                   <button 
                     onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                     disabled={currentPage === 1}
                     className="p-1.5 border border-blue-900/20 hover:border-blue-500/40 text-slate-400 hover:text-white disabled:opacity-30 disabled:border-blue-900/10 rounded transition-colors"
                   >
                     <ChevronLeft className="w-3.5 h-3.5" />
                   </button>
                   <button 
                     onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                     disabled={currentPage === totalPages}
                     className="p-1.5 border border-blue-900/20 hover:border-blue-500/40 text-slate-400 hover:text-white disabled:opacity-30 disabled:border-blue-900/10 rounded transition-colors"
                   >
                     <ChevronRight className="w-3.5 h-3.5" />
                   </button>
                </div>
             </div>
          </div>
      </div>
    </div>
  );
}
