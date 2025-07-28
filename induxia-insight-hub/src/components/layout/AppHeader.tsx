import React, { useState } from 'react';
import { Bell, ChevronDown, User } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/simple-sidebar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { Alert } from '@/types';

interface AppHeaderProps {
  alerts?: Alert[];
}

export function AppHeader({ alerts = [] }: AppHeaderProps) {
  const { user, signOut } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  
  const criticalAlerts = alerts.filter(alert => alert.priority === 'critical');
  const unreadCount = criticalAlerts.length;

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4">
        {/* Left side - Sidebar trigger */}
        <div className="flex items-center gap-4">
          <SidebarTrigger className="p-2 hover:bg-secondary rounded-lg transition-colors" />
          <div className="hidden md:block">
            <h2 className="text-lg font-semibold text-foreground">
              {user?.role === 'plant_director' && 'Mission Control Dashboard'}
              {user?.role === 'maintenance_manager' && 'Asset Health Cockpit'}
              {user?.role === 'production_supervisor' && 'Line Performance Dashboard'}
              {user?.role === 'operator' && 'Operations Dashboard'}
              {user?.role === 'admin' && 'Admin Dashboard'}
            </h2>
            <p className="text-sm text-muted-foreground">Real-time plant monitoring and optimization</p>
          </div>
        </div>

        {/* Right side - Notifications and User menu */}
        <div className="flex items-center gap-4">

          {/* Notifications */}
          <DropdownMenu open={showNotifications} onOpenChange={setShowNotifications}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative p-2">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Critical Alerts</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {criticalAlerts.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  No critical alerts
                </div>
              ) : (
                criticalAlerts.slice(0, 5).map((alert) => (
                  <DropdownMenuItem key={alert.id} className="flex flex-col items-start p-3">
                    <div className="font-medium text-sm">{alert.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">{alert.source}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(alert.timestamp).toLocaleTimeString()}
                    </div>
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Profile Dropdown */}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 px-3">
                  <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                    <span className="text-accent-foreground font-semibold text-sm">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-medium">{user.name}</div>
                    <div className="text-xs text-muted-foreground capitalize">
                      {user.role.replace('_', ' ')}
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile Settings</DropdownMenuItem>
                <DropdownMenuItem onClick={signOut}>Sign Out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}