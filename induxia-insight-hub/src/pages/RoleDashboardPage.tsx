import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  User,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Wrench,
  BarChart3,
  Target,
  Activity
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useMockData } from '@/hooks/useMockData';
import { MaintenanceCalendar, mockMaintenanceEvents, MaintenanceEvent } from '@/components/calendar/MaintenanceCalendar';

// Mock role-specific data
const mockRoleData = {
  plant_director: {
    overview: {
      plantsManaged: 1,
      totalAssets: 25,
      activeAlerts: 3,
      completedTasksThisWeek: 12,
      kpiImprovement: '+8.5%',
      costSavings: '$45,000'
    },
    recentActivity: [
      { date: '2024-01-28', action: 'Reviewed monthly OEE report', type: 'review' },
      { date: '2024-01-27', action: 'Approved emergency maintenance for Asset A3', type: 'approval' },
      { date: '2024-01-26', action: 'Strategic planning meeting completed', type: 'meeting' },
      { date: '2024-01-25', action: 'Quality improvement initiative launched', type: 'initiative' }
    ],
    upcomingTasks: [
      { id: 1, title: 'Board presentation preparation', due: '2024-01-30', priority: 'high' },
      { id: 2, title: 'Q1 budget review', due: '2024-02-01', priority: 'medium' },
      { id: 3, title: 'Safety audit planning', due: '2024-02-05', priority: 'medium' }
    ]
  },
  maintenance_manager: {
    overview: {
      activeWorkOrders: 8,
      completedThisWeek: 15,
      overdueWorkOrders: 2,
      teamUtilization: 87,
      avgRepairTime: '2.4h',
      preventiveCompliance: '94%'
    },
    recentActivity: [
      { date: '2024-01-28', action: 'Approved bearing replacement for Conveyor Belt 3', type: 'approval' },
      { date: '2024-01-27', action: 'Completed team training on new procedures', type: 'training' },
      { date: '2024-01-26', action: 'Reviewed supplier performance metrics', type: 'review' },
      { date: '2024-01-25', action: 'Updated maintenance schedules', type: 'update' }
    ],
    upcomingTasks: [
      { id: 1, title: 'Critical bearing replacement - A3', due: '2024-01-29', priority: 'critical' },
      { id: 2, title: 'Monthly equipment inspections', due: '2024-01-31', priority: 'high' },
      { id: 3, title: 'Technician performance reviews', due: '2024-02-02', priority: 'medium' }
    ]
  },
  production_supervisor: {
    overview: {
      linesSupervised: 2,
      qualityRate: 97.2,
      throughputToday: 1247,
      targetToday: 1500,
      qualityIncidents: 3,
      lineEfficiency: '89%'
    },
    recentActivity: [
      { date: '2024-01-28', action: 'Addressed quality incident on Line 1', type: 'incident' },
      { date: '2024-01-27', action: 'Implemented process optimization suggestion', type: 'improvement' },
      { date: '2024-01-26', action: 'Conducted shift handover meeting', type: 'meeting' },
      { date: '2024-01-25', action: 'Reviewed daily production targets', type: 'review' }
    ],
    upcomingTasks: [
      { id: 1, title: 'Quality control calibration - Line 2', due: '2024-01-29', priority: 'high' },
      { id: 2, title: 'Weekly production review', due: '2024-01-30', priority: 'medium' },
      { id: 3, title: 'Operator training session', due: '2024-02-01', priority: 'medium' }
    ]
  }
};

function getActivityIcon(type: string) {
  switch (type) {
    case 'approval': return <CheckCircle className="w-4 h-4 text-success" />;
    case 'review': return <BarChart3 className="w-4 h-4 text-primary" />;
    case 'meeting': return <User className="w-4 h-4 text-warning" />;
    case 'training': return <Target className="w-4 h-4 text-primary" />;
    case 'incident': return <AlertTriangle className="w-4 h-4 text-destructive" />;
    case 'improvement': return <TrendingUp className="w-4 h-4 text-success" />;
    case 'update': return <Activity className="w-4 h-4 text-primary" />;
    case 'initiative': return <Target className="w-4 h-4 text-success" />;
    default: return <Clock className="w-4 h-4 text-muted-foreground" />;
  }
}

function getPriorityColor(priority: string): "default" | "secondary" | "destructive" | "outline" | "success" | "warning" {
  switch (priority) {
    case 'critical': return 'destructive';
    case 'high': return 'warning';
    case 'medium': return 'default';
    case 'low': return 'secondary';
    default: return 'secondary';
  }
}

export default function RoleDashboardPage() {
  const { user } = useAuth();
  
  if (!user) return null;

  const roleData = mockRoleData[user.role];
  const userEvents = mockMaintenanceEvents.filter(event => {
    // Filter events based on role
    if (user.role === 'maintenance_manager') return true;
    if (user.role === 'production_supervisor') {
      return event.assetName.includes('Line') || event.assetName.includes('Quality');
    }
    return true; // Plant director sees all
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
      {/* Modern Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b border-border/50">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                Welcome back, {user.name}
              </h1>
              <p className="text-muted-foreground capitalize text-lg">
                {user.role.replace('_', ' ')} Dashboard - Your personalized overview
              </p>
            </div>
            <div className="hidden md:block">
              <div className="flex items-center gap-2 px-4 py-2 bg-card/50 border border-border/50 rounded-lg backdrop-blur-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm text-muted-foreground">System Status: Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">

      {/* Enhanced Role-specific Overview Cards */}
      {user.role === 'plant_director' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">{(roleData.overview as any).totalAssets}</div>
                  <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">Total Assets</div>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-800 rounded-xl">
                  <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-300" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900 border-emerald-200 dark:border-emerald-800 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-emerald-700 dark:text-emerald-300">{(roleData.overview as any).kpiImprovement}</div>
                  <div className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">KPI Improvement</div>
                </div>
                <div className="p-3 bg-emerald-100 dark:bg-emerald-800 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-300" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-violet-50 to-violet-100 dark:from-violet-950 dark:to-violet-900 border-violet-200 dark:border-violet-800 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-violet-700 dark:text-violet-300">{(roleData.overview as any).costSavings}</div>
                  <div className="text-sm text-violet-600 dark:text-violet-400 font-medium">Cost Savings</div>
                </div>
                <div className="p-3 bg-violet-100 dark:bg-violet-800 rounded-xl">
                  <Target className="w-6 h-6 text-violet-600 dark:text-violet-300" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {user.role === 'maintenance_manager' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-primary" />
                <div>
                  <div className="text-2xl font-bold">{(roleData.overview as any).activeWorkOrders}</div>
                  <div className="text-sm text-muted-foreground">Active Work Orders</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-success" />
                <div>
                  <div className="text-2xl font-bold text-success">{(roleData.overview as any).preventiveCompliance}</div>
                  <div className="text-sm text-muted-foreground">Preventive Compliance</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-warning" />
                <div>
                  <div className="text-2xl font-bold">{(roleData.overview as any).avgRepairTime}</div>
                  <div className="text-sm text-muted-foreground">Avg Repair Time</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {user.role === 'production_supervisor' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                <div>
                  <div className="text-2xl font-bold">{(roleData.overview as any).linesSupervised}</div>
                  <div className="text-sm text-muted-foreground">Production Lines</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-success" />
                <div>
                  <div className="text-2xl font-bold text-success">{(roleData.overview as any).qualityRate}%</div>
                  <div className="text-sm text-muted-foreground">Quality Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                <div>
                  <div className="text-2xl font-bold">{(roleData.overview as any).throughputToday}</div>
                  <div className="text-sm text-muted-foreground">Units Today</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Enhanced Calendar - 2/3 width */}
        <div className="lg:col-span-2">
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl shadow-lg overflow-hidden">
            <MaintenanceCalendar 
              events={userEvents}
              onEventClick={(event) => console.log('Event clicked:', event)}
              onDayClick={(day, events) => console.log('Day clicked:', day, events)}
            />
          </div>
        </div>

        {/* Right Sidebar - 1/3 width */}
        <div className="space-y-6">
          {/* Enhanced Upcoming Tasks */}
          <Card className="bg-card/50 backdrop-blur-sm border border-border/50 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                Upcoming Tasks
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {roleData.upcomingTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{task.title}</div>
                    <div className="text-xs text-muted-foreground">Due: {task.due}</div>
                  </div>
                  <Badge variant={getPriorityColor(task.priority)}>
                    {task.priority.toUpperCase()}
                  </Badge>
                </div>
              ))}
              <Link to="/calendar">
                <Button variant="outline" className="w-full mt-3">
                  View Full Calendar
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Enhanced Recent Activity */}
          <Card className="bg-card/50 backdrop-blur-sm border border-border/50 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Activity className="w-5 h-5 text-primary" />
                </div>
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {roleData.recentActivity.map((activity, index) => (
                <div key={index} className="flex gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{activity.action}</div>
                    <div className="text-xs text-muted-foreground">{activity.date}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
      </div>
    </div>
  );
}