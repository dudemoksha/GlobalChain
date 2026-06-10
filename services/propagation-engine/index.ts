/**
 * GlobalChain Propagation Engine
 * Calculates cascading impacts across the supply chain graph.
 */

export interface Node {
  id: string;
  tier: number;
  health: number;
  risk: number;
}

export interface Edge {
  source: string;
  target: string;
  weight: number;
}

export class PropagationEngine {
  /**
   * Calculates the propagated risk for a target node.
   * Traverses upstream to find disruptions and calculates weighted impact.
   */
  static calculateCascadingImpact(
    nodes: Node[],
    edges: Edge[],
    targetNodeId: string = 'Main'
  ) {
    let totalRisk = 0;
    let affectedTiers: Record<number, number> = { 1: 0, 2: 0, 3: 0 };
    let totalRevenueAtRisk = 0;
    let delayEstimation = 0;

    // Build reverse adjacency list (Downstream -> Upstream)
    const upstreamMap = new Map<string, Edge[]>();
    edges.forEach(edge => {
      if (!upstreamMap.has(edge.target)) upstreamMap.set(edge.target, []);
      upstreamMap.get(edge.target)!.push(edge);
    });

    const queue: { id: string; impact: number }[] = [{ id: targetNodeId, impact: 1.0 }];
    const visited = new Set<string>();

    while (queue.length > 0) {
      const { id, impact } = queue.shift()!;
      if (visited.has(id)) continue;
      visited.add(id);

      const upstream = upstreamMap.get(id) || [];
      upstream.forEach(edge => {
        const sourceNode = nodes.find(n => n.id === edge.source);
        if (sourceNode) {
          const sourceRisk = (100 - sourceNode.health) / 100;
          const localImpact = impact * edge.weight * sourceRisk;
          
          if (localImpact > 0.05) { // Significant impact threshold
            totalRisk += localImpact;
            affectedTiers[sourceNode.tier as keyof typeof affectedTiers]++;
            totalRevenueAtRisk += localImpact * 1000000; // $1M per impact unit
            delayEstimation = Math.max(delayEstimation, localImpact * 30); // Max 30 days
          }

          queue.push({ id: edge.source, impact: impact * edge.weight });
        }
      });
    }

    return {
      totalRisk: Math.min(totalRisk, 1.0),
      affectedTiers,
      estimatedDelayDays: Math.round(delayEstimation),
      revenueAtRisk: Math.round(totalRevenueAtRisk)
    };
  }
}
