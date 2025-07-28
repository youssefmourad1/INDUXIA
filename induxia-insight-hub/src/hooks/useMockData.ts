import { useState, useEffect } from 'react';
import { Asset, Alert, KPI, ProductionLine, QualityIncident, OptimizationSuggestion } from '@/types';

// Mock data generators for realistic demo
export function useMockData() {
  const [kpis, setKpis] = useState<KPI>({
    oee: 82,
    production: { current: 1247, target: 1500, units: 'Units' },
    downtimeCostAvoided: 45000,
    energySavings: 12000,
  });

  const [assets] = useState<Asset[]>([
    { id: 'A1', name: 'Mixer Unit 1', type: 'Mixer', status: 'healthy', oee: 88, location: { x: 20, y: 30 }, lastMaintenance: '2024-01-15', nextMaintenance: '2024-03-15' },
    { id: 'A2', name: 'Press Line 2', type: 'Press', status: 'warning', oee: 75, location: { x: 50, y: 40 }, lastMaintenance: '2024-01-10', nextMaintenance: '2024-02-28' },
    { id: 'A3', name: 'Conveyor Belt 3', type: 'Conveyor', status: 'critical', oee: 45, location: { x: 80, y: 60 }, lastMaintenance: '2023-12-20', nextMaintenance: '2024-02-01' },
    { id: 'A4', name: 'Quality Control Station', type: 'QC', status: 'healthy', oee: 95, location: { x: 30, y: 70 }, lastMaintenance: '2024-01-20', nextMaintenance: '2024-04-20' },
    { id: 'A5', name: 'Packaging Unit', type: 'Packaging', status: 'healthy', oee: 91, location: { x: 70, y: 80 }, lastMaintenance: '2024-01-25', nextMaintenance: '2024-04-25' },
  ]);

  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      title: 'Conveyor Belt 3 - Bearing Wear Critical',
      description: 'AI detected critical bearing wear pattern. RUL: 2-3 days',
      priority: 'critical',
      status: 'active',
      assetId: 'A3',
      timestamp: new Date().toISOString(),
      source: 'APM Agent',
      confidence: 94,
    },
    {
      id: '2', 
      title: 'Press Line 2 - Temperature Rising',
      description: 'Temperature trending above normal operating range',
      priority: 'high',
      status: 'active',
      assetId: 'A2',
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      source: 'Thermal Monitor',
      confidence: 87,
    },
  ]);

  const [productionLines] = useState<ProductionLine[]>([
    { id: 'L1', name: 'Production Line 1', throughput: 145, qualityRate: 97.2, microStoppages: 3, status: 'running' },
    { id: 'L2', name: 'Production Line 2', throughput: 132, qualityRate: 96.8, microStoppages: 5, status: 'running' },
  ]);

  const [qualityIncidents] = useState<QualityIncident[]>([
    { id: 'Q1', timestamp: new Date().toISOString(), defectType: 'Surface Scratch', lineId: 'L1', severity: 'minor' },
    { id: 'Q2', timestamp: new Date(Date.now() - 900000).toISOString(), defectType: 'Dimension Out of Spec', lineId: 'L2', severity: 'major' },
  ]);

  const [optimizationSuggestions] = useState<OptimizationSuggestion[]>([
    {
      id: 'O1',
      title: 'Increase Line 1 Speed',
      description: 'Increase speed by 2% based on current conditions',
      estimatedGain: '+15 units/hr',
      confidence: 89,
      status: 'pending',
    },
  ]);

  // Simulate real-time OEE updates
  useEffect(() => {
    const interval = setInterval(() => {
      setKpis(prev => ({
        ...prev,
        oee: Math.max(70, Math.min(95, prev.oee + (Math.random() - 0.5) * 2)),
        production: {
          ...prev.production,
          current: Math.max(0, prev.production.current + Math.floor(Math.random() * 10 - 3)),
        },
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return {
    kpis,
    assets,
    alerts,
    productionLines,
    qualityIncidents,
    optimizationSuggestions,
  };
}