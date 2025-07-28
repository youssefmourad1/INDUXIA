import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading, session } = useAuth();
  const location = useLocation();

  console.log('ProtectedRoute - Loading:', loading, 'User:', user?.email || 'No user', 'Session:', !!session);

  if (loading) {
    console.log('Still loading auth state...');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('No user found, redirecting to auth...');
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  console.log('User authenticated, rendering protected content for:', user.email);
  return <>{children}</>;
}