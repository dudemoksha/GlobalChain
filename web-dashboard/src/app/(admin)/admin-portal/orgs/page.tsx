"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, CheckCircle2, XCircle, Clock, 
  Building2, Trash2, AlertCircle, Loader2, Search, Filter, Ban, RefreshCw
} from 'lucide-react';
import { fetchOrganizations, updateOrgStatusDb, deleteOrganizationDb } from '@/lib/api';
import { useStore } from '@/store/useStore';

export default function AdminOrgsPage() {
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Pending' | 'Approved' | 'Suspended'>('ALL');
  const [actioningId, setActioningId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const { addAuditLog } = useStore();

  const loadOrgs = async () => {
    setIsLoading(true);
    try {
      const data = await fetchOrganizations();
      setOrganizations(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrgs();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleUpdateStatus = async (id: string, name: string, status: 'Approved' | 'Rejected' | 'Suspended') => {
    setActioningId(id);
    // Instant UI update
    setOrganizations(prev => 
      prev.map(org => org.id === id ? { ...org, status } : org)
    );

    try {
      await updateOrgStatusDb(id, status);
      addAuditLog({
        user: 'ROOT_ADMIN',
        action: `ORG_${status.toUpperCase()}`,
        result: 'SUCCESS',
        details: `Updated organization '${name}' access clearance status to '${status}'.`
      });
      showToast(`Organization '${name}' status updated to ${status}.`);
    } catch (error: any) {
      addAuditLog({
        user: 'ROOT_ADMIN',
        action: `ORG_${status.toUpperCase()}`,
        result: 'FAILED',
        details: `Failed to update status for '${name}': ${error.message || 'Unknown error'}`
      });
      showToast(`Error updating organization status.`);
      // Revert on failure
      loadOrgs();
    } finally {
      setActioningId(null);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to archive and permanently remove all access credentials for organization '${name}'?`)) {
      setActioningId(id);
      // Instant UI update
      setOrganizations(prev => prev.filter(org => org.id !== id));

      try {
        await deleteOrganizationDb(id);
        addAuditLog({
          user: 'ROOT_ADMIN',
          action: 'ORG_ARCHIVED',
          result: 'SUCCESS',
          details: `Archived organization '${name}' and revoked all system node linkages.`
        });
        showToast(`Organization '${name}' archived successfully.`);
      } catch (error: any) {
        addAuditLog({
          user: 'ROOT_ADMIN',
          action: 'ORG_ARCHIVED',
          result: 'FAILED',
          details: `Failed to archive '${name}': ${error.message || 'Unknown error'}`
        });
        showToast(`Error archiving organization.`);
        // Revert on failure
        loadOrgs();
      } finally {
        setActioningId(null);
      }
    }
  };

  // Dynamic filtering
  const filteredOrgs = organizations.filter(org => {
    const matchesSearch = 
      org.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      org.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || org.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 font-mono">
      {/* Toast Alert */}
      {toastMessage && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-20 right-6 z-50 p-4 bg-[#0a0c10] border border-blue-500/40 rounded-xl shadow-2xl flex items-center gap-3"
        >
          <CheckCircle2 className="w-5 h-5 text-green-500" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">{toastMessage}</span>
        </motion.div>
      )}

      {/* Header Section */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tighter uppercase flex items-center gap-3">
            <Shield className="text-blue-500 w-6 h-6 animate-pulse" /> Organization_Control_Panel
          </h2>
          <p className="text-slate-500 text-xs mt-1 font-bold uppercase tracking-[0.2em]">Manage Corporate Identities & Network Access...</p>
        </div>
        <button 
          onClick={loadOrgs}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-900/20 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest rounded hover:bg-blue-900/40 disabled:opacity-50 transition-all flex items-center gap-2"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} /> Sync DB
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4 bg-[#0a0c10] p-6 border border-blue-900/20 rounded-2xl">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="SEARCH_BY_ORG_NAME_OR_EMAIL..."
            className="w-full bg-black/40 border border-blue-900/30 rounded-lg py-3 pl-12 pr-4 text-xs text-white focus:outline-none focus:border-blue-500/50 transition-all font-mono"
          />
        </div>
        <div className="flex gap-2 shrink-0">
          {(['ALL', 'Pending', 'Approved', 'Suspended'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-4 py-2 rounded text-[10px] font-bold uppercase tracking-widest border transition-all ${
                statusFilter === filter 
                  ? 'bg-blue-600 border-blue-500 text-white' 
                  : 'bg-black/20 border-blue-900/30 text-slate-400 hover:bg-white/5'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Organizations List */}
      <div className="grid grid-cols-1 gap-6">
        {isLoading ? (
          <div className="p-20 bg-[#0a0c10] border border-blue-900/20 rounded-2xl flex flex-col items-center justify-center text-center">
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
            <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Querying corporate directory shard...</p>
          </div>
        ) : filteredOrgs.length === 0 ? (
          <div className="p-20 bg-[#0a0c10] border border-blue-900/20 rounded-2xl flex flex-col items-center justify-center text-center">
            <Building2 className="w-10 h-10 text-slate-600 mb-4" />
            <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">No organizations matched search query / status filter</p>
          </div>
        ) : (
          <AnimatePresence>
            {filteredOrgs.map((org, i) => (
              <motion.div
                key={org.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ opacity: 0, x: 20 }}
                className={`p-8 bg-[#0a0c10] border rounded-2xl flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 group transition-all ${
                  org.status === 'Pending' ? 'border-yellow-500/20 hover:border-yellow-500/40' : 
                  org.status === 'Approved' ? 'border-green-500/20 hover:border-green-500/40' : 
                  'border-red-500/20 hover:border-red-500/40'
                }`}
              >
                 <div className="flex items-start md:items-center gap-6">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center border shrink-0 transition-transform group-hover:scale-105 ${
                       org.status === 'Pending' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500' : 
                       org.status === 'Approved' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 
                       'bg-red-500/10 border-red-500/20 text-red-500'
                    }`}>
                       <Building2 className="w-7 h-7" />
                    </div>
                    <div>
                       <div className="flex flex-wrap items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-white tracking-tight">{org.name}</h3>
                          <span className={`px-2 py-0.5 border text-[8px] font-bold uppercase rounded ${
                            org.status === 'Pending' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500' : 
                            org.status === 'Approved' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 
                            'bg-red-500/10 border-red-500/20 text-red-500'
                          }`}>{org.status}</span>
                       </div>
                       <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] text-slate-500 uppercase font-bold tracking-widest font-mono">
                          <span className="text-slate-400">ID: {org.id}</span>
                          <span className="hidden md:inline w-1 h-1 rounded-full bg-slate-800" />
                          <span className="text-slate-400">Email: {org.email}</span>
                          <span className="hidden md:inline w-1 h-1 rounded-full bg-slate-800" />
                          <span className="flex items-center gap-1 text-slate-400">
                            <Clock className="w-3 h-3" /> {new Date(org.created_at).toLocaleDateString()}
                          </span>
                       </div>
                    </div>
                 </div>
    
                 <div className="flex flex-wrap items-center gap-3 self-end lg:self-center">
                    {actioningId === org.id ? (
                      <Loader2 className="w-5 h-5 text-blue-500 animate-spin mx-6" />
                    ) : (
                      <>
                        {org.status === 'Pending' && (
                          <>
                            <button 
                              onClick={() => handleUpdateStatus(org.id, org.name, 'Approved')}
                              className="px-4 py-2.5 bg-green-500/10 border border-green-500/20 text-green-500 text-[9px] font-bold uppercase tracking-widest rounded hover:bg-green-500 hover:text-white transition-all flex items-center gap-1.5"
                            >
                               <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                            </button>
                            <button 
                              onClick={() => handleUpdateStatus(org.id, org.name, 'Rejected')}
                              className="px-4 py-2.5 bg-red-500/10 border border-red-500/20 text-red-500 text-[9px] font-bold uppercase tracking-widest rounded hover:bg-red-500 hover:text-white transition-all flex items-center gap-1.5"
                            >
                               <XCircle className="w-3.5 h-3.5" /> Reject
                            </button>
                          </>
                        )}
                        {org.status === 'Approved' && (
                          <button 
                            onClick={() => handleUpdateStatus(org.id, org.name, 'Suspended')}
                            className="px-4 py-2.5 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[9px] font-bold uppercase tracking-widest rounded hover:bg-yellow-500 hover:text-white transition-all flex items-center gap-1.5"
                          >
                             <Ban className="w-3.5 h-3.5" /> Suspend
                          </button>
                        )}
                        {org.status === 'Suspended' && (
                          <button 
                            onClick={() => handleUpdateStatus(org.id, org.name, 'Approved')}
                            className="px-4 py-2.5 bg-green-500/10 border border-green-500/20 text-green-500 text-[9px] font-bold uppercase tracking-widest rounded hover:bg-green-500 hover:text-white transition-all flex items-center gap-1.5"
                          >
                             <CheckCircle2 className="w-3.5 h-3.5" /> Reactivate
                          </button>
                        )}
                        <button 
                          onClick={() => handleDelete(org.id, org.name)}
                          className="p-2.5 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 hover:border-red-500/20 rounded text-slate-500 hover:text-red-500 transition-all"
                          title="Archive & Revoke Identity"
                        >
                           <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                 </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      <div className="p-6 bg-blue-500/5 border border-blue-500/10 rounded-2xl flex justify-between text-slate-500 text-[10px] font-bold uppercase tracking-widest">
         <span>{filteredOrgs.length} of {organizations.length} organizations visible</span>
         <span>{organizations.filter(o => o.status === 'Pending').length} awaiting authentication clearance</span>
      </div>
    </div>
  );
}
