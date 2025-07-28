import React, { useState } from 'react';
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
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Camera,
  TrendingUp,
  BarChart3,
  Target,
  Lightbulb,
  ArrowUp,
  Eye,
  Search,
  Filter,
  MapPin,
  Activity,
  Zap
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useMockData } from '@/hooks/useMockData';
import { QualityIncidentDetail } from '@/components/quality/QualityIncidentDetail';
import { AdvancedSearch } from '@/components/search/AdvancedSearch';
import { BulkOperations } from '@/components/bulk/BulkOperations';
import { InteractivePlantLayout } from '@/components/plant/InteractivePlantLayout';
import { RealTimeSensorDashboard } from '@/components/analytics/RealTimeSensorDashboard';
import { WorkflowManagement } from '@/components/workflow/WorkflowManagement';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// Extended mock data for quality control
const mockQualityData = {
  overall: {
    qualityRate: 97.2,
    defectRate: 2.8,
    inspectedToday: 1247,
    rejectedToday: 35,
  },
  incidents: [
    {
      id: 'QI-001',
      timestamp: new Date().toISOString(),
      defectType: 'Surface Scratch',
      severity: 'minor' as const,
      lineId: 'L1',
      lineName: 'Production Line 1',
      imageUrl: null,
      confidence: 94,
      actionTaken: null,
      status: 'active' as const,
    },
    {
      id: 'QI-002',
      timestamp: new Date(Date.now() - 900000).toISOString(),
      defectType: 'Dimension Out of Spec',
      severity: 'major' as const,
      lineId: 'L2',
      lineName: 'Production Line 2',
      imageUrl: null,
      confidence: 87,
      actionTaken: 'Line stopped for adjustment',
      status: 'resolved' as const,
    },
    {
      id: 'QI-003',
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      defectType: 'Color Variation',
      severity: 'minor' as const,
      lineId: 'L1',
      lineName: 'Production Line 1',
      imageUrl: null,
      confidence: 91,
      actionTaken: null,
      status: 'acknowledged' as const,
    },
  ],
  suggestions: [
    {
      id: 'QS-001',
      title: 'Adjust Camera Angle on Line 2',
      description: 'Recommendation to improve defect detection accuracy by adjusting camera position',
      estimatedImprovement: '+2.5% detection accuracy',
      confidence: 89,
      status: 'pending' as const,
      priority: 'medium' as const,
    },
    {
      id: 'QS-002',
      title: 'Calibrate Color Sensor - Line 1',
      description: 'Color variation incidents suggest sensor drift. Calibration recommended.',
      estimatedImprovement: '-15% color defects',
      confidence: 95,
      status: 'pending' as const,
      priority: 'high' as const,
    },
  ],
};

interface QualityIncident {
  id: string;
  timestamp: string;
  defectType: string;
  severity: 'minor' | 'major' | 'critical';
  lineId: string;
  lineName: string;
  imageUrl?: string | null;
  confidence: number;
  actionTaken?: string | null;
  status: 'active' | 'acknowledged' | 'resolved';
  description?: string;
  assignedTo?: string;
  resolution?: string;
  images?: string[];
  comments?: Array<{
    id: string;
    user: string;
    message: string;
    timestamp: string;
  }>;
}

interface QualitySuggestion {
  id: string;
  title: string;
  description: string;
  estimatedImprovement: string;
  confidence: number;
  status: 'pending' | 'accepted' | 'dismissed';
  priority: 'low' | 'medium' | 'high';
}

function getSeverityColor(severity: 'minor' | 'major' | 'critical') {
  switch (severity) {
    case 'critical':
      return 'destructive';
    case 'major':
      return 'warning';
    case 'minor':
      return 'secondary';
    default:
      return 'secondary';
  }
}

function getStatusColor(status: 'active' | 'acknowledged' | 'resolved') {
  switch (status) {
    case 'active':
      return 'destructive';
    case 'acknowledged':
      return 'warning';
    case 'resolved':
      return 'success';
    default:
      return 'secondary';
  }
}

interface QualityIncidentCardProps {
  incident: QualityIncident;
  onAcknowledge: (id: string) => void;
  onCreateReport: (id: string) => void;
}

function QualityIncidentCard({ incident, onAcknowledge, onCreateReport }: QualityIncidentCardProps) {
  return (
    <Card className="transition-all duration-200 hover:shadow-md border-l-4 border-l-warning">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Camera className="w-5 h-5 text-primary" />
              {incident.defectType}
            </CardTitle>
            <p className="text-sm text-muted-foreground">{incident.lineName}</p>
          </div>
          <div className="flex gap-2">
            <Badge variant={getSeverityColor(incident.severity) as any}>
              {incident.severity.toUpperCase()}
            </Badge>
            <Badge variant={getStatusColor(incident.status) as any}>
              {incident.status.toUpperCase()}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Detection Info */}
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Detected:</span>
          <span>{new Date(incident.timestamp).toLocaleString()}</span>
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">AI Confidence:</span>
          <Badge variant="outline">{incident.confidence}%</Badge>
        </div>

        {/* Image placeholder */}
        <div className="bg-muted/30 rounded-lg p-8 text-center">
          <Camera className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Product Image</p>
          <Button variant="outline" size="sm" className="mt-2">
            <Eye className="w-4 h-4 mr-2" />
            View Image
          </Button>
        </div>

        {/* Action taken */}
        {incident.actionTaken && (
          <div className="bg-success/10 p-3 rounded-lg">
            <p className="text-sm text-success-foreground">
              <strong>Action Taken:</strong> {incident.actionTaken}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          {incident.status === 'active' && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onAcknowledge(incident.id)}
            >
              Acknowledge
            </Button>
          )}
          <Button 
            size="sm"
            onClick={() => onCreateReport(incident.id)}
          >
            Create Report
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

interface OptimizationSuggestionCardProps {
  suggestion: QualitySuggestion;
  onAccept: (id: string) => void;
  onDismiss: (id: string) => void;
}

function OptimizationSuggestionCard({ suggestion, onAccept, onDismiss }: OptimizationSuggestionCardProps) {
  const priorityColor = suggestion.priority === 'high' ? 'destructive' : 
                       suggestion.priority === 'medium' ? 'warning' : 'secondary';

  return (
    <Card className="border-l-4 border-l-primary">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-primary" />
            {suggestion.title}
          </CardTitle>
          <Badge variant={priorityColor as any}>
            {suggestion.priority.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{suggestion.description}</p>
        
        <div className="bg-primary/5 p-3 rounded-lg">
          <div className="flex items-center gap-2 text-sm">
            <ArrowUp className="w-4 h-4 text-success" />
            <span className="font-medium">Estimated Improvement:</span>
            <span className="text-success">{suggestion.estimatedImprovement}</span>
          </div>
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">AI Confidence:</span>
          <Badge variant="outline">{suggestion.confidence}%</Badge>
        </div>

        {suggestion.status === 'pending' && (
          <div className="flex gap-2">
            <Button 
              size="sm"
              onClick={() => onAccept(suggestion.id)}
            >
              Accept
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onDismiss(suggestion.id)}
            >
              Dismiss
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function QualityControlPage() {
  const { user } = useAuth();
  const { productionLines } = useMockData();
  const [selectedLine, setSelectedLine] = useState<string>('all');
  const [qualityIncidents, setQualityIncidents] = useState<QualityIncident[]>(mockQualityData.incidents);
  const [suggestions, setSuggestions] = useState<QualitySuggestion[]>(mockQualityData.suggestions);
  const [selectedIncident, setSelectedIncident] = useState<QualityIncident | null>(null);
  const [filteredIncidents, setFilteredIncidents] = useState<QualityIncident[]>(mockQualityData.incidents);
  const [selectedIncidentIds, setSelectedIncidentIds] = useState<string[]>([]);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [activeView, setActiveView] = useState<'incidents' | 'plant' | 'analytics' | 'workflow'>('incidents');

  const handleAcknowledgeIncident = (id: string) => {
    setQualityIncidents(prev =>
      prev.map(incident =>
        incident.id === id ? { ...incident, status: 'acknowledged' as const } : incident
      )
    );
  };

  const handleCreateReport = (id: string) => {
    console.log('Creating quality report for incident:', id);
    // In real app, this would open a report creation form
  };

  const handleViewIncident = (incident: QualityIncident) => {
    setSelectedIncident(incident);
  };

  const handleUpdateIncident = (updatedIncident: QualityIncident) => {
    setQualityIncidents(prev => 
      prev.map(incident => 
        incident.id === updatedIncident.id ? updatedIncident : incident
      )
    );
    setFilteredIncidents(prev => 
      prev.map(incident => 
        incident.id === updatedIncident.id ? updatedIncident : incident
      )
    );
  };

  const handleSearch = (filters: any) => {
    let filtered = qualityIncidents;

    // Apply text search
    if (filters.query) {
      filtered = filtered.filter(incident =>
        incident.defectType.toLowerCase().includes(filters.query.toLowerCase()) ||
        incident.lineName.toLowerCase().includes(filters.query.toLowerCase()) ||
        (incident.actionTaken && incident.actionTaken.toLowerCase().includes(filters.query.toLowerCase()))
      );
    }

    // Apply date range filter
    if (filters.dateRange.from || filters.dateRange.to) {
      filtered = filtered.filter(incident => {
        const incidentDate = new Date(incident.timestamp);
        if (filters.dateRange.from && incidentDate < filters.dateRange.from) return false;
        if (filters.dateRange.to && incidentDate > filters.dateRange.to) return false;
        return true;
      });
    }

    // Apply severity filter
    if (filters.severity.length > 0) {
      filtered = filtered.filter(incident => filters.severity.includes(incident.severity));
    }

    // Apply status filter
    if (filters.status.length > 0) {
      filtered = filtered.filter(incident => filters.status.includes(incident.status));
    }

    // Apply line filter
    if (filters.lineId.length > 0) {
      filtered = filtered.filter(incident => filters.lineId.includes(incident.lineId));
    }

    // Apply confidence filter
    filtered = filtered.filter(incident => 
      incident.confidence >= filters.confidence.min && 
      incident.confidence <= filters.confidence.max
    );

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (filters.sortBy) {
        case 'timestamp':
          aValue = new Date(a.timestamp).getTime();
          bValue = new Date(b.timestamp).getTime();
          break;
        case 'severity':
          const severityOrder = { 'critical': 3, 'major': 2, 'minor': 1 };
          aValue = severityOrder[a.severity as keyof typeof severityOrder];
          bValue = severityOrder[b.severity as keyof typeof severityOrder];
          break;
        case 'confidence':
          aValue = a.confidence;
          bValue = b.confidence;
          break;
        case 'defectType':
          aValue = a.defectType;
          bValue = b.defectType;
          break;
        default:
          return 0;
      }

      if (filters.sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    setFilteredIncidents(filtered);
  };

  const handleExport = (filters: any) => {
    const dataToExport = {
      incidents: filteredIncidents,
      filters,
      exportedAt: new Date().toISOString(),
      summary: {
        total: filteredIncidents.length,
        active: filteredIncidents.filter(i => i.status === 'active').length,
        resolved: filteredIncidents.filter(i => i.status === 'resolved').length,
      }
    };

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quality-incidents-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Quality incidents exported successfully');
  };

  const handleBulkAction = (action: string, selectedIds: string[], data?: any) => {
    setQualityIncidents(prev => 
      prev.map(incident => {
        if (!selectedIds.includes(incident.id)) return incident;
        
        switch (action) {
          case 'assign':
            return { ...incident, assignedTo: data?.assignee };
          case 'status':
            return { ...incident, status: data?.status };
          case 'notes':
            return { 
              ...incident, 
              comments: [
                ...(incident.comments || []),
                {
                  id: Date.now().toString(),
                  user: 'Current User',
                  message: data?.notes,
                  timestamp: new Date().toISOString(),
                }
              ]
            };
          case 'archive':
            return { ...incident, status: 'archived' as any };
          case 'delete':
            return null;
          default:
            return incident;
        }
      }).filter(Boolean) as QualityIncident[]
    );

    // Also update filtered incidents
    if (action === 'delete') {
      setFilteredIncidents(prev => prev.filter(incident => !selectedIds.includes(incident.id)));
    } else {
      setFilteredIncidents(prev => 
        prev.map(incident => {
          if (!selectedIds.includes(incident.id)) return incident;
          
          switch (action) {
            case 'assign':
              return { ...incident, assignedTo: data?.assignee };
            case 'status':
              return { ...incident, status: data?.status };
            case 'archive':
              return { ...incident, status: 'archived' as any };
            default:
              return incident;
          }
        })
      );
    }
  };

  const handleAcceptSuggestion = (id: string) => {
    setSuggestions(prev =>
      prev.map(suggestion =>
        suggestion.id === id ? { ...suggestion, status: 'accepted' as const } : suggestion
      )
    );
  };

  const handleDismissSuggestion = (id: string) => {
    setSuggestions(prev =>
      prev.map(suggestion =>
        suggestion.id === id ? { ...suggestion, status: 'dismissed' as const } : suggestion
      )
    );
  };

  // Filter incidents based on selected line for display
  const displayIncidents = selectedLine === 'all' 
    ? filteredIncidents 
    : filteredIncidents.filter(incident => incident.lineId === selectedLine);

  const isProductionSupervisor = user?.role === 'production_supervisor';

  // Convert incidents to bulk operation format
  const bulkItems = displayIncidents.map(incident => ({
    id: incident.id,
    type: 'incident' as const,
    title: `${incident.defectType} - ${incident.lineName}`,
    status: incident.status,
    assignedTo: incident.assignedTo,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-6 py-8">
        {/* Modern Header with Gradient */}
        <div className="relative mb-8 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-8 border border-primary/10">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-3">
                Quality Control Center
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Real-time quality monitoring, intelligent defect detection, and process optimization
              </p>
            </div>

            {/* Modern View Toggle */}
            <div className="flex bg-background/80 backdrop-blur-sm rounded-xl p-1 border shadow-sm">
              {[
                { id: 'incidents', icon: AlertTriangle, label: 'Incidents' },
                { id: 'plant', icon: MapPin, label: 'Plant' },
                { id: 'analytics', icon: Activity, label: 'Analytics' },
                { id: 'workflow', icon: Zap, label: 'Workflows' }
              ].map((view) => (
                <Button
                  key={view.id}
                  variant={activeView === view.id ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveView(view.id as any)}
                  className={cn(
                    "transition-all duration-200 rounded-lg",
                    activeView === view.id 
                      ? "bg-primary text-primary-foreground shadow-md" 
                      : "hover:bg-muted/50"
                  )}
                >
                  <view.icon className="w-4 h-4 mr-2" />
                  {view.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Modern KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: 'Quality Rate',
              value: `${mockQualityData.overall.qualityRate}%`,
              icon: CheckCircle,
              trend: '+2.1%',
              color: 'success',
              description: 'Overall quality performance'
            },
            {
              title: 'Defect Rate',
              value: `${mockQualityData.overall.defectRate}%`,
              icon: AlertTriangle,
              trend: '-0.5%',
              color: 'warning',
              description: 'Total defects detected'
            },
            {
              title: 'Inspected Today',
              value: mockQualityData.overall.inspectedToday.toLocaleString(),
              icon: Target,
              trend: '+12%',
              color: 'primary',
              description: 'Items processed today'
            },
            {
              title: 'Rejected Items',
              value: mockQualityData.overall.rejectedToday.toString(),
              icon: Shield,
              trend: '-8%',
              color: 'destructive',
              description: 'Items requiring attention'
            }
          ].map((kpi, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-background to-muted/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={cn(
                    "p-3 rounded-xl transition-transform group-hover:scale-110",
                    kpi.color === 'success' && "bg-success/10 text-success",
                    kpi.color === 'warning' && "bg-warning/10 text-warning", 
                    kpi.color === 'primary' && "bg-primary/10 text-primary",
                    kpi.color === 'destructive' && "bg-destructive/10 text-destructive"
                  )}>
                    <kpi.icon className="w-6 h-6" />
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {kpi.trend}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-bold">{kpi.value}</h3>
                  <p className="text-sm font-medium">{kpi.title}</p>
                  <p className="text-xs text-muted-foreground">{kpi.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Dynamic Content Based on Active View */}
        <div className="space-y-6">
          {activeView === 'incidents' && (
            <div className="space-y-6">
              {/* Modern Search and Filters */}
              <Card className="border-0 shadow-lg bg-gradient-to-r from-background to-muted/10">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Search className="w-5 h-5" />
                    Smart Search & Filters
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <AdvancedSearch
                    onSearch={handleSearch}
                    onExport={handleExport}
                    productionLines={productionLines}
                  />
                </CardContent>
              </Card>

              {/* Production Line Filter for Supervisors */}
              {isProductionSupervisor && (
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium">Production Line:</span>
                      <Select value={selectedLine} onValueChange={setSelectedLine}>
                        <SelectTrigger className="w-48 border-0 bg-muted/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Lines</SelectItem>
                          {productionLines.map((line) => (
                            <SelectItem key={line.id} value={line.id}>
                              {line.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Bulk Operations */}
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <BulkOperations
                    items={bulkItems}
                    selectedItems={selectedIncidentIds}
                    onSelectionChange={setSelectedIncidentIds}
                    onBulkAction={handleBulkAction}
                  />
                </CardContent>
              </Card>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Incident Feed */}
                <div className="xl:col-span-2 space-y-4">
                  <Card className="border-0 shadow-lg bg-gradient-to-br from-background to-muted/10">
                    <CardHeader className="border-b bg-gradient-to-r from-muted/20 to-transparent">
                      <CardTitle className="flex items-center gap-3">
                        <div className="p-2 bg-warning/10 rounded-lg">
                          <AlertTriangle className="w-5 h-5 text-warning" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold">Live Quality Feed</h3>
                          <p className="text-sm text-muted-foreground">Real-time incident monitoring</p>
                        </div>
                        <Badge variant="destructive" className="ml-auto animate-pulse">
                          {displayIncidents.filter(i => i.status === 'active').length} Active
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4 max-h-[600px] overflow-y-auto scroll-smooth">
                        {displayIncidents.length === 0 ? (
                          <div className="text-center py-16">
                            <div className="mx-auto w-24 h-24 bg-success/10 rounded-full flex items-center justify-center mb-4">
                              <CheckCircle className="w-12 h-12 text-success" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">All Clear!</h3>
                            <p className="text-muted-foreground">No quality incidents detected</p>
                          </div>
                        ) : (
                          displayIncidents.map((incident) => (
                            <div key={incident.id} className="relative group">
                              <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200 bg-gradient-to-r from-background to-muted/5">
                                <CardContent className="p-6">
                                  <QualityIncidentCard
                                    incident={incident}
                                    onAcknowledge={handleAcknowledgeIncident}
                                    onCreateReport={handleCreateReport}
                                  />
                                </CardContent>
                              </Card>
                              <Button
                                variant="outline"
                                size="sm"
                                className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => handleViewIncident(incident)}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                Details
                              </Button>
                            </div>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar Panel */}
                <div className="space-y-6">
                  {/* Optimization Suggestions */}
                  <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/5 to-transparent">
                    <CardHeader className="border-b bg-gradient-to-r from-primary/10 to-transparent">
                      <CardTitle className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Lightbulb className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">AI Insights</h3>
                          <p className="text-sm text-muted-foreground">Smart recommendations</p>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {suggestions.filter(s => s.status === 'pending').map((suggestion) => (
                          <Card key={suggestion.id} className="border-0 bg-gradient-to-r from-background to-muted/10">
                            <CardContent className="p-4">
                              <OptimizationSuggestionCard
                                suggestion={suggestion}
                                onAccept={handleAcceptSuggestion}
                                onDismiss={handleDismissSuggestion}
                              />
                            </CardContent>
                          </Card>
                        ))}
                        
                        {suggestions.filter(s => s.status === 'pending').length === 0 && (
                          <div className="text-center py-8">
                            <div className="mx-auto w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mb-3">
                              <TrendingUp className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <p className="text-muted-foreground">No new suggestions</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {activeView === 'plant' && (
            <Card className="border-0 shadow-lg bg-gradient-to-br from-background to-muted/10">
              <CardContent className="p-8">
                <InteractivePlantLayout />
              </CardContent>
            </Card>
          )}

          {activeView === 'analytics' && (
            <Card className="border-0 shadow-lg bg-gradient-to-br from-background to-muted/10">
              <CardContent className="p-8">
                <RealTimeSensorDashboard />
              </CardContent>
            </Card>
          )}

          {activeView === 'workflow' && (
            <Card className="border-0 shadow-lg bg-gradient-to-br from-background to-muted/10">
              <CardContent className="p-8">
                <WorkflowManagement />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Quality Incident Detail Modal */}
        {selectedIncident && (
          <QualityIncidentDetail
            incident={selectedIncident}
            onClose={() => setSelectedIncident(null)}
            onUpdate={handleUpdateIncident}
          />
        )}
      </div>
    </div>
  );
}