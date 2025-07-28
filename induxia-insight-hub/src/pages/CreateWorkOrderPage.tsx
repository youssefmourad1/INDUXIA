import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ClipboardList,
  ArrowLeft,
  Calendar as CalendarIcon,
  User,
  Wrench,
  Clock,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  Bot,
  Save,
  Send,
  Building,
  Zap,
  Target
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

// Mock data for dropdowns
const mockAssets = [
  { id: 'A1', name: 'Mixer Unit 1', type: 'Mixer', location: 'Production Line 1' },
  { id: 'A2', name: 'Press Line 2', type: 'Press', location: 'Production Line 2' },
  { id: 'A3', name: 'Conveyor Belt 3', type: 'Conveyor', location: 'Transport System' },
  { id: 'A4', name: 'Quality Control Station', type: 'QC Equipment', location: 'Quality Lab' },
  { id: 'A5', name: 'Packaging Unit', type: 'Packaging', location: 'Final Assembly' },
  { id: 'A6', name: 'Heat Exchanger', type: 'HVAC', location: 'Utility Room' },
  { id: 'A7', name: 'Air Compressor', type: 'Pneumatic', location: 'Utility Room' },
  { id: 'A8', name: 'Water Pump System', type: 'Hydraulic', location: 'Pump House' },
];

const mockTechnicians = [
  { id: 'T1', name: 'Marcus Rodriguez', specialization: 'Mechanical', availability: 'available' },
  { id: 'T2', name: 'Sarah Kim', specialization: 'Electrical', availability: 'busy' },
  { id: 'T3', name: 'James Wilson', specialization: 'Hydraulics', availability: 'available' },
  { id: 'T4', name: 'Mike Chen', specialization: 'Controls', availability: 'available' },
  { id: 'T5', name: 'Lisa Park', specialization: 'Mechanical', availability: 'busy' },
  { id: 'T6', name: 'David Thompson', specialization: 'Electrical', availability: 'available' },
];

const workOrderTemplates = [
  {
    id: 'bearing_replacement',
    title: 'Bearing Replacement',
    description: 'Replace worn bearing in rotating equipment',
    estimatedHours: 4,
    priority: 'high',
    requiredSkills: ['Mechanical']
  },
  {
    id: 'sensor_calibration',
    title: 'Sensor Calibration',
    description: 'Calibrate temperature/pressure sensors',
    estimatedHours: 2,
    priority: 'medium',
    requiredSkills: ['Electrical', 'Controls']
  },
  {
    id: 'lubrication_service',
    title: 'Lubrication Service',
    description: 'Routine lubrication of moving parts',
    estimatedHours: 1,
    priority: 'low',
    requiredSkills: ['Mechanical']
  },
  {
    id: 'preventive_inspection',
    title: 'Preventive Inspection',
    description: 'Comprehensive equipment inspection',
    estimatedHours: 3,
    priority: 'medium',
    requiredSkills: ['Mechanical', 'Electrical']
  },
];

// AI-powered suggestions based on asset and issue type
const getAISuggestions = (selectedAsset: string, issueDescription: string) => {
  const suggestions = [];
  
  if (issueDescription.toLowerCase().includes('noise') || issueDescription.toLowerCase().includes('vibration')) {
    suggestions.push({
      type: 'root_cause',
      title: 'Potential Root Causes',
      items: ['Bearing wear', 'Misalignment', 'Imbalance', 'Loose mounting bolts']
    });
    suggestions.push({
      type: 'recommended_actions',
      title: 'Recommended Actions',
      items: ['Vibration analysis', 'Visual inspection', 'Torque check', 'Bearing replacement']
    });
  }
  
  if (issueDescription.toLowerCase().includes('temperature') || issueDescription.toLowerCase().includes('hot')) {
    suggestions.push({
      type: 'urgency',
      title: 'AI Assessment',
      items: ['High priority - thermal issues can cause rapid degradation', 'Recommend immediate inspection']
    });
  }
  
  if (selectedAsset && mockAssets.find(a => a.id === selectedAsset)?.type === 'Electrical') {
    suggestions.push({
      type: 'safety',
      title: 'Safety Considerations',
      items: ['Lockout/Tagout required', 'Qualified electrician needed', 'PPE requirements']
    });
  }
  
  return suggestions;
};

type WorkOrderPriority = 'critical' | 'high' | 'medium' | 'low';
type WorkOrderSource = 'manual' | 'ai_generated' | 'scheduled' | 'inspection';

interface CreateWorkOrderForm {
  title: string;
  description: string;
  assetId: string;
  priority: WorkOrderPriority;
  assignedTo: string;
  dueDate: Date | undefined;
  estimatedHours: number;
  source: WorkOrderSource;
  requestedBy: string;
  category: string;
  tags: string[];
}

export default function CreateWorkOrderPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [form, setForm] = useState<CreateWorkOrderForm>({
    title: '',
    description: '',
    assetId: '',
    priority: 'medium',
    assignedTo: '',
    dueDate: undefined,
    estimatedHours: 2,
    source: 'manual',
    requestedBy: user?.name || '',
    category: 'maintenance',
    tags: []
  });

  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update AI suggestions when asset or description changes
  React.useEffect(() => {
    if (form.assetId && form.description) {
      const suggestions = getAISuggestions(form.assetId, form.description);
      setAiSuggestions(suggestions);
    } else {
      setAiSuggestions([]);
    }
  }, [form.assetId, form.description]);

  const handleTemplateSelect = (templateId: string) => {
    const template = workOrderTemplates.find(t => t.id === templateId);
    if (template) {
      setForm(prev => ({
        ...prev,
        title: template.title,
        description: template.description,
        estimatedHours: template.estimatedHours,
        priority: template.priority as WorkOrderPriority
      }));
      setSelectedTemplate(templateId);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.title.trim()) newErrors.title = 'Title is required';
    if (!form.description.trim()) newErrors.description = 'Description is required';
    if (!form.assetId) newErrors.assetId = 'Asset selection is required';
    if (!form.assignedTo) newErrors.assignedTo = 'Technician assignment is required';
    if (!form.dueDate) newErrors.dueDate = 'Due date is required';
    if (form.estimatedHours < 0.5) newErrors.estimatedHours = 'Estimated hours must be at least 0.5';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (isDraft: boolean = false) => {
    if (!isDraft && !validateForm()) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate work order ID
    const workOrderId = `WO-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`;
    
    console.log('Creating work order:', {
      ...form,
      id: workOrderId,
      status: isDraft ? 'draft' : 'open',
      createdDate: new Date().toISOString(),
      completionPercentage: 0
    });

    setIsSubmitting(false);
    navigate('/work-orders');
  };

  const selectedAsset = mockAssets.find(a => a.id === form.assetId);
  const selectedTechnician = mockTechnicians.find(t => t.id === form.assignedTo);
  const availableTechnicians = mockTechnicians.filter(t => t.availability === 'available');

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-green-600/10 border-b border-border/50">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/work-orders')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Work Orders
            </Button>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                Create Work Order
                <span className="block text-xl md:text-2xl font-medium text-muted-foreground mt-1">
                  AI-Assisted Work Order Creation
                </span>
              </h1>
              <p className="text-muted-foreground text-lg">
                Create detailed work orders with intelligent suggestions and automated assignments
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Templates */}
            <Card className="bg-card/50 backdrop-blur-sm border border-border/50 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  Quick Templates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {workOrderTemplates.map((template) => (
                    <Button
                      key={template.id}
                      variant={selectedTemplate === template.id ? "default" : "outline"}
                      className="justify-start h-auto p-4"
                      onClick={() => handleTemplateSelect(template.id)}
                    >
                      <div className="text-left">
                        <div className="font-medium">{template.title}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {template.estimatedHours}h • {template.priority}
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Basic Information */}
            <Card className="bg-card/50 backdrop-blur-sm border border-border/50 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-primary" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Work Order Title *</Label>
                    <Input
                      id="title"
                      placeholder="Enter work order title"
                      value={form.title}
                      onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                      className={errors.title ? "border-destructive" : ""}
                    />
                    {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={form.category} onValueChange={(value) => setForm(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="maintenance">Preventive Maintenance</SelectItem>
                        <SelectItem value="repair">Corrective Repair</SelectItem>
                        <SelectItem value="inspection">Inspection</SelectItem>
                        <SelectItem value="emergency">Emergency</SelectItem>
                        <SelectItem value="upgrade">Upgrade/Modification</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the issue or work required in detail..."
                    rows={4}
                    value={form.description}
                    onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                    className={errors.description ? "border-destructive" : ""}
                  />
                  {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
                </div>
              </CardContent>
            </Card>

            {/* Asset and Assignment */}
            <Card className="bg-card/50 backdrop-blur-sm border border-border/50 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-primary" />
                  Asset & Assignment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="asset">Asset *</Label>
                    <Select value={form.assetId} onValueChange={(value) => setForm(prev => ({ ...prev, assetId: value }))}>
                      <SelectTrigger className={errors.assetId ? "border-destructive" : ""}>
                        <SelectValue placeholder="Select asset" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockAssets.map((asset) => (
                          <SelectItem key={asset.id} value={asset.id}>
                            <div className="flex items-center gap-2">
                              <Wrench className="w-4 h-4" />
                              <div>
                                <div className="font-medium">{asset.name}</div>
                                <div className="text-xs text-muted-foreground">{asset.location}</div>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.assetId && <p className="text-xs text-destructive">{errors.assetId}</p>}
                    {selectedAsset && (
                      <div className="p-2 bg-muted/50 rounded text-sm">
                        <div className="font-medium">{selectedAsset.name}</div>
                        <div className="text-muted-foreground">{selectedAsset.type} • {selectedAsset.location}</div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="technician">Assigned Technician *</Label>
                    <Select value={form.assignedTo} onValueChange={(value) => setForm(prev => ({ ...prev, assignedTo: value }))}>
                      <SelectTrigger className={errors.assignedTo ? "border-destructive" : ""}>
                        <SelectValue placeholder="Select technician" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockTechnicians.map((tech) => (
                          <SelectItem key={tech.id} value={tech.id} disabled={tech.availability === 'busy'}>
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4" />
                              <div>
                                <div className="font-medium">{tech.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {tech.specialization} • {tech.availability}
                                </div>
                              </div>
                              {tech.availability === 'available' && (
                                <CheckCircle className="w-3 h-3 text-green-500" />
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.assignedTo && <p className="text-xs text-destructive">{errors.assignedTo}</p>}
                    {selectedTechnician && (
                      <div className="p-2 bg-muted/50 rounded text-sm">
                        <div className="font-medium">{selectedTechnician.name}</div>
                        <div className="text-muted-foreground">
                          {selectedTechnician.specialization} • 
                          <span className={selectedTechnician.availability === 'available' ? 'text-green-600' : 'text-red-600'}>
                            {selectedTechnician.availability}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Priority and Scheduling */}
            <Card className="bg-card/50 backdrop-blur-sm border border-border/50 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Priority & Scheduling
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={form.priority} onValueChange={(value: WorkOrderPriority) => setForm(prev => ({ ...prev, priority: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="critical">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                            Critical
                          </div>
                        </SelectItem>
                        <SelectItem value="high">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-orange-500" />
                            High
                          </div>
                        </SelectItem>
                        <SelectItem value="medium">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-blue-500" />
                            Medium
                          </div>
                        </SelectItem>
                        <SelectItem value="low">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-500" />
                            Low
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date *</Label>
                    <Popover open={showCalendar} onOpenChange={setShowCalendar}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !form.dueDate && "text-muted-foreground",
                            errors.dueDate && "border-destructive"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {form.dueDate ? format(form.dueDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={form.dueDate}
                          onSelect={(date) => {
                            setForm(prev => ({ ...prev, dueDate: date }));
                            setShowCalendar(false);
                          }}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {errors.dueDate && <p className="text-xs text-destructive">{errors.dueDate}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="estimatedHours">Estimated Hours *</Label>
                    <Input
                      id="estimatedHours"
                      type="number"
                      step="0.5"
                      min="0.5"
                      value={form.estimatedHours}
                      onChange={(e) => setForm(prev => ({ ...prev, estimatedHours: parseFloat(e.target.value) || 0 }))}
                      className={errors.estimatedHours ? "border-destructive" : ""}
                    />
                    {errors.estimatedHours && <p className="text-xs text-destructive">{errors.estimatedHours}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requestedBy">Requested By</Label>
                  <Input
                    id="requestedBy"
                    value={form.requestedBy}
                    onChange={(e) => setForm(prev => ({ ...prev, requestedBy: e.target.value }))}
                    placeholder="Enter requester name"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Submit Actions */}
            <Card className="bg-card/50 backdrop-blur-sm border border-border/50 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    onClick={() => handleSubmit(false)}
                    disabled={isSubmitting}
                    className="flex-1 flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Create Work Order
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={() => handleSubmit(true)}
                    disabled={isSubmitting}
                    className="flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save as Draft
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={() => navigate('/work-orders')}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - AI Suggestions and Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* AI Suggestions */}
            {aiSuggestions.length > 0 && (
              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
                    <Bot className="w-5 h-5" />
                    AI Insights & Suggestions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {aiSuggestions.map((suggestion, index) => (
                    <div key={index} className="space-y-2">
                      <h4 className="font-medium text-purple-700 dark:text-purple-300">
                        {suggestion.title}
                      </h4>
                      <ul className="space-y-1">
                        {suggestion.items.map((item: string, itemIndex: number) => (
                          <li key={itemIndex} className="text-sm text-purple-600 dark:text-purple-400 flex items-start gap-2">
                            <Zap className="w-3 h-3 mt-0.5 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Available Technicians */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-green-500" />
                  Available Technicians
                  <Badge variant="outline">{availableTechnicians.length} Available</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {availableTechnicians.map((tech) => (
                  <div key={tech.id} className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <div className="font-medium text-sm">{tech.name}</div>
                      <div className="text-xs text-muted-foreground">{tech.specialization}</div>
                    </div>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                ))}
                {availableTechnicians.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No technicians currently available
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  Pro Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>• Be specific in descriptions for better AI suggestions</p>
                <p>• Include safety considerations for critical work</p>
                <p>• Use templates to maintain consistency</p>
                <p>• Consider technician specialization when assigning</p>
                <p>• Set realistic time estimates for better planning</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}