import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Wrench,
  AlertTriangle,
  CheckCircle,
  Plus,
  Save,
  Eye,
  Users
} from 'lucide-react';
import { useMockData } from '@/hooks/useMockData';
import { useToast } from '@/hooks/use-toast';

// Mock maintenance templates
const maintenanceTemplates = [
  {
    id: 'TEMP-001',
    name: 'Routine Inspection',
    description: 'Standard monthly inspection checklist',
    estimatedHours: 2,
    priority: 'medium',
    tasks: ['Visual inspection', 'Lubrication check', 'Vibration measurement', 'Temperature check']
  },
  {
    id: 'TEMP-002',
    name: 'Bearing Replacement',
    description: 'Complete bearing replacement procedure',
    estimatedHours: 4,
    priority: 'high',
    tasks: ['Equipment shutdown', 'Bearing removal', 'New bearing installation', 'Testing and startup']
  },
  {
    id: 'TEMP-003',
    name: 'Preventive Maintenance',
    description: 'Comprehensive preventive maintenance package',
    estimatedHours: 6,
    priority: 'medium',
    tasks: ['Complete inspection', 'Parts replacement', 'Calibration', 'Performance testing']
  }
];

const technicians = [
  { id: 'TECH-001', name: 'Marcus Rodriguez', specialization: 'Mechanical' },
  { id: 'TECH-002', name: 'Sarah Kim', specialization: 'Electrical' },
  { id: 'TECH-003', name: 'James Wilson', specialization: 'Hydraulics' },
  { id: 'TECH-004', name: 'Mike Chen', specialization: 'Controls' },
];

interface CreateTemplateForm {
  name: string;
  description: string;
  estimatedHours: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  tasks: string[];
}

interface TechnicianAvailability {
  id: string;
  name: string;
  specialization: string;
  availability: {
    date: string;
    status: 'available' | 'busy' | 'off';
    currentTask?: string;
  }[];
}

// Mock technician availability data
const mockTechnicianAvailability: TechnicianAvailability[] = [
  {
    id: 'TECH-001',
    name: 'Marcus Rodriguez',
    specialization: 'Mechanical',
    availability: [
      { date: '2024-01-29', status: 'busy', currentTask: 'Bearing Replacement - A3' },
      { date: '2024-01-30', status: 'available' },
      { date: '2024-01-31', status: 'available' },
      { date: '2024-02-01', status: 'off' },
    ]
  },
  {
    id: 'TECH-002',
    name: 'Sarah Kim',
    specialization: 'Electrical',
    availability: [
      { date: '2024-01-29', status: 'available' },
      { date: '2024-01-30', status: 'busy', currentTask: 'Routine Inspection - A1' },
      { date: '2024-01-31', status: 'available' },
      { date: '2024-02-01', status: 'available' },
    ]
  },
  {
    id: 'TECH-003',
    name: 'James Wilson',
    specialization: 'Hydraulics',
    availability: [
      { date: '2024-01-29', status: 'available' },
      { date: '2024-01-30', status: 'available' },
      { date: '2024-01-31', status: 'busy', currentTask: 'Sensor Calibration - A2' },
      { date: '2024-02-01', status: 'available' },
    ]
  },
];

function CreateTemplateDialog() {
  const [open, setOpen] = useState(false);
  const [templateForm, setTemplateForm] = useState<CreateTemplateForm>({
    name: '',
    description: '',
    estimatedHours: 2,
    priority: 'medium',
    tasks: ['']
  });

  const addTask = () => {
    setTemplateForm(prev => ({
      ...prev,
      tasks: [...prev.tasks, '']
    }));
  };

  const updateTask = (index: number, value: string) => {
    setTemplateForm(prev => ({
      ...prev,
      tasks: prev.tasks.map((task, i) => i === index ? value : task)
    }));
  };

  const removeTask = (index: number) => {
    setTemplateForm(prev => ({
      ...prev,
      tasks: prev.tasks.filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    console.log('Creating template:', templateForm);
    // In real app, this would save to backend
    setOpen(false);
    setTemplateForm({
      name: '',
      description: '',
      estimatedHours: 2,
      priority: 'medium',
      tasks: ['']
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full justify-start">
          <Plus className="w-4 h-4 mr-2" />
          Create Template
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Maintenance Template</DialogTitle>
          <DialogDescription>
            Create a reusable template for common maintenance procedures
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Template Name</label>
              <Input
                value={templateForm.name}
                onChange={(e) => setTemplateForm(prev => ({...prev, name: e.target.value}))}
                placeholder="e.g., Monthly Inspection"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Priority</label>
              <Select 
                value={templateForm.priority} 
                onValueChange={(value: any) => setTemplateForm(prev => ({...prev, priority: value}))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={templateForm.description}
              onChange={(e) => setTemplateForm(prev => ({...prev, description: e.target.value}))}
              placeholder="Detailed description of the maintenance procedure"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Estimated Hours</label>
            <Input
              type="number"
              value={templateForm.estimatedHours}
              onChange={(e) => setTemplateForm(prev => ({...prev, estimatedHours: parseFloat(e.target.value) || 0}))}
              min="0.5"
              step="0.5"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Tasks Checklist</label>
            {templateForm.tasks.map((task, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={task}
                  onChange={(e) => updateTask(index, e.target.value)}
                  placeholder={`Task ${index + 1}`}
                />
                {templateForm.tasks.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeTask(index)}
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addTask}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Create Template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function TechnicianScheduleDialog() {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('2024-01-29');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-success';
      case 'busy': return 'bg-warning';
      case 'off': return 'bg-muted';
      default: return 'bg-secondary';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available': return 'Available';
      case 'busy': return 'Busy';
      case 'off': return 'Off Duty';
      default: return 'Unknown';
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full justify-start">
          <Users className="w-4 h-4 mr-2" />
          Technician Schedule
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Technician Availability</DialogTitle>
          <DialogDescription>
            View technician schedules and availability for the next few days
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Date</label>
            <Select value={selectedDate} onValueChange={setSelectedDate}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024-01-29">January 29, 2024</SelectItem>
                <SelectItem value="2024-01-30">January 30, 2024</SelectItem>
                <SelectItem value="2024-01-31">January 31, 2024</SelectItem>
                <SelectItem value="2024-02-01">February 1, 2024</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockTechnicianAvailability.map((tech) => {
              const dayAvailability = tech.availability.find(a => a.date === selectedDate);
              return (
                <Card key={tech.id} className="border">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{tech.name}</h4>
                        <p className="text-sm text-muted-foreground">{tech.specialization} Specialist</p>
                      </div>
                      {dayAvailability && (
                        <Badge 
                          variant="outline"
                          className={`${getStatusColor(dayAvailability.status)} text-white border-none`}
                        >
                          {getStatusText(dayAvailability.status)}
                        </Badge>
                      )}
                    </div>
                    
                    {dayAvailability?.currentTask && (
                      <div className="bg-muted/30 p-2 rounded text-sm">
                        <span className="font-medium">Current Task: </span>
                        {dayAvailability.currentTask}
                      </div>
                    )}

                    {dayAvailability?.status === 'available' && (
                      <div className="text-sm text-success mt-2">
                        ✓ Available for new assignments
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Weekly Overview */}
          <div className="mt-6">
            <h4 className="font-semibold mb-3">Weekly Overview</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Technician</th>
                    <th className="text-center p-2">Jan 29</th>
                    <th className="text-center p-2">Jan 30</th>
                    <th className="text-center p-2">Jan 31</th>
                    <th className="text-center p-2">Feb 1</th>
                  </tr>
                </thead>
                <tbody>
                  {mockTechnicianAvailability.map((tech) => (
                    <tr key={tech.id} className="border-b">
                      <td className="p-2 font-medium">{tech.name}</td>
                      {tech.availability.map((day) => (
                        <td key={day.date} className="p-2 text-center">
                          <div className={`w-4 h-4 rounded-full mx-auto ${getStatusColor(day.status)}`} 
                               title={getStatusText(day.status)}></div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="flex gap-4 mt-3 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-success"></div>
                <span>Available</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-warning"></div>
                <span>Busy</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-muted"></div>
                <span>Off Duty</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface MaintenanceScheduleForm {
  assetId: string;
  title: string;
  description: string;
  type: 'preventive' | 'predictive' | 'corrective' | 'emergency';
  priority: 'low' | 'medium' | 'high' | 'critical';
  scheduledDate: string;
  estimatedHours: number;
  assignedTo: string;
  template: string;
  notes: string;
}

export default function ScheduleMaintenancePage() {
  const { assets } = useMockData();
  const { toast } = useToast();
  
  const [form, setForm] = useState<MaintenanceScheduleForm>({
    assetId: '',
    title: '',
    description: '',
    type: 'preventive',
    priority: 'medium',
    scheduledDate: '',
    estimatedHours: 2,
    assignedTo: '',
    template: '',
    notes: ''
  });

  const handleTemplateSelect = (templateId: string) => {
    const template = maintenanceTemplates.find(t => t.id === templateId);
    if (template) {
      setForm(prev => ({
        ...prev,
        template: templateId,
        title: template.name,
        description: template.description,
        estimatedHours: template.estimatedHours,
        priority: template.priority as any
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!form.assetId || !form.title || !form.scheduledDate || !form.assignedTo) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Simulate API call
    console.log('Scheduling maintenance:', form);
    
    toast({
      title: "Maintenance Scheduled",
      description: `Maintenance for ${assets.find(a => a.id === form.assetId)?.name} has been scheduled successfully.`,
    });

    // Reset form
    setForm({
      assetId: '',
      title: '',
      description: '',
      type: 'preventive',
      priority: 'medium',
      scheduledDate: '',
      estimatedHours: 2,
      assignedTo: '',
      template: '',
      notes: ''
    });
  };

  const selectedTemplate = maintenanceTemplates.find(t => t.id === form.template);

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
          <h1 className="text-3xl font-bold text-foreground">Schedule Maintenance</h1>
          <p className="text-muted-foreground">Plan and schedule maintenance activities for plant assets</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Maintenance Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Asset Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Asset *</label>
                    <Select value={form.assetId} onValueChange={(value) => setForm(prev => ({...prev, assetId: value}))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select asset" />
                      </SelectTrigger>
                      <SelectContent>
                        {assets.map((asset) => (
                          <SelectItem key={asset.id} value={asset.id}>
                            {asset.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Template</label>
                    <Select value={form.template} onValueChange={handleTemplateSelect}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select template (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        {maintenanceTemplates.map((template) => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Title and Description */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title *</label>
                  <Input
                    value={form.title}
                    onChange={(e) => setForm(prev => ({...prev, title: e.target.value}))}
                    placeholder="Maintenance task title"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={form.description}
                    onChange={(e) => setForm(prev => ({...prev, description: e.target.value}))}
                    placeholder="Detailed description of maintenance work"
                    rows={3}
                  />
                </div>

                {/* Type and Priority */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Maintenance Type</label>
                    <Select value={form.type} onValueChange={(value: any) => setForm(prev => ({...prev, type: value}))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="preventive">Preventive</SelectItem>
                        <SelectItem value="predictive">Predictive</SelectItem>
                        <SelectItem value="corrective">Corrective</SelectItem>
                        <SelectItem value="emergency">Emergency</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Priority</label>
                    <Select value={form.priority} onValueChange={(value: any) => setForm(prev => ({...prev, priority: value}))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Scheduling */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Scheduled Date *</label>
                    <Input
                      type="datetime-local"
                      value={form.scheduledDate}
                      onChange={(e) => setForm(prev => ({...prev, scheduledDate: e.target.value}))}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Estimated Hours</label>
                    <Input
                      type="number"
                      value={form.estimatedHours}
                      onChange={(e) => setForm(prev => ({...prev, estimatedHours: parseInt(e.target.value) || 0}))}
                      min="0.5"
                      step="0.5"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Assigned To *</label>
                    <Select value={form.assignedTo} onValueChange={(value) => setForm(prev => ({...prev, assignedTo: value}))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select technician" />
                      </SelectTrigger>
                      <SelectContent>
                        {technicians.map((tech) => (
                          <SelectItem key={tech.id} value={tech.id}>
                            {tech.name} ({tech.specialization})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Additional Notes</label>
                  <Textarea
                    value={form.notes}
                    onChange={(e) => setForm(prev => ({...prev, notes: e.target.value}))}
                    placeholder="Any additional instructions or notes"
                    rows={3}
                  />
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    Schedule Maintenance
                  </Button>
                  <Button type="button" variant="outline">
                    Save as Draft
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Template Preview */}
          {selectedTemplate && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Template Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold">{selectedTemplate.name}</h4>
                  <p className="text-sm text-muted-foreground">{selectedTemplate.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Duration:</span>
                    <div className="font-medium">{selectedTemplate.estimatedHours}h</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Priority:</span>
                    <Badge variant={selectedTemplate.priority === 'high' ? 'warning' : 'default'}>
                      {selectedTemplate.priority.toUpperCase()}
                    </Badge>
                  </div>
                </div>

                <div>
                  <span className="text-sm text-muted-foreground">Tasks:</span>
                  <ul className="mt-2 space-y-1 text-sm">
                    {selectedTemplate.tasks.map((task, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-success" />
                        {task}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <CreateTemplateDialog />
              
              <Link to="/calendar">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Eye className="w-4 h-4 mr-2" />
                  View Calendar
                </Button>
              </Link>
              
              <TechnicianScheduleDialog />
            </CardContent>
          </Card>

          {/* Recent Schedules */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Schedules</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <div className="font-medium">Bearing Replacement - A3</div>
                <div className="text-muted-foreground">Tomorrow, 9:00 AM</div>
              </div>
              <div className="text-sm">
                <div className="font-medium">Routine Inspection - A1</div>
                <div className="text-muted-foreground">Jan 30, 2:00 PM</div>
              </div>
              <div className="text-sm">
                <div className="font-medium">Sensor Calibration - A2</div>
                <div className="text-muted-foreground">Feb 1, 10:00 AM</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}