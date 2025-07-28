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
  Calendar as CalendarIcon,
  Filter,
  Plus,
  User,
  Clock,
  Wrench,
  AlertTriangle,
  CheckCircle,
  Eye
} from 'lucide-react';
import { MaintenanceCalendar, mockMaintenanceEvents, MaintenanceEvent } from '@/components/calendar/MaintenanceCalendar';
import { DayDetailModal } from '@/components/calendar/DayDetailModal';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';

// Mock upcoming events for different views
const mockUpcomingEvents = [
  {
    id: 'UE-001',
    title: 'Critical Bearing Replacement',
    assetName: 'Conveyor Belt 3',
    technician: 'Marcus Rodriguez',
    startTime: '2024-01-29T09:00:00',
    endTime: '2024-01-29T13:00:00',
    priority: 'critical',
    status: 'scheduled'
  },
  {
    id: 'UE-002',
    title: 'Routine Inspection',
    assetName: 'Mixer Unit 1',
    technician: 'Sarah Kim',
    startTime: '2024-01-30T14:00:00',
    endTime: '2024-01-30T16:00:00',
    priority: 'medium',
    status: 'scheduled'
  },
  {
    id: 'UE-003',
    title: 'Temperature Sensor Calibration',
    assetName: 'Press Line 2',
    technician: 'James Wilson',
    startTime: '2024-01-31T10:00:00',
    endTime: '2024-01-31T12:00:00',
    priority: 'high',
    status: 'scheduled'
  }
];

// Mock technician schedules
const mockTechnicianSchedules = [
  {
    id: 'TECH-001',
    name: 'Marcus Rodriguez',
    specialization: 'Mechanical',
    currentTask: 'Bearing Replacement - A3',
    utilization: 85,
    todayTasks: 2,
    weekTasks: 8
  },
  {
    id: 'TECH-002',
    name: 'Sarah Kim',
    specialization: 'Electrical',
    currentTask: 'Available',
    utilization: 72,
    todayTasks: 1,
    weekTasks: 6
  },
  {
    id: 'TECH-003',
    name: 'James Wilson',
    specialization: 'Hydraulics',
    currentTask: 'Sensor Calibration - A2',
    utilization: 91,
    todayTasks: 3,
    weekTasks: 12
  },
  {
    id: 'TECH-004',
    name: 'Mike Chen',
    specialization: 'Controls',
    currentTask: 'Available',
    utilization: 68,
    todayTasks: 1,
    weekTasks: 5
  }
];

function getPriorityColor(priority: string): "default" | "secondary" | "destructive" | "outline" | "success" | "warning" {
  switch (priority) {
    case 'critical': return 'destructive';
    case 'high': return 'warning';
    case 'medium': return 'default';
    case 'low': return 'secondary';
    default: return 'secondary';
  }
}

export default function CalendarPage() {
  const { user } = useAuth();
  const [selectedView, setSelectedView] = useState('calendar');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState<MaintenanceEvent | null>(null);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [dayEvents, setDayEvents] = useState<MaintenanceEvent[]>([]);
  const [isDayModalOpen, setIsDayModalOpen] = useState(false);

  const handleEventClick = (event: MaintenanceEvent) => {
    setSelectedEvent(event);
  };

  const handleDayClick = (day: Date, events: MaintenanceEvent[]) => {
    setSelectedDay(day);
    setDayEvents(events);
    setIsDayModalOpen(true);
  };

  const filteredEvents = mockMaintenanceEvents.filter(event => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'critical') return event.priority === 'critical';
    if (selectedFilter === 'today') {
      const today = new Date().toDateString();
      return new Date(event.startTime).toDateString() === today;
    }
    return true;
  });

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Maintenance Calendar</h1>
          <p className="text-muted-foreground">
            Schedule and track maintenance activities across all plant assets
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/schedule-maintenance">
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Schedule Maintenance
            </Button>
          </Link>
        </div>
      </div>

      {/* View Controls */}
      <div className="flex gap-4 mb-6">
        <Select value={selectedView} onValueChange={setSelectedView}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="calendar">Calendar View</SelectItem>
            <SelectItem value="list">List View</SelectItem>
            <SelectItem value="technicians">Technician Schedules</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedFilter} onValueChange={setSelectedFilter}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Events</SelectItem>
            <SelectItem value="critical">Critical Only</SelectItem>
            <SelectItem value="today">Today</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Calendar View */}
      {selectedView === 'calendar' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <MaintenanceCalendar 
              events={filteredEvents}
              onEventClick={handleEventClick}
              onDayClick={handleDayClick}
            />
          </div>
          
          {/* Event Details Sidebar */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Event Details</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedEvent ? (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold">{selectedEvent.title}</h4>
                      <p className="text-sm text-muted-foreground">{selectedEvent.assetName}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Priority:</span>
                        <Badge variant={getPriorityColor(selectedEvent.priority)}>
                          {selectedEvent.priority.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Technician:</span>
                        <span className="text-sm font-medium">{selectedEvent.technician}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Duration:</span>
                        <span className="text-sm font-medium">
                          {new Date(selectedEvent.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - 
                          {new Date(selectedEvent.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">Select an event to view details</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* List View */}
      {selectedView === 'list' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-primary" />
                Upcoming Maintenance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockUpcomingEvents.map((event) => (
                <div key={event.id} className="p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold">{event.title}</h4>
                      <p className="text-sm text-muted-foreground">{event.assetName}</p>
                    </div>
                    <Badge variant={getPriorityColor(event.priority)}>
                      {event.priority.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span>{event.technician}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>{new Date(event.startTime).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-success" />
                Recently Completed
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-lg bg-success/5">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold">Monthly Inspection</h4>
                    <p className="text-sm text-muted-foreground">Packaging Unit</p>
                  </div>
                  <Badge variant="success">COMPLETED</Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  Completed by Mike Chen on Jan 26, 2024
                </div>
              </div>

              <div className="p-4 border rounded-lg bg-success/5">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold">Belt Tensioning</h4>
                    <p className="text-sm text-muted-foreground">Conveyor Belt 2</p>
                  </div>
                  <Badge variant="success">COMPLETED</Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  Completed by James Wilson on Jan 25, 2024
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Technician Schedules View */}
      {selectedView === 'technicians' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {mockTechnicianSchedules.map((tech) => (
            <Card key={tech.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  {tech.name}
                </CardTitle>
                <p className="text-sm text-muted-foreground">{tech.specialization} Specialist</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Utilization</span>
                    <span className="font-medium">{tech.utilization}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${tech.utilization}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Current Task:</span>
                    <span className={`text-sm font-medium ${tech.currentTask === 'Available' ? 'text-success' : 'text-foreground'}`}>
                      {tech.currentTask}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Today:</span>
                    <span className="text-sm font-medium">{tech.todayTasks} tasks</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">This Week:</span>
                    <span className="text-sm font-medium">{tech.weekTasks} tasks</span>
                  </div>
                </div>

                <Button variant="outline" size="sm" className="w-full">
                  View Full Schedule
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Day Detail Modal */}
      <DayDetailModal
        isOpen={isDayModalOpen}
        onClose={() => setIsDayModalOpen(false)}
        selectedDay={selectedDay}
        events={dayEvents}
        onEventClick={handleEventClick}
      />
    </div>
  );
}