// Propagation Worker
import { SupplyChainGraph } from '../graph-engine/src';

self.onmessage = (e: MessageEvent) => {
  const { type, data } = e.data;

  if (type === 'CALCULATE_PROPAGATION') {
    const graph = new SupplyChainGraph();
    // Reconstruct graph from data
    data.nodes.forEach((n: any) => graph.addNode(n));
    data.edges.forEach((e: any) => graph.addEdge(e));

    // Perform heavy calculations
    const results = data.nodes.map((n: any) => ({
      id: n.id,
      propagatedRisk: graph.calculateCascadingRisk(n.id)
    }));

    self.postMessage({ type: 'PROPAGATION_RESULTS', results });
  }
};
