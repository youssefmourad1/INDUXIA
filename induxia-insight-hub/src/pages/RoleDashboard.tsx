import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import RoleDashboardPage from './RoleDashboardPage';

// Role-based dashboard router component
export default function RoleDashboard() {
  const { user } = useAuth();
  
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">INDUXIA Portal</h1>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // All roles now use the same dashboard with role-specific content
  return <RoleDashboardPage />;
}