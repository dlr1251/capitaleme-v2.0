import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabaseClient } from '../lib/supabase-client.js';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  console.log('[useAuth] ========== AUTH PROVIDER RENDERING ==========');
  console.log('[useAuth] AuthProvider component rendering');
  
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  console.log('[useAuth] Initial state:', {
    hasUser: !!user,
    hasSession: !!session,
    loading,
    isAdmin,
  });

  useEffect(() => {
    console.log('[useAuth] useEffect triggered - starting auth check');
    console.log('[useAuth] Getting initial session from Supabase...');
    
    // Get initial session
    supabaseClient.auth.getSession().then(({ data: { session }, error }) => {
      console.log('[useAuth] getSession completed');
      if (error) {
        console.error('[useAuth] Error getting session:', error);
        console.log('[useAuth] Setting loading to false due to error');
        setLoading(false);
        return;
      }
      
      console.log('[useAuth] Initial session retrieved:', {
        hasSession: !!session,
        hasUser: !!session?.user,
        userId: session?.user?.id,
        userEmail: session?.user?.email,
      });
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        console.log('[useAuth] User found, checking admin role - loading will remain true');
        checkAdminRole(session.user.id);
      } else {
        console.log('[useAuth] No user found, setting loading to false');
        setLoading(false);
      }
    });

    // Listen for auth changes with better token refresh handling
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange(async (event, session) => {
      console.log('[useAuth] Auth state changed:', event, session?.user?.id);
      
      // Handle different auth events
      if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
        console.log('[useAuth] User signed out or deleted');
        setSession(null);
        setUser(null);
        setIsAdmin(false);
        setLoading(false);
        return;
      }
      
      if (event === 'TOKEN_REFRESHED') {
        console.log('[useAuth] Token refreshed successfully');
        // Token was refreshed, update session
        if (session) {
          setSession(session);
          setUser(session.user ?? null);
        }
        return;
      }
      
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        console.log('[useAuth] User signed in or updated');
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          await checkAdminRole(session.user.id);
        }
        return;
      }
      
      // Default: update session and user
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        await checkAdminRole(session.user.id);
      } else {
        setIsAdmin(false);
        setLoading(false);
      }
    });
    
    // Set up periodic session refresh check (every 60 minutes)
    // This proactively refreshes tokens before they expire to prevent random logouts
    let refreshInterval: NodeJS.Timeout | null = null;
    if (typeof window !== 'undefined') {
      refreshInterval = setInterval(async () => {
      try {
        const { data: { session: currentSession } } = await supabaseClient.auth.getSession();
        if (currentSession) {
          // Check if token is close to expiring (within 5 minutes)
          const expiresAt = currentSession.expires_at;
          if (expiresAt) {
            const expiresIn = expiresAt - Math.floor(Date.now() / 1000);
            console.log('[useAuth] Token check - expires in:', expiresIn, 'seconds');
            if (expiresIn < 300) { // Less than 5 minutes
              console.log('[useAuth] Token expiring soon, refreshing proactively...');
              const { data: { session: refreshedSession }, error } = await supabaseClient.auth.refreshSession();
              if (error) {
                console.error('[useAuth] Error refreshing session:', error);
                // If refresh fails, clear session to trigger re-login
                if (error.message?.includes('refresh_token_not_found') || error.message?.includes('expired')) {
                  console.log('[useAuth] Refresh token expired, clearing session');
                  setSession(null);
                  setUser(null);
                  setIsAdmin(false);
                }
              } else if (refreshedSession) {
                console.log('[useAuth] Session refreshed successfully');
                setSession(refreshedSession);
                setUser(refreshedSession.user ?? null);
              }
            }
          }
        } else {
          console.log('[useAuth] No session found during periodic check');
        }
      } catch (error) {
        console.error('[useAuth] Error checking session:', error);
      }
      }, 60 * 60 * 1000); // Check every 60 minutes
    }

    return () => {
      subscription.unsubscribe();
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, []);

  async function checkAdminRole(userId: string) {
    try {
      console.log('[useAuth] ========== CHECKING ADMIN ROLE ==========');
      console.log('[useAuth] Checking admin role for user:', userId);
      
      // Add timeout to prevent hanging (reduced to 3 seconds)
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Admin role check timeout')), 3000);
      });
      
      const queryPromise = supabaseClient
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .maybeSingle();
      
      const result = await Promise.race([queryPromise, timeoutPromise]) as any;
      const { data, error } = result || {};

      if (error) {
        // Log error but don't block - allow user to proceed
        console.warn('Error checking admin role (non-blocking):', {
          message: error.message,
          code: error.code,
        });
        // Default to false but don't block the app
        setIsAdmin(false);
        setLoading(false);
      } else if (data) {
        const isAdminUser = data.role === 'admin' || data.role === 'super_admin';
        console.log('[useAuth] Admin check result:', { role: data.role, isAdmin: isAdminUser });
        console.log('[useAuth] Setting isAdmin to', isAdminUser, 'and loading to false');
        setIsAdmin(isAdminUser);
        setLoading(false);
        console.log('[useAuth] ========== ADMIN CHECK COMPLETE ==========');
      } else {
        // Profile doesn't exist - user is not admin
        console.warn('[useAuth] User profile not found in profiles table');
        console.log('[useAuth] Setting isAdmin to false and loading to false');
        setIsAdmin(false);
        setLoading(false);
        console.log('[useAuth] ========== ADMIN CHECK COMPLETE (no profile) ==========');
      }
    } catch (error: any) {
      // If timeout or any error, just set admin to false and continue
      console.warn('[useAuth] Admin role check failed (non-blocking):', error.message || error);
      console.log('[useAuth] Setting isAdmin to false and loading to false');
      setIsAdmin(false);
      setLoading(false);
      console.log('[useAuth] ========== ADMIN CHECK COMPLETE (error) ==========');
    }
  }

  async function signIn(email: string, password: string) {
    try {
      console.log('Calling supabaseClient.auth.signInWithPassword...');
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });
      
      console.log('Sign in response:', { data, error });
      
      if (error) {
        console.error('Supabase auth error:', error);
        return { error };
      }
      
      // Session will be updated via onAuthStateChange listener
      return { error: null };
    } catch (err: any) {
      console.error('Exception in signIn:', err);
      return { error: err };
    }
  }

  async function signOut() {
    await supabaseClient.auth.signOut();
    setUser(null);
    setSession(null);
    setIsAdmin(false);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signIn,
        signOut,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

