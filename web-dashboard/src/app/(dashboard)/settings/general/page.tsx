"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, User, Building2, Shield, Bell, Cpu, Sliders, LogOut,
  Trash2, History, Monitor, Smartphone, Lock, Download, Palette, RefreshCcw,
  CheckCircle2, X, QrCode, Key, ShieldCheck, Zap, AlertCircle, Copy, Eye, EyeOff
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useRouter } from 'next/navigation';

type Tab = 'Profile' | 'Organization' | 'Security' | 'Notifications' | 'AI & Analytics' | 'System';

/* â”€â”€ Reusable Toast â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function Toast({ msg, onDone }: { msg: string; onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 2500); return () => clearTimeout(t); }, [onDone]);
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className="fixed bottom-8 right-8 z-[999] flex items-center gap-3 px-6 py-4 bg-glow-blue/20 border border-glow-blue/40 backdrop-blur-xl rounded-2xl shadow-[0_0_40px_rgba(59,130,246,0.3)]"
    >
      <CheckCircle2 className="w-4 h-4 text-glow-blue shrink-0" />
      <span className="text-[11px] font-bold uppercase tracking-widest text-white">{msg}</span>
    </motion.div>
  );
}

export default function GeneralSettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('Profile');
  const { logout, userRole } = useStore();
  const router = useRouter();
  const [loginHistory, setLoginHistory] = useState<any[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => setToast(msg);

  useEffect(() => {
    const logs = JSON.parse(localStorage.getItem('gc_login_history') || '[]');
    setLoginHistory(logs);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/welcome');
  };

  const tabs: { id: Tab; icon: any; label: string }[] = [
    { id: 'Profile', icon: User, label: 'Account Profile' },
    { id: 'Organization', icon: Building2, label: 'Org Governance' },
    { id: 'Security', icon: Shield, label: 'Access & Security' },
    { id: 'Notifications', icon: Bell, label: 'Alert Protocols' },
    { id: 'AI & Analytics', icon: Cpu, label: 'Intel Preferences' },
    { id: 'System', icon: Sliders, label: 'System Prefs' },
  ];

  return (
    <div className="space-y-8 pb-20 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex justify-between items-end bg-[#0a0c10]/50 p-10 rounded-[3rem] border border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px]" />
        <div>
           <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-glow-blue/10 rounded-xl flex items-center justify-center border border-glow-blue/20">
                 <Settings className="w-5 h-5 text-glow-blue" />
              </div>
              <span className="text-xs font-bold text-glow-blue uppercase tracking-[0.4em]">Operational Configuration</span>
           </div>
           <h2 className="font-header text-5xl text-white tracking-tighter uppercase italic leading-[0.9] mb-4">
              Global<span className="text-glow-blue">Settings</span>
           </h2>
           <p className="text-slate-500 text-sm max-w-xl font-bold uppercase tracking-tight">Managing enterprise identity, intelligence autonomy, and secure nodal access protocols.</p>
        </div>
        
        <button onClick={handleLogout} className="px-8 py-5 border border-critical/20 text-critical hover:bg-critical/10 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-3">
           <LogOut className="w-4 h-4" /> Terminate Session
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-3 space-y-2">
           {tabs.map((tab) => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id)}
               className={`w-full flex items-center gap-4 px-6 py-5 rounded-2xl transition-all group relative ${
                 activeTab === tab.id 
                   ? 'bg-glow-blue/10 border border-glow-blue/20 text-glow-blue shadow-[0_10px_30px_rgba(59,130,246,0.1)]' 
                   : 'text-slate-500 hover:text-slate-300 hover:bg-white/5 border border-transparent'
               }`}
             >
                {activeTab === tab.id && (
                  <motion.div layoutId="tab-active" className="absolute left-0 w-1 h-8 bg-glow-blue rounded-r-full shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                )}
                <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-glow-blue' : 'text-slate-600 group-hover:text-slate-400'}`} />
                <span className="text-[11px] font-bold uppercase tracking-widest">{tab.label}</span>
             </button>
           ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-9">
           <AnimatePresence mode="wait">
             <motion.div
               key={activeTab}
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               transition={{ duration: 0.2 }}
               className="glass-panel p-12 rounded-[3.5rem] border border-white/10 min-h-[600px] bg-white/[0.01]"
             >
                {activeTab === 'Profile' && <ProfileSettings userRole={userRole} showToast={showToast} />}
                {activeTab === 'Organization' && <OrganizationSettings userRole={userRole} showToast={showToast} />}
                {activeTab === 'Security' && <SecuritySettings history={loginHistory} showToast={showToast} />}
                {activeTab === 'Notifications' && <NotificationSettings showToast={showToast} />}
                {activeTab === 'AI & Analytics' && <IntelSettings showToast={showToast} />}
                {activeTab === 'System' && <SystemSettings showToast={showToast} />}
             </motion.div>
           </AnimatePresence>
        </div>
      </div>

      {/* Global Toast */}
      <AnimatePresence>
        {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
      </AnimatePresence>
    </div>
  );
}

/* â”€â”€ Profile Settings â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function ProfileSettings({ userRole, showToast }: { userRole: string | null; showToast: (m: string) => void }) {
    const defaultName = userRole === 'Admin' ? 'Administrator' : userRole === 'MainCompany' ? 'Company User' : 'Supplier Representative';
    const defaultEmail = userRole === 'Admin' ? 'admin@globalchain.io' : userRole === 'MainCompany' ? 'manager@company.com' : 'rep@supplier.com';
    const accessLevel = userRole === 'Admin' ? 'Level 5 (Unrestricted)' : userRole === 'MainCompany' ? 'Level 3 (Corporate)' : 'Level 1 (External)';
    const [saved, setSaved] = useState(false);

    return (
        <div className="space-y-10">
            <h3 className="font-header text-2xl text-white uppercase italic tracking-tight mb-10 flex items-center gap-3">
                <User className="w-6 h-6 text-glow-blue" /> Account <span className="text-glow-blue">Profile</span>
            </h3>
            <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                    <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest ml-1">Display Name</label>
                    <input type="text" defaultValue={defaultName} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white focus:outline-none focus:border-glow-blue/50 font-mono transition-colors hover:border-white/20" />
                </div>
                <div className="space-y-3">
                    <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest ml-1">Email</label>
                    <input type="email" defaultValue={defaultEmail} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white focus:outline-none focus:border-glow-blue/50 font-mono transition-colors hover:border-white/20" />
                </div>
                <div className="space-y-3">
                    <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest ml-1">Access Level</label>
                    <div className="w-full bg-glow-blue/10 border border-glow-blue/20 rounded-2xl py-4 px-6 text-sm text-glow-blue font-bold font-mono">{accessLevel}</div>
                </div>
            </div>
            <div className="pt-10 border-t border-white/5 flex items-center gap-4">
                <button 
                  onClick={() => { setSaved(true); showToast('Profile changes saved successfully'); setTimeout(() => setSaved(false), 2000); }}
                  className="px-10 py-4 bg-glow-blue text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg hover:bg-blue-600 transition-colors"
                >
                  Save Profile Changes
                </button>
                {saved && <span className="text-[10px] text-success font-bold uppercase flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Saved</span>}
            </div>
        </div>
    );
}

/* â”€â”€ Organization Settings â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function OrganizationSettings({ userRole, showToast }: { userRole: string | null; showToast: (m: string) => void }) {
    const [saved, setSaved] = useState(false);

    return (
        <div className="space-y-10">
            <h3 className="font-header text-2xl text-white uppercase italic tracking-tight mb-10 flex items-center gap-3">
                <Building2 className="w-6 h-6 text-glow-blue" /> Organization <span className="text-glow-blue">Details</span>
            </h3>
            <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3 col-span-2">
                    <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest ml-1">Organization Name</label>
                    <input type="text" defaultValue={userRole === 'Admin' ? 'GlobalChain Internal' : 'Acme Corp'} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white focus:outline-none focus:border-glow-blue/50 font-mono hover:border-white/20 transition-colors" />
                </div>
                <div className="space-y-3">
                    <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest ml-1">Registration ID</label>
                    <input type="text" defaultValue="GC-ORG-8492" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white focus:outline-none focus:border-glow-blue/50 font-mono hover:border-white/20 transition-colors" />
                </div>
                <div className="space-y-3">
                    <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest ml-1">Headquarters Region</label>
                    <input type="text" defaultValue="US-East" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white focus:outline-none focus:border-glow-blue/50 font-mono hover:border-white/20 transition-colors" />
                </div>
            </div>
            <div className="pt-10 border-t border-white/5 flex justify-between items-center">
                <div className="flex items-center gap-4 p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                    <Shield className="w-6 h-6 text-slate-600" />
                    <div className="flex-1">
                        <p className="text-[11px] text-white font-bold uppercase">Organization Verified</p>
                        <p className="text-[9px] text-slate-500 uppercase mt-1 italic">Approved by GlobalChain Admin</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                  {saved && <span className="text-[10px] text-success font-bold uppercase flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Updated</span>}
                  <button 
                    onClick={() => { setSaved(true); showToast('Organization details updated'); setTimeout(() => setSaved(false), 2000); }}
                    className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
            </div>
        </div>
    );
}

/* â”€â”€ 2FA Modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function TwoFAModal({ onClose, showToast }: { onClose: () => void; showToast: (m: string) => void }) {
  const [step, setStep] = useState<'overview' | 'setup' | 'verify' | 'done'>('overview');
  const [code, setCode] = useState('');
  const [show2FAKey, setShow2FAKey] = useState(false);
  const secretKey = 'JBSWY3DPEHPK3PXP';

  const handleVerify = () => {
    if (code.length === 6) {
      setStep('done');
      setTimeout(() => { onClose(); showToast('2FA successfully configured and active'); }, 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-md"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-[#0a0d14] border border-white/10 rounded-[3rem] p-10 w-full max-w-md relative shadow-[0_40px_80px_rgba(0,0,0,0.6)]"
      >
        <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-white/5 rounded-xl text-slate-500 hover:text-white transition-all">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-glow-blue/10 rounded-xl flex items-center justify-center border border-glow-blue/20">
            <ShieldCheck className="w-5 h-5 text-glow-blue" />
          </div>
          <div>
            <h3 className="font-header text-xl text-white uppercase italic tracking-tight">2FA Management</h3>
            <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Biometric L4 Security</p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              <div className="p-6 bg-success/5 border border-success/20 rounded-2xl flex items-center gap-4">
                <ShieldCheck className="w-6 h-6 text-success shrink-0" />
                <div>
                  <p className="text-[11px] font-bold text-white uppercase">2FA Currently Active</p>
                  <p className="text-[9px] text-slate-500 italic mt-1 uppercase font-mono">Authenticator app linked via GlobalChain Mobile</p>
                </div>
              </div>
              <div className="space-y-3">
                <button onClick={() => setStep('setup')} className="w-full py-4 bg-glow-blue text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center justify-center gap-2">
                  <QrCode className="w-4 h-4" /> Reconfigure Authenticator
                </button>
                <button onClick={() => { showToast('Backup codes regenerated & sent to email'); onClose(); }} className="w-full py-4 bg-white/5 border border-white/10 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                  <Key className="w-4 h-4" /> Generate New Backup Codes
                </button>
                <button onClick={() => { showToast('Recovery email sent to registered address'); onClose(); }} className="w-full py-4 border border-warning/20 text-warning rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-warning/5 transition-all flex items-center justify-center gap-2">
                  <AlertCircle className="w-4 h-4" /> Send Recovery Email
                </button>
              </div>
            </motion.div>
          )}

          {step === 'setup' && (
            <motion.div key="setup" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Step 1: Scan QR Code</p>
              <div className="flex justify-center">
                <div className="w-44 h-44 bg-white rounded-2xl p-3 flex items-center justify-center">
                  <div className="w-full h-full bg-[linear-gradient(45deg,#000_25%,transparent_25%),linear-gradient(-45deg,#000_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#000_75%),linear-gradient(-45deg,transparent_75%,#000_75%)] bg-[length:8px_8px] bg-[position:0_0,0_4px,4px_-4px,-4px_0px] opacity-90 rounded-lg" />
                </div>
              </div>
              <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                <p className="text-[9px] text-slate-500 uppercase font-bold mb-2">Manual Entry Key</p>
                <div className="flex items-center justify-between gap-2">
                  <code className="text-[11px] text-glow-blue font-mono tracking-[0.3em]">
                    {show2FAKey ? secretKey : 'â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢'}
                  </code>
                  <div className="flex gap-2">
                    <button onClick={() => setShow2FAKey(!show2FAKey)} className="p-1.5 hover:bg-white/5 rounded-lg text-slate-500 hover:text-white transition-all">
                      {show2FAKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button onClick={() => { navigator.clipboard.writeText(secretKey); showToast('Key copied to clipboard'); }} className="p-1.5 hover:bg-white/5 rounded-lg text-slate-500 hover:text-white transition-all">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              <button onClick={() => setStep('verify')} className="w-full py-4 bg-glow-blue text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-blue-600 transition-all">
                Next: Verify Code â†’
              </button>
            </motion.div>
          )}

          {step === 'verify' && (
            <motion.div key="verify" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Step 2: Enter 6-Digit Code</p>
              <input
                type="text"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="w-full text-center text-3xl font-mono tracking-[0.5em] bg-white/5 border border-white/10 rounded-2xl py-6 text-white focus:outline-none focus:border-glow-blue/50 transition-colors"
              />
              <button 
                onClick={handleVerify} 
                disabled={code.length !== 6}
                className="w-full py-4 bg-glow-blue text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-blue-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Verify & Activate
              </button>
            </motion.div>
          )}

          {step === 'done' && (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.5 }}>
                <CheckCircle2 className="w-16 h-16 text-success mx-auto mb-4" />
              </motion.div>
              <p className="text-lg font-header text-white uppercase italic">2FA Configured!</p>
              <p className="text-[10px] text-slate-500 mt-2 uppercase font-bold tracking-widest">Your account is now secured</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

/* â”€â”€ Security Settings â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function SecuritySettings({ history, showToast }: { history: any[]; showToast: (m: string) => void }) {
    const [show2FA, setShow2FA] = useState(false);
    const [keyChanged, setKeyChanged] = useState(false);

    return (
        <div className="space-y-12">
            <div className="flex justify-between items-start">
               <h3 className="font-header text-2xl text-white uppercase italic tracking-tight flex items-center gap-3">
                   <Shield className="w-6 h-6 text-glow-blue" /> Access <span className="text-glow-blue">& History</span>
               </h3>
               <button 
                 onClick={() => { setKeyChanged(true); showToast('Access key rotation initiated â€” check email'); setTimeout(() => setKeyChanged(false), 3000); }}
                 className="px-6 py-2 bg-critical/10 border border-critical/20 text-critical text-[9px] font-bold uppercase tracking-widest rounded-xl hover:bg-critical/20 transition-colors flex items-center gap-2"
               >
                 {keyChanged ? <><CheckCircle2 className="w-3 h-3" /> Rotation Sent</> : 'Change Access Key'}
               </button>
            </div>

            <div className="space-y-6">
                <h4 className="text-[10px] text-slate-500 uppercase font-bold tracking-widest flex items-center gap-2 ml-1">
                   <History className="w-3 h-3 text-glow-blue" /> Login Chronology (Last 5)
                </h4>
                <div className="border border-white/5 rounded-3xl overflow-hidden bg-black/20">
                   <table className="w-full text-left border-collapse">
                      <thead>
                         <tr className="bg-white/5 border-b border-white/5">
                            <th className="px-6 py-4 text-[9px] font-bold text-slate-500 uppercase tracking-widest">Device / Browser</th>
                            <th className="px-6 py-4 text-[9px] font-bold text-slate-500 uppercase tracking-widest">Timestamp</th>
                            <th className="px-6 py-4 text-[9px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                         {history.length > 0 ? history.slice(0, 5).map((log, i) => (
                           <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                              <td className="px-6 py-4">
                                 <div className="flex items-center gap-3">
                                    <Monitor className="w-4 h-4 text-slate-600" />
                                    <span className="text-[10px] text-white font-mono truncate max-w-[200px]">{log.device}</span>
                                 </div>
                              </td>
                              <td className="px-6 py-4 text-[10px] text-slate-400 font-mono">{new Date(log.timestamp).toLocaleString()}</td>
                              <td className="px-6 py-4">
                                 <span className={`text-[8px] font-bold px-2 py-0.5 rounded border ${log.status === 'SUCCESS' ? 'text-success border-success/20 bg-success/5' : 'text-critical border-critical/20 bg-critical/5'}`}>
                                    {log.status}
                                 </span>
                              </td>
                           </tr>
                         )) : (
                           <tr>
                              <td colSpan={3} className="px-6 py-10 text-center text-[10px] text-slate-600 font-bold uppercase tracking-widest italic opacity-30">No security logs recorded</td>
                           </tr>
                         )}
                      </tbody>
                   </table>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
               <div className="p-8 bg-white/5 border border-white/5 rounded-[2.5rem]">
                  <h4 className="text-[10px] text-white font-bold uppercase tracking-widest mb-6 flex items-center gap-2"><Smartphone className="w-4 h-4 text-glow-blue" /> Authorized Devices</h4>
                  <div className="space-y-4">
                     <div className="flex justify-between items-center p-3 bg-glow-blue/5 border border-glow-blue/10 rounded-xl">
                        <div className="flex items-center gap-3">
                           <Monitor className="w-4 h-4 text-glow-blue" />
                           <span className="text-[10px] text-white font-bold">Current Workstation</span>
                        </div>
                        <span className="text-[8px] text-success font-bold">ACTIVE</span>
                     </div>
                     <div className="flex justify-between items-center p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                        <div className="flex items-center gap-3">
                           <Smartphone className="w-4 h-4 text-slate-500" />
                           <span className="text-[10px] text-slate-400 font-bold">Mobile Device</span>
                        </div>
                        <button onClick={() => showToast('Mobile device revoked successfully')} className="text-[8px] text-critical font-bold hover:underline">REVOKE</button>
                     </div>
                  </div>
               </div>
               <div className="p-8 bg-white/5 border border-white/5 rounded-[2.5rem]">
                  <h4 className="text-[10px] text-white font-bold uppercase tracking-widest mb-6 flex items-center gap-2"><Lock className="w-4 h-4 text-glow-blue" /> 2FA Protocols</h4>
                  <p className="text-[10px] text-slate-500 mb-6 italic leading-relaxed uppercase font-mono">Biometric L4 authentication is active via the GlobalChain mobile application.</p>
                  <button 
                    onClick={() => setShow2FA(true)}
                    className="w-full py-3 bg-glow-blue/10 border border-glow-blue/20 text-glow-blue rounded-xl text-[9px] font-bold uppercase tracking-widest hover:bg-glow-blue/20 transition-colors flex items-center justify-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4" /> Manage 2FA
                  </button>
               </div>
            </div>

            <AnimatePresence>
              {show2FA && <TwoFAModal onClose={() => setShow2FA(false)} showToast={showToast} />}
            </AnimatePresence>
        </div>
    );
}

/* â”€â”€ Notification / Alert Protocol Settings â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function NotificationSettings({ showToast }: { showToast: (m: string) => void }) {
    const [toggles, setToggles] = useState([
        { 
          id: 1, label: 'Critical Disruption Alerts', 
          desc: 'Instant push for any Node Health < 20%', 
          onDesc: 'ðŸ”” You will receive instant push notifications when any supplier node drops below 20% health â€” ensures immediate action.', 
          offDesc: 'ðŸ”• Critical disruption alerts are muted. Node failures will be silently logged only â€” not recommended in live environments.',
          val: true 
        },
        { 
          id: 2, label: 'AI Strategy Recommendations', 
          desc: 'Notify when better backup options are detected.', 
          onDesc: 'ðŸ¤– The AI engine will push real-time alerts whenever a better supplier route or backup node is identified in the network.',
          offDesc: 'â¸ AI strategy suggestions are disabled. You will need to manually review the Recommendations page for insights.',
          val: true 
        },
        { 
          id: 3, label: 'Simulation Completion', 
          desc: 'Daily summary of all stress test results.', 
          onDesc: 'ðŸ“Š Receive a daily digest summarizing all simulation runs, impact scores, and affected supplier counts.',
          offDesc: 'ðŸ“­ Simulation summaries are off. Results remain viewable in Simulation History but no notifications will be sent.',
          val: false 
        },
        { 
          id: 4, label: 'Weekly Resilience Report', 
          desc: 'Aggregated analytics across entire mesh.', 
          onDesc: 'ðŸ“ˆ A comprehensive weekly PDF report is generated and emailed with network resilience scores, risk trends, and supplier health.',
          offDesc: 'ðŸ“‹ Weekly resilience reports are disabled. Analytics remain available on-demand via the Analytics Engine.',
          val: true 
        },
    ]);

    const toggle = (id: number) => {
        setToggles(prev => {
          const updated = prev.map(t => t.id === id ? { ...t, val: !t.val } : t);
          const item = updated.find(t => t.id === id)!;
          showToast(`${item.label}: ${item.val ? 'Enabled' : 'Disabled'}`);
          return updated;
        });
    };

    return (
        <div className="space-y-10">
            <h3 className="font-header text-2xl text-white uppercase italic tracking-tight mb-10 flex items-center gap-3">
                <Bell className="w-6 h-6 text-glow-blue" /> Alert <span className="text-glow-blue">Protocols</span>
            </h3>
            <div className="space-y-5">
                {toggles.map((item) => (
                  <div key={item.id} className="p-6 bg-white/5 border border-white/5 rounded-3xl hover:border-glow-blue/20 transition-all">
                    <div className="flex items-start justify-between gap-4 cursor-pointer" onClick={() => toggle(item.id)}>
                       <div className="flex-1">
                          <p className="text-[11px] text-white font-bold uppercase tracking-tight mb-1">{item.label}</p>
                          <p className="text-[9px] text-slate-500 italic uppercase">{item.desc}</p>
                       </div>
                       <div className={`w-12 h-6 rounded-full relative transition-colors shrink-0 mt-1 ${item.val ? 'bg-glow-blue shadow-[0_0_10px_rgba(59,130,246,0.4)]' : 'bg-white/10'}`}>
                          <motion.div 
                            animate={{ left: item.val ? '1.75rem' : '0.25rem' }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
                            style={{ position: 'absolute', top: '0.25rem' }}
                          />
                       </div>
                    </div>
                    <AnimatePresence>
                      <motion.div
                        key={item.val ? 'on' : 'off'}
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`mt-4 p-3 rounded-xl text-[10px] font-mono leading-relaxed ${item.val ? 'bg-glow-blue/5 border border-glow-blue/10 text-slate-300' : 'bg-white/[0.02] border border-white/5 text-slate-500'}`}
                      >
                        {item.val ? item.onDesc : item.offDesc}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                ))}
            </div>
        </div>
    );
}

/* â”€â”€ Intel Settings (AI & Analytics) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function IntelSettings({ showToast }: { showToast: (m: string) => void }) {
    const [slider, setSlider] = useState(74);
    const [showConfigModal, setShowConfigModal] = useState(false);
    const [exportFormat, setExportFormat] = useState<'JSON' | 'CSV' | 'Both'>('JSON');
    const [exportFreq, setExportFreq] = useState<'Hourly' | 'Daily' | 'Weekly'>('Daily');
    const [exportTime, setExportTime] = useState('00:00');

    return (
        <div className="space-y-10">
            <h3 className="font-header text-2xl text-white uppercase italic tracking-tight mb-10 flex items-center gap-3">
                <Cpu className="w-6 h-6 text-glow-blue" /> Intelligence <span className="text-glow-blue">Engine</span>
            </h3>
            <div className="space-y-10">
                <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] space-y-8">
                   <div>
                      <div className="flex justify-between items-center mb-4">
                         <label className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">AI Autonomy Level</label>
                         <span className="text-xs font-mono text-glow-blue">{slider}% Authorized</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" max="100" 
                        value={slider}
                        onChange={(e) => setSlider(parseInt(e.target.value))}
                        className="w-full h-1 bg-white/5 rounded-full appearance-none cursor-pointer accent-glow-blue" 
                      />
                      <div className="flex justify-between mt-3">
                        <p className="text-[9px] text-slate-600 italic uppercase font-bold">
                          {slider < 30 ? 'Manual mode â€” AI only suggests, never acts autonomously' : 
                           slider < 70 ? 'Hybrid mode â€” AI executes low-risk reroutes automatically' : 
                           'Full autonomy â€” AI handles all rerouting and failovers in real time'}
                        </p>
                        <button onClick={() => showToast(`AI Autonomy set to ${slider}%`)} className="text-[9px] text-glow-blue font-bold hover:underline uppercase">Apply</button>
                      </div>
                   </div>
                </div>

                <div 
                  className="p-8 bg-glow-blue/5 border border-glow-blue/10 rounded-[2.5rem] flex items-center justify-between group cursor-pointer hover:bg-glow-blue/10 transition-colors"
                  onClick={() => setShowConfigModal(true)}
                >
                   <div className="flex items-center gap-6">
                      <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-glow-blue">
                         <Download className="w-6 h-6" />
                      </div>
                      <div>
                         <p className="text-[11px] text-white font-bold uppercase tracking-widest">Data Export Preferences</p>
                         <p className="text-[9px] text-slate-500 uppercase mt-1 italic">Format: {exportFormat} // Frequency: {exportFreq} {exportTime} UTC</p>
                      </div>
                   </div>
                   <button className="px-6 py-2 border border-white/10 text-white text-[9px] font-bold uppercase tracking-widest rounded-xl group-hover:bg-glow-blue transition-all pointer-events-none">Configure</button>
                </div>
            </div>

            {/* Data Export Config Modal */}
            <AnimatePresence>
              {showConfigModal && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-md"
                  onClick={(e) => { if (e.target === e.currentTarget) setShowConfigModal(false); }}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-[#0a0d14] border border-white/10 rounded-[3rem] p-10 w-full max-w-md relative"
                  >
                    <button onClick={() => setShowConfigModal(false)} className="absolute top-6 right-6 p-2 hover:bg-white/5 rounded-xl text-slate-500 hover:text-white transition-all">
                      <X className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-10 h-10 bg-glow-blue/10 rounded-xl flex items-center justify-center border border-glow-blue/20">
                        <Download className="w-5 h-5 text-glow-blue" />
                      </div>
                      <div>
                        <h3 className="font-header text-xl text-white uppercase italic">Export Config</h3>
                        <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Data Pipeline Settings</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-3">Export Format</p>
                        <div className="grid grid-cols-3 gap-3">
                          {(['JSON', 'CSV', 'Both'] as const).map(f => (
                            <button key={f} onClick={() => setExportFormat(f)} className={`py-3 rounded-xl border text-[9px] font-bold uppercase transition-all ${exportFormat === f ? 'bg-glow-blue/20 border-glow-blue text-white' : 'bg-white/5 border-white/10 text-slate-500 hover:text-white'}`}>{f}</button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-3">Frequency</p>
                        <div className="grid grid-cols-3 gap-3">
                          {(['Hourly', 'Daily', 'Weekly'] as const).map(f => (
                            <button key={f} onClick={() => setExportFreq(f)} className={`py-3 rounded-xl border text-[9px] font-bold uppercase transition-all ${exportFreq === f ? 'bg-glow-blue/20 border-glow-blue text-white' : 'bg-white/5 border-white/10 text-slate-500 hover:text-white'}`}>{f}</button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-3">Export Time (UTC)</p>
                        <input type="time" value={exportTime} onChange={e => setExportTime(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white font-mono text-sm focus:outline-none focus:border-glow-blue/50" />
                      </div>
                      <button 
                        onClick={() => { setShowConfigModal(false); showToast(`Export configured: ${exportFormat} ${exportFreq} at ${exportTime} UTC`); }}
                        className="w-full py-4 bg-glow-blue text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-blue-600 transition-all"
                      >
                        Save Export Settings
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
        </div>
    );
}

/* â”€â”€ System Settings â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function SystemSettings({ showToast }: { showToast: (m: string) => void }) {
    const [theme, setTheme] = useState('Dark_Tactical');
    const [freq, setFreq] = useState('Realtime');
    const [wiped, setWiped] = useState(false);
    const [applyingTheme, setApplyingTheme] = useState<string | null>(null);
    const [applyingFreq, setApplyingFreq] = useState<string | null>(null);
    const { resetSimulations, clearAuditLogs } = useStore();

    const handleTheme = (t: string) => {
        setApplyingTheme(t);
        setTimeout(() => {
          setTheme(t);
          setApplyingTheme(null);
          showToast(`Theme changed to ${t.replace(/_/g, ' ')}`);
        }, 700);
    };

    const handleFreq = (f: string) => {
        setApplyingFreq(f);
        setTimeout(() => {
          setFreq(f);
          setApplyingFreq(null);
          showToast(`Telemetry frequency set to ${f.replace(/_/g, ' ')}`);
        }, 700);
    };

    const handleWipe = () => {
        resetSimulations();
        clearAuditLogs();
        setWiped(true);
        showToast('Operational data purged successfully');
        setTimeout(() => setWiped(false), 3000);
    };

    return (
        <div className="space-y-10">
            <h3 className="font-header text-2xl text-white uppercase italic tracking-tight mb-10 flex items-center gap-3">
                <Sliders className="w-6 h-6 text-glow-blue" /> System <span className="text-glow-blue">Interface</span>
            </h3>
            <div className="grid grid-cols-2 gap-8">
                <div className="p-8 bg-white/5 border border-white/5 rounded-[2.5rem] space-y-6">
                   <h4 className="text-[10px] text-white font-bold uppercase tracking-widest flex items-center gap-2"><Palette className="w-4 h-4 text-glow-blue" /> Aesthetic Profile</h4>
                   <div className="grid grid-cols-2 gap-4">
                      {['Dark_Tactical', 'High_Contrast', 'Clean_Vault', 'Matrix_Blue'].map(t => (
                        <button 
                          key={t} 
                          onClick={() => handleTheme(t)}
                          className={`py-4 rounded-xl border text-[9px] font-bold uppercase transition-all relative overflow-hidden ${theme === t ? 'bg-glow-blue/20 border-glow-blue text-white shadow-lg' : 'bg-white/5 border-white/10 text-slate-600 hover:text-white hover:bg-white/10'}`}
                        >
                          {applyingTheme === t ? (
                            <span className="flex items-center justify-center gap-1">
                              <RefreshCcw className="w-3 h-3 animate-spin" /> Applying...
                            </span>
                          ) : (
                            <>
                              {theme === t && <CheckCircle2 className="w-3 h-3 inline mr-1 text-glow-blue" />}
                              {t.replace(/_/g, ' ')}
                            </>
                          )}
                        </button>
                      ))}
                   </div>
                   {theme && (
                     <p className="text-[9px] text-glow-blue font-mono italic">
                       Active: {theme.replace(/_/g, ' ')}
                     </p>
                   )}
                </div>
                <div className="p-8 bg-white/5 border border-white/5 rounded-[2.5rem] space-y-6">
                   <h4 className="text-[10px] text-white font-bold uppercase tracking-widest flex items-center gap-2"><RefreshCcw className="w-4 h-4 text-glow-blue" /> Telemetry Frequency</h4>
                   <div className="grid grid-cols-2 gap-4">
                      {['Realtime', '1min_Sync', '5min_Audit', 'Manual'].map(f => (
                        <button 
                          key={f} 
                          onClick={() => handleFreq(f)}
                          className={`py-4 rounded-xl border text-[9px] font-bold uppercase transition-all ${freq === f ? 'bg-glow-blue/20 border-glow-blue text-white shadow-lg' : 'bg-white/5 border-white/10 text-slate-600 hover:text-white hover:bg-white/10'}`}
                        >
                          {applyingFreq === f ? (
                            <span className="flex items-center justify-center gap-1">
                              <RefreshCcw className="w-3 h-3 animate-spin" /> Setting...
                            </span>
                          ) : (
                            <>
                              {freq === f && <CheckCircle2 className="w-3 h-3 inline mr-1 text-glow-blue" />}
                              {f.replace(/_/g, ' ')}
                            </>
                          )}
                        </button>
                      ))}
                   </div>
                   {freq && (
                     <p className="text-[9px] text-glow-blue font-mono italic">
                       Active: {freq.replace(/_/g, ' ')}
                     </p>
                   )}
                </div>
            </div>
            
            <div className="mt-10 p-10 bg-critical/5 border border-critical/10 rounded-[3rem] flex items-center justify-between hover:bg-critical/10 transition-colors">
                <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-critical">
                       <Trash2 className="w-6 h-6" />
                    </div>
                    <div>
                       <p className="text-[11px] text-white font-bold uppercase tracking-widest">Wipe Operational Data</p>
                       <p className="text-[9px] text-slate-500 uppercase mt-1 italic">Permanently clear simulation history and audit logs.</p>
                    </div>
                </div>
                <button 
                  onClick={handleWipe}
                  disabled={wiped}
                  className={`px-10 py-4 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg transition-colors ${wiped ? 'bg-success' : 'bg-critical hover:bg-red-600'}`}
                >
                  {wiped ? 'Purge Complete' : 'Initialize Purge'}
                </button>
            </div>
        </div>
    );
}
