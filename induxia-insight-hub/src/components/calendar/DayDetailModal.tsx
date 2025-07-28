import React from 'react';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  User, 
  Wrench, 
  Calendar as CalendarIcon,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  Settings,
  X
} from 'lucide-react';
import { MaintenanceEvent } from './MaintenanceCalendar';
import { cn } from '@/lib/utils';

interface DayDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDay: Date | null;
  events: MaintenanceEvent[];
  onEventClick?: (event: MaintenanceEvent) => void;
}

// Generate detailed hourly schedule for the selected day
const generateHourlySchedule = (day: Date, events: MaintenanceEvent[]) => {
  const hours = Array.from({ length: 24 }, (_, i) => {
    const hour = i;
    const hourEvents = events.filter(event => {
      const eventStart = new Date(event.startTime);
      const eventEnd = new Date(event.endTime);
      const hourTime = new Date(day);
      hourTime.setHours(hour, 0, 0, 0);
      const hourEndTime = new Date(day);
      hourEndTime.setHours(hour + 1, 0, 0, 0);
      
      return (eventStart < hourEndTime && eventEnd > hourTime);
    });
    
    return {
      hour,
      events: hourEvents,
      isEmpty: hourEvents.length === 0,
      isBusinessHours: hour >= 6 && hour < 18
    };
  });
  
  return hours;
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'critical': return 'bg-red-500 text-white';
    case 'high': return 'bg-orange-500 text-white';
    case 'medium': return 'bg-blue-500 text-white';
    case 'low': return 'bg-gray-500 text-white';
    default: return 'bg-gray-400 text-white';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed': return <CheckCircle2 className="w-4 h-4 text-green-600" />;
    case 'in_progress': return <Settings className="w-4 h-4 text-blue-600 animate-spin" />;
    case 'scheduled': return <Clock className="w-4 h-4 text-orange-600" />;
    case 'cancelled': return <X className="w-4 h-4 text-red-600" />;
    default: return <Clock className="w-4 h-4 text-gray-600" />;
  }
};

export function DayDetailModal({ 
  isOpen, 
  onClose, 
  selectedDay, 
  events, 
  onEventClick 
}: DayDetailModalProps) {
  if (!selectedDay) return null;

  const hourlySchedule = generateHourlySchedule(selectedDay, events);
  const totalEvents = events.length;
  const criticalEvents = events.filter(e => e.priority === 'critical').length;
  const completedEvents = events.filter(e => e.status === 'completed').length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <CalendarIcon className="w-6 h-6 text-primary" />
            {format(selectedDay, 'EEEE, MMMM d, yyyy')}
          </DialogTitle>
        </DialogHeader>

        {/* Day Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">{totalEvents}</div>
                  <div className="text-sm text-blue-600 dark:text-blue-400">Total Events</div>
                </div>
                <Wrench className="w-8 h-8 text-blue-600 dark:text-blue-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-red-700 dark:text-red-300">{criticalEvents}</div>
                  <div className="text-sm text-red-600 dark:text-red-400">Critical Priority</div>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-green-700 dark:text-green-300">{completedEvents}</div>
                  <div className="text-sm text-green-600 dark:text-green-400">Completed</div>
                </div>
                <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-300" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Hourly Timeline */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Hourly Schedule
          </h3>
          
          <div className="grid grid-cols-1 gap-2 max-h-96 overflow-y-auto">
            {hourlySchedule.map(({ hour, events: hourEvents, isEmpty, isBusinessHours }) => (
              <div 
                key={hour}
                className={cn(
                  "flex items-center gap-4 p-3 rounded-lg border transition-colors",
                  isEmpty 
                    ? "bg-muted/30 border-muted/50" 
                    : "bg-card border-border hover:bg-muted/50",
                  !isBusinessHours && isEmpty && "opacity-50"
                )}
              >
                <div className="flex-shrink-0 w-16 text-center">
                  <div className={cn(
                    "text-sm font-medium",
                    isEmpty ? "text-muted-foreground" : "text-foreground"
                  )}>
                    {format(new Date().setHours(hour, 0, 0, 0), 'HH:mm')}
                  </div>
                </div>
                
                <div className="flex-1">
                  {isEmpty ? (
                    <div className="text-sm text-muted-foreground italic">
                      {isBusinessHours ? "No scheduled maintenance" : "Off hours"}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {hourEvents.map((event) => (
                        <div 
                          key={event.id}
                          onClick={() => onEventClick?.(event)}
                          className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex-shrink-0">
                            {getStatusIcon(event.status)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="font-medium truncate">{event.title}</div>
                              <Badge 
                                className={cn("text-xs", getPriorityColor(event.priority))}
                              >
                                {event.priority.toUpperCase()}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                <span>{event.assetName}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                <span>{event.technician}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>
                                  {format(new Date(event.startTime), 'HH:mm')} - 
                                  {format(new Date(event.endTime), 'HH:mm')}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button>
            View Full Calendar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}