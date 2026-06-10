"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FileSpreadsheet, Download, Database, Layers, CheckCircle2, Info, ArrowRight } from 'lucide-react';

const TEMPLATES = [
  {
    id: 'TPL-01',
    name: 'Global Supply Graph (Nodes & Edges)',
    desc: 'The comprehensive template for ingesting your entire supply chain network. Contains separate sheets for Facilities (nodes) and Dependencies (edges).',
    fields: 'id, name, lat, lng, tier, base_health, target_id, weight',
    size: '12 KB',
    format: '.xlsx',
    type: 'CORE',
  },
  {
    id: 'TPL-02',
    name: 'Inventory & Stockpile Ledger',
    desc: 'Used to track warehouse capacities, current stock levels, and replenishment rates for predictive modeling.',
    fields: 'facility_id, sku, quantity, capacity, lead_time_days',
    size: '8 KB',
    format: '.csv',
    type: 'ANALYTICS',
  },
  {
    id: 'TPL-03',
    name: 'Supplier Financial Health Ratings',
    desc: 'Ingest third-party financial scores (Altman Z-Score, Moody\'s) to enhance the network risk model.',
    fields: 'supplier_id, credit_rating, z_score, operating_cash_flow',
    size: '6 KB',
    format: '.csv',
    type: 'RISK',
  },
];

export default function ExcelTemplatesPage() {
  const handleDownload = (name: string, format: string) => {
    // In a real app, this would trigger a download of the actual template file from public/ or a bucket
    const csvContent = "data:text/csv;charset=utf-8,id,name,lat,lng,tier,base_health\nSUP-01,Example Factory,34.05,-118.24,1,100";
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `${name.toLowerCase().replace(/ /g, '_')}_template${format}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex justify-between items-end gap-6 flex-wrap">
        <div>
          <h2 className="font-header text-4xl text-white tracking-tight uppercase italic mb-2">Data <span className="text-glow-blue">Templates</span></h2>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-tight">Download standardized schema formats for seamless data ingestion.</p>
        </div>
      </div>

      <div className="glass-panel p-8 rounded-[2.5rem] border border-white/10 bg-glow-blue/[0.02]">
        <div className="flex items-start gap-4 max-w-4xl">
          <Info className="w-6 h-6 text-glow-blue shrink-0 mt-1" />
          <div>
            <h3 className="text-white font-bold uppercase tracking-widest mb-2">Schema Adherence Required</h3>
            <p className="text-[11px] text-slate-400 font-mono leading-relaxed">
              To ensure the graph engine correctly maps spatial coordinates and calculates traversal weights, all uploaded datasets MUST adhere to these schema templates. Extraneous columns will be ignored. Missing required columns will trigger a validation failure during the upload phase.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {TEMPLATES.map((tpl, i) => (
          <motion.div key={tpl.id} whileHover={{ y: -5 }} className="glass-panel p-8 rounded-[2.5rem] border border-white/10 flex flex-col relative group overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
              <FileSpreadsheet className="w-24 h-24 text-white" />
            </div>
            
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className={`px-3 py-1 text-[9px] font-bold uppercase tracking-widest rounded border ${
                tpl.type === 'CORE' ? 'bg-glow-blue/10 border-glow-blue/20 text-glow-blue' :
                tpl.type === 'RISK' ? 'bg-critical/10 border-critical/20 text-critical' :
                'bg-purple-500/10 border-purple-500/20 text-purple-400'
              }`}>
                {tpl.type} SCHEMA
              </div>
              <span className="text-[10px] font-mono text-slate-500">{tpl.id}</span>
            </div>

            <h3 className="text-xl font-header text-white mb-3 relative z-10">{tpl.name}</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed mb-8 flex-1 relative z-10">{tpl.desc}</p>
            
            <div className="space-y-4 mb-8 relative z-10">
              <div>
                <p className="text-[8px] text-slate-600 font-bold uppercase tracking-widest mb-2">Required Columns</p>
                <div className="p-3 bg-black/40 border border-white/5 rounded-xl">
                  <code className="text-[9px] text-slate-300 font-mono break-words">{tpl.fields}</code>
                </div>
              </div>
            </div>

            <button 
              onClick={() => handleDownload(tpl.name, tpl.format)}
              className="w-full py-4 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-white uppercase tracking-[0.2em] hover:bg-glow-blue hover:border-glow-blue/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all flex items-center justify-center gap-3 relative z-10"
            >
              <Download className="w-4 h-4" /> Download {tpl.format}
            </button>
          </motion.div>
        ))}
      </div>

      <div className="glass-panel p-8 rounded-[2.5rem] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
         <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-success/10 border border-success/20 rounded-2xl flex items-center justify-center shrink-0">
               <Database className="w-6 h-6 text-success" />
            </div>
            <div>
               <h3 className="text-white font-bold uppercase tracking-widest mb-1">Ready to ingest?</h3>
               <p className="text-[11px] text-slate-400 font-mono">Once your data is mapped to our templates, proceed to the ingestion engine.</p>
            </div>
         </div>
         <a href="/data/upload" className="px-8 py-4 bg-glow-blue text-white rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:bg-blue-500 transition-all flex items-center gap-3 shrink-0 whitespace-nowrap">
            Launch Ingestion Engine <ArrowRight className="w-4 h-4" />
         </a>
      </div>
    </div>
  );
}
