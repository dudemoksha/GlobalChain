"use client";

import React, { useEffect, useRef, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import * as THREE from 'three';
import { useStore, Supplier, Edge } from '@/store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Activity, Zap, AlertTriangle } from 'lucide-react';

const Globe = dynamic(() => import('react-globe.gl'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-[#020617] text-glow-blue gap-4">
      <div className="w-16 h-16 border-2 border-glow-blue border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(59,130,246,0.3)]"></div>
      <p className="font-header text-xs tracking-[0.3em] uppercase animate-pulse">Initializing Global Intelligence...</p>
    </div>
  )
});

interface Globe3DProps {
  showLayers?: boolean;
  showArcs?: boolean;
  is2D?: boolean;
  focusNodeId?: string | null;
  activeSimulation?: any;
  showPropagation?: boolean;
}

export default function Globe3D({ 
  showLayers = true, 
  showArcs = true,
  is2D = false, 
  focusNodeId = null, 
  activeSimulation = null,
  showPropagation = true
}: Globe3DProps) {
  const globeRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { suppliers, edges, userRole } = useStore();
  const [hoveredNode, setHoveredNode] = useState<Supplier | null>(null);
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

  // Use simulation data if active, otherwise operational data
  const displaySuppliers = useMemo(() => {
    const base = activeSimulation?.simulatedSuppliers || suppliers;
    return base.map((s: Supplier) => {
      if (userRole === 'MainCompany' && s.tier > 1 && s.visibility === 'Private') {
        return { ...s, name: `Tier ${s.tier} Node`, category: 'Classified' };
      }
      return s;
    });
  }, [suppliers, userRole, activeSimulation]);

  const arcData = useMemo(() => {
    if (!showArcs || !showLayers) return [];
    return edges.map((edge: Edge) => {
      const source = displaySuppliers.find((s: Supplier) => s.id === edge.source);
      const target = edge.target === 'Main' ? { lat: 37.7749, lng: -122.4194 } : displaySuppliers.find((s: Supplier) => s.id === edge.target);
      if (!source || !target) return null;
      
      // Cinematic glowing continuous routes
      let color = 'rgba(59, 130, 246, 0.9)'; // Premium glowing blue
      let dashAnimateTime = 2500;
      let stroke = 1.8;

      const sourceHealth = source.health;
      const targetHealth = (target as any).health ?? 100;
      const sourceRisk = source.risk;

      if (sourceHealth < 40 || targetHealth < 40 || sourceRisk > 70) {
        color = 'rgba(239, 68, 68, 1.0)'; // Intense Solid Red
        dashAnimateTime = 800;
        stroke = 2.5;
      } else if (sourceHealth < 80 || targetHealth < 80 || sourceRisk > 30) {
        color = 'rgba(245, 158, 11, 1.0)'; // Bold Glowing Orange
        dashAnimateTime = 1500;
        stroke = 2.2;
      }

      return { 
        startLat: source.lat, 
        startLng: source.lng, 
        endLat: target.lat, 
        endLng: target.lng, 
        color,
        dashLength: 0.95, // Near continuous smooth flow
        dashGap: 0.05,
        dashAnimateTime,
        stroke
      };
    }).filter((x): x is NonNullable<typeof x> => x !== null);
  }, [edges, displaySuppliers, showArcs, showLayers, activeSimulation, showPropagation]);

  const customNodeData = useMemo(() => {
    if (!showLayers) return [];
    return displaySuppliers.map((s: Supplier) => {
      // Dynamic recoloring based on health and risk
      let color = '#22c55e'; // GREEN: safe supplier, healthy operations
      if (s.health < 40 || s.risk > 70) {
        color = '#ef4444'; // RED: critical disruption
      } else if (s.health < 80 || s.risk > 30) {
        color = '#f59e0b'; // ORANGE: warning state
      }

      let size = s.tier === 1 ? 1.8 : s.tier === 2 ? 1.2 : 0.8;
      if (s.health < 40) size *= 1.4;

      return {
        lat: s.lat, lng: s.lng, 
        size,
        color,
        name: s.name, 
        supplier: s,
        label: s.name
      };
    });
  }, [displaySuppliers, showLayers, activeSimulation, showPropagation]);

  const ringData = useMemo(() => {
    if (!showLayers) return [];
    return displaySuppliers.map((s: Supplier) => {
      let color = 'rgba(34, 197, 94, 0.6)'; // GREEN
      if (s.health < 40 || s.risk > 70) {
        color = 'rgba(239, 68, 68, 0.9)';
      } else if (s.health < 80 || s.risk > 30) {
        color = 'rgba(245, 158, 11, 0.9)';
      }

      return {
        lat: s.lat,
        lng: s.lng,
        maxR: s.tier === 1 ? 4.0 : s.tier === 2 ? 2.5 : 1.5,
        propagationSpeed: s.health < 40 ? 6 : 2,
        repeatPeriod: 1200,
        color
      };
    });
  }, [displaySuppliers, showLayers]);

  useEffect(() => {
    if (globeRef.current && isMounted) {
      const globe = globeRef.current;
      const controls = globe.controls();
      if (controls) {
        controls.autoRotate = !hoveredNode && !focusNodeId;
        controls.autoRotateSpeed = 0.5;
        controls.enableDamping = true;
        controls.dampingFactor = 0.1;
      }

      if (focusNodeId) {
        const target = displaySuppliers.find((s: Supplier) => s.id === focusNodeId);
        if (target) {
          globe.pointOfView({ lat: target.lat, lng: target.lng, altitude: 0.8 }, 1500);
        }
      } else if (!is2D) {
        globe.pointOfView({ altitude: 2.5 }, 1000);
      }
    }
  }, [hoveredNode, isMounted, focusNodeId, displaySuppliers, is2D]);

  if (!isMounted || dimensions.width === 0) {
    return (
      <div ref={containerRef} className="w-full h-full min-h-[600px] flex flex-col items-center justify-center bg-[#020617] text-glow-blue gap-4">
        <div className="w-12 h-12 border-2 border-glow-blue border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(59,130,246,0.3)]"></div>
        <p className="font-header text-[10px] tracking-[0.3em] uppercase animate-pulse">Initializing Neural Link...</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full h-full relative group bg-[#020617] flex items-center justify-center overflow-hidden">
      {displaySuppliers.length === 0 && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none bg-black/40 backdrop-blur-sm">
          <div className="glass-panel p-8 rounded-2xl border border-white/10 flex flex-col items-center text-center">
            <AlertTriangle className="w-12 h-12 text-slate-500 mb-4" />
            <h2 className="font-header text-xl text-white uppercase italic tracking-widest mb-2">No supplier dataset uploaded</h2>
            <p className="text-slate-400 text-xs font-mono uppercase">Please ingest an operational graph to visualize the network.</p>
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
        
        // 2D/3D Logic
        
        // Arcs (Shipping Routes)
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
        
        // Custom Nodes - Rendered as Luminous Spheres (No more cylinders)
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
        onCustomLayerHover={(node: any) => setHoveredNode(node?.supplier || null)}
        
        // Rings (Pulse Effects)
        ringsData={ringData}
        ringColor="color"
        ringMaxRadius="maxR"
        ringPropagationSpeed="propagationSpeed"
        ringRepeatPeriod="repeatPeriod"

        // Labels
        labelsData={customNodeData}
        labelLat="lat"
        labelLng="lng"
        labelText="label"
        labelSize={0.3}
        labelDotRadius={0.1}
        labelColor={() => 'rgba(255, 255, 255, 0.6)'}
        labelResolution={2}
        
        showAtmosphere={!is2D}
        atmosphereColor="#3b82f6"
        atmosphereAltitude={0.15}
      />

      {/* Tooltip on Hover */}
      <AnimatePresence>
        {hoveredNode && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="absolute bottom-32 right-12 z-50 pointer-events-none"
          >
            <div className="glass-panel p-6 rounded-2xl border border-glow-blue/40 w-72 bg-black/80 backdrop-blur-3xl shadow-[0_0_30px_rgba(59,130,246,0.2)]">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-header text-white text-xl leading-tight uppercase italic truncate pr-4">{hoveredNode.name}</h3>
                <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${hoveredNode.health < 40 ? 'bg-critical' : 'bg-glow-blue'} text-white`}>Tier {hoveredNode.tier}</span>
              </div>
              <div className="space-y-3">
                 <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest text-slate-500">
                    <span>Health Metrics</span>
                    <span className={hoveredNode.health < 40 ? 'text-critical' : 'text-success'}>{hoveredNode.health}%</span>
                 </div>
                 <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${hoveredNode.health}%` }} className={`h-full ${hoveredNode.health < 40 ? 'bg-critical' : 'bg-success'}`} />
                 </div>
                 <p className="text-[10px] text-slate-400 font-mono uppercase mt-4 italic">{hoveredNode.category} // {hoveredNode.city || 'GLOBAL'}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
