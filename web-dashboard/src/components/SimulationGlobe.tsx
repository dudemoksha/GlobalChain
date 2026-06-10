"use client";

import React, { useEffect, useRef, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import * as THREE from 'three';
import { useStore, Supplier, Edge, Simulation } from '@/store/useStore';
import { Shield, Activity, Zap, AlertTriangle, Radio } from 'lucide-react';

const Globe = dynamic(() => import('react-globe.gl'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-[#020617]/50 text-glow-blue gap-4 rounded-[3rem]">
      <div className="w-16 h-16 border-2 border-glow-blue border-t-transparent rounded-full animate-spin"></div>
      <p className="font-header text-xs tracking-[0.3em] uppercase animate-pulse">Initializing Simulation Matrix...</p>
    </div>
  )
});

export default function SimulationGlobe() {
  const globeRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { suppliers, edges, activeSimulation, userRole } = useStore();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          setDimensions({ width, height });
        }
      }
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Use simulated data if available, otherwise fallback to basic operational points but keep them white (safe)
  const displaySuppliers = activeSimulation?.simulatedSuppliers || suppliers.map(s => ({ ...s, health: 100 }));

  const arcData = useMemo(() => {
    return edges.map(edge => {
      const source = displaySuppliers.find(s => s.id === edge.source);
      const target = edge.target === 'Main' ? { lat: 37.7749, lng: -122.4194 } : displaySuppliers.find(s => s.id === edge.target);
      if (!source || !target) return null;
      
      let color = 'rgba(59, 130, 246, 0.9)';
      let dashAnimateTime = 2500;
      let stroke = 1.8;

      const sourceHealth = source.health;
      const targetHealth = (target as any).health ?? 100;
      const sourceRisk = source.risk;

      if (sourceHealth < 40 || targetHealth < 40 || sourceRisk > 70) {
         color = 'rgba(239, 68, 68, 1.0)';
         dashAnimateTime = 800;
         stroke = 2.5;
      } else if (sourceHealth < 80 || targetHealth < 80 || sourceRisk > 30) {
         color = 'rgba(245, 158, 11, 1.0)';
         dashAnimateTime = 1500;
         stroke = 2.2;
      }
      
      return { 
        startLat: source.lat, 
        startLng: source.lng, 
        endLat: target.lat, 
        endLng: target.lng, 
        color, 
        dashLength: 0.95,
        dashGap: 0.05,
        dashAnimateTime,
        stroke
      };
    }).filter((x): x is NonNullable<typeof x> => x !== null);
  }, [edges, displaySuppliers]);

  const customNodeData = useMemo(() => {
    return displaySuppliers.map(s => {
        const displayName = (userRole === 'MainCompany' && s.tier > 1) ? `Tier ${s.tier} Node` : s.name;
        let color = '#22c55e'; // GREEN
        if (s.health < 40 || s.risk > 70) {
          color = '#ef4444'; // RED
        } else if (s.health < 80 || s.risk > 30) {
          color = '#f59e0b'; // ORANGE
        }

        let size = s.tier === 1 ? 1.8 : 1.0; 
        if (s.health < 60) size *= 1.3;
        
        return {
            lat: s.lat, lng: s.lng, 
            size,
            color,
            name: displayName,
            health: s.health,
            supplier: s
        };
    });
  }, [displaySuppliers, userRole]);

  const ringData = useMemo(() => {
    const supplierRings = displaySuppliers.map(s => {
      let color = 'rgba(34, 197, 94, 0.6)'; // GREEN
      if (s.health < 40 || s.risk > 70) {
        color = 'rgba(239, 68, 68, 0.9)';
      } else if (s.health < 80 || s.risk > 30) {
        color = 'rgba(245, 158, 11, 0.9)';
      }

      return {
        lat: s.lat,
        lng: s.lng,
        maxR: s.tier === 1 ? 4.0 : 2.5,
        propagationSpeed: s.health < 100 ? 5 : 2,
        repeatPeriod: 1200,
        color
      };
    });

    if (activeSimulation && activeSimulation.location) {
        supplierRings.push({
            lat: activeSimulation.location.lat, 
            lng: activeSimulation.location.lng, 
            maxR: (activeSimulation.radius / 100) * 2,
            propagationSpeed: 4, 
            repeatPeriod: 800, 
            color: '#ef4444'
        });
    }

    return supplierRings;
  }, [displaySuppliers, activeSimulation]);

  if (!isMounted || dimensions.width === 0) {
    return (
      <div ref={containerRef} className="w-full h-full min-h-[500px] flex flex-col items-center justify-center bg-[#020617]/50 text-glow-blue gap-4 rounded-[3rem]">
        <div className="w-12 h-12 border-2 border-glow-blue border-t-transparent rounded-full animate-spin"></div>
        <p className="font-header text-[10px] tracking-[0.3em] uppercase animate-pulse">Syncing Simulation Orbit...</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full h-full relative group bg-black/40 rounded-[3rem] border border-white/10 overflow-hidden shadow-inner">
      {displaySuppliers.length === 0 && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none bg-black/40 backdrop-blur-sm">
          <div className="glass-panel p-8 rounded-2xl border border-white/10 flex flex-col items-center text-center">
            <AlertTriangle className="w-12 h-12 text-slate-500 mb-4" />
            <h2 className="font-header text-xl text-white uppercase italic tracking-widest mb-2">No supplier dataset uploaded</h2>
            <p className="text-slate-400 text-xs font-mono uppercase">Please ingest an operational graph to simulate disruptions.</p>
          </div>
        </div>
      )}
      <Globe
        ref={globeRef}
        width={dimensions.width}
        height={dimensions.height}
        globeImageUrl="/earth-night.png"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        arcsData={arcData}
        arcStartLat="startLat"
        arcStartLng="startLng"
        arcEndLat="endLat"
        arcEndLng="endLng"
        arcColor="color"
        arcDashLength="dashLength"
        arcDashGap="dashGap"
        arcDashAnimateTime="dashAnimateTime"
        arcStroke="stroke"
        arcAltitudeAutoScale={0.7}
        
        // Custom Nodes - High Visibility Luminous Spheres
        customLayerData={customNodeData}
        customLayerLabel="name"
        customThreeObject={(d: any) => {
          const sphere = new THREE.SphereGeometry(d.size);
          const material = new THREE.MeshPhongMaterial({ 
            color: d.color,
            transparent: true,
            opacity: 0.9,
            emissive: d.color,
            emissiveIntensity: 2
          });
          return new THREE.Mesh(sphere, material);
        }}
        customThreeObjectUpdate={(obj: any, d: any) => {
          if (globeRef.current) {
            const coords = globeRef.current.getCoords(d.lat, d.lng, 0.01);
            Object.assign(obj.position, coords);
          }
        }}

        ringsData={ringData}
        ringColor="color"
        ringMaxRadius="maxR"
        ringPropagationSpeed="propagationSpeed"
        ringRepeatPeriod="repeatPeriod"
        showAtmosphere={true}
        atmosphereColor="#3b82f6"
        atmosphereAltitude={0.15}
      />

      <div className="absolute top-8 left-8 pointer-events-none flex flex-col gap-4">
        <div className="glass-panel p-6 rounded-2xl border border-white/10 backdrop-blur-md">
           <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 rounded-full bg-critical animate-pulse" />
              <span className="text-[10px] text-white font-bold uppercase tracking-[0.2em]">Simulation_Mode_Active</span>
           </div>
           <p className="text-[9px] text-slate-500 font-mono uppercase tracking-widest">Projection: Mercator_Sphere_v4</p>
        </div>
      </div>

      <div className="absolute bottom-8 right-8 pointer-events-none">
        <div className="glass-panel p-5 rounded-2xl border border-white/10 flex flex-col gap-3 text-[9px] font-bold uppercase tracking-widest backdrop-blur-md">
           <div className="flex items-center gap-3"><div className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_8px_white]" /> <span className="text-white">Safe / Nominal</span></div>
           <div className="flex items-center gap-3"><div className="w-2.5 h-2.5 rounded-full bg-warning shadow-[0_0_8px_rgba(245,158,11,0.8)]" /> <span className="text-warning">Affected / Warning</span></div>
           <div className="flex items-center gap-3"><div className="w-2.5 h-2.5 rounded-full bg-critical shadow-[0_0_8px_rgba(239,68,68,0.8)]" /> <span className="text-critical">Disrupted / Critical</span></div>
        </div>
      </div>
    </div>
  );
}
