"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Search, Filter, Shield, 
  MapPin, Activity, Star, MoreVertical,
  ChevronRight, Plus, Download, Upload,
  AlertTriangle, CheckCircle2
} from 'lucide-react';
import { useStore, Supplier } from '@/store/useStore';

export default function SupplierListPage() {
  const { suppliers } = useStore();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSuppliers = suppliers.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="font-header text-4xl text-white tracking-tight uppercase italic mb-2">
            Tier 1 <span className="text-glow-blue">Supplier Directory</span>
          </h2>
          <p className="text-slate-500 text-sm">Managing direct strategic partnerships and primary material sourcing nodes.</p>
        </div>
        <div className="flex gap-4">
           <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2">
              <Download className="w-4 h-4" /> Export
           </button>
           <button className="px-6 py-3 bg-glow-blue text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add New Supplier
           </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Tier 1', value: suppliers.length, color: 'text-white' },
          { label: 'High Risk', value: suppliers.filter(s => s.health < 40).length, color: 'text-critical' },
          { label: 'Operational', value: suppliers.filter(s => s.health >= 70).length, color: 'text-success' },
          { label: 'Backup Nodes', value: 12, color: 'text-glow-blue' },
        ].map((stat, i) => (
          <div key={i} className="glass-panel p-6 rounded-2xl border border-white/10">
             <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">{stat.label}</p>
             <h3 className={`text-2xl font-header ${stat.color}`}>{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
           <input 
             type="text" 
             placeholder="SEARCH_BY_NAME_OR_ID..."
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-glow-blue/50 transition-all font-mono"
           />
        </div>
        <button className="px-6 bg-white/[0.03] border border-white/10 rounded-xl text-slate-400 hover:text-white transition-all flex items-center gap-2">
           <Filter className="w-4 h-4" /> <span className="text-[10px] font-bold uppercase">Advanced Filters</span>
        </button>
      </div>

      {/* Main Table */}
      <div className="glass-panel rounded-[2rem] border border-white/10 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.02]">
              <th className="px-8 py-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Supplier Entity</th>
              <th className="px-8 py-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Global Location</th>
              <th className="px-8 py-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Operational Health</th>
              <th className="px-8 py-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredSuppliers.map((supplier) => (
              <motion.tr 
                key={supplier.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="group hover:bg-white/[0.01] transition-all cursor-pointer"
              >
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-slate-500 group-hover:text-glow-blue group-hover:bg-glow-blue/10 transition-all border border-white/10 group-hover:border-glow-blue/30 relative">
                       <Shield className="w-5 h-5" />
                       {supplier.health < 40 && (
                         <div className="absolute -top-1 -right-1 w-4 h-4 bg-critical rounded-full flex items-center justify-center border-2 border-[#020617]">
                            <AlertTriangle className="w-2 h-2 text-white" />
                         </div>
                       )}
                    </div>
                    <div>
                      <p className="text-white font-header text-lg italic tracking-tight">{supplier.name}</p>
                      <p className="text-[9px] text-slate-500 font-mono uppercase tracking-widest">ID: {supplier.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <MapPin className="w-4 h-4 text-glow-blue/50" />
                    <span>Lat: {supplier.lat.toFixed(2)}, Lng: {supplier.lng.toFixed(2)}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-6">
                    <div className="flex-1 max-w-[120px] h-1.5 bg-white/5 rounded-full overflow-hidden">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${supplier.health}%` }}
                         className={`h-full ${supplier.health < 40 ? 'bg-critical' : supplier.health < 70 ? 'bg-warning' : 'bg-success'}`}
                       />
                    </div>
                    <span className={`text-xs font-bold font-mono ${supplier.health < 40 ? 'text-critical' : supplier.health < 70 ? 'text-warning' : 'text-success'}`}>
                       {supplier.health}%
                    </span>
                  </div>
                </td>
                <td className="px-8 py-6 text-right">
                   <div className="flex items-center justify-end gap-2">
                      <button className="p-3 hover:bg-white/5 rounded-xl text-slate-500 hover:text-white transition-all">
                         <Activity className="w-4 h-4" />
                      </button>
                      <button className="p-3 hover:bg-white/5 rounded-xl text-slate-500 hover:text-white transition-all">
                         <MoreVertical className="w-4 h-4" />
                      </button>
                   </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex justify-between items-center px-4">
         <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Showing {filteredSuppliers.length} of {suppliers.length} Primary Nodes</p>
         <div className="flex gap-2">
            <button className="px-4 py-2 border border-white/5 rounded-lg text-[10px] font-bold text-slate-500 hover:text-white transition-all">Previous</button>
            <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold text-white hover:bg-white/10 transition-all">Next</button>
         </div>
      </div>
    </div>
  );
}
