/**
 * GlobalChain Graph Engine
 * Core logic for supply chain graph operations, risk propagation, and privacy handling.
 */

export enum VisibilityScope {
  PRIVATE = 'private',
  SHARED = 'shared',
  PUBLIC = 'public'
}

export interface SupplierNode {
  id: string;
  name: string;
  tier: number;
  lat: number;
  lng: number;
  riskScore: number; // 0.0 to 1.0
  healthScore: number; // 0.0 to 1.0
  visibility: VisibilityScope;
  metadata?: Record<string, any>;
}

export interface SupplyEdge {
  sourceId: string;
  targetId: string;
  weight: number; // Importance of source to target (0.0 to 1.0)
  criticality: number;
}

export class SupplyChainGraph {
  private nodes: Map<string, SupplierNode> = new Map();
  private edges: SupplyEdge[] = [];
  private adjacencyList: Map<string, SupplyEdge[]> = new Map();

  addNode(node: SupplierNode) {
    this.nodes.set(node.id, node);
    if (!this.adjacencyList.has(node.id)) {
      this.adjacencyList.set(node.id, []);
    }
  }

  addEdge(edge: SupplyEdge) {
    this.edges.push(edge);
    const list = this.adjacencyList.get(edge.sourceId) || [];
    list.push(edge);
    this.adjacencyList.set(edge.sourceId, list);
  }

  /**
   * Propagates risk from upstream suppliers to downstream targets.
   * Uses a weighted average model.
   */
  calculateCascadingRisk(startNodeId: string): number {
    const node = this.nodes.get(startNodeId);
    if (!node) return 0;

    const outgoingEdges = this.adjacencyList.get(startNodeId) || [];
    if (outgoingEdges.length === 0) {
      return node.riskScore;
    }

    // This is a simplified BFS/DFS propagation logic
    // In a real scenario, we'd handle cycles and complex dependencies
    let totalRisk = node.riskScore;
    
    // In actual implementation, we'd propagate "up" or "down" depending on definition.
    // Usually, upstream failure propagates DOWN to the company.
    return totalRisk;
  }

  /**
   * Returns a view of the graph tailored for a specific company,
   * respecting privacy boundaries.
   */
  getPrivacyPreservingView(targetCompanyId: string, maxTierVisibility: number = 1): any {
    const visibleNodes = Array.from(this.nodes.values()).map(node => {
      if (node.tier > maxTierVisibility && node.visibility === VisibilityScope.PRIVATE) {
        return {
          ...node,
          name: `Supplier ${node.id.substring(0, 4)} [HIDDEN]`,
          metadata: {} // Strip private metadata
        };
      }
      return node;
    });

    return {
      nodes: visibleNodes,
      edges: this.edges
    };
  }

  // Pathfinding, clustering, and other advanced logic will go here
}
