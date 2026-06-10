/**
 * GlobalChain Disaster Intelligence Service
 * Monitors global disaster feeds and calculates impact zones.
 */

export enum DisasterType {
  FLOOD = 'flood',
  EARTHQUAKE = 'earthquake',
  WAR = 'war',
  CYBERATTACK = 'cyberattack',
  LOGISTICS_FAILURE = 'logistics_failure'
}

export interface DisasterEvent {
  id: string;
  type: DisasterType;
  severity: 'low' | 'medium' | 'high' | 'critical';
  lat: number;
  lng: number;
  radiusKm: number;
  description: string;
  timestamp: Date;
}

export class DisasterIntelligenceService {
  /**
   * Fetches latest disasters from public APIs (Mocked for now).
   * In production, this would call USGS, GDACS, etc.
   */
  async fetchLatestEvents(): Promise<DisasterEvent[]> {
    return [
      {
        id: 'evt_001',
        type: DisasterType.LOGISTICS_FAILURE,
        severity: 'critical',
        lat: 31.2304,
        lng: 121.4737, // Shanghai
        radiusKm: 50,
        description: 'Major port congestion detected in Shanghai terminals.',
        timestamp: new Date()
      },
      {
        id: 'evt_002',
        type: DisasterType.FLOOD,
        severity: 'high',
        lat: 10.8231,
        lng: 106.6297, // Vietnam (Ho Chi Minh)
        radiusKm: 120,
        description: 'Monsoon flash flooding affecting electronics manufacturing cluster.',
        timestamp: new Date()
      }
    ];
  }

  /**
   * Checks if a supplier is within the impact radius of any disaster.
   */
  checkSupplierExposure(supplierLat: number, supplierLng: number, events: DisasterEvent[]): DisasterEvent[] {
    return events.filter(event => {
      const distance = this.calculateDistance(supplierLat, supplierLng, event.lat, event.lng);
      return distance <= event.radiusKm;
    });
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }
}
