import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Zap, 
  AlertTriangle, 
  CheckCircle, 
  Thermometer,
  Gauge,
  MapPin,
  Eye,
  Settings,
  ZoomIn,
  ZoomOut,
  RotateCcw
} from 'lucide-react';
import { toast } from 'sonner';

interface AssetPosition {
  id: string;
  name: string;
  type: 'conveyor' | 'press' | 'mixer' | 'quality_station' | 'sensor';
  x: number;
  y: number;
  width: number;
  height: number;
  status: 'healthy' | 'warning' | 'critical' | 'offline';
  temperature?: number;
  pressure?: number;
  vibration?: number;
  oee?: number;
  lastUpdate: string;
}

const mockAssets: AssetPosition[] = [
  {
    id: 'A1',
    name: 'Mixer Unit 1',
    type: 'mixer',
    x: 100,
    y: 150,
    width: 120,
    height: 80,
    status: 'healthy',
    temperature: 65,
    pressure: 2.1,
    oee: 94,
    lastUpdate: new Date().toISOString()
  },
  {
    id: 'A2',
    name: 'Press Line 2',
    type: 'press',
    x: 300,
    y: 100,
    width: 100,
    height: 150,
    status: 'warning',
    temperature: 78,
    pressure: 3.2,
    oee: 87,
    lastUpdate: new Date().toISOString()
  },
  {
    id: 'A3',
    name: 'Conveyor Belt 3',
    type: 'conveyor',
    x: 150,
    y: 300,
    width: 200,
    height: 40,
    status: 'critical',
    temperature: 45,
    vibration: 8.5,
    oee: 23,
    lastUpdate: new Date().toISOString()
  },
  {
    id: 'A4',
    name: 'Quality Control Station',
    type: 'quality_station',
    x: 450,
    y: 200,
    width: 80,
    height: 80,
    status: 'healthy',
    temperature: 22,
    oee: 98,
    lastUpdate: new Date().toISOString()
  },
  {
    id: 'S1',
    name: 'Temperature Sensor',
    type: 'sensor',
    x: 250,
    y: 50,
    width: 20,
    height: 20,
    status: 'healthy',
    temperature: 72,
    lastUpdate: new Date().toISOString()
  },
  {
    id: 'S2',
    name: 'Pressure Sensor',
    type: 'sensor',
    x: 350,
    y: 80,
    width: 20,
    height: 20,
    status: 'warning',
    pressure: 4.1,
    lastUpdate: new Date().toISOString()
  }
];

interface InteractivePlantLayoutProps {
  className?: string;
}

export function InteractivePlantLayout({ className }: InteractivePlantLayoutProps) {
  const [assets, setAssets] = useState<AssetPosition[]>(mockAssets);
  const [selectedAsset, setSelectedAsset] = useState<AssetPosition | null>(null);
  const [zoom, setZoom] = useState(1);
  const [viewMode, setViewMode] = useState<'status' | 'temperature' | 'oee'>('status');
  const [showSensors, setShowSensors] = useState(true);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAssets(prev => prev.map(asset => {
        // Randomly update some values
        const shouldUpdate = Math.random() > 0.7;
        if (!shouldUpdate) return asset;

        const updates: Partial<AssetPosition> = {
          lastUpdate: new Date().toISOString()
        };

        // Update temperature
        if (asset.temperature) {
          updates.temperature = asset.temperature + (Math.random() - 0.5) * 5;
        }

        // Update pressure
        if (asset.pressure) {
          updates.pressure = Math.max(0, asset.pressure + (Math.random() - 0.5) * 0.5);
        }

        // Update OEE
        if (asset.oee) {
          updates.oee = Math.max(0, Math.min(100, asset.oee + (Math.random() - 0.5) * 10));
        }

        // Occasionally change status
        if (Math.random() > 0.95) {
          const statuses: AssetPosition['status'][] = ['healthy', 'warning', 'critical'];
          updates.status = statuses[Math.floor(Math.random() * statuses.length)];
          
          if (updates.status === 'critical') {
            toast.error(`Critical alert: ${asset.name}`, {
              description: 'Asset requires immediate attention'
            });
          }
        }

        return { ...asset, ...updates };
      }));
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const getAssetColor = (asset: AssetPosition) => {
    switch (viewMode) {
      case 'status':
        switch (asset.status) {
          case 'healthy': return '#10b981';
          case 'warning': return '#f59e0b';
          case 'critical': return '#ef4444';
          case 'offline': return '#6b7280';
          default: return '#6b7280';
        }
      case 'temperature':
        if (!asset.temperature) return '#6b7280';
        if (asset.temperature > 80) return '#ef4444';
        if (asset.temperature > 60) return '#f59e0b';
        return '#10b981';
      case 'oee':
        if (!asset.oee) return '#6b7280';
        if (asset.oee > 90) return '#10b981';
        if (asset.oee > 70) return '#f59e0b';
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getAssetIcon = (type: string) => {
    switch (type) {
      case 'sensor': return <Zap className="w-3 h-3" />;
      case 'mixer': return <RotateCcw className="w-4 h-4" />;
      case 'press': return <Gauge className="w-4 h-4" />;
      case 'conveyor': return <MapPin className="w-4 h-4" />;
      case 'quality_station': return <CheckCircle className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Interactive Plant Layout
          </CardTitle>
          <div className="flex gap-2">
            <Select value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="status">Status View</SelectItem>
                <SelectItem value="temperature">Temperature</SelectItem>
                <SelectItem value="oee">OEE Performance</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSensors(!showSensors)}
            >
              {showSensors ? 'Hide' : 'Show'} Sensors
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Controls */}
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setZoom(Math.min(2, zoom + 0.2))}
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setZoom(Math.max(0.5, zoom - 0.2))}
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setZoom(1)}
              >
                Reset
              </Button>
            </div>

            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-success rounded"></div>
                <span>Healthy</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-warning rounded"></div>
                <span>Warning</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-destructive rounded"></div>
                <span>Critical</span>
              </div>
            </div>
          </div>

          {/* Plant Layout */}
          <div className="relative border rounded-lg bg-muted/20 overflow-hidden" style={{ height: '500px' }}>
            <div 
              className="relative w-full h-full"
              style={{ 
                transform: `scale(${zoom})`,
                transformOrigin: 'top left',
                transition: 'transform 0.2s ease'
              }}
            >
              {/* Background Grid */}
              <div 
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: 'radial-gradient(circle, #666 1px, transparent 1px)',
                  backgroundSize: '20px 20px'
                }}
              />

              {/* Assets */}
              {assets.map((asset) => {
                if (asset.type === 'sensor' && !showSensors) return null;
                
                return (
                  <div
                    key={asset.id}
                    className="absolute cursor-pointer group transition-all duration-200 hover:scale-105"
                    style={{
                      left: `${asset.x}px`,
                      top: `${asset.y}px`,
                      width: `${asset.width}px`,
                      height: `${asset.height}px`,
                      backgroundColor: getAssetColor(asset),
                      borderRadius: asset.type === 'sensor' ? '50%' : '8px',
                      border: selectedAsset?.id === asset.id ? '3px solid #3b82f6' : '2px solid rgba(255,255,255,0.3)',
                      zIndex: selectedAsset?.id === asset.id ? 10 : 1
                    }}
                    onClick={() => setSelectedAsset(asset)}
                  >
                    {/* Asset Icon */}
                    <div className="absolute inset-0 flex items-center justify-center text-white">
                      {getAssetIcon(asset.type)}
                    </div>

                    {/* Asset Label */}
                    <div className="absolute -bottom-6 left-0 text-xs font-medium whitespace-nowrap text-foreground">
                      {asset.name}
                    </div>

                    {/* Status Indicator */}
                    {asset.status === 'critical' && (
                      <div className="absolute -top-2 -right-2 w-4 h-4 bg-destructive rounded-full animate-pulse flex items-center justify-center">
                        <AlertTriangle className="w-2 h-2 text-white" />
                      </div>
                    )}

                    {/* Real-time Value Display */}
                    {viewMode === 'temperature' && asset.temperature && (
                      <div className="absolute -bottom-10 left-0 text-xs bg-background px-1 rounded">
                        {asset.temperature.toFixed(1)}°C
                      </div>
                    )}
                    {viewMode === 'oee' && asset.oee && (
                      <div className="absolute -bottom-10 left-0 text-xs bg-background px-1 rounded">
                        {asset.oee.toFixed(0)}%
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Connection Lines (simple example) */}
              <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
                <line
                  x1="220"
                  y1="190"
                  x2="300"
                  y2="175"
                  stroke="#666"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />
                <line
                  x1="350"
                  y1="300"
                  x2="450"
                  y2="240"
                  stroke="#666"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />
              </svg>
            </div>
          </div>

          {/* Asset Details Panel */}
          {selectedAsset && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getAssetIcon(selectedAsset.type)}
                    {selectedAsset.name}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedAsset(null)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Status</div>
                    <Badge variant={selectedAsset.status === 'healthy' ? 'success' : selectedAsset.status === 'warning' ? 'warning' : 'destructive'}>
                      {selectedAsset.status.toUpperCase()}
                    </Badge>
                  </div>
                  
                  {selectedAsset.temperature && (
                    <div>
                      <div className="text-sm text-muted-foreground">Temperature</div>
                      <div className="flex items-center gap-1">
                        <Thermometer className="w-4 h-4" />
                        <span className="font-medium">{selectedAsset.temperature.toFixed(1)}°C</span>
                      </div>
                    </div>
                  )}
                  
                  {selectedAsset.pressure && (
                    <div>
                      <div className="text-sm text-muted-foreground">Pressure</div>
                      <div className="flex items-center gap-1">
                        <Gauge className="w-4 h-4" />
                        <span className="font-medium">{selectedAsset.pressure.toFixed(1)} bar</span>
                      </div>
                    </div>
                  )}
                  
                  {selectedAsset.oee && (
                    <div>
                      <div className="text-sm text-muted-foreground">OEE</div>
                      <div className="font-medium">{selectedAsset.oee.toFixed(0)}%</div>
                    </div>
                  )}
                </div>
                
                <div className="mt-4 text-xs text-muted-foreground">
                  Last updated: {new Date(selectedAsset.lastUpdate).toLocaleTimeString()}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </CardContent>
    </Card>
  );
}