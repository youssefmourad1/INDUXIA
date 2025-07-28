import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  ArrowLeft,
  Activity,
  TrendingDown,
  TrendingUp,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Wrench,
  BarChart3,
  Clock
} from 'lucide-react';
import { useMockData } from '@/hooks/useMockData';

// Mock historical data
const mockHealthHistory = {
  'A1': {
    name: 'Mixer Unit 1',
    events: [
      { date: '2024-01-28', type: 'maintenance', description: 'Routine inspection completed', severity: 'info', oee: 88 },
      { date: '2024-01-25', type: 'alert', description: 'Temperature spike detected', severity: 'warning', oee: 85 },
      { date: '2024-01-20', type: 'maintenance', description: 'Bearing replacement', severity: 'info', oee: 90 },
      { date: '2024-01-15', type: 'alert', description: 'Vibration anomaly', severity: 'warning', oee: 82 },
    ],
    metrics: {
      avgOEE: 86.3,
      uptime: 94.2,
      mtbf: 156, // Mean Time Between Failures (hours)
      mttr: 2.4, // Mean Time To Repair (hours)
    }
  },
  'A2': {
    name: 'Press Line 2',
    events: [
      { date: '2024-01-28', type: 'alert', description: 'Temperature trending above normal', severity: 'high', oee: 75 },
      { date: '2024-01-24', type: 'maintenance', description: 'Sensor calibration', severity: 'info', oee: 80 },
      { date: '2024-01-18', type: 'failure', description: 'Hydraulic system failure', severity: 'critical', oee: 0 },
      { date: '2024-01-16', type: 'maintenance', description: 'Emergency repair completed', severity: 'info', oee: 78 },
    ],
    metrics: {
      avgOEE: 58.3,
      uptime: 87.1,
      mtbf: 89,
      mttr: 4.2,
    }
  },
  'A3': {
    name: 'Conveyor Belt 3',
    events: [
      { date: '2024-01-28', type: 'alert', description: 'Critical bearing wear detected', severity: 'critical', oee: 45 },
      { date: '2024-01-22', type: 'alert', description: 'Vibration levels increasing', severity: 'warning', oee: 65 },
      { date: '2024-01-15', type: 'maintenance', description: 'Belt tensioning adjustment', severity: 'info', oee: 70 },
      { date: '2024-01-10', type: 'alert', description: 'Speed variation detected', severity: 'warning', oee: 68 },
    ],
    metrics: {
      avgOEE: 62.0,
      uptime: 78.3,
      mtbf: 72,
      mttr: 3.8,
    }
  }
};

function getEventIcon(type: string) {
  switch (type) {
    case 'maintenance':
      return <Wrench className="w-4 h-4 text-primary" />;
    case 'alert':
      return <AlertTriangle className="w-4 h-4 text-warning" />;
    case 'failure':
      return <AlertTriangle className="w-4 h-4 text-destructive" />;
    default:
      return <Activity className="w-4 h-4 text-muted-foreground" />;
  }
}

function getSeverityColor(severity: string) {
  switch (severity) {
    case 'critical':
      return 'destructive';
    case 'high':
      return 'destructive';
    case 'warning':
      return 'warning';
    case 'info':
      return 'default';
    default:
      return 'secondary';
  }
}

export default function HealthHistoryPage() {
  const [searchParams] = useSearchParams();
  const assetId = searchParams.get('asset') || 'A1';
  const [timeRange, setTimeRange] = useState('30d');
  
  const { assets } = useMockData();
  const assetData = mockHealthHistory[assetId as keyof typeof mockHealthHistory];
  const currentAsset = assets.find(a => a.id === assetId);

  if (!assetData || !currentAsset) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Asset Not Found</h1>
          <Link to="/assets">
            <Button>Return to Assets</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link to="/assets">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Assets
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Health History</h1>
          <p className="text-muted-foreground">{assetData.name} - Historical performance and maintenance data</p>
        </div>
      </div>

      {/* Asset Selector and Time Range */}
      <div className="flex gap-4 mb-6">
        <Select value={assetId} onValueChange={(value) => window.location.href = `/health-history?asset=${value}`}>
          <SelectTrigger className="w-64">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {assets.map((asset) => (
              <SelectItem key={asset.id} value={asset.id}>
                {asset.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              <div>
                <div className="text-2xl font-bold">{assetData.metrics.avgOEE}%</div>
                <div className="text-sm text-muted-foreground">Avg OEE</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-success" />
              <div>
                <div className="text-2xl font-bold">{assetData.metrics.uptime}%</div>
                <div className="text-sm text-muted-foreground">Uptime</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-warning" />
              <div>
                <div className="text-2xl font-bold">{assetData.metrics.mtbf}h</div>
                <div className="text-sm text-muted-foreground">MTBF</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Wrench className="w-5 h-5 text-destructive" />
              <div>
                <div className="text-2xl font-bold">{assetData.metrics.mttr}h</div>
                <div className="text-sm text-muted-foreground">MTTR</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Event Timeline */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Event Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assetData.events.map((event, index) => (
                  <div key={index} className="flex gap-4 p-4 border rounded-lg">
                    <div className="flex-shrink-0 mt-1">
                      {getEventIcon(event.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold">{event.description}</h4>
                          <p className="text-sm text-muted-foreground">
                            {new Date(event.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant={getSeverityColor(event.severity) as any}>
                            {event.severity.toUpperCase()}
                          </Badge>
                          <Badge variant="outline">
                            OEE: {event.oee}%
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        {event.oee > 80 ? (
                          <TrendingUp className="w-4 h-4 text-success" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-destructive" />
                        )}
                        <span className="text-muted-foreground">
                          Impact on performance
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Chart Placeholder */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Performance Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-muted-foreground">OEE Trend Chart</p>
                  <p className="text-sm text-muted-foreground">Last 30 days</p>
                </div>
              </div>
              
              {/* Recent Trends */}
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">This Week:</span>
                  <span className="font-medium">{currentAsset.oee}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Last Week:</span>
                  <span className="font-medium">{currentAsset.oee + 3}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Trend:</span>
                  <div className="flex items-center gap-1">
                    <TrendingDown className="w-4 h-4 text-destructive" />
                    <span className="text-destructive">-3%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}