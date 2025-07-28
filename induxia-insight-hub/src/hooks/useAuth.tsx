import React, { useState, createContext, useContext, ReactNode, useEffect } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types';

interface Profile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar_url?: string;
  department?: string;
}

interface User extends Profile {
  // For compatibility with existing code
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string, role?: UserRole) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  // Deprecated methods for backward compatibility
  login: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        
        if (session?.user) {
          console.log('Fetching profile for user:', session.user.id);
          
          // Add timeout to profile fetch to prevent hanging
          const profileFetchPromise = supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();
            
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Profile fetch timeout')), 10000)
          );
          
          try {
            const { data: profile, error } = await Promise.race([
              profileFetchPromise,
              timeoutPromise
            ]) as any;
            
            console.log('Profile query completed. Error:', error, 'Profile:', profile);
            
            if (error) {
              console.error('Error fetching profile:', error);
              // Create a basic user object from session data if profile fetch fails
              const fallbackUser = {
                id: session.user.id,
                email: session.user.email || '',
                name: session.user.user_metadata?.name || 'User',
                role: session.user.user_metadata?.role || 'operator'
              };
              console.log('Using fallback user data:', fallbackUser);
              setUser(fallbackUser);
            } else if (profile) {
              console.log('Profile found:', profile);
              setUser(profile);
            } else {
              console.log('No profile found, using session metadata');
              // Use session metadata as fallback
              const fallbackUser = {
                id: session.user.id,
                email: session.user.email || '',
                name: session.user.user_metadata?.name || 'User', 
                role: session.user.user_metadata?.role || 'operator'
              };
              setUser(fallbackUser);
            }
          } catch (fetchError) {
            console.error('Profile fetch failed/timeout:', fetchError);
            // Always set a user object to unblock the auth flow
            const fallbackUser = {
              id: session.user.id,
              email: session.user.email || '',
              name: session.user.user_metadata?.name || 'User',
              role: session.user.user_metadata?.role || 'operator'
            };
            console.log('Using fallback user after error:', fallbackUser);
            setUser(fallbackUser);
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.email || 'No session');
      setSession(session);
      if (session?.user) {
        console.log('Getting profile for initial session user:', session.user.id);
        // Fetch user profile - using maybeSingle instead of single
        try {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();
            
          console.log('Initial profile query completed. Error:', error, 'Profile:', profile);
          
          if (error) {
            console.error('Error fetching initial profile:', error);
          } else if (profile) {
            console.log('Initial profile found:', profile);
            setUser(profile);
          } else {
            console.log('No initial profile found for user');
          }
          setLoading(false);
        } catch (profileError) {
          console.error('Exception in initial profile fetch:', profileError);
          setLoading(false);
        }
      } else {
        console.log('No initial session found');
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, name: string, role: UserRole = 'operator') => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          name,
          role
        }
      }
    });

    return { error };
  };

  const signIn = async (email: string, password: string) => {
    console.log('Attempting to sign in with:', email);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('Sign in error:', error);
    }
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  // Deprecated methods for backward compatibility
  const login = (role: UserRole) => {
    console.warn('login() is deprecated. Use signIn() instead.');
  };

  const logout = () => {
    console.warn('logout() is deprecated. Use signOut() instead.');
    signOut();
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}