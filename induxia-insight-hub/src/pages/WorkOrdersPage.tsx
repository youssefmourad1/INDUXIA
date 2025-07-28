import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  ClipboardList,
  Plus,
  Search,
  Filter,
  Calendar,
  User,
  Wrench,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { InteractiveWorkOrderChart } from '@/components/charts/InteractiveWorkOrderChart';
import { CollaborativeComments } from '@/components/collaboration/CollaborativeComments';

// Mock work order data
const mockWorkOrders: WorkOrder[] = [
  {
    id: 'WO-2024-001',
    title: 'Replace Bearing - Conveyor Belt 3',
    description: 'Critical bearing wear detected by AI. Immediate replacement required.',
    assetId: 'A3',
    assetName: 'Conveyor Belt 3',
    status: 'open',
    priority: 'critical',
    assignedTo: 'Marcus Rodriguez',
    createdDate: '2024-01-28',
    dueDate: '2024-01-30',
    estimatedHours: 4,
    source: 'AI Generated',
    completionPercentage: 0,
  },
  {
    id: 'WO-2024-002',
    title: 'Temperature Sensor Calibration - Press Line 2',
    description: 'Temperature readings trending above normal. Calibration required.',
    assetId: 'A2',
    assetName: 'Press Line 2',
    status: 'in_progress',
    priority: 'high',
    assignedTo: 'Sarah Kim',
    createdDate: '2024-01-27',
    dueDate: '2024-01-29',
    estimatedHours: 2,
    source: 'Manual',
    completionPercentage: 60,
  },
  {
    id: 'WO-2024-003',
    title: 'Routine Maintenance - Mixer Unit 1',
    description: 'Scheduled monthly maintenance and inspection.',
    assetId: 'A1',
    assetName: 'Mixer Unit 1',
    status: 'completed',
    priority: 'medium',
    assignedTo: 'James Wilson',
    createdDate: '2024-01-25',
    dueDate: '2024-01-26',
    estimatedHours: 3,
    source: 'Scheduled',
    completionPercentage: 100,
  },
  {
    id: 'WO-2024-004',
    title: 'Lubrication Service - Quality Control Station',
    description: 'Weekly lubrication and inspection of moving parts.',
    assetId: 'A4',
    assetName: 'Quality Control Station',
    status: 'scheduled',
    priority: 'low',
    assignedTo: 'Mike Chen',
    createdDate: '2024-01-28',
    dueDate: '2024-02-02',
    estimatedHours: 1,
    source: 'Scheduled',
    completionPercentage: 0,
  },
];

type WorkOrderStatus = 'open' | 'in_progress' | 'completed' | 'scheduled' | 'on_hold';
type WorkOrderPriority = 'critical' | 'high' | 'medium' | 'low';

interface WorkOrder {
  id: string;
  title: string;
  description: string;
  assetId: string;
  assetName: string;
  status: WorkOrderStatus;
  priority: WorkOrderPriority;
  assignedTo: string;
  createdDate: string;
  dueDate: string;
  estimatedHours: number;
  source: string;
  completionPercentage: number;
}

function getStatusIcon(status: WorkOrderStatus) {
  switch (status) {
    case 'open':
      return <AlertCircle className="w-4 h-4 text-destructive" />;
    case 'in_progress':
      return <Clock className="w-4 h-4 text-warning" />;
    case 'completed':
      return <CheckCircle className="w-4 h-4 text-success" />;
    case 'scheduled':
      return <Calendar className="w-4 h-4 text-primary" />;
    default:
      return <Clock className="w-4 h-4 text-muted-foreground" />;
  }
}

function getStatusColor(status: WorkOrderStatus): "default" | "secondary" | "destructive" | "outline" | "success" | "warning" {
  switch (status) {
    case 'open':
      return 'destructive';
    case 'in_progress':
      return 'warning';
    case 'completed':
      return 'success';
    case 'scheduled':
      return 'default';
    case 'on_hold':
      return 'secondary';
    default:
      return 'secondary';
  }
}

function getPriorityColor(priority: WorkOrderPriority): "default" | "secondary" | "destructive" | "outline" | "success" | "warning" {
  switch (priority) {
    case 'critical':
      return 'destructive';
    case 'high':
      return 'warning';
    case 'medium':
      return 'default';
    case 'low':
      return 'secondary';
    default:
      return 'secondary';
  }
}

interface WorkOrderCardProps {
  workOrder: WorkOrder;
  onStatusChange: (id: string, status: WorkOrderStatus) => void;
}

function WorkOrderCard({ workOrder, onStatusChange }: WorkOrderCardProps) {
  const isOverdue = new Date(workOrder.dueDate) < new Date() && workOrder.status !== 'completed';

  return (
    <Card className={`transition-all duration-200 hover:shadow-md ${isOverdue ? 'border-destructive/50 bg-destructive/5' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-lg">{workOrder.title}</CardTitle>
              {workOrder.source === 'AI Generated' && (
                <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/30">
                  AI Generated
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{workOrder.description}</p>
          </div>
          <Badge variant={getPriorityColor(workOrder.priority)}>
            {workOrder.priority.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Asset and Assignment Info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Wrench className="w-4 h-4" />
              <span>Asset</span>
            </div>
            <div className="font-medium">{workOrder.assetName}</div>
          </div>
          <div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="w-4 h-4" />
              <span>Assigned To</span>
            </div>
            <div className="font-medium">{workOrder.assignedTo}</div>
          </div>
        </div>

        {/* Dates and Progress */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-muted-foreground">Due Date</div>
            <div className={`font-medium ${isOverdue ? 'text-destructive' : ''}`}>
              {new Date(workOrder.dueDate).toLocaleDateString()}
              {isOverdue && ' (Overdue)'}
            </div>
          </div>
          <div>
            <div className="text-muted-foreground">Est. Hours</div>
            <div className="font-medium">{workOrder.estimatedHours}h</div>
          </div>
        </div>

        {/* Progress Bar (for in-progress orders) */}
        {workOrder.status === 'in_progress' && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{workOrder.completionPercentage}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${workOrder.completionPercentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Status and Actions */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-2">
            {getStatusIcon(workOrder.status)}
            <Badge variant={getStatusColor(workOrder.status) as any}>
              {workOrder.status.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>
          
          <div className="flex gap-2">
            {workOrder.status === 'open' && (
              <Button 
                size="sm" 
                onClick={() => onStatusChange(workOrder.id, 'in_progress')}
              >
                Start Work
              </Button>
            )}
            {workOrder.status === 'in_progress' && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onStatusChange(workOrder.id, 'completed')}
              >
                Mark Complete
              </Button>
            )}
            <Button size="sm" variant="outline">
              View Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function WorkOrdersPage() {
  const { user } = useAuth();
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(mockWorkOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<string | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);

  const handleStatusChange = (id: string, newStatus: WorkOrderStatus) => {
    setWorkOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === id 
          ? { ...order, status: newStatus, completionPercentage: newStatus === 'completed' ? 100 : order.completionPercentage }
          : order
      )
    );
  };

  // Filter work orders
  const filteredOrders = workOrders.filter(order => {
    const matchesSearch = order.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || order.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Statistics
  const stats = {
    total: workOrders.length,
    open: workOrders.filter(wo => wo.status === 'open').length,
    inProgress: workOrders.filter(wo => wo.status === 'in_progress').length,
    overdue: workOrders.filter(wo => new Date(wo.dueDate) < new Date() && wo.status !== 'completed').length,
  };

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Work Orders</h1>
          <p className="text-muted-foreground">
            Manage maintenance work orders and track progress
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowAnalytics(!showAnalytics)}
            className="flex items-center gap-2"
          >
            <BarChart3 className="w-4 h-4" />
            {showAnalytics ? 'Hide Analytics' : 'Show Analytics'}
          </Button>
          <Link to="/work-orders/create">
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create Work Order
            </Button>
          </Link>
        </div>
      </div>

      {/* Interactive Analytics Chart */}
      {showAnalytics && (
        <InteractiveWorkOrderChart className="mb-6" />
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-primary" />
              <div>
                <div className="text-2xl font-bold">{stats.total}</div>
                <div className="text-sm text-muted-foreground">Total Orders</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-destructive" />
              <div>
                <div className="text-2xl font-bold text-destructive">{stats.open}</div>
                <div className="text-sm text-muted-foreground">Open</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-warning" />
              <div>
                <div className="text-2xl font-bold text-warning">{stats.inProgress}</div>
                <div className="text-sm text-muted-foreground">In Progress</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-destructive" />
              <div>
                <div className="text-2xl font-bold text-destructive">{stats.overdue}</div>
                <div className="text-sm text-muted-foreground">Overdue</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search work orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Work Orders Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Work Orders List */}
        <div className="xl:col-span-2">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredOrders.map((workOrder) => (
              <div key={workOrder.id} className="relative">
                <WorkOrderCard
                  workOrder={workOrder}
                  onStatusChange={handleStatusChange}
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => setSelectedWorkOrder(workOrder.id)}
                >
                  Comments
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Collaboration Panel */}
        <div className="xl:col-span-1">
          {selectedWorkOrder ? (
            <CollaborativeComments
              workOrderId={selectedWorkOrder}
              className="sticky top-6"
            />
          ) : (
            <Card className="sticky top-6">
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center">
                  <ClipboardList className="w-8 h-8 mx-auto mb-2 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">
                    Select a work order to view collaboration
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {filteredOrders.length === 0 && (
        <div className="xl:col-span-3">
          <Card>
            <CardContent className="flex items-center justify-center h-64">
              <div className="text-center">
                <ClipboardList className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-muted-foreground">No work orders found</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}