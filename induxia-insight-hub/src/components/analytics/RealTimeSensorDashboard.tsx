import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ReferenceLine,
  Brush
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Zap, 
  AlertTriangle,
  Brain,
  Target,
  Clock
} from 'lucide-react';

// Mock real-time sensor data
const generateSensorData = (points: number = 50) => {
  const data = [];
  const now = new Date();
  
  for (let i = points - 1; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 60000); // 1 minute intervals
    data.push({
      time: timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: timestamp.getTime(),
      temperature: 65 + Math.sin(i * 0.1) * 10 + Math.random() * 5,
      pressure: 2.5 + Math.cos(i * 0.15) * 0.8 + Math.random() * 0.3,
      vibration: 3 + Math.sin(i * 0.2) * 2 + Math.random() * 1,
      oee: 85 + Math.sin(i * 0.05) * 15 + Math.random() * 10,
      energy: 1200 + Math.sin(i * 0.08) * 200 + Math.random() * 100,
      quality_score: 94 + Math.sin(i * 0.12) * 6 + Math.random() * 3
    });
  }
  
  return data;
};

// Predictive analytics data
const generatePredictiveData = () => {
  const historical = [];
  const predicted = [];
  const now = new Date();
  
  // Historical data (last 30 days)
  for (let i = 30; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    historical.push({
      date: date.toLocaleDateString(),
      actual_oee: 85 + Math.sin(i * 0.1) * 10 + Math.random() * 5,
      maintenance_cost: 5000 + Math.random() * 2000,
      downtime_hours: 2 + Math.random() * 3
    });
  }
  
  // Predicted data (next 30 days)
  for (let i = 1; i <= 30; i++) {
    const date = new Date(now.getTime() + i * 24 * 60 * 60 * 1000);
    predicted.push({
      date: date.toLocaleDateString(),
      predicted_oee: 87 + Math.sin(i * 0.1) * 8 + Math.random() * 3,
      predicted_cost: 4500 + Math.random() * 1500,
      predicted_downtime: 1.5 + Math.random() * 2,
      confidence: 95 - i * 1.5 // Confidence decreases over time
    });
  }
  
  return { historical, predicted };
};

interface RealTimeSensorDashboardProps {
  className?: string;
}

export function RealTimeSensorDashboard({ className }: RealTimeSensorDashboardProps) {
  const [sensorData, setSensorData] = useState(generateSensorData());
  const [predictiveData] = useState(generatePredictiveData());
  const [selectedMetric, setSelectedMetric] = useState('temperature');
  const [timeRange, setTimeRange] = useState('1h');
  const [isLive, setIsLive] = useState(true);

  // Real-time data updates
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setSensorData(prevData => {
        const newData = [...prevData];
        const now = new Date();
        
        // Remove oldest point and add new one
        newData.shift();
        newData.push({
          time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          timestamp: now.getTime(),
          temperature: 65 + Math.sin(Date.now() * 0.001) * 10 + Math.random() * 5,
          pressure: 2.5 + Math.cos(Date.now() * 0.0015) * 0.8 + Math.random() * 0.3,
          vibration: 3 + Math.sin(Date.now() * 0.002) * 2 + Math.random() * 1,
          oee: 85 + Math.sin(Date.now() * 0.0005) * 15 + Math.random() * 10,
          energy: 1200 + Math.sin(Date.now() * 0.0008) * 200 + Math.random() * 100,
          quality_score: 94 + Math.sin(Date.now() * 0.0012) * 6 + Math.random() * 3
        });
        
        return newData;
      });
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, [isLive]);

  const getMetricInfo = (metric: string) => {
    const latest = sensorData[sensorData.length - 1];
    const previous = sensorData[sensorData.length - 2];
    
    switch (metric) {
      case 'temperature':
        return {
          value: latest?.temperature?.toFixed(1) || '0',
          unit: '°C',
          trend: (latest?.temperature || 0) > (previous?.temperature || 0) ? 'up' : 'down',
          icon: <Activity className="w-4 h-4" />,
          color: '#ef4444'
        };
      case 'pressure':
        return {
          value: latest?.pressure?.toFixed(2) || '0',
          unit: 'bar',
          trend: (latest?.pressure || 0) > (previous?.pressure || 0) ? 'up' : 'down',
          icon: <Zap className="w-4 h-4" />,
          color: '#3b82f6'
        };
      case 'oee':
        return {
          value: latest?.oee?.toFixed(1) || '0',
          unit: '%',
          trend: (latest?.oee || 0) > (previous?.oee || 0) ? 'up' : 'down',
          icon: <Target className="w-4 h-4" />,
          color: '#10b981'
        };
      case 'vibration':
        return {
          value: latest?.vibration?.toFixed(1) || '0',
          unit: 'mm/s',
          trend: (latest?.vibration || 0) > (previous?.vibration || 0) ? 'up' : 'down',
          icon: <Activity className="w-4 h-4" />,
          color: '#f59e0b'
        };
      default:
        return {
          value: '0',
          unit: '',
          trend: 'up',
          icon: <Activity className="w-4 h-4" />,
          color: '#6b7280'
        };
    }
  };

  const metricInfo = getMetricInfo(selectedMetric);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Real-time Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {['temperature', 'pressure', 'oee', 'vibration'].map((metric) => {
          const info = getMetricInfo(metric);
          return (
            <Card 
              key={metric}
              className={`cursor-pointer transition-all ${selectedMetric === metric ? 'ring-2 ring-primary' : ''}`}
              onClick={() => setSelectedMetric(metric)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {info.icon}
                    <span className="text-sm font-medium capitalize">{metric}</span>
                  </div>
                  {info.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4 text-success" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-destructive" />
                  )}
                </div>
                <div className="mt-2">
                  <div className="text-2xl font-bold" style={{ color: info.color }}>
                    {info.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{info.unit}</div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Real-time Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Real-time Sensor Data - {selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)}
              {isLive && <Badge variant="destructive" className="animate-pulse">LIVE</Badge>}
            </CardTitle>
            <div className="flex gap-2">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">1H</SelectItem>
                  <SelectItem value="4h">4H</SelectItem>
                  <SelectItem value="1d">1D</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant={isLive ? "default" : "outline"}
                size="sm"
                onClick={() => setIsLive(!isLive)}
              >
                {isLive ? 'Pause' : 'Resume'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={sensorData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip 
                labelFormatter={(label) => `Time: ${label}`}
                formatter={(value: any, name: string) => [
                  `${value.toFixed(2)} ${getMetricInfo(selectedMetric).unit}`,
                  selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)
                ]}
              />
              <Line
                type="monotone"
                dataKey={selectedMetric}
                stroke={metricInfo.color}
                strokeWidth={2}
                dot={false}
                isAnimationActive={isLive}
              />
              <Brush dataKey="time" height={30} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Predictive Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Predictive Analytics & Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* OEE Prediction */}
            <div>
              <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                <Target className="w-4 h-4" />
                OEE Prediction (30 days)
              </h4>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={[...predictiveData.historical.slice(-10), ...predictiveData.predicted.slice(0, 10)]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis domain={[70, 100]} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="actual_oee"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.3}
                  />
                  <Area
                    type="monotone"
                    dataKey="predicted_oee"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.2}
                    strokeDasharray="5 5"
                  />
                  <ReferenceLine x={predictiveData.historical[predictiveData.historical.length - 1]?.date} stroke="#666" strokeDasharray="2 2" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Maintenance Cost Prediction */}
            <div>
              <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Maintenance Cost Trend
              </h4>
              <ResponsiveContainer width="100%" height={200}>
                <ScatterChart data={[...predictiveData.historical, ...predictiveData.predicted]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: any, name: string) => [
                      `$${value.toFixed(0)}`,
                      name.includes('predicted') ? 'Predicted Cost' : 'Actual Cost'
                    ]}
                  />
                  <Scatter dataKey="maintenance_cost" fill="#ef4444" />
                  <Scatter dataKey="predicted_cost" fill="#f59e0b" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Insights */}
          <div className="mt-6 p-4 bg-primary/5 rounded-lg">
            <div className="flex items-start gap-3">
              <Brain className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium text-primary mb-2">AI-Generated Insights</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-warning" />
                    <span>Temperature trending 5% above normal - recommend calibration within 72 hours</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-success" />
                    <span>OEE improvement of 3.2% detected after last maintenance cycle</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <span>Optimal maintenance window: Next Tuesday 2-6 AM (minimal production impact)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}