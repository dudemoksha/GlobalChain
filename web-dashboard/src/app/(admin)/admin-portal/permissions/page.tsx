"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Key, Shield, AlertTriangle, CheckCircle2, Loader2, RefreshCw, Copy, Check } from 'lucide-react';
import { useStore } from '@/store/useStore';

export default function AdminPermissionsPage() {
  const { addAuditLog } = useStore();
  const [isRotating, setIsRotating] = useState(false);
  const [activeKey, setActiveKey] = useState("gc_live_kex_sha256_fa89bc019cdd9908deef4412ab99015c");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [rotationHistory, setRotationHistory] = useState([
    { version: 'v2.4.1', rotatedBy: 'SYSTEM', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toLocaleString(), signature: 'gc_live_kex_sha256_e81c...99a1' },
    { version: 'v2.4.0', rotatedBy: 'GC-ADMIN-01', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toLocaleString(), signature: 'gc_live_kex_sha256_a210...ff2b' },
  ]);

  const handleCopyKey = () => {
    navigator.clipboard.writeText(activeKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEmergencyRotation = () => {
    if (confirm("WARNING: Initiating emergency key rotation will temporarily disrupt active Singapore node handshakes. Do you wish to continue?")) {
      setIsRotating(true);
      
      setTimeout(() => {
        // Generate new random hex key
        const characters = '0123456789abcdef';
        let keyTail = '';
        for (let i = 0; i < 32; i++) {
          keyTail += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        const newKey = `gc_live_kex_sha256_${keyTail}`;
        setActiveKey(newKey);
        
        // Add to history
        const newRecord = {
          version: `v2.4.${rotationHistory.length + 2}`,
          rotatedBy: 'ROOT_ADMIN',
          timestamp: new Date().toLocaleString(),
          signature: `${newKey.substring(0, 19)}...${newKey.substring(newKey.length - 4)}`
        };
        setRotationHistory(prev => [newRecord, ...prev]);

        // Audit Log
        addAuditLog({
          user: 'AUTH_GATE',
          action: 'JWT_ROTATION',
          result: 'SUCCESS',
          details: `Emergency key rotation initiated. Active symmetric key rotated to signature version ${newRecord.version}.`
        });

        setIsRotating(false);
        setToastMessage("Emergency key rotation completed successfully.");
        setTimeout(() => setToastMessage(null), 4000);
      }, 1500);
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
          <CheckCircle2 className="w-5 h-5 text-green-500" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">{toastMessage}</span>
        </motion.div>
      )}

      {/* Header Section */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tighter uppercase flex items-center gap-3">
            <Lock className="text-blue-500 w-6 h-6 animate-pulse" /> Access_Control_Matrix
          </h2>
          <p className="text-slate-500 text-xs mt-1 font-bold uppercase tracking-[0.2em]">Configuring Granular Clearance for Global Nodes...</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Role Hierarchy */}
         <div className="lg:col-span-2 p-8 bg-[#0a0c10] border border-blue-900/20 rounded-3xl space-y-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
               <Shield className="w-4 h-4 text-blue-500" /> Role_Hierarchy
            </h3>
            <div className="space-y-4">
               {[
                 { role: 'Root_Admin', perm: 'FULL_CONTROL', color: 'text-blue-400' },
                 { role: 'Ops_Director', perm: 'READ_WRITE_EXEC', color: 'text-slate-300' },
                 { role: 'Risk_Analyst', perm: 'READ_ONLY_INTEL', color: 'text-slate-500' },
                 { role: 'Supplier_Node', perm: 'PARTIAL_DATA_SYNC', color: 'text-slate-600' },
               ].map((role, i) => (
                 <div key={i} className="flex justify-between items-center p-4 border border-blue-900/10 rounded hover:bg-blue-500/5 transition-all">
                    <span className={`font-bold ${role.color}`}>{role.role}</span>
                    <span className="text-[9px] font-bold uppercase bg-blue-900/20 px-2 py-1 rounded text-blue-300">{role.perm}</span>
                 </div>
               ))}
            </div>

            {/* Rotation Ledger */}
            <div className="mt-8 pt-8 border-t border-blue-900/10">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Key Rotation History</h4>
              <div className="space-y-3">
                {rotationHistory.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-[10px] p-3 bg-black/20 border border-blue-900/5 rounded text-slate-500 font-mono">
                    <div className="flex gap-4">
                      <span className="text-blue-400 font-bold">{item.version}</span>
                      <span>Rotated by: {item.rotatedBy}</span>
                    </div>
                    <div className="flex gap-4">
                      <span>{item.timestamp}</span>
                      <span className="text-slate-600">{item.signature}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
         </div>

         {/* Encryption Key Controller */}
         <div className="p-8 bg-[#0a0c10] border border-blue-900/20 rounded-3xl flex flex-col justify-between text-center relative overflow-hidden min-h-[400px]">
            {isRotating && (
              <div className="absolute inset-0 bg-black/85 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-6 text-center">
                <Loader2 className="w-10 h-10 text-red-500 animate-spin mb-4" />
                <span className="text-[10px] font-bold text-white uppercase tracking-widest animate-pulse">REGENERATING SYMMETRIC SECRET...</span>
                <span className="text-[8px] text-slate-500 uppercase mt-2">Invalidating old session keys across clusters...</span>
              </div>
            )}
            
            <div className="flex flex-col items-center">
              <Key className="w-14 h-14 text-blue-500 mb-6 animate-pulse" />
              <p className="text-[11px] text-white font-bold uppercase tracking-widest mb-1">Active Symmetric Token</p>
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-4">Click to copy active session encryption key</p>
              
              <div className="flex items-center gap-2 bg-black/40 border border-blue-900/30 rounded-lg p-3 w-full justify-between group">
                <span className="text-[9px] text-blue-400 font-mono truncate max-w-[200px]" title={activeKey}>
                  {activeKey}
                </span>
                <button 
                  onClick={handleCopyKey}
                  className="text-slate-500 hover:text-white transition-colors shrink-0"
                >
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="mt-8">
              <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-xl mb-6 text-left flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                <div>
                  <p className="text-[9px] text-white font-bold uppercase">Severe Operational Impact</p>
                  <p className="text-[8px] text-slate-500 uppercase mt-1 leading-normal">Emergency rotation invalidates all existing user cookies & Singapore/EU node handshakes.</p>
                </div>
              </div>
              <button 
                onClick={handleEmergencyRotation}
                className="w-full py-4 bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl shadow-[0_0_20px_rgba(239,68,68,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Emergency_Key_Rotation
              </button>
            </div>
         </div>
      </div>
    </div>
  );
}
