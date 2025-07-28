import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function AuthDebugger() {
  const { user, session, loading } = useAuth();

  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <Card className="fixed top-4 right-4 z-50 w-80 bg-yellow-50 border-yellow-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Auth Debug Info</CardTitle>
      </CardHeader>
      <CardContent className="text-xs space-y-1">
        <div>Loading: {loading.toString()}</div>
        <div>Session: {session ? 'Yes' : 'No'}</div>
        <div>Session User: {session?.user?.email || 'None'}</div>
        <div>Profile User: {user?.email || 'None'}</div>
        <div>User Role: {user?.role || 'None'}</div>
        <div>User Name: {user?.name || 'None'}</div>
      </CardContent>
    </Card>
  );
}