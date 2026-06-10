"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Search, Edit2, Trash2, Shield,
  Save, X, Upload, Database, CheckCircle2, AlertTriangle
} from 'lucide-react';
import { useStore, Supplier, Tier } from '@/store/useStore';
import Link from 'next/link';


export default function SupplierManagementPage() {
  const { suppliers, addSupplier, updateSupplier, deleteSupplier } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [tierFilter, setTierFilter] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<Supplier>>({
    name: '', tier: 1, lat: 0, lng: 0, health: 100, risk: 0, 
    visibility: 'Public', category: 'Logistics', isBackup: false
  });

  const filteredSuppliers = suppliers.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchTier = tierFilter === null || s.tier === tierFilter;
    return matchSearch && matchTier;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateSupplier(editingId, formData);
      setEditingId(null);
    } else {
      const newId = `manual-${Date.now()}`;
      addSupplier({ ...formData, id: newId } as Supplier);
    }
    setIsAdding(false);
    setFormData({ name: '', tier: 1, lat: 0, lng: 0, health: 100, risk: 0, visibility: 'Public', category: 'Logistics', isBackup: false });
  };

  const handleEdit = (s: Supplier) => {
    setEditingId(s.id);
    setFormData({ ...s });
    setIsAdding(true);
  };

  const handleDelete = (id: string) => {
    setConfirmDeleteId(id);
  };

  const confirmDelete = () => {
    if (confirmDeleteId) deleteSupplier(confirmDeleteId);
    setConfirmDeleteId(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="font-header text-3xl text-white tracking-tight uppercase italic mb-2">
            Supplier <span className="text-glow-blue">Management</span>
          </h2>
          <p className="text-slate-500 text-sm">Directly manage nodes and relationships within the global supply chain graph.</p>
        </div>
        <div className="flex gap-3">
          {suppliers.length === 0 && (
            <Link href="/data/upload">
              <button className="border border-white/10 text-slate-400 px-6 py-3 rounded-xl font-header text-xs uppercase tracking-widest transition-all flex items-center gap-2 hover:bg-white/5">
                <Upload className="w-4 h-4" /> Upload Dataset
              </button>
            </Link>
          )}
          <button 
            onClick={() => { setEditingId(null); setFormData({ name: '', tier: 1, lat: 0, lng: 0, health: 100, risk: 0, visibility: 'Public', category: 'Logistics', isBackup: false }); setIsAdding(true); }}
            className="bg-glow-blue hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-header text-xs uppercase tracking-widest transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.3)]"
          >
            <Plus className="w-4 h-4" /> Add Supplier
          </button>
        </div>
      </div>

      {/* Empty State */}
      {suppliers.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Database className="w-16 h-16 text-slate-700 mx-auto mb-6" />
          <h3 className="font-header text-2xl text-white uppercase italic mb-3">No Suppliers Loaded</h3>
          <p className="text-slate-500 text-sm max-w-sm mb-8">Upload a dataset to populate your supplier network, or add suppliers manually above.</p>
          <Link href="/data/upload">
            <button className="px-8 py-4 bg-glow-blue text-white rounded-2xl text-sm font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(59,130,246,0.3)] flex items-center gap-2">
              <Upload className="w-4 h-4" /> Upload Dataset
            </button>
          </Link>
        </div>
      )}



      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-white/10">
            <h3 className="text-white font-header text-xs uppercase tracking-widest mb-6">Discovery Filters</h3>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Search nodes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-glow-blue/50 transition-all"
                />
              </div>
              <div className="pt-4 space-y-2">
                <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest ml-1">Tier Level</label>
                <div className="flex gap-2">
                  {[1, 2, 3].map(t => (
                    <button key={t} className="flex-1 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-white/10 transition-all">T{t}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Supplier Table */}
        <div className="lg:col-span-3">
          <div className="glass-panel border border-white/10 rounded-3xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Node Name</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Category</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Health</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Tier</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredSuppliers.map((s) => (
                  <tr key={s.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          s.health > 70 ? 'bg-success/10 text-success' : s.health > 40 ? 'bg-warning/10 text-warning' : 'bg-critical/10 text-critical'
                        }`}>
                          <Shield className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{s.name}</p>
                          <p className="text-[10px] text-slate-500 font-mono uppercase">{s.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">{s.category}</span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div className={`h-full ${s.health > 70 ? 'bg-success' : s.health > 40 ? 'bg-warning' : 'bg-critical'}`} style={{ width: `${s.health}%` }} />
                        </div>
                        <span className="text-xs font-mono text-slate-300">{s.health}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[9px] text-slate-400 font-bold">Tier {s.tier}</span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEdit(s)} className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-glow-blue transition-all" title="Edit"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(s.id)} className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-critical transition-all" title="Delete"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAdding(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass-panel w-full max-w-lg rounded-3xl border border-white/10 overflow-hidden relative z-10"
            >
              <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                <h3 className="font-header text-xl text-white uppercase italic">{editingId ? 'Edit' : 'Add New'} <span className="text-glow-blue">Supplier Node</span></h3>
                <button onClick={() => setIsAdding(false)} className="text-slate-500 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2 space-y-2">
                    <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest ml-1">Entity Name</label>
                    <input required type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-glow-blue/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest ml-1">Latitude</label>
                    <input required type="number" step="any" value={formData.lat} onChange={(e) => setFormData({ ...formData, lat: parseFloat(e.target.value) })} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-glow-blue/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest ml-1">Longitude</label>
                    <input required type="number" step="any" value={formData.lng} onChange={(e) => setFormData({ ...formData, lng: parseFloat(e.target.value) })} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-glow-blue/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest ml-1">Tier Level</label>
                    <select value={formData.tier} onChange={(e) => setFormData({ ...formData, tier: parseInt(e.target.value) as Tier })} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-glow-blue/50 appearance-none">
                      <option value={1}>Tier 1 (Direct)</option>
                      <option value={2}>Tier 2 (Indirect)</option>
                      <option value={3}>Tier 3 (Raw Materials)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest ml-1">Visibility</label>
                    <select value={formData.visibility} onChange={(e) => setFormData({ ...formData, visibility: e.target.value as 'Public' | 'Private' })} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-glow-blue/50 appearance-none">
                      <option value="Public">Public (Identity Visible)</option>
                      <option value="Private">Private (Masked identity)</option>
                    </select>
                  </div>
                  <div className="col-span-2 space-y-2">
                    <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest ml-1">Category</label>
                    <input type="text" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} placeholder="e.g. Semiconductors" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-glow-blue/50" />
                  </div>
                  <div className="col-span-2 flex items-center gap-3 p-4 bg-white/[0.02] border border-white/5 rounded-xl cursor-pointer" onClick={() => setFormData({...formData, isBackup: !formData.isBackup})}>
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${formData.isBackup ? 'bg-glow-blue border-glow-blue' : 'border-white/20'}`}>
                      {formData.isBackup && <CheckCircle2 className="w-3 h-3 text-white" />}
                    </div>
                    <span className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">Mark as Backup Supplier</span>
                  </div>
                </div>

                <div className="pt-4 flex gap-4">
                  <button type="button" onClick={() => setIsAdding(false)} className="flex-1 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-header text-[10px] uppercase tracking-widest transition-all">Cancel</button>
                  <button type="submit" className="flex-1 py-4 bg-glow-blue hover:bg-blue-600 text-white font-header text-[10px] uppercase tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] flex items-center justify-center gap-2">
                    <Save className="w-4 h-4" /> {editingId ? 'Update Node' : 'Initialize Node'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {confirmDeleteId && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setConfirmDeleteId(null)} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass-panel w-full max-w-sm rounded-3xl border border-critical/20 p-8 relative z-10 text-center"
            >
              <div className="w-16 h-16 mx-auto bg-critical/10 border border-critical/20 rounded-2xl flex items-center justify-center mb-6">
                <AlertTriangle className="w-8 h-8 text-critical" />
              </div>
              <h3 className="font-header text-xl text-white uppercase italic mb-2">Confirm Deletion</h3>
              <p className="text-slate-500 text-sm mb-8">This will permanently remove the supplier node from your network graph. This action cannot be undone.</p>
              <div className="flex gap-4">
                <button onClick={() => setConfirmDeleteId(null)} className="flex-1 py-3 border border-white/10 text-slate-400 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 transition-all">Cancel</button>
                <button onClick={confirmDelete} className="flex-1 py-3 bg-critical text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-red-500 transition-all shadow-[0_0_20px_rgba(239,68,68,0.3)]">Delete Node</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
