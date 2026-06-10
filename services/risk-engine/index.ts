/**
 * GlobalChain Risk Engine Service
 * Calculates dynamic risk and health scores for suppliers.
 */

export interface RiskFactors {
  reliability: number;        // 0.0 to 1.0 (historical performance)
  disasterExposure: number;   // 0.0 to 1.0 (proximity to events)
  trafficCongestion: number;  // 0.0 to 1.0
  geopoliticalStability: number; // 0.0 to 1.0
  uptime: number;             // 0.0 to 1.0
  backupReadiness: number;    // 0.0 to 1.0
}

export class RiskEngine {
  // Weights for different factors
  private static WEIGHTS = {
    reliability: 0.25,
    disasterExposure: 0.30,
    trafficCongestion: 0.10,
    geopoliticalStability: 0.15,
    uptime: 0.10,
    backupReadiness: 0.10
  };

  /**
   * Calculates the overall health score of a supplier.
   * Higher is better (1.0 = perfect health).
   */
  calculateHealthScore(factors: RiskFactors): number {
    const score = (
      factors.reliability * RiskEngine.WEIGHTS.reliability +
      (1 - factors.disasterExposure) * RiskEngine.WEIGHTS.disasterExposure +
      (1 - factors.trafficCongestion) * RiskEngine.WEIGHTS.trafficCongestion +
      factors.geopoliticalStability * RiskEngine.WEIGHTS.geopoliticalStability +
      factors.uptime * RiskEngine.WEIGHTS.uptime +
      factors.backupReadiness * RiskEngine.WEIGHTS.backupReadiness
    );

    return Math.max(0, Math.min(1, score));
  }

  /**
   * Calculates the risk score (inverse of health, weighted by dependency).
   * Higher is more dangerous (1.0 = critical risk).
   */
  calculateRiskScore(healthScore: number, dependencyWeight: number): number {
    const baseRisk = 1 - healthScore;
    // Amplify risk if the dependency is high
    const amplifiedRisk = baseRisk * (1 + dependencyWeight);
    return Math.max(0, Math.min(1, amplifiedRisk));
  }

  /**
   * Calculates the Operational Resilience Score for a company.
   */
  calculateResilience(suppliers: { healthScore: number, backupReady: boolean }[]): number {
    if (suppliers.length === 0) return 0;
    
    const avgHealth = suppliers.reduce((sum, s) => sum + s.healthScore, 0) / suppliers.length;
    const backupCoverage = suppliers.filter(s => s.backupReady).length / suppliers.length;
    
    return (avgHealth * 0.6) + (backupCoverage * 0.4);
  }
}
