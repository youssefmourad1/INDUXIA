// INDUXIA Portal Type Definitions

export type UserRole = 'plant_director' | 'maintenance_manager' | 'production_supervisor' | 'operator' | 'admin';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  avatar?: string;
}

export interface Asset {
  id: string;
  name: string;
  type: string;
  status: 'healthy' | 'warning' | 'critical' | 'offline';
  oee: number;
  location: { x: number; y: number };
  lastMaintenance: string;
  nextMaintenance: string;
}

export interface Alert {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'acknowledged' | 'resolved';
  assetId?: string;
  timestamp: string;
  source: string;
  confidence?: number;
}

export interface KPI {
  oee: number;
  production: {
    current: number;
    target: number;
    units: string;
  };
  downtimeCostAvoided: number;
  energySavings: number;
}

export interface ProductionLine {
  id: string;
  name: string;
  throughput: number;
  qualityRate: number;
  microStoppages: number;
  status: 'running' | 'stopped' | 'maintenance';
}

export interface QualityIncident {
  id: string;
  timestamp: string;
  defectType: string;
  imageUrl?: string;
  lineId: string;
  severity: 'minor' | 'major' | 'critical';
}

export interface OptimizationSuggestion {
  id: string;
  title: string;
  description: string;
  estimatedGain: string;
  confidence: number;
  status: 'pending' | 'accepted' | 'dismissed';
}