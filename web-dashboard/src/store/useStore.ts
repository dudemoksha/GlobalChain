import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Tier = 1 | 2 | 3;

export interface Supplier {
  id: string;
  name: string;
  tier: Tier;
  lat: number;
  lng: number;
  health: number;   // 0–100
  risk: number;     // 0–100
  visibility: 'Public' | 'Private';
  category: string;
  city?: string;    
  isBackup?: boolean;
  affectedBy?: string; 
  reason?: string;     
}

export interface Edge {
  source: string;  
  target: string;  
  value: number;   
}

export interface Recommendation {
  id: string;
  supplierId: string;
  backupId: string;
  backupName: string;
  backupContact: {
    email: string;
    phone: string;
    representative: string;
  };
  reason: string;
  riskReduction: number;
  logisticsImprovement: number;
  resilienceBoost: number;
  timestamp: string;
  type: 'SIMULATION' | 'AUTOMATIC';
}

export interface Simulation {
  id: string;
  type: string;
  locationName?: string;
  location?: { lat: number; lng: number };
  targetNodeId?: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  radius: number;
  duration: string;
  active: boolean;
  timestamp: string;
  simulatedSuppliers?: Supplier[];
  simulatedRecommendations?: Recommendation[];
  impactReport?: {
    totalAffected: number;
    financialLoss: number;
    logisticsDelay: string;
    resilienceScore: number;
  };
}

export interface Organization {
  id: string;
  name: string;
  email: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Suspended';
  createdAt: string;
}

export interface DbSyncState {
  isConnected: boolean;
  isSyncing: boolean;
  lastSyncedAt: string | null;
  orgId: string | null;
  error: string | null;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  result: string;
  details: string;
}

interface GlobalState {
  suppliers: Supplier[];
  edges: Edge[];
  activeSimulation: Simulation | null;
  simulationHistory: Simulation[];
  autoRecommendations: Recommendation[];
  userRole: 'Admin' | 'MainCompany' | 'Supplier' | null;
  organizations: Organization[];
  db: DbSyncState;
  auditLogs: AuditLog[];

  // Actions
  setSuppliers: (suppliers: Supplier[]) => void;
  setOrganizations: (organizations: Organization[]) => void;
  addSupplier: (supplier: Supplier) => void;
  updateSupplier: (id: string, updates: Partial<Supplier>) => void;
  deleteSupplier: (id: string) => void;
  setEdges: (edges: Edge[]) => void;
  addEdge: (edge: Edge) => void;
  updateEdge: (source: string, target: string, updates: Partial<Edge>) => void;
  removeEdge: (source: string, target: string) => void;

  // Simulation & Intelligence
  runSimulation: (sim: Simulation) => void;
  clearSimulation: () => void;
  resetSimulations: () => void;
  reevaluateIntelligence: () => void;
  resolveRecommendation: (id: string) => void;
  
  // Auth & DB
  login: (role: GlobalState['userRole']) => void;
  logout: () => void;
  setOrgId: (orgId: string) => void;
  setDbConnected: (connected: boolean) => void;
  setDbSyncing: (syncing: boolean) => void;
  setDbError: (error: string | null) => void;
  setSyncedAt: () => void;

  // Audit Logs actions
  addAuditLog: (log: Omit<AuditLog, 'id' | 'timestamp'>) => void;
  clearAuditLogs: () => void;
  resetAuditLogs: () => void;
}

