import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { 
  CheckSquare, 
  Square, 
  Trash2, 
  Edit, 
  Download, 
  Archive,
  AlertTriangle,
  CheckCircle,
  Users,
  FileText
} from 'lucide-react';
import { toast } from 'sonner';

interface BulkItem {
  id: string;
  type: 'incident' | 'workorder' | 'maintenance';
  title: string;
  status: string;
  priority?: string;
  assignedTo?: string;
}

interface BulkOperationsProps {
  items: BulkItem[];
  selectedItems: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  onBulkAction: (action: string, selectedIds: string[], data?: any) => void;
  className?: string;
}

export function BulkOperations({ 
  items, 
  selectedItems, 
  onSelectionChange, 
  onBulkAction,
  className 
}: BulkOperationsProps) {
  const [bulkAction, setBulkAction] = useState('');
  const [assignee, setAssignee] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSelectAll = () => {
    if (selectedItems.length === items.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(items.map(item => item.id));
    }
  };

  const handleItemSelect = (itemId: string) => {
    if (selectedItems.includes(itemId)) {
      onSelectionChange(selectedItems.filter(id => id !== itemId));
    } else {
      onSelectionChange([...selectedItems, itemId]);
    }
  };

  const handleBulkAction = (action: string) => {
    if (selectedItems.length === 0) {
      toast.error('Please select items first');
      return;
    }

    setBulkAction(action);
    
    if (action === 'delete' || action === 'archive') {
      // Immediate actions
      onBulkAction(action, selectedItems);
      onSelectionChange([]);
      toast.success(`${selectedItems.length} items ${action}d successfully`);
    } else {
      // Actions requiring additional data
      setIsDialogOpen(true);
    }
  };

  const handleConfirmAction = () => {
    const actionData: any = { notes };
    
    if (bulkAction === 'assign') {
      actionData.assignee = assignee;
    } else if (bulkAction === 'status') {
      actionData.status = newStatus;
    }

    onBulkAction(bulkAction, selectedItems, actionData);
    onSelectionChange([]);
    setIsDialogOpen(false);
    setNotes('');
    setAssignee('');
    setNewStatus('');
    toast.success(`${selectedItems.length} items updated successfully`);
  };

  const handleExportSelected = () => {
    if (selectedItems.length === 0) {
      toast.error('Please select items to export');
      return;
    }

    const selectedData = items.filter(item => selectedItems.includes(item.id));
    const exportData = {
      items: selectedData,
      exportedAt: new Date().toISOString(),
      count: selectedData.length,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bulk-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success(`${selectedItems.length} items exported successfully`);
  };

  const getActionTitle = () => {
    switch (bulkAction) {
      case 'assign': return 'Bulk Assignment';
      case 'status': return 'Bulk Status Update';
      case 'notes': return 'Add Bulk Notes';
      default: return 'Bulk Action';
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5" />
            Bulk Operations
            {selectedItems.length > 0 && (
              <Badge variant="secondary">
                {selectedItems.length} selected
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Selection Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="select-all"
              checked={selectedItems.length === items.length && items.length > 0}
              onCheckedChange={handleSelectAll}
            />
            <label htmlFor="select-all" className="text-sm font-medium">
              Select All ({items.length} items)
            </label>
          </div>
          
          {selectedItems.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSelectionChange([])}
            >
              Clear Selection
            </Button>
          )}
        </div>

        {/* Items List */}
        <div className="max-h-64 overflow-y-auto space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className={`flex items-center space-x-3 p-2 rounded-lg border ${
                selectedItems.includes(item.id) 
                  ? 'bg-primary/5 border-primary/20' 
                  : 'bg-muted/20'
              }`}
            >
              <Checkbox
                id={`item-${item.id}`}
                checked={selectedItems.includes(item.id)}
                onCheckedChange={() => handleItemSelect(item.id)}
              />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium truncate">{item.title}</span>
                  <Badge variant="outline" className="text-xs">
                    {item.type}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {item.status}
                  </Badge>
                  {item.assignedTo && (
                    <span className="text-xs text-muted-foreground">
                      Assigned to: {item.assignedTo}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bulk Actions */}
        <div className="border-t pt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkAction('assign')}
              disabled={selectedItems.length === 0}
            >
              <Users className="w-4 h-4 mr-1" />
              Assign
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkAction('status')}
              disabled={selectedItems.length === 0}
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              Status
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkAction('notes')}
              disabled={selectedItems.length === 0}
            >
              <FileText className="w-4 h-4 mr-1" />
              Notes
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportSelected}
              disabled={selectedItems.length === 0}
            >
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkAction('archive')}
              disabled={selectedItems.length === 0}
            >
              <Archive className="w-4 h-4 mr-1" />
              Archive
            </Button>
            
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleBulkAction('delete')}
              disabled={selectedItems.length === 0}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>

        {/* Bulk Action Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{getActionTitle()}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="bg-muted/30 p-3 rounded-lg">
                <p className="text-sm">
                  This action will affect <strong>{selectedItems.length}</strong> selected items.
                </p>
              </div>

              {bulkAction === 'assign' && (
                <div>
                  <label className="text-sm font-medium block mb-2">Assign To</label>
                  <Select value={assignee} onValueChange={setAssignee}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select technician" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="john-doe">John Doe</SelectItem>
                      <SelectItem value="jane-smith">Jane Smith</SelectItem>
                      <SelectItem value="mike-wilson">Mike Wilson</SelectItem>
                      <SelectItem value="sarah-connor">Sarah Connor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {bulkAction === 'status' && (
                <div>
                  <label className="text-sm font-medium block mb-2">New Status</label>
                  <Select value={newStatus} onValueChange={setNewStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="acknowledged">Acknowledged</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <label className="text-sm font-medium block mb-2">Notes (Optional)</label>
                <Textarea
                  placeholder="Add notes about this bulk action..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleConfirmAction} className="flex-1">
                  Confirm Action
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}