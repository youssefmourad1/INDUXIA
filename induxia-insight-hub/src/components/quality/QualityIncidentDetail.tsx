import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Camera, 
  Upload, 
  Download, 
  Printer,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Calendar,
  Target,
  FileText,
  Image,
  Zap,
  Activity,
  MessageSquare
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

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

interface QualityIncidentDetailProps {
  incident: QualityIncident;
  onClose: () => void;
  onUpdate: (incident: QualityIncident) => void;
}

function getSeverityColor(severity: 'minor' | 'major' | 'critical') {
  switch (severity) {
    case 'critical': return 'destructive';
    case 'major': return 'warning';
    case 'minor': return 'secondary';
    default: return 'secondary';
  }
}

function getStatusColor(status: 'active' | 'acknowledged' | 'resolved') {
  switch (status) {
    case 'active': return 'destructive';
    case 'acknowledged': return 'warning';
    case 'resolved': return 'success';
    default: return 'secondary';
  }
}

export function QualityIncidentDetail({ incident, onClose, onUpdate }: QualityIncidentDetailProps) {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [comments, setComments] = useState(incident.comments || []);
  const [newComment, setNewComment] = useState('');

  const form = useForm({
    defaultValues: {
      status: incident.status,
      assignedTo: incident.assignedTo || '',
      actionTaken: incident.actionTaken || '',
      resolution: incident.resolution || '',
    }
  });

  const handleImageUpload = async (files: File[]) => {
    setIsUploading(true);
    try {
      // Simulate upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSelectedImages(prev => [...prev, ...files]);
      toast.success(`${files.length} image(s) uploaded successfully`);
    } catch (error) {
      toast.error('Failed to upload images');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    const comment = {
      id: Date.now().toString(),
      user: 'Current User',
      message: newComment,
      timestamp: new Date().toISOString(),
    };
    
    setComments(prev => [...prev, comment]);
    setNewComment('');
    toast.success('Comment added');
  };

  const handleStatusUpdate = (values: any) => {
    const updatedIncident = { ...incident, ...values };
    onUpdate(updatedIncident);
    toast.success('Incident updated successfully');
  };

  const handleExport = () => {
    // Create export data
    const exportData = {
      incident,
      images: selectedImages.map(f => f.name),
      comments,
      exportedAt: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quality-incident-${incident.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Incident data exported');
  };

  const handlePrint = () => {
    window.print();
    toast.success('Print dialog opened');
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-warning" />
            Quality Incident Details - {incident.id}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Detected</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(incident.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Confidence</div>
                    <div className="text-xs text-muted-foreground">{incident.confidence}%</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Line</div>
                    <div className="text-xs text-muted-foreground">{incident.lineName}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Badge variant={getSeverityColor(incident.severity) as any}>
                      {incident.severity.toUpperCase()}
                    </Badge>
                    <Badge variant={getStatusColor(incident.status) as any} className="ml-2">
                      {incident.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button onClick={handleExport} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button onClick={handlePrint} variant="outline" size="sm">
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Images and Analysis */}
            <div className="space-y-6">
              {/* Image Upload Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Image className="w-5 h-5" />
                    Product Images
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Upload Area */}
                  <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Drag and drop images or click to upload
                    </p>
                    <Input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        if (files.length > 0) {
                          handleImageUpload(files);
                        }
                      }}
                      className="hidden"
                      id="image-upload"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isUploading}
                      onClick={() => document.getElementById('image-upload')?.click()}
                    >
                      {isUploading ? 'Uploading...' : 'Select Images'}
                    </Button>
                  </div>

                  {/* Uploaded Images */}
                  {selectedImages.length > 0 && (
                    <div className="grid grid-cols-2 gap-2">
                      {selectedImages.map((file, index) => (
                        <div key={index} className="relative">
                          <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                            <Image className="w-8 h-8 text-muted-foreground" />
                          </div>
                          <p className="text-xs text-center mt-1 truncate">{file.name}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* AI Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    AI Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="bg-muted/30 p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-warning rounded-full"></div>
                        <span className="font-medium text-sm">Defect Type</span>
                      </div>
                      <p className="text-sm">{incident.defectType}</p>
                    </div>
                    
                    <div className="bg-muted/30 p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span className="font-medium text-sm">Detection Confidence</span>
                      </div>
                      <p className="text-sm">{incident.confidence}% - High confidence detection</p>
                    </div>

                    <div className="bg-muted/30 p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-success rounded-full"></div>
                        <span className="font-medium text-sm">Recommended Actions</span>
                      </div>
                      <ul className="text-sm space-y-1">
                        <li>• Inspect upstream process parameters</li>
                        <li>• Check tooling condition</li>
                        <li>• Review material batch quality</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Details and Actions */}
            <div className="space-y-6">
              {/* Status Update Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Incident Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleStatusUpdate)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="acknowledged">Acknowledged</SelectItem>
                                <SelectItem value="resolved">Resolved</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="assignedTo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Assigned To</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select technician" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="john-doe">John Doe</SelectItem>
                                <SelectItem value="jane-smith">Jane Smith</SelectItem>
                                <SelectItem value="mike-wilson">Mike Wilson</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="actionTaken"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Action Taken</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Describe actions taken to address this incident..."
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      {form.watch('status') === 'resolved' && (
                        <FormField
                          control={form.control}
                          name="resolution"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Resolution Details</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Provide detailed resolution information..."
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      )}

                      <Button type="submit" className="w-full">
                        Update Incident
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>

              {/* Comments Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Comments & Notes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Existing Comments */}
                  <div className="space-y-3 max-h-32 overflow-y-auto">
                    {comments.map((comment) => (
                      <div key={comment.id} className="bg-muted/30 p-3 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <User className="w-3 h-3" />
                          <span className="text-xs font-medium">{comment.user}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(comment.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm">{comment.message}</p>
                      </div>
                    ))}
                  </div>

                  {/* Add Comment */}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                    />
                    <Button onClick={handleAddComment} size="sm">
                      Add
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
