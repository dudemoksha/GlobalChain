// Clustering Worker
// Optimizes performance for large datasets on the 3D globe

self.onmessage = (e: MessageEvent) => {
  const { type, nodes, zoomLevel } = e.data;

  if (type === 'CLUSTER_NODES') {
    // If zoom is high, show all nodes
    if (zoomLevel > 5) {
      self.postMessage({ type: 'CLUSTERS_READY', clusters: nodes });
      return;
    }

    // Distance-based clustering
    const clusters: any[] = [];
    const processed = new Set();
    const clusterRadius = 10 / (zoomLevel || 1); // Dynamic radius

    for (const node of nodes) {
      if (processed.has(node.id)) continue;

      const cluster = {
        ...node,
        isCluster: true,
        count: 1,
        children: [node.id]
      };

      processed.add(node.id);

      // Find nearby nodes
      for (const other of nodes) {
        if (processed.has(other.id)) continue;

        const dist = Math.sqrt(
          Math.pow(node.lat - other.lat, 2) + 
          Math.pow(node.lng - other.lng, 2)
        );

        if (dist < clusterRadius) {
          cluster.count++;
          cluster.children.push(other.id);
          processed.add(other.id);
        }
      }

      if (cluster.count > 1) {
        cluster.name = `${cluster.count} Suppliers (Region)`;
        cluster.color = '#3b82f6'; // Cluster color
      }

      clusters.push(cluster);
    }

    self.postMessage({ type: 'CLUSTERS_READY', clusters });
  }
};
