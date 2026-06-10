"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Cpu, Brain, Zap, Activity, BarChart3, 
  TrendingUp, RefreshCcw, Shield, CheckCircle2, Settings
} from 'lucide-react';

const models = [
  { id: 'MDL-001', name: 'Risk Propagation Engine', version: 'v3.2.1', accuracy: 94.8, status: 'Active', inference: '42ms', trained: '12 MAY 2026' },
  { id: 'MDL-002', name: 'Demand Forecaster', version: 'v2.4.0', accuracy: 91.2, status: 'Active', inference: '18ms', trained: '10 MAY 2026' },
  { id: 'MDL-003', name: 'Anomaly Detector', version: 'v1.9.4', accuracy: 97.4, status: 'Active', inference: '8ms', trained: '14 MAY 2026' },
  { id: 'MDL-004', name: 'Supplier Health Scorer', version: 'v2.1.0', accuracy: 89.6, status: 'Training', inference: '—', trained: 'In Progress' },
];

export default function AIModelsConfig() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase tracking-widest mb-2 font-mono">
            <span>Intelligence</span><span className="opacity-30">/</span><span className="text-slate-300">AI Engine Config</span>
          </div>
          <h2 className="font-header text-3xl text-white tracking-tight uppercase italic">
            Neural <span className="text-glow-blue">Intelligence Engine</span>
          </h2>
        </div>
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2 px-3 py-1 bg-glow-blue/10 border border-glow-blue/30 rounded-full">
            <Cpu className="w-3 h-3 text-glow-blue" />
            <span className="text-[9px] text-glow-blue font-bold uppercase font-mono">Neural_Core: Online v2.4</span>
          </div>
          <button className="px-6 py-2 bg-glow-blue text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg flex items-center gap-2 hover:scale-105 transition-all">
            <RefreshCcw className="w-3 h-3" /> Retrain All
          </button>
        </div>
      </div>

      {/* Global AI KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: 'Active Models', val: '3', color: 'text-success' },
          { label: 'Models in Training', val: '1', color: 'text-warning' },
          { label: 'Avg Accuracy', val: '93.3%', color: 'text-glow-blue' },
          { label: 'Daily Inferences', val: '284k', color: 'text-white' },
        ].map((kpi, i) => (
          <motion.div key={i} whileHover={{ y: -4 }} className="glass-panel border border-white/10 p-6 rounded-2xl">
            <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest mb-1">{kpi.label}</p>
            <div className={`text-2xl font-header ${kpi.color}`}>{kpi.val}</div>
          </motion.div>
        ))}
      </div>

      {/* Models List */}
      <div className="glass-panel border border-white/10 rounded-3xl p-8">
        <h3 className="font-header text-sm text-white uppercase tracking-widest mb-6 flex items-center gap-2">
          <Brain className="w-4 h-4 text-glow-blue" /> Deployed Intelligence Models
        </h3>
        <div className="space-y-4">
          {models.map((model, i) => (
            <motion.div key={model.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="p-6 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/[0.08] transition-all group">
              <div className="flex items-start justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    model.status === 'Active' ? 'bg-success/10 border border-success/20' : 'bg-warning/10 border border-warning/20'
                  }`}>
                    <Cpu className={`w-6 h-6 ${model.status === 'Active' ? 'text-success' : 'text-warning'}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="text-sm font-bold text-white uppercase italic tracking-tight">{model.name}</h4>
                      <span className={`text-[8px] font-bold uppercase px-2 py-0.5 rounded border ${
                        model.status === 'Active' ? 'text-success border-success/30 bg-success/10' : 'text-warning border-warning/30 bg-warning/10'
                      }`}>{model.status}</span>
                    </div>
                    <div className="flex items-center gap-4 text-[9px] text-slate-500 font-mono uppercase">
                      <span>{model.id} // {model.version}</span>
                      <span>Trained: {model.trained}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-8 shrink-0">
                  <div className="text-center">
                    <p className="text-[8px] text-slate-500 uppercase mb-1">Accuracy</p>
                    <p className={`text-lg font-header ${model.accuracy > 93 ? 'text-success' : 'text-warning'}`}>{model.accuracy}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[8px] text-slate-500 uppercase mb-1">Inference</p>
                    <p className="text-lg font-header text-glow-blue">{model.inference}</p>
                  </div>
                  <button className="p-2 border border-white/10 rounded-xl text-slate-500 hover:text-white hover:border-white/20 transition-all">
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {model.status === 'Active' && (
                <div className="mt-5 pt-4 border-t border-white/5">
                  <div className="flex justify-between text-[9px] text-slate-500 uppercase mb-2">
                    <span>Model Accuracy Index</span><span>{model.accuracy}%</span>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${model.accuracy}%` }}
                      className={`h-full ${model.accuracy > 93 ? 'bg-success' : 'bg-warning'}`} />
                  </div>
                </div>
              )}

              {model.status === 'Training' && (
                <div className="mt-5 pt-4 border-t border-white/5 flex items-center gap-4">
                  <RefreshCcw className="w-3 h-3 text-warning animate-spin" />
                  <span className="text-[9px] text-warning font-mono uppercase font-bold">Training in Progress — ETA: 4.2 hours</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Model Architecture Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 bg-glow-blue/5 border border-glow-blue/20 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-[0.04]"><Brain className="w-32 h-32 text-glow-blue" /></div>
          <div className="relative z-10">
            <h4 className="text-[10px] font-bold text-glow-blue uppercase tracking-widest mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4" /> Neural Architecture
            </h4>
            <p className="text-[10px] text-slate-300 leading-relaxed italic mb-4">
              "All GlobalChain models run on a hybrid Transformer-GNN architecture purpose-built for graph-structured supply chain data. Optimised for real-time inference with &lt; 50ms latency targets."
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Architecture', val: 'Transformer-GNN' },
                { label: 'Training Data', val: '14B Events' },
                { label: 'Context Window', val: '128k Nodes' },
                { label: 'Update Cycle', val: 'Continuous' },
              ].map((s, i) => (
                <div key={i} className="p-3 bg-white/5 rounded-xl">
                  <p className="text-[8px] text-slate-500 uppercase mb-1">{s.label}</p>
                  <p className="text-[10px] font-bold text-white">{s.val}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-panel border border-white/10 rounded-3xl p-8">
          <h4 className="text-[10px] font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-2">
            <Shield className="w-4 h-4 text-glow-blue" /> Safety & Governance
          </h4>
          <div className="space-y-4">
            {[
              { label: 'Explainability Mode', val: 'SHAP + LIME', active: true },
              { label: 'Bias Monitoring', val: 'Continuous', active: true },
              { label: 'Human Override Protocol', val: 'Level 4 Required', active: true },
              { label: 'Model Drift Detection', val: 'Active (±2σ)', active: true },
            ].map((g, i) => (
              <div key={i} className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/5">
                <div>
                  <p className="text-[10px] font-bold text-white uppercase tracking-tight">{g.label}</p>
                  <p className="text-[9px] text-slate-500 font-mono mt-0.5">{g.val}</p>
                </div>
                {g.active && <CheckCircle2 className="w-4 h-4 text-success" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
