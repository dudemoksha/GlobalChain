// Simulation Worker
import { SupplyChainGraph } from '../graph-engine/src';
import { RiskEngine } from '../services/risk-engine';

self.onmessage = (e: MessageEvent) => {
  const { type, data, scenario } = e.data;

  if (type === 'RUN_SIMULATION') {
    const graph = new SupplyChainGraph();
    // Reconstruct graph
    data.nodes.forEach((n: any) => graph.addNode(n));
    data.edges.forEach((e: any) => graph.addEdge(e));

    // Apply scenario disruption
    // Example: Scenario "Port Shutdown" affects all nodes in a specific region
    const disruptedNodes = data.nodes.filter((n: any) => {
      if (scenario.type === 'PORT_SHUTDOWN') {
        return n.region === scenario.targetRegion;
      }
      if (scenario.type === 'CYBERATTACK') {
        return Math.random() < 0.2; // 20% random disruption for demo
      }
      return false;
    });

    // Calculate new risk scores and propagation
    const results = disruptedNodes.map((n: any) => ({
      id: n.id,
      impact: 'CRITICAL',
      delayDays: Math.floor(Math.random() * 14) + 7
    }));

    // Estimate Revenue Impact
    const totalRevenueAtRisk = results.length * 150000; // Mock calculation

    self.postMessage({ 
      type: 'SIMULATION_COMPLETE', 
      results,
      metrics: {
        totalRevenueAtRisk,
        affectedNodesCount: results.length,
        resilienceDelta: -15.4
      }
    });
  }
};
