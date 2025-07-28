import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { TrendingUp, Calendar, Users, Clock, Download } from 'lucide-react';

// Mock data for different chart types
const workOrderStatusData = [
  { name: 'Open', value: 23, color: '#ef4444' },
  { name: 'In Progress', value: 15, color: '#f59e0b' },
  { name: 'Completed', value: 45, color: '#10b981' },
  { name: 'On Hold', value: 7, color: '#6b7280' }
];

const weeklyCompletionData = [
  { week: 'Week 1', completed: 12, planned: 15, efficiency: 80 },
  { week: 'Week 2', completed: 18, planned: 20, efficiency: 90 },
  { week: 'Week 3', completed: 15, planned: 18, efficiency: 83 },
  { week: 'Week 4', completed: 22, planned: 25, efficiency: 88 }
];

const priorityTrendData = [
  { month: 'Jan', critical: 5, high: 12, medium: 20, low: 15 },
  { month: 'Feb', critical: 3, high: 15, medium: 18, low: 22 },
  { month: 'Mar', critical: 7, high: 18, medium: 25, low: 20 },
  { month: 'Apr', critical: 4, high: 14, medium: 22, low: 25 },
  { month: 'May', critical: 6, high: 16, medium: 24, low: 18 },
  { month: 'Jun', critical: 2, high: 12, medium: 20, low: 28 }
];

const technicianPerformanceData = [
  { name: 'John Doe', completed: 24, avg_time: 2.5, rating: 4.8 },
  { name: 'Jane Smith', completed: 31, avg_time: 2.1, rating: 4.9 },
  { name: 'Mike Wilson', completed: 19, avg_time: 3.2, rating: 4.6 },
  { name: 'Sarah Connor', completed: 27, avg_time: 2.8, rating: 4.7 }
];

interface InteractiveWorkOrderChartProps {
  className?: string;
}

export function InteractiveWorkOrderChart({ className }: InteractiveWorkOrderChartProps) {
  const [selectedChart, setSelectedChart] = useState('status');
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedMetric, setSelectedMetric] = useState('completion');

  const handleChartClick = (data: any) => {
    console.log('Chart clicked:', data);
    // In real app, this would drill down to detailed view
  };

  const exportChart = () => {
    // Simulate chart export
    const exportData = {
      chartType: selectedChart,
      period: selectedPeriod,
      data: getCurrentChartData(),
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `work-order-chart-${selectedChart}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getCurrentChartData = () => {
    switch (selectedChart) {
      case 'status': return workOrderStatusData;
      case 'completion': return weeklyCompletionData;
      case 'priority': return priorityTrendData;
      case 'technician': return technicianPerformanceData;
      default: return workOrderStatusData;
    }
  };

  const renderChart = () => {
    switch (selectedChart) {
      case 'status':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={workOrderStatusData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                onClick={handleChartClick}
                className="cursor-pointer"
              >
                {workOrderStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'completion':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={weeklyCompletionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="completed" 
                stackId="1" 
                stroke="#10b981" 
                fill="#10b981" 
                fillOpacity={0.6}
                onClick={handleChartClick}
                className="cursor-pointer"
              />
              <Area 
                type="monotone" 
                dataKey="planned" 
                stackId="2" 
                stroke="#6b7280" 
                fill="#6b7280" 
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'priority':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={priorityTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="critical" stackId="a" fill="#ef4444" onClick={handleChartClick} className="cursor-pointer" />
              <Bar dataKey="high" stackId="a" fill="#f59e0b" onClick={handleChartClick} className="cursor-pointer" />
              <Bar dataKey="medium" stackId="a" fill="#3b82f6" onClick={handleChartClick} className="cursor-pointer" />
              <Bar dataKey="low" stackId="a" fill="#10b981" onClick={handleChartClick} className="cursor-pointer" />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'technician':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={technicianPerformanceData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={80} />
              <Tooltip />
              <Bar 
                dataKey="completed" 
                fill="#3b82f6" 
                onClick={handleChartClick}
                className="cursor-pointer"
              />
            </BarChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  const getChartStats = () => {
    switch (selectedChart) {
      case 'status':
        return {
          total: workOrderStatusData.reduce((sum, item) => sum + item.value, 0),
          active: workOrderStatusData.filter(item => item.name !== 'Completed').reduce((sum, item) => sum + item.value, 0)
        };
      case 'completion':
        return {
          avgEfficiency: Math.round(weeklyCompletionData.reduce((sum, item) => sum + item.efficiency, 0) / weeklyCompletionData.length),
          totalCompleted: weeklyCompletionData.reduce((sum, item) => sum + item.completed, 0)
        };
      case 'priority':
        const latestMonth = priorityTrendData[priorityTrendData.length - 1];
        return {
          criticalThisMonth: latestMonth.critical,
          totalThisMonth: latestMonth.critical + latestMonth.high + latestMonth.medium + latestMonth.low
        };
      case 'technician':
        return {
          topPerformer: technicianPerformanceData.reduce((max, tech) => tech.completed > max.completed ? tech : max),
          avgCompletion: Math.round(technicianPerformanceData.reduce((sum, tech) => sum + tech.completed, 0) / technicianPerformanceData.length)
        };
      default:
        return {};
    }
  };

  const stats = getChartStats();

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Work Order Analytics
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={exportChart}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
        
        <div className="flex gap-4">
          <Select value={selectedChart} onValueChange={setSelectedChart}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="status">Status Distribution</SelectItem>
              <SelectItem value="completion">Completion Trends</SelectItem>
              <SelectItem value="priority">Priority Analysis</SelectItem>
              <SelectItem value="technician">Technician Performance</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {selectedChart === 'status' && (
            <>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{stats.total}</div>
                <div className="text-sm text-muted-foreground">Total Orders</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-warning">{stats.active}</div>
                <div className="text-sm text-muted-foreground">Active Orders</div>
              </div>
            </>
          )}

          {selectedChart === 'completion' && (
            <>
              <div className="text-center">
                <div className="text-2xl font-bold text-success">{stats.avgEfficiency}%</div>
                <div className="text-sm text-muted-foreground">Avg Efficiency</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{stats.totalCompleted}</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
            </>
          )}

          {selectedChart === 'priority' && (
            <>
              <div className="text-center">
                <div className="text-2xl font-bold text-destructive">{stats.criticalThisMonth}</div>
                <div className="text-sm text-muted-foreground">Critical This Month</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{stats.totalThisMonth}</div>
                <div className="text-sm text-muted-foreground">Total This Month</div>
              </div>
            </>
          )}

          {selectedChart === 'technician' && (
            <>
              <div className="text-center">
                <div className="text-lg font-bold text-success">{stats.topPerformer?.name}</div>
                <div className="text-sm text-muted-foreground">Top Performer</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{stats.avgCompletion}</div>
                <div className="text-sm text-muted-foreground">Avg Completion</div>
              </div>
            </>
          )}
        </div>

        {/* Chart */}
        <div className="mb-4">
          {renderChart()}
        </div>

        {/* Legend or additional info */}
        {selectedChart === 'status' && (
          <div className="flex flex-wrap gap-2">
            {workOrderStatusData.map((item) => (
              <Badge key={item.name} variant="outline" className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                {item.name}: {item.value}
              </Badge>
            ))}
          </div>
        )}

        {selectedChart === 'priority' && (
          <div className="mt-4 p-3 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground">
              Click on chart segments to drill down into specific priority levels and time periods.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}