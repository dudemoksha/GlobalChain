"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileSpreadsheet, 
  Upload, 
  Search, 
  Filter, 
  Activity, 
  CheckCircle2, 
  AlertTriangle,
  Zap,
  ArrowRight,
  Database
} from 'lucide-react';

const history = [
  { id: 'XL-902', name: 'Global_Supply_Chain_Q2.xlsx', status: 'Success', rows: '12,402', time: '2h ago' },
  { id: 'XL-901', name: 'Partner_Lead_Times_V4.xls', status: 'Warning', rows: '4,092', time: '1d ago' },
  { id: 'XL-900', name: 'Inventory_Forecast_Final.xlsx', status: 'Success', rows: '8,400', time: '3d ago' },
];

export default function ExcelDataManagement() {
  const [isUploading, setIsUploading] = useState(false);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase tracking-widest mb-2 font-mono">
            <span>Data Management</span>
            <span className="opacity-30">/</span>
            <span className="text-slate-300">Excel Ingestion</span>
          </div>
          <h2 className="font-header text-3xl text-white tracking-tight uppercase italic">
            Excel <span className="text-glow-blue">Intelligence Portal</span>
          </h2>
        </div>
        <div className="flex gap-4">
           <button className="px-6 py-2 bg-white/5 border border-white/10 text-slate-400 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:text-white transition-all flex items-center gap-2">
              <Database className="w-3 h-3" /> External API Sync
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Upload Area */}
        <div className="lg:col-span-8 space-y-8">
           <div className="glass-panel border border-white/10 rounded-3xl p-12 relative overflow-hidden group">
              <div className="absolute inset-0 z-0 opacity-5 pointer-events-none">
                 <FileSpreadsheet className="w-full h-full scale-150 rotate-12 text-glow-blue" />
              </div>
              
              <div className="relative z-10 flex flex-col items-center justify-center text-center py-12">
                 <div className="w-20 h-20 bg-glow-blue/10 border border-glow-blue/30 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Upload className="w-10 h-10 text-glow-blue" />
                 </div>
                 <h3 className="text-xl font-header text-white uppercase italic tracking-tight mb-2">Initialize Excel Protocol</h3>
                 <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] mb-8 font-mono">Drag .xlsx or .xls manifest here</p>
                 
                 <div className="flex gap-4">
                    <button className="px-10 py-3 bg-glow-blue text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:scale-105 transition-all">
                       Select Manifest
                    </button>
                    <button className="px-10 py-3 border border-white/10 text-slate-500 hover:text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all">
                       Download Template
                    </button>
                 </div>
              </div>
           </div>

           {/* Sheet Selection / Mapping Mock */}
           <div className="glass-panel border border-white/10 rounded-3xl p-8">
              <div className="flex justify-between items-center mb-8">
                 <h3 className="font-header text-sm text-white uppercase tracking-widest flex items-center gap-2">
                    <Zap className="w-4 h-4 text-glow-blue" /> Intelligent Cell Mapping
                 </h3>
                 <span className="text-[9px] text-success font-bold uppercase font-mono">Auto_Match_Active (94%)</span>
              </div>
              
              <div className="space-y-4">
                 {[
                   { label: 'Supplier_ID', mapping: 'Column A (Partners)', status: 'Matched' },
                   { label: 'Latency_Value', mapping: 'Column D (LeadTimes)', status: 'Matched' },
                   { label: 'Inventory_Count', mapping: 'Manual Selection Required', status: 'Pending' },
                 ].map((map, i) => (
                   <div key={i} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl">
                      <div className="flex items-center gap-4">
                         <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                            <span className="text-[10px] font-mono text-slate-500">{i+1}</span>
                         </div>
                         <div>
                            <div className="text-[10px] text-white font-bold uppercase">{map.label}</div>
                            <div className="text-[9px] text-slate-500 italic">{map.mapping}</div>
                         </div>
                      </div>
                      <div className={`text-[8px] font-bold uppercase px-2 py-0.5 rounded border ${map.status === 'Matched' ? 'text-success border-success/30' : 'text-warning border-warning/30'}`}>
                         {map.status}
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Ingestion History */}
        <div className="lg:col-span-4 space-y-8">
           <div className="glass-panel border border-white/10 rounded-3xl p-8 h-full">
              <h3 className="font-header text-sm text-white uppercase tracking-widest mb-8 flex items-center gap-2">
                 <Activity className="w-4 h-4 text-glow-blue" /> Manifest History
              </h3>
              
              <div className="space-y-4">
                 {history.map((file, i) => (
                   <div key={i} className="p-4 bg-white/5 border border-white/5 rounded-2xl group hover:bg-white/[0.08] transition-all cursor-pointer">
                      <div className="flex justify-between items-center mb-2">
                         <div className="flex items-center gap-2">
                            <FileSpreadsheet className="w-3 h-3 text-slate-500" />
                            <span className="text-[10px] font-bold text-white uppercase truncate max-w-[120px] tracking-tighter">{file.name}</span>
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

              <div className="mt-10 p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                 <div className="flex items-center gap-2 mb-3">
                    <Database className="w-4 h-4 text-glow-blue" />
                    <span className="text-[10px] font-bold text-glow-blue uppercase tracking-wider">Data Health Summary</span>
                 </div>
                 <div className="space-y-3">
                    {[
                      { label: 'Integrity Score', val: 98 },
                      { label: 'Duplicates Filtered', val: 124 },
                      { label: 'Outlier Alerts', val: 12 },
                    ].map((stat, i) => (
                      <div key={i} className="flex justify-between items-center text-[9px]">
                         <span className="text-slate-500 uppercase tracking-widest">{stat.label}</span>
                         <span className="text-white font-mono">{stat.val}</span>
                      </div>
                    ))}
                 </div>
              </div>

              <button className="w-full py-4 mt-8 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-white hover:bg-white/5 transition-all">
                 Full Data Validation Audit
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
