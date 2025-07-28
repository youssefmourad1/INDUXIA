import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, isSameMonth } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight,
  Clock,
  User,
  Wrench,
  AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MaintenanceEvent {
  id: string;
  title: string;
  assetName: string;
  type: 'preventive' | 'predictive' | 'corrective' | 'emergency';
  priority: 'low' | 'medium' | 'high' | 'critical';
  technician: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
}

// Enhanced mock maintenance events with current dates
const generateMockEvents = () => {
  const events: MaintenanceEvent[] = [];
  const today = new Date();
  
  for (let i = 0; i < 15; i++) {
    const eventDate = new Date(today.getTime() + (i * 24 * 60 * 60 * 1000));
    events.push({
      id: `MAINT-${String(i + 1).padStart(3, '0')}`,
      title: ['Bearing Replacement', 'Routine Inspection', 'Sensor Calibration', 'Lubrication Service', 'System Check'][i % 5],
      assetName: ['Conveyor Belt 3', 'Mixer Unit 1', 'Press Line 2', 'Quality Station', 'Pump System'][i % 5],
      type: ['preventive', 'predictive', 'corrective', 'emergency'][i % 4] as any,
      priority: ['low', 'medium', 'high', 'critical'][i % 4] as any,
      technician: ['Marcus Rodriguez', 'Sarah Kim', 'James Wilson', 'Mike Chen'][i % 4],
      startTime: new Date(eventDate.setHours(8 + (i % 8))).toISOString(),
      endTime: new Date(eventDate.setHours(10 + (i % 6))).toISOString(),
      status: ['scheduled', 'in_progress', 'completed'][i % 3] as any
    });
  }
  return events;
};

const mockMaintenanceEvents: MaintenanceEvent[] = generateMockEvents();

interface MaintenanceCalendarProps {
  events?: MaintenanceEvent[];
  onEventClick?: (event: MaintenanceEvent) => void;
  onDayClick?: (day: Date, events: MaintenanceEvent[]) => void;
  compact?: boolean;
}

export function MaintenanceCalendar({ 
  events = mockMaintenanceEvents, 
  onEventClick,
  onDayClick,
  compact = false 
}: MaintenanceCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getEventsForDay = (day: Date) => {
    return events.filter(event => 
      isSameDay(new Date(event.startTime), day)
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-destructive';
      case 'high': return 'bg-warning';
      case 'medium': return 'bg-primary';
      case 'low': return 'bg-secondary';
      default: return 'bg-muted';
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  return (
    <Card className={cn("w-full", compact && "h-fit")}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-primary" />
            {format(currentDate, 'MMMM yyyy')}
          </CardTitle>
          <div className="flex gap-1">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigateMonth('prev')}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setCurrentDate(new Date())}
            >
              Today
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigateMonth('next')}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {daysInMonth.map(day => {
            const dayEvents = getEventsForDay(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            
            return (
              <div
                key={day.toISOString()}
                onClick={() => onDayClick?.(day, dayEvents)}
                className={cn(
                  "min-h-20 p-1 border rounded-lg transition-all duration-200 cursor-pointer",
                  "hover:bg-muted/50 hover:shadow-md hover:scale-[1.02]",
                  isCurrentMonth ? "bg-background" : "bg-muted/20",
                  isToday(day) && "ring-2 ring-primary shadow-lg",
                  dayEvents.length > 0 && "border-primary/30"
                )}
              >
                <div className={cn(
                  "text-sm font-medium mb-1",
                  isCurrentMonth ? "text-foreground" : "text-muted-foreground",
                  isToday(day) && "text-primary font-bold"
                )}>
                  {format(day, 'd')}
                </div>
                
                <div className="space-y-1">
                  {dayEvents.slice(0, compact ? 2 : 3).map(event => (
                    <div
                      key={event.id}
                      onClick={() => onEventClick?.(event)}
                      className={cn(
                        "text-xs p-1 rounded text-white cursor-pointer hover:opacity-80",
                        getPriorityColor(event.priority),
                        compact && "truncate"
                      )}
                      title={`${event.title} - ${event.assetName}`}
                    >
                      <div className="truncate font-medium">
                        {compact ? event.assetName : event.title}
                      </div>
                      {!compact && (
                        <div className="truncate opacity-90">
                          {format(new Date(event.startTime), 'HH:mm')} - {event.assetName}
                        </div>
                      )}
                    </div>
                  ))}
                  {dayEvents.length > (compact ? 2 : 3) && (
                    <div className="text-xs text-muted-foreground">
                      +{dayEvents.length - (compact ? 2 : 3)} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded bg-destructive"></div>
            <span>Critical</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded bg-warning"></div>
            <span>High</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded bg-primary"></div>
            <span>Medium</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded bg-secondary"></div>
            <span>Low</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Export events for use in other components
export { mockMaintenanceEvents };
export type { MaintenanceEvent };