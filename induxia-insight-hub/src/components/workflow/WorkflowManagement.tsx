import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  ArrowRight, 
  User, 
  MessageSquare,
  Bell,
  FileText,
  RefreshCw,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';

interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  assignee?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  dueDate?: string;
  completedAt?: string;
  comments?: string;
  requiredApprovals?: string[];
  attachments?: string[];
}

interface Workflow {
  id: string;
  type: 'work_order_approval' | 'quality_escalation' | 'maintenance_completion';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'completed' | 'cancelled';
  createdAt: string;
  initiator: string;
  currentStep: number;
  steps: WorkflowStep[];
  estimatedCompletion?: string;
}

const mockWorkflows: Workflow[] = [
  {
    id: 'WF-001',
    type: 'work_order_approval',
    title: 'Emergency Repair - Conveyor Belt 3',
    description: 'Critical bearing replacement requiring approval and resource allocation',
    priority: 'critical',
    status: 'active',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    initiator: 'John Doe',
    currentStep: 1,
    estimatedCompletion: new Date(Date.now() + 7200000).toISOString(),
    steps: [
      {
        id: 'step1',
        name: 'Safety Assessment',
        description: 'Review safety protocols and risk assessment',
        assignee: 'Safety Officer',
        status: 'completed',
        completedAt: new Date(Date.now() - 1800000).toISOString(),
        comments: 'Safety protocols reviewed and approved'
      },
      {
        id: 'step2',
        name: 'Supervisor Approval',
        description: 'Production supervisor approval for downtime',
        assignee: 'Sarah Connor',
        status: 'in_progress',
        dueDate: new Date(Date.now() + 3600000).toISOString(),
        requiredApprovals: ['Production Manager']
      },
      {
        id: 'step3',
        name: 'Resource Allocation',
        description: 'Assign technicians and allocate spare parts',
        status: 'pending',
        dueDate: new Date(Date.now() + 7200000).toISOString()
      },
      {
        id: 'step4',
        name: 'Execution',
        description: 'Perform the maintenance work',
        status: 'pending'
      }
    ]
  },
  {
    id: 'WF-002',
    type: 'quality_escalation',
    title: 'Quality Alert - Surface Defects Line 2',
    description: 'Escalation process for recurring quality issues',
    priority: 'high',
    status: 'active',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    initiator: 'Quality AI System',
    currentStep: 2,
    steps: [
      {
        id: 'step1',
        name: 'Initial Assessment',
        description: 'Quality engineer reviews the defect pattern',
        assignee: 'Mike Wilson',
        status: 'completed',
        completedAt: new Date(Date.now() - 5400000).toISOString()
      },
      {
        id: 'step2',
        name: 'Root Cause Analysis',
        description: 'Investigate underlying causes',
        assignee: 'Quality Team',
        status: 'in_progress',
        dueDate: new Date(Date.now() + 3600000).toISOString()
      },
      {
        id: 'step3',
        name: 'Corrective Action Plan',
        description: 'Develop and approve corrective measures',
        status: 'pending'
      }
    ]
  }
];

interface WorkflowManagementProps {
  className?: string;
}

export function WorkflowManagement({ className }: WorkflowManagementProps) {
  const [workflows, setWorkflows] = useState<Workflow[]>(mockWorkflows);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [newComment, setNewComment] = useState('');
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'comment'>('comment');

  // Simulate workflow updates
  useEffect(() => {
    const interval = setInterval(() => {
      setWorkflows(prev => prev.map(workflow => {
        // Random workflow progression
        if (Math.random() > 0.9 && workflow.status === 'active') {
          const updatedSteps = [...workflow.steps];
          const currentStepIndex = workflow.currentStep;
          
          if (currentStepIndex < updatedSteps.length) {
            // Progress current step
            if (updatedSteps[currentStepIndex].status === 'in_progress' && Math.random() > 0.7) {
              updatedSteps[currentStepIndex] = {
                ...updatedSteps[currentStepIndex],
                status: 'completed',
                completedAt: new Date().toISOString()
              };
              
              // Start next step
              if (currentStepIndex + 1 < updatedSteps.length) {
                updatedSteps[currentStepIndex + 1] = {
                  ...updatedSteps[currentStepIndex + 1],
                  status: 'in_progress'
                };
              }
              
              toast.success(`Workflow step completed: ${updatedSteps[currentStepIndex].name}`, {
                description: workflow.title
              });
              
              return {
                ...workflow,
                steps: updatedSteps,
                currentStep: Math.min(currentStepIndex + 1, updatedSteps.length - 1),
                status: currentStepIndex + 1 >= updatedSteps.length ? 'completed' : 'active'
              };
            }
          }
        }
        
        return workflow;
      }));
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const handleStepAction = (workflowId: string, stepId: string, action: 'approve' | 'reject' | 'comment') => {
    const comment = newComment.trim();
    if (action !== 'comment' && !comment) {
      toast.error('Please add a comment for this action');
      return;
    }

    setWorkflows(prev => prev.map(workflow => {
      if (workflow.id !== workflowId) return workflow;
      
      const updatedSteps = workflow.steps.map(step => {
        if (step.id !== stepId) return step;
        
        switch (action) {
          case 'approve':
            toast.success(`Step approved: ${step.name}`);
            return {
              ...step,
              status: 'completed' as const,
              completedAt: new Date().toISOString(),
              comments: comment
            };
          case 'reject':
            toast.error(`Step rejected: ${step.name}`);
            return {
              ...step,
              status: 'rejected' as const,
              comments: comment
            };
          case 'comment':
            toast.success('Comment added');
            return {
              ...step,
              comments: step.comments ? `${step.comments}\n\n${comment}` : comment
            };
          default:
            return step;
        }
      });
      
      return { ...workflow, steps: updatedSteps };
    }));
    
    setNewComment('');
  };

  const getStepIcon = (status: WorkflowStep['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-success" />;
      case 'in_progress': return <Clock className="w-4 h-4 text-warning animate-pulse" />;
      case 'rejected': return <AlertTriangle className="w-4 h-4 text-destructive" />;
      default: return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getWorkflowIcon = (type: string) => {
    switch (type) {
      case 'work_order_approval': return <FileText className="w-4 h-4" />;
      case 'quality_escalation': return <AlertTriangle className="w-4 h-4" />;
      case 'maintenance_completion': return <RefreshCw className="w-4 h-4" />;
      default: return <Zap className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'destructive';
      case 'high': return 'warning';
      case 'medium': return 'default';
      default: return 'secondary';
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5" />
          Workflow Management
          <Badge variant="outline">
            {workflows.filter(w => w.status === 'active').length} Active
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Active Workflows */}
        <div className="space-y-4">
          {workflows.map((workflow) => (
            <Card key={workflow.id} className="border-l-4 border-l-primary">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getWorkflowIcon(workflow.type)}
                      <CardTitle className="text-lg">{workflow.title}</CardTitle>
                      <Badge variant={getPriorityColor(workflow.priority) as any}>
                        {workflow.priority.toUpperCase()}
                      </Badge>
                      <Badge variant={workflow.status === 'active' ? 'default' : 'success'}>
                        {workflow.status.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{workflow.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span>Initiated by: {workflow.initiator}</span>
                      <span>Created: {new Date(workflow.createdAt).toLocaleString()}</span>
                      {workflow.estimatedCompletion && (
                        <span>ETA: {new Date(workflow.estimatedCompletion).toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setSelectedWorkflow(workflow)}>
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          {getWorkflowIcon(workflow.type)}
                          {workflow.title}
                        </DialogTitle>
                      </DialogHeader>

                      <div className="space-y-6">
                        {/* Workflow Progress */}
                        <div className="space-y-4">
                          <h3 className="font-semibold">Workflow Progress</h3>
                          <div className="space-y-3">
                            {workflow.steps.map((step, index) => (
                              <div key={step.id} className="flex items-start gap-3">
                                <div className="flex flex-col items-center">
                                  {getStepIcon(step.status)}
                                  {index < workflow.steps.length - 1 && (
                                    <div className="w-px h-8 bg-border mt-2" />
                                  )}
                                </div>
                                
                                <div className="flex-1 space-y-2">
                                  <div className="flex items-center justify-between">
                                    <h4 className="font-medium">{step.name}</h4>
                                    <Badge variant={
                                      step.status === 'completed' ? 'success' :
                                      step.status === 'in_progress' ? 'warning' :
                                      step.status === 'rejected' ? 'destructive' : 'secondary'
                                    }>
                                      {step.status.replace('_', ' ').toUpperCase()}
                                    </Badge>
                                  </div>
                                  
                                  <p className="text-sm text-muted-foreground">{step.description}</p>
                                  
                                  {step.assignee && (
                                    <div className="flex items-center gap-2 text-sm">
                                      <User className="w-3 h-3" />
                                      <span>Assigned to: {step.assignee}</span>
                                    </div>
                                  )}
                                  
                                  {step.dueDate && (
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                      <Clock className="w-3 h-3" />
                                      <span>Due: {new Date(step.dueDate).toLocaleString()}</span>
                                    </div>
                                  )}
                                  
                                  {step.comments && (
                                    <div className="bg-muted/30 p-2 rounded text-sm">
                                      <div className="flex items-center gap-1 mb-1">
                                        <MessageSquare className="w-3 h-3" />
                                        <span className="font-medium">Comments:</span>
                                      </div>
                                      <p>{step.comments}</p>
                                    </div>
                                  )}
                                  
                                  {/* Step Actions */}
                                  {step.status === 'in_progress' && (
                                    <div className="space-y-2 pt-2 border-t">
                                      <div className="flex gap-2">
                                        <Select value={actionType} onValueChange={(value: any) => setActionType(value)}>
                                          <SelectTrigger className="w-32">
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="approve">Approve</SelectItem>
                                            <SelectItem value="reject">Reject</SelectItem>
                                            <SelectItem value="comment">Comment</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      
                                      <Textarea
                                        placeholder="Add your comment..."
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        className="min-h-[60px]"
                                      />
                                      
                                      <Button 
                                        size="sm"
                                        onClick={() => handleStepAction(workflow.id, step.id, actionType)}
                                      >
                                        {actionType === 'approve' ? 'Approve Step' : 
                                         actionType === 'reject' ? 'Reject Step' : 'Add Comment'}
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Automated Notifications */}
                        <div className="space-y-3">
                          <h3 className="font-semibold">Automated Notifications & Reminders</h3>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm bg-primary/10 p-2 rounded">
                              <Bell className="w-4 h-4 text-primary" />
                              <span>Reminder sent to {workflow.steps[workflow.currentStep]?.assignee} - Step due in 2 hours</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm bg-success/10 p-2 rounded">
                              <CheckCircle className="w-4 h-4 text-success" />
                              <span>Step completion notification sent to workflow initiator</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm bg-warning/10 p-2 rounded">
                              <AlertTriangle className="w-4 h-4 text-warning" />
                              <span>Escalation trigger: If not completed in 4 hours, notify manager</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>

              <CardContent>
                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{workflow.currentStep + 1} of {workflow.steps.length} steps</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-500"
                      style={{ width: `${((workflow.currentStep + 1) / workflow.steps.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Current Step */}
                <div className="mt-4 p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">Current Step:</span>
                    {getStepIcon(workflow.steps[workflow.currentStep]?.status)}
                    <span className="text-sm">{workflow.steps[workflow.currentStep]?.name}</span>
                  </div>
                  {workflow.steps[workflow.currentStep]?.assignee && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="w-3 h-3" />
                      <span>Assigned to: {workflow.steps[workflow.currentStep].assignee}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {workflows.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Zap className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No active workflows</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}