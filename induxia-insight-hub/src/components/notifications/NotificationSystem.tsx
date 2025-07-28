import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, X, CheckCircle, AlertTriangle, Info, Zap } from 'lucide-react';
import { toast } from 'sonner';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

const mockNotifications: Notification[] = [
  {
    id: 'n1',
    type: 'warning',
    title: 'Work Order WO-2024-001 Delayed',
    message: 'Maintenance on Conveyor Belt #3 is running 2 hours behind schedule',
    timestamp: new Date().toISOString(),
    read: false,
    priority: 'high',
    actionUrl: '/work-orders'
  },
  {
    id: 'n2',
    type: 'success',
    title: 'Work Order WO-2024-015 Completed',
    message: 'Pump replacement on Line 2 has been successfully completed',
    timestamp: new Date(Date.now() - 300000).toISOString(),
    read: false,
    priority: 'medium'
  },
  {
    id: 'n3',
    type: 'error',
    title: 'Critical Asset Alert',
    message: 'Hydraulic Press #1 temperature exceeding safe limits',
    timestamp: new Date(Date.now() - 600000).toISOString(),
    read: true,
    priority: 'critical',
    actionUrl: '/assets'
  }
];

export function NotificationSystem() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [isOpen, setIsOpen] = useState(false);

  // Simulate real-time notifications
  useEffect(() => {
    const interval = setInterval(() => {
      const newNotification: Notification = {
        id: `n${Date.now()}`,
        type: ['success', 'warning', 'error', 'info'][Math.floor(Math.random() * 4)] as any,
        title: [
          'New Work Order Created',
          'Asset Status Changed',
          'Maintenance Completed',
          'Quality Alert Triggered',
          'Technician Assignment Updated'
        ][Math.floor(Math.random() * 5)],
        message: [
          'Emergency repair required on Production Line 1',
          'Scheduled maintenance reminder for tomorrow',
          'Quality inspection passed for Batch #2024-045',
          'New technician assigned to WO-2024-032',
          'Spare parts inventory running low'
        ][Math.floor(Math.random() * 5)],
        timestamp: new Date().toISOString(),
        read: false,
        priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as any
      };

      setNotifications(prev => [newNotification, ...prev.slice(0, 9)]);
      
      // Show toast for high priority notifications
      if (newNotification.priority === 'high' || newNotification.priority === 'critical') {
        toast(newNotification.title, {
          description: newNotification.message,
          action: {
            label: "View",
            onClick: () => setIsOpen(true),
          },
        });
      }
    }, 15000); // New notification every 15 seconds

    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4 text-success" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-warning" />;
      case 'error': return <X className="w-4 h-4 text-destructive" />;
      default: return <Info className="w-4 h-4 text-primary" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'destructive';
      case 'high': return 'warning';
      case 'medium': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-2 -right-2 h-5 w-5 text-xs p-0 flex items-center justify-center"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-12 w-96 max-h-96 bg-background border rounded-lg shadow-lg z-50">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Notifications</h3>
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                    Mark all read
                  </Button>
                )}
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No notifications</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b cursor-pointer hover:bg-muted/50 ${
                    !notification.read ? 'bg-primary/5' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-medium truncate">{notification.title}</h4>
                        <Badge variant={getPriorityColor(notification.priority) as any} className="text-xs">
                          {notification.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(notification.timestamp).toLocaleString()}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2"></div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}