import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Cog, 
  ClipboardList, 
  Shield, 
  Truck, 
  FileText,
  Settings,
  Calendar
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  useSidebar,
} from '@/components/ui/simple-sidebar';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types';
import induxiaLogo from '@/assets/induxia-logo.jpg';

// Navigation items for each role
const roleNavigationItems: Record<UserRole, Array<{
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
}>> = {
  plant_director: [
    { title: 'Dashboard', url: '/', icon: LayoutDashboard },
    { title: 'Asset Health', url: '/assets', icon: Cog },
    { title: 'Work Orders', url: '/work-orders', icon: ClipboardList },
    { title: 'Quality Control', url: '/quality', icon: Shield },
    { title: 'Supply Chain', url: '/supply-chain', icon: Truck },
    { title: 'Reports', url: '/reports', icon: FileText },
    { title: 'Calendar', url: '/calendar', icon: Calendar },
    { title: 'Settings', url: '/settings', icon: Settings },
  ],
  maintenance_manager: [
    { title: 'Dashboard', url: '/', icon: LayoutDashboard },
    { title: 'Asset Health', url: '/assets', icon: Cog },
    { title: 'Work Orders', url: '/work-orders', icon: ClipboardList },
    { title: 'Calendar', url: '/calendar', icon: Calendar },
    { title: 'Reports', url: '/reports', icon: FileText },
    { title: 'Settings', url: '/settings', icon: Settings },
  ],
  production_supervisor: [
    { title: 'Dashboard', url: '/', icon: LayoutDashboard },
    { title: 'Quality Control', url: '/quality', icon: Shield },
    { title: 'Calendar', url: '/calendar', icon: Calendar },
    { title: 'Reports', url: '/reports', icon: FileText },
    { title: 'Settings', url: '/settings', icon: Settings },
  ],
  operator: [
    { title: 'Dashboard', url: '/', icon: LayoutDashboard },
    { title: 'Work Orders', url: '/work-orders', icon: ClipboardList },
    { title: 'Calendar', url: '/calendar', icon: Calendar },
    { title: 'Settings', url: '/settings', icon: Settings },
  ],
  admin: [
    { title: 'Dashboard', url: '/', icon: LayoutDashboard },
    { title: 'Asset Health', url: '/assets', icon: Cog },
    { title: 'Work Orders', url: '/work-orders', icon: ClipboardList },
    { title: 'Quality Control', url: '/quality', icon: Shield },
    { title: 'Supply Chain', url: '/supply-chain', icon: Truck },
    { title: 'Reports', url: '/reports', icon: FileText },
    { title: 'Calendar', url: '/calendar', icon: Calendar },
    { title: 'Settings', url: '/settings', icon: Settings },
  ],
};

export function AppSidebar() {
  const { collapsed } = useSidebar();
  const { user } = useAuth();
  const location = useLocation();
  
  const items = user ? roleNavigationItems[user.role] : [];
  
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <Sidebar className="bg-primary border-r border-primary/20">
      <SidebarContent className="bg-primary flex flex-col h-full">
        {/* Logo Section */}
        <div className="p-4 border-b border-primary-foreground/10">
          <div className="flex items-center gap-3">
            <img src={induxiaLogo} alt="INDUXIA Logo" className="h-8 w-auto" />
            {!collapsed && (
              <div>
                <p className="text-primary-foreground/70 text-xs">Portal</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 p-2 bg-primary/20 rounded-lg mx-2">
          {!collapsed && (
            <div className="text-primary-foreground/70 px-2 py-2 text-xs font-semibold uppercase tracking-wider">
              Navigation
            </div>
          )}
          <nav className="space-y-1">
            {items.map((item) => {
              const active = isActive(item.url);
              return (
                <NavLink
                  key={item.title}
                  to={item.url}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                    active
                      ? 'bg-accent text-accent-foreground font-medium'
                      : 'text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground'
                  }`}
                >
                  <item.icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-accent-foreground' : ''}`} />
                  {!collapsed && (
                    <span className="font-medium">{item.title}</span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Info at Bottom */}
        {user && (
          <div className="p-4 border-t border-primary-foreground/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                <span className="text-accent-foreground font-semibold text-sm">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              {!collapsed && (
                <div className="flex-1">
                  <p className="text-primary-foreground font-medium text-sm">{user.name}</p>
                  <p className="text-primary-foreground/70 text-xs capitalize">
                    {user.role.replace('_', ' ')}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}