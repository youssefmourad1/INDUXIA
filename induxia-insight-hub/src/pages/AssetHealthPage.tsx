import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Wrench, 
  TrendingUp,
  Activity,
  Thermometer,
  Zap
} from 'lucide-react';
import { useMockData } from '@/hooks/useMockData';
import { useAuth } from '@/hooks/useAuth';
import { Asset, Alert } from '@/types';
import plantLayoutImage from '@/assets/plant-layout.jpg';

// Mock detailed asset data
const mockAssetDetails = {
  'A1': { temperature: 72, vibration: 0.8, efficiency: 88, lastAlert: null },
  'A2': { temperature: 85, vibration: 1.2, efficiency: 75, lastAlert: '2h ago' },
  'A3': { temperature: 95, vibration: 2.1, efficiency: 45, lastAlert: 'Active' },
  'A4': { temperature: 68, vibration: 0.5, efficiency: 95, lastAlert: null },
  'A5': { temperature: 70, vibration: 0.6, efficiency: 91, lastAlert: null },
};

interface AssetMapProps {
  assets: Asset[];
  onAssetClick: (asset: Asset) => void;
  selectedAsset?: Asset;
}

function AssetMap({ assets, onAssetClick, selectedAsset }: AssetMapProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          Interactive Plant Map
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          className="relative w-full h-96 bg-cover bg-center rounded-lg overflow-hidden"
          style={{ backgroundImage: `url(${plantLayoutImage})` }}
        >
          <div className="absolute inset-0 bg-primary/20">
            {assets.map((asset) => {
              const isSelected = selectedAsset?.id === asset.id;
              const statusColor = {
                healthy: 'bg-status-healthy',
                warning: 'bg-warning',
                critical: 'bg-destructive',
                offline: 'bg-status-offline'
              }[asset.status];

              return (
                <button
                  key={asset.id}
                  onClick={() => onAssetClick(asset)}
                  className={`absolute w-8 h-8 rounded-full border-2 border-white shadow-lg transition-all duration-200 hover:scale-110 ${statusColor} ${
                    isSelected ? 'scale-125 ring-4 ring-primary/50' : ''
                  }`}
                  style={{
                    left: `${asset.location.x}%`,
                    top: `${asset.location.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  title={`${asset.name} - ${asset.status.toUpperCase()}`}
                >
                  <span className="sr-only">{asset.name}</span>
                  {asset.status === 'critical' && (
                    <AlertTriangle className="w-4 h-4 text-white mx-auto" />
                  )}
                  {asset.status === 'healthy' && (
                    <CheckCircle className="w-4 h-4 text-white mx-auto" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
        
        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-status-healthy"></div>
            <span>Healthy</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-warning"></div>
            <span>Warning</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-destructive"></div>
            <span>Critical</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-status-offline"></div>
            <span>Offline</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface AlertQueueProps {
  alerts: Alert[];
  onApproveAlert: (alertId: string) => void;
}

function AlertQueue({ alerts, onApproveAlert }: AlertQueueProps) {
  const maintenanceAlerts = alerts.filter(alert => 
    alert.source.includes('APM') || alert.source.includes('Monitor')
  );

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-destructive" />
          Predictive Alert Queue
          <Badge variant="destructive" className="ml-2">
            {maintenanceAlerts.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto scroll-industrial">
          {maintenanceAlerts.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 mx-auto mb-3 text-success" />
              <p className="text-muted-foreground">No maintenance alerts</p>
            </div>
          ) : (
            maintenanceAlerts.map((alert) => (
              <div
                key={alert.id}
                className="p-4 border rounded-lg bg-card hover:bg-muted/30 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">{alert.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{alert.description}</p>
                  </div>
                  <Badge 
                    variant={alert.priority === 'critical' ? 'destructive' : 'warning' as any}
                    className="ml-2"
                  >
                    {alert.priority.toUpperCase()}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                  <span>RUL: 2-3 days</span>
                  <span>Confidence: {alert.confidence}%</span>
                  <span>{alert.source}</span>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => onApproveAlert(alert.id)}
                    className="flex-1"
                  >
                    <Wrench className="w-4 h-4 mr-2" />
                    Approve & Create Work Order
                  </Button>
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface AssetDetailsProps {
  asset: Asset | null;
}

function AssetDetails({ asset }: AssetDetailsProps) {
  if (!asset) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <Activity className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
            <p className="text-muted-foreground">Select an asset to view details</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const details = mockAssetDetails[asset.id as keyof typeof mockAssetDetails];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wrench className="w-5 h-5 text-primary" />
          {asset.name} Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status Overview */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <div className="text-2xl font-bold text-foreground">{asset.oee}%</div>
            <div className="text-sm text-muted-foreground">OEE</div>
          </div>
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <div className={`text-2xl font-bold ${
              asset.status === 'healthy' ? 'text-success' :
              asset.status === 'warning' ? 'text-warning' : 'text-destructive'
            }`}>
              {asset.status.toUpperCase()}
            </div>
            <div className="text-sm text-muted-foreground">Status</div>
          </div>
        </div>

        {/* Live Metrics */}
        <div className="space-y-4">
          <h4 className="font-semibold">Live Metrics</h4>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-warning" />
                <span className="text-sm">Temperature</span>
              </div>
              <span className={`font-semibold ${details.temperature > 90 ? 'text-destructive' : 'text-foreground'}`}>
                {details.temperature}°C
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" />
                <span className="text-sm">Vibration</span>
              </div>
              <span className={`font-semibold ${details.vibration > 2 ? 'text-destructive' : 'text-foreground'}`}>
                {details.vibration} mm/s
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-success" />
                <span className="text-sm">Efficiency</span>
              </div>
              <span className="font-semibold text-foreground">{details.efficiency}%</span>
            </div>
          </div>
        </div>

        {/* Maintenance Info */}
        <div className="space-y-2">
          <h4 className="font-semibold">Maintenance Schedule</h4>
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last Maintenance:</span>
              <span>{new Date(asset.lastMaintenance).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Next Scheduled:</span>
              <span>{new Date(asset.nextMaintenance).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Link to="/schedule-maintenance">
            <Button className="flex-1" size="sm">
              Schedule Maintenance
            </Button>
          </Link>
          <Link to={`/health-history?asset=${asset.id}`}>
            <Button variant="outline" size="sm">
              View History
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AssetHealthPage() {
  const { assets, alerts } = useMockData();
  const { user } = useAuth();
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  const handleAssetClick = (asset: Asset) => {
    setSelectedAsset(asset);
  };

  const handleApproveAlert = (alertId: string) => {
    console.log('Creating work order for alert:', alertId);
    // In real app, this would call the API to create a work order
  };

  const isMaintenanceManager = user?.role === 'maintenance_manager';

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Asset Health {isMaintenanceManager ? 'Cockpit' : 'Overview'}
        </h1>
        <p className="text-muted-foreground">
          {isMaintenanceManager 
            ? 'Manage predictive maintenance alerts and monitor real-time asset health'
            : 'Monitor the health and performance of all plant assets'
          }
        </p>
      </div>

      {/* Layout based on role */}
      {isMaintenanceManager ? (
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-6 h-[calc(100vh-12rem)]">
          {/* Interactive Plant Map - 70% width */}
          <div className="lg:col-span-5">
            <AssetMap 
              assets={assets} 
              onAssetClick={handleAssetClick}
              selectedAsset={selectedAsset}
            />
          </div>
          
          {/* Predictive Alert Queue - 30% width */}
          <div className="lg:col-span-2">
            <AlertQueue 
              alerts={alerts}
              onApproveAlert={handleApproveAlert}
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Plant Map */}
          <AssetMap 
            assets={assets} 
            onAssetClick={handleAssetClick}
            selectedAsset={selectedAsset}
          />
          
          {/* Asset Details */}
          <AssetDetails asset={selectedAsset} />
        </div>
      )}
    </div>
  );
}