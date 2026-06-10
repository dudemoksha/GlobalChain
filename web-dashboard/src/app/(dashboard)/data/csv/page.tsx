"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Upload, 
  CheckCircle2, 
  AlertTriangle,
  Database,
  Zap,
  RefreshCcw,
  ArrowRight,
  Eye
} from 'lucide-react';

const uploadHistory = [
  { id: 'CSV-4201', name: 'suppliers_asia_q2.csv', rows: '8,402', status: 'Success', time: '1h ago' },
  { id: 'CSV-4200', name: 'route_latency_may.csv', rows: '1,204', status: 'Warning', time: '4h ago' },
  { id: 'CSV-4199', name: 'inventory_forecast.csv', rows: '12,000', status: 'Success', time: '1d ago' },
];

const previewRows = [
  { id: 'S-001', name: 'NanoFab Dynamics', region: 'TW', health: 42, tier: 1 },
  { id: 'S-002', name: 'CoreChips Taiwan', region: 'TW', health: 94, tier: 1 },
  { id: 'S-003', name: 'LogiCore Systems', region: 'CN', health: 85, tier: 2 },
];

export default function CSVBulkUpload() {
  const [hasFile, setHasFile] = useState(false);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase tracking-widest mb-2 font-mono">
            <span>Data Management</span>
            <span className="opacity-30">/</span>
            <span className="text-slate-300">CSV Ingestion</span>
          </div>
          <h2 className="font-header text-3xl text-white tracking-tight uppercase italic">
            Bulk <span className="text-glow-blue">Data Ingestion</span>
          </h2>
        </div>
        <button className="px-6 py-2 bg-white/5 border border-white/10 text-slate-400 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:text-white transition-all flex items-center gap-2">
          <Database className="w-3 h-3" /> Sync External API
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          {/* Drop Zone */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            onClick={() => setHasFile(true)}
            className="glass-panel border-2 border-dashed border-white/10 hover:border-glow-blue/40 rounded-3xl p-16 flex flex-col items-center justify-center text-center cursor-pointer transition-all group"
          >
            <div className="w-20 h-20 bg-glow-blue/10 border border-glow-blue/30 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Upload className="w-10 h-10 text-glow-blue" />
            </div>
            <h3 className="text-xl font-header text-white uppercase italic tracking-tight mb-2">Drop CSV Manifest</h3>
            <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-mono mb-8">.csv files up to 50MB</p>
            <div className="flex gap-4">
              <button className="px-10 py-3 bg-glow-blue text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:scale-105 transition-all">
                Select File
              </button>
              <button className="px-10 py-3 border border-white/10 text-slate-500 hover:text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all">
                Download Template
              </button>
            </div>
          </motion.div>

          {/* Preview Table */}
          {hasFile && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel border border-white/10 rounded-3xl p-8"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-header text-sm text-white uppercase tracking-widest flex items-center gap-2">
                  <Eye className="w-4 h-4 text-glow-blue" /> Data Preview (First 3 Rows)
                </h3>
                <span className="text-[9px] text-success font-bold uppercase font-mono">Schema Validated ✓</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-[10px]">
                  <thead>
                    <tr className="border-b border-white/10">
                      {['Supplier_ID', 'Name', 'Region', 'Health_Index', 'Tier'].map(h => (
                        <th key={h} className="text-left text-[9px] text-slate-500 uppercase tracking-widest py-3 pr-6 font-bold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewRows.map((row, i) => (
                      <tr key={i} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                        <td className="py-3 pr-6 text-glow-blue font-mono">{row.id}</td>
                        <td className="py-3 pr-6 text-white font-bold uppercase">{row.name}</td>
                        <td className="py-3 pr-6 text-slate-400">{row.region}</td>
                        <td className={`py-3 pr-6 font-mono ${row.health < 60 ? 'text-critical' : 'text-success'}`}>{row.health}%</td>
                        <td className="py-3 pr-6 text-glow-blue">T{row.tier}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex gap-4 mt-8">
                <button className="flex-1 py-4 bg-glow-blue text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-all">
                  Commit Ingestion
                </button>
                <button onClick={() => setHasFile(false)} className="px-8 py-4 border border-white/10 text-slate-500 hover:text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all">
                  Discard
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Upload History */}
        <div className="lg:col-span-4">
          <div className="glass-panel border border-white/10 rounded-3xl p-8 h-full">
            <h3 className="font-header text-sm text-white uppercase tracking-widest mb-8 flex items-center gap-2">
              <Zap className="w-4 h-4 text-glow-blue" /> Upload History
            </h3>
            <div className="space-y-4">
              {uploadHistory.map((file, i) => (
                <div key={i} className="p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/[0.08] transition-all cursor-pointer">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <FileText className="w-3 h-3 text-slate-500" />
                      <span className="text-[10px] font-bold text-white uppercase truncate max-w-[130px]">{file.name}</span>
                    </div>
                    <span className={`text-[8px] font-bold uppercase ${file.status === 'Success' ? 'text-success' : 'text-warning'}`}>{file.status}</span>
                  </div>
                  <div className="flex justify-between text-[8px] text-slate-600 font-mono uppercase">
                    <span>Rows: {file.rows}</span>
                    <span>{file.time}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-10 p-6 bg-glow-blue/5 border border-glow-blue/20 rounded-2xl">
              <div className="flex items-center gap-2 mb-3">
                <Database className="w-4 h-4 text-glow-blue" />
                <span className="text-[10px] font-bold text-glow-blue uppercase tracking-wider">Ingestion Stats</span>
              </div>
              <div className="space-y-2 text-[9px]">
                <div className="flex justify-between"><span className="text-slate-500 uppercase">Total Rows Indexed</span><span className="text-white font-mono">21,606</span></div>
                <div className="flex justify-between"><span className="text-slate-500 uppercase">Duplicates Filtered</span><span className="text-white font-mono">142</span></div>
                <div className="flex justify-between"><span className="text-slate-500 uppercase">Outliers Flagged</span><span className="text-warning font-mono">18</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