export const useStore = create<GlobalState>()(
  persist(
    (set, get) => ({
      suppliers: [],
  edges: [],
  activeSimulation: null,
  simulationHistory: [],
  autoRecommendations: [],
  userRole: null,
  organizations: [],
  db: {
    isConnected: false,
    isSyncing: false,
    lastSyncedAt: null,
    orgId: null,
    error: null,
  },
  auditLogs: [],

  setSuppliers: (suppliers) => set({ suppliers }),
  setOrganizations: (organizations) => set({ organizations }),
  addSupplier: (supplier) => set((state) => {
    if (state.suppliers.some(s => s.id === supplier.id)) {
      return { suppliers: state.suppliers.map(s => s.id === supplier.id ? supplier : s) };
    }
    return { suppliers: [...state.suppliers, supplier] };
  }),
  updateSupplier: (id, updates) => set((state) => ({
    suppliers: state.suppliers.map((s) => s.id === id ? { ...s, ...updates } : s),
  })),
  deleteSupplier: (id) => set((state) => ({
    suppliers: state.suppliers.filter((s) => s.id !== id),
  })),

  setEdges: (edges) => set({ edges }),
  addEdge: (edge) => set((state) => ({ edges: [...state.edges, edge] })),
  updateEdge: (source, target, updates) => set((state) => ({
    edges: state.edges.map(e => (e.source === source && e.target === target) ? { ...e, ...updates } : e)
  })),
  removeEdge: (source, target) => set((state) => ({
    edges: state.edges.filter(e => !(e.source === source && e.target === target))
  })),

  runSimulation: (sim) => {
    const { suppliers, edges, userRole } = get();
    let simSuppliers: Supplier[] = suppliers.map(s => ({ 
      ...s, 
      health: 100, 
      affectedBy: undefined as string | undefined, 
      reason: undefined as string | undefined 
    }));
    
    simSuppliers = simSuppliers.map(s => {
      let isDirect = false;
      if (sim.targetNodeId && s.id === sim.targetNodeId) isDirect = true;
      else if (sim.location) {
        const dist = getDistance(s.lat, s.lng, sim.location.lat, sim.location.lng);
        if (dist <= sim.radius) isDirect = true;
      }
      if (isDirect) {
        const h = sim.severity === 'Critical' ? 0 : sim.severity === 'High' ? 20 : sim.severity === 'Medium' ? 50 : 80;
        return { ...s, health: h, affectedBy: 'DIRECT', reason: `Directly affected by ${sim.type} in ${sim.locationName || 'target zone'}.` };
      }
      return s;
    });

    for (let i = 0; i < 3; i++) {
      simSuppliers = simSuppliers.map(node => {
        if (node.affectedBy) return node;
        const incomingEdges = edges.filter(e => e.target === node.id || (e.target === 'Main' && node.id === 'Main'));
        for (const edge of incomingEdges) {
          const sourceNode = simSuppliers.find(s => s.id === edge.source);
          if (sourceNode && sourceNode.affectedBy) {
            const newHealth = Math.max(0, node.health - (edge.value * (100 - sourceNode.health)));
            const sourceName = (userRole === 'MainCompany' && sourceNode.tier > 1) ? `Tier ${sourceNode.tier} Partner` : sourceNode.name;
            return {
              ...node, health: newHealth, affectedBy: sourceNode.id,
              reason: `Indirectly affected by disruption in downstream ${sourceNode.category} dependency (${sourceName}).`
            };
          }
        }
        return node;
      });
    }

    const recommendations: Recommendation[] = [];
    simSuppliers.forEach(s => {
      if (s.health < 80) { // Relaxed from 60 to 80 for better visibility
        const backup = suppliers.find(b => b.category === s.category && b.isBackup && !simSuppliers.find(ss => ss.id === b.id)?.affectedBy);
        if (backup) {
          recommendations.push({
            id: `rec-${Date.now()}-${s.id}`,
            supplierId: s.id,
            backupId: backup.id,
            backupName: backup.name,
            backupContact: {
              email: `ops@${backup.name.toLowerCase().replace(/\s+/g, '')}.com`,
              phone: `+1 (555) ${Math.floor(100 + Math.random() * 899)}-${Math.floor(1000 + Math.random() * 8999)}`,
              representative: ['Sarah Chen', 'Marcus Thorne', 'Elena Rodriguez', 'Alex Kim'][Math.floor(Math.random() * 4)]
            },
            reason: `Disruption exposure: ${Math.round(100 - s.health)}%. ${backup.name} provides 35% lower risk and optimized route stability.`,
            riskReduction: Math.round(80 - s.health),
            logisticsImprovement: 15,
            resilienceBoost: 22,
            timestamp: new Date().toISOString(),
            type: 'SIMULATION'
          });
        }
      }
    });

    // Ensure at least one recommendation for demo if any node is affected
    if (recommendations.length === 0 && simSuppliers.some(s => s.health < 100)) {
      const affected = simSuppliers.find(s => s.health < 100);
      const backup = suppliers.find(b => b.isBackup) || suppliers[0];
      if (affected && backup) {
         recommendations.push({
            id: `rec-demo-${Date.now()}`,
            supplierId: affected.id,
            backupId: backup.id,
            backupName: backup.name,
            backupContact: {
              email: `emergency@${backup.name.toLowerCase().replace(/\s+/g, '')}.io`,
              phone: `+44 20 ${Math.floor(7000 + Math.random() * 2999)} ${Math.floor(1000 + Math.random() * 8999)}`,
              representative: 'Emergency Response Team'
            },
            reason: `Heuristic match: Mitigation required for ${affected.name}. ${backup.name} identified as optimal failover node with verified capacity.`,
            riskReduction: 45,
            logisticsImprovement: 12,
            resilienceBoost: 18,
            timestamp: new Date().toISOString(),
            type: 'SIMULATION'
          });
      }
    }

    const impactedCount = simSuppliers.filter(s => s.health < 100).length;
    const completedSim: Simulation = {
      ...sim, active: true, timestamp: new Date().toISOString(),
      simulatedSuppliers: simSuppliers, simulatedRecommendations: recommendations,
      impactReport: {
        totalAffected: impactedCount,
        financialLoss: impactedCount * 125000,
        logisticsDelay: impactedCount > 5 ? '14-21 Days' : '3-5 Days',
        resilienceScore: Math.round((simSuppliers.reduce((a,s)=>a+s.health,0) / simSuppliers.length) || 100)
      }
    };
    set(state => ({ activeSimulation: completedSim, simulationHistory: [completedSim, ...state.simulationHistory].slice(0, 50) }));
  },

  reevaluateIntelligence: () => {
    const { suppliers, autoRecommendations } = get();
    if (suppliers.length === 0) return;

    const newRecommendations: Recommendation[] = [];
    // Only analyze non-backup, healthy suppliers for better options
    const mainSuppliers = suppliers.filter(s => !s.isBackup && s.health > 80);
    const backups = suppliers.filter(s => s.isBackup);

    mainSuppliers.forEach(s => {
      // Find a better backup in same category
      const betterOption = backups.find(b => b.category === s.category && b.risk < s.risk - 10 && b.health >= s.health);
      if (betterOption) {
        newRecommendations.push({
          id: `auto-${Date.now()}-${s.id}`,
          supplierId: s.id,
          backupId: betterOption.id,
          backupName: betterOption.name,
          backupContact: {
            email: `support@${betterOption.name.toLowerCase().replace(/\s+/g, '')}.com`,
            phone: `+1 (800) ${Math.floor(100 + Math.random() * 899)}-${Math.floor(1000 + Math.random() * 8999)}`,
            representative: 'Strategic Account Manager'
          },
          reason: `Higher efficiency detected. ${betterOption.name} offers ${s.risk - betterOption.risk}% lower risk and 15% faster logistics route.`,
          riskReduction: s.risk - betterOption.risk,
          logisticsImprovement: 15,
          resilienceBoost: 10,
          timestamp: new Date().toISOString(),
          type: 'AUTOMATIC'
        });
      }
    });

    // Keep top 20 recent auto-recommendations
    set(state => ({ 
      autoRecommendations: [...newRecommendations, ...state.autoRecommendations].slice(0, 20) 
    }));
  },

  resolveRecommendation: (id: string) => set((state) => ({
    autoRecommendations: state.autoRecommendations.filter(r => r.id !== id)
  })),
  clearSimulation: () => set({ activeSimulation: null }),
  resetSimulations: () => set({ activeSimulation: null, simulationHistory: [], autoRecommendations: [] }),
  login: (role) => set({ 
    userRole: role, 
    suppliers: [], 
    edges: [], 
    activeSimulation: null, 
    simulationHistory: [], 
    autoRecommendations: [] 
  }),
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('gc_org_id');
    }
    set((state) => ({ 
      userRole: null, 
      suppliers: [], 
      edges: [], 
      activeSimulation: null, 
      simulationHistory: [], 
      autoRecommendations: [],
      db: { ...state.db, orgId: null }
    }));
  },
  setOrgId: (orgId) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('gc_org_id', orgId);
    }
    set((state) => ({ db: { ...state.db, orgId } }));
  },
  setDbConnected: (isConnected) => set((state) => ({ db: { ...state.db, isConnected } })),
  setDbSyncing: (isSyncing) => set((state) => ({ db: { ...state.db, isSyncing } })),
  setDbError: (error) => set((state) => ({ db: { ...state.db, error } })),
  setSyncedAt: () => set((state) => ({ db: { ...state.db, lastSyncedAt: new Date().toISOString(), isSyncing: false, error: null } })),
  addAuditLog: (log) => set((state) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      ...log
    };
    return { auditLogs: [newLog, ...state.auditLogs].slice(0, 500) };
  }),
  clearAuditLogs: () => set({ auditLogs: [] }),
  resetAuditLogs: () => set({ auditLogs: [] }),
    }),
    {
      name: 'globalchain-storage',
      partialize: (state) => ({
        suppliers: state.suppliers,
        edges: state.edges,
        activeSimulation: state.activeSimulation,
        simulationHistory: state.simulationHistory,
        autoRecommendations: state.autoRecommendations,
        userRole: state.userRole,
        organizations: state.organizations,
        db: state.db,
        auditLogs: state.auditLogs,
      }),
    }
  )
);

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}
