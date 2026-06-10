"use client";

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Shield, Globe } from 'lucide-react';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/welcome');
    }, 4500);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="h-screen w-full bg-[#020617] flex flex-col items-center justify-center overflow-hidden relative">
      {/* Cinematic Background Arcs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-glow-blue/10 rounded-full animate-ping-slow opacity-20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-glow-blue/20 rounded-full animate-pulse opacity-20" />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ scale: 0, rotate: -45, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="w-32 h-32 bg-glow-blue/10 rounded-3xl flex items-center justify-center border border-glow-blue/30 shadow-[0_0_50px_rgba(59,130,246,0.3)] mb-8"
        >
          <Shield className="w-16 h-16 text-glow-blue" />
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="text-center"
        >
          <h1 className="font-header text-6xl text-white tracking-tighter uppercase italic mb-2">
            Global<span className="text-glow-blue">Chain</span>
          </h1>
          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-[0.6em] ml-1">Enterprise Intelligence Network</p>
        </motion.div>
      </div>

      {/* Loading Bar Container */}
      <div className="absolute bottom-20 w-64 h-px bg-white/10 overflow-hidden">
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ duration: 3, delay: 1, ease: "easeInOut" }}
          className="w-full h-full bg-gradient-to-r from-transparent via-glow-blue to-transparent"
        />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 4 }}
        className="absolute bottom-8 text-[8px] text-slate-600 font-mono uppercase tracking-widest"
      >
        Initializing Secure Global Protocol v4.2.0...
      </motion.div>
    </div>
  );
}
