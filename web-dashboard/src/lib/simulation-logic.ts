import { useStore, Simulation, Supplier } from '@/store/useStore';

export const runSimulation = (sim: Simulation) => {
  const { suppliers, updateSupplier } = useStore.getState();
  
  if (!sim.location || !sim.radius) return;

  const { lat: simLat, lng: simLng } = sim.location;
  const radiusInDegrees = sim.radius / 111; // Rough km to deg conversion

  suppliers.forEach(supplier => {
    const dist = Math.sqrt(
      Math.pow(supplier.lat - simLat, 2) + Math.pow(supplier.lng - simLng, 2)
    );

    if (dist <= radiusInDegrees) {
      // Calculate damage based on proximity
      const proximityEffect = 1 - (dist / radiusInDegrees);
      const damage = Math.floor(proximityEffect * 80); // Up to 80% health reduction
      
      const newHealth = Math.max(0, supplier.health - damage);
      const newRisk = Math.min(100, supplier.risk + damage);
      
      updateSupplier(supplier.id, { health: newHealth, risk: newRisk });
    }
  });
};

export const resetGlobalHealth = () => {
  const { suppliers, updateSupplier } = useStore.getState();
  suppliers.forEach(s => {
    updateSupplier(s.id, { health: 90 + Math.random() * 10, risk: Math.random() * 10 });
  });
};
