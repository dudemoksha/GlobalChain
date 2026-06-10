"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, UserPlus, Search, Filter, Shield, 
  Lock, Mail, MoreVertical, CheckCircle2, XCircle,
  Key, Activity, Ban, RefreshCw, Eye, Loader2, X
} from 'lucide-react';
import { useStore } from '@/store/useStore';

const INITIAL_USERS = [
  { id: 'GC-001', name: 'Major General Alpha', email: 'alpha@globalchain.intl', role: 'Root_Admin', status: 'Active', clearance: 'L5' },
  { id: 'GC-402', name: 'Sarah Chen', email: 's.chen@logistics.corp', role: 'Operations_Director', status: 'Active', clearance: 'L4' },
  { id: 'GC-812', name: 'Marco Rossi', email: 'm.rossi@partner.eu', role: 'Supplier_Lead', status: 'Pending', clearance: 'L2' },
  { id: 'GC-119', name: 'James Wilson', email: 'j.wilson@security.gov', role: 'Risk_Analyst', status: 'Active', clearance: 'L4' },
  { id: 'GC-334', name: 'Yuki Tanaka', email: 'y.tanaka@manufacture.jp', role: 'Tier2_Manager', status: 'Suspended', clearance: 'L2' },
];

export default function AdminUserManagement() {
  const { addAuditLog } = useStore();
  const [users, setUsers] = useState(INITIAL_USERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Active' | 'Pending' | 'Suspended'>('ALL');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [actioningId, setActioningId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const handleStatusChange = (id: string, newStatus: 'Active' | 'Suspended') => {
    setActioningId(id);
    setOpenMenuId(null);
    setTimeout(() => {
      const user = users.find(u => u.id === id);
      setUsers(prev => prev.map(u => u.id === id ? { ...u, status: newStatus } : u));
      addAuditLog({
        user: 'ROOT_ADMIN',
        action: `USER_${newStatus.toUpperCase()}`,
        result: 'SUCCESS',
        details: `Identity '${user?.name}' (${id}) status updated to ${newStatus}.`
      });
      showToast(`User ${user?.name} is now ${newStatus}.`);
      setActioningId(null);
    }, 700);
  };

  const handleRevoke = (id: string) => {
    const user = users.find(u => u.id === id);
    if (confirm(`Revoke all clearance for ${user?.name}? This will terminate active sessions.`)) {
      setOpenMenuId(null);
      setActioningId(id);
      setTimeout(() => {
        setUsers(prev => prev.filter(u => u.id !== id));
        addAuditLog({
          user: 'ROOT_ADMIN',
          action: 'USER_REVOKED',
          result: 'SUCCESS',
          details: `Identity '${user?.name}' (${id}) permanently revoked. All clearance tokens invalidated.`
        });
        showToast(`${user?.name}'s identity revoked.`);
        setActioningId(null);
      }, 700);
    }
  };

  const handleProvision = () => {
    const name = prompt('Enter new identity name:');
    if (!name) return;
    const email = prompt('Enter email address:');
    if (!email) return;
    const newUser = {
      id: `GC-${Math.floor(Math.random() * 900) + 100}`,
      name, email,
      role: 'Supplier_Lead',
      status: 'Pending' as const,
      clearance: 'L1',
    };
    setUsers(prev => [newUser, ...prev]);
    addAuditLog({
      user: 'ROOT_ADMIN',
      action: 'USER_PROVISIONED',
      result: 'SUCCESS',
      details: `New identity '${name}' provisioned with L1 clearance. Pending admin activation.`
    });
    showToast(`${name} provisioned. Awaiting activation.`);
  };

  const filtered = users.filter(u => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.id.toLowerCase().includes(q) || u.role.toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'ALL' || u.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {toast && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="fixed top-20 right-6 z-50 p-4 bg-[#0a0c10] border border-blue-500/40 rounded-xl shadow-2xl flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-500" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">{toast}</span>
        </motion.div>
      )}

      <div className="flex justify-between items-end flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tighter uppercase flex items-center gap-3">
            <Users className="text-blue-500 w-6 h-6 animate-pulse" /> Personnel_Directory
          </h2>
          <p className="text-slate-500 text-xs mt-1 font-bold uppercase tracking-[0.2em]">Managing Global Intelligence Clearance Levels...</p>
        </div>
        <button onClick={handleProvision}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold uppercase tracking-widest rounded transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] flex items-center gap-2">
          <UserPlus className="w-4 h-4" /> Provision New Identity
        </button>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            placeholder="SEARCH_BY_IDENTITY_SIGNATURE..."
            className="w-full bg-[#0a0c10] border border-blue-900/20 rounded-lg py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all font-mono" />
        </div>
        <div className="flex gap-2 shrink-0">
          {(['ALL', 'Active', 'Pending', 'Suspended'] as const).map(f => (
            <button key={f} onClick={() => setStatusFilter(f)}
              className={`px-4 py-2 rounded text-[10px] font-bold uppercase tracking-widest border transition-all ${statusFilter === f ? 'bg-blue-600 border-blue-500 text-white' : 'bg-[#0a0c10] border-blue-900/20 text-slate-400 hover:bg-white/5'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* User Table */}
      <div className="bg-[#0a0c10] border border-blue-900/20 rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-blue-900/10 bg-blue-500/[0.02]">
              <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Identity Signature</th>
              <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Auth Role</th>
              <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
              <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Clearance</th>
              <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Protocol</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-900/10">
            <AnimatePresence>
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className="px-8 py-16 text-center text-slate-600 text-xs uppercase font-bold">No identities match search criteria</td></tr>
              ) : filtered.map((user) => (
                <motion.tr key={user.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: 20 }}
                  className="hover:bg-blue-500/[0.03] transition-colors group relative">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
                        <Shield className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white tracking-tight">{user.name}</p>
                        <p className="text-[10px] text-slate-500 font-mono uppercase">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                      <Key className="w-3 h-3 text-blue-500" /> {user.role}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    {actioningId === user.id ? (
                      <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                    ) : (
                      <div className="flex items-center gap-2">
                        {user.status === 'Active' ? <CheckCircle2 className="w-4 h-4 text-green-500" /> :
                         user.status === 'Pending' ? <Activity className="w-4 h-4 text-yellow-500" /> :
                         <XCircle className="w-4 h-4 text-red-500" />}
                        <span className={`text-[10px] font-bold uppercase ${user.status === 'Active' ? 'text-green-500' : user.status === 'Pending' ? 'text-yellow-500' : 'text-red-500'}`}>{user.status}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 rounded bg-blue-500/10 border border-blue-500/20 text-[9px] text-blue-400 font-bold font-mono">SEC_LEVEL_{user.clearance}</span>
                  </td>
                  <td className="px-8 py-6 text-right relative">
                    <button onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)}
                      className="p-2 hover:bg-blue-500/10 rounded text-slate-500 hover:text-blue-400 transition-all">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                    <AnimatePresence>
                      {openMenuId === user.id && (
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: -5 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                          className="absolute right-8 top-12 z-50 w-48 bg-[#0d1117] border border-blue-900/30 rounded-xl shadow-2xl overflow-hidden">
                          {user.status !== 'Active' && (
                            <button onClick={() => handleStatusChange(user.id, 'Active')}
                              className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-bold uppercase text-green-400 hover:bg-green-500/10 transition-colors">
                              <CheckCircle2 className="w-4 h-4" /> Activate
                            </button>
                          )}
                          {user.status === 'Active' && (
                            <button onClick={() => handleStatusChange(user.id, 'Suspended')}
                              className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-bold uppercase text-yellow-400 hover:bg-yellow-500/10 transition-colors">
                              <Ban className="w-4 h-4" /> Suspend
                            </button>
                          )}
                          <button onClick={() => handleRevoke(user.id)}
                            className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-bold uppercase text-red-400 hover:bg-red-500/10 transition-colors border-t border-blue-900/20">
                            <X className="w-4 h-4" /> Revoke Identity
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      <div className="p-6 bg-blue-500/[0.02] border border-blue-900/20 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Lock className="w-5 h-5 text-blue-500" />
          <div>
            <p className="text-[10px] text-white font-bold uppercase tracking-widest">Global Identity Integrity</p>
            <p className="text-[9px] text-slate-500 font-mono mt-1 italic uppercase">{filtered.length} of {users.length} identities visible // {users.filter(u => u.status === 'Active').length} Active</p>
          </div>
        </div>
        <button onClick={() => {
          const csv = "data:text/csv;charset=utf-8," + ["ID,Name,Email,Role,Status,Clearance", ...users.map(u => `"${u.id}","${u.name}","${u.email}","${u.role}","${u.status}","${u.clearance}"`)].join('\n');
          const link = document.createElement('a');
          link.setAttribute('href', encodeURI(csv));
          link.setAttribute('download', `personnel_directory_${Date.now()}.csv`);
          document.body.appendChild(link); link.click(); document.body.removeChild(link);
          addAuditLog({ user: 'ROOT_ADMIN', action: 'EXPORT_PERSONNEL', result: 'SUCCESS', details: `Exported ${users.length} personnel records.` });
          showToast('Personnel directory exported.');
        }} className="text-[10px] text-blue-500 font-bold uppercase tracking-widest hover:text-blue-400 flex items-center gap-2 transition-colors">
          Download Audit Logs
        </button>
      </div>
    </div>
  );
}
