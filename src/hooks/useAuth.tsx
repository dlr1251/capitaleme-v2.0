import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
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
  
  // Track if we've already checked admin role for the current user
  const adminCheckedForUser = useRef<string | null>(null);
  const initialSessionChecked = useRef(false);
  const isInitializing = useRef(false); // Prevent multiple simultaneous initializations

  console.log('[useAuth] Initial state:', {
    hasUser: !!user,
    hasSession: !!session,
    loading,
    isAdmin,
  });

  useEffect(() => {
    // Prevent multiple simultaneous initializations, but allow re-initialization after SIGNED_IN
    if (isInitializing.current && !initialSessionChecked.current) {
      console.log('[useAuth] Already initializing, skipping duplicate useEffect');
      return;
    }
    
    // If we already have a session and user, and admin is checked, don't re-initialize
    if (session && user && initialSessionChecked.current && adminCheckedForUser.current === user.id) {
      console.log('[useAuth] Session and user already exist with admin checked, skipping re-initialization');
      // Ensure loading is false if we have everything
      if (loading) {
        setLoading(false);
      }
      return;
    }
    
    isInitializing.current = true;
    console.log('[useAuth] useEffect triggered - starting auth check');
    console.log('[useAuth] Getting initial session from Supabase...');
    
    // Get initial session - NEVER clear session here unless explicitly logged out
    supabaseClient.auth.getSession().then(({ data: { session }, error }) => {
      console.log('[useAuth] getSession completed');
      
      if (error) {
        console.error('[useAuth] Error getting session:', error);
        // NEVER clear session on error - always try to recover and keep existing state
        // User must manually sign out to close session
        console.log('[useAuth] Session error - attempting recovery without clearing state...');
        supabaseClient.auth.refreshSession().then(({ data: { session: refreshedSession }, error: refreshError }) => {
          if (!refreshError && refreshedSession) {
            console.log('[useAuth] Session recovered after error');
            setSession(refreshedSession);
            setUser(refreshedSession.user ?? null);
            initialSessionChecked.current = true;
            if (refreshedSession.user) {
              const userId = refreshedSession.user.id;
              adminCheckedForUser.current = userId;
              checkAdminRole(userId);
            } else {
              setLoading(false);
            }
          } else {
            // Even refresh failed - but NEVER clear session automatically
            // Keep existing state and let user manually sign out if needed
            console.log('[useAuth] Could not recover session, but keeping existing state (user must manually sign out)');
            setLoading(false);
            // Don't clear session/user state - preserve it for user to decide
          }
        });
        return;
      }
      
      console.log('[useAuth] Initial session retrieved:', {
        hasSession: !!session,
        hasUser: !!session?.user,
        userId: session?.user?.id,
        userEmail: session?.user?.email,
      });
      
      // Always update session state - even if null, it's the current state
      setSession(session);
      setUser(session?.user ?? null);
      initialSessionChecked.current = true;
      
      if (session?.user) {
        console.log('[useAuth] User found, checking admin role - loading will remain true');
        const userId = session.user.id;
        adminCheckedForUser.current = userId; // Set before check to prevent duplicates
        checkAdminRole(userId);
      } else {
        // No session - this is normal if user hasn't logged in
        // Only clear state if we're sure there's no session in storage
        console.log('[useAuth] No session found - this is normal if user is not logged in');
        // Don't clear existing session state if user was already logged in
        // Only set loading to false
        setLoading(false);
        // Only clear admin check tracker if we're sure there's no user
        if (!session && !user) {
          adminCheckedForUser.current = null;
        }
      }
      
      isInitializing.current = false;
    });

    // Listen for auth changes with better token refresh handling
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange(async (event, session) => {
      console.log('[useAuth] Auth state changed:', event, session?.user?.id);
      
      // Handle different auth events
      // Only clear session on explicit SIGNED_OUT event (when user clicks sign out button)
      // Never clear on other events automatically
      if (event === 'SIGNED_OUT') {
        console.log('[useAuth] User explicitly signed out via signOut()');
        setSession(null);
        setUser(null);
        setIsAdmin(false);
        setLoading(false);
        adminCheckedForUser.current = null;
        return;
      }
      
      if (event === 'USER_DELETED') {
        console.log('[useAuth] User deleted - clearing session');
        setSession(null);
        setUser(null);
        setIsAdmin(false);
        setLoading(false);
        adminCheckedForUser.current = null;
        return;
      }
      
      // Ignore INITIAL_SESSION event - we already handled it in the useEffect above
      // But ensure state is synced in case useEffect hasn't completed yet
      if (event === 'INITIAL_SESSION') {
        console.log('[useAuth] INITIAL_SESSION event - syncing state (already handled in useEffect)');
        // Sync state if session exists, but don't re-check admin role unless needed
        if (session?.user) {
          const userId = session.user.id;
          
          // Update session and user state
          setSession(session);
          setUser(session.user);
          initialSessionChecked.current = true;
          
          // Only check admin role if we haven't checked it yet
          // This handles the case where INITIAL_SESSION fires before useEffect completes
          if (adminCheckedForUser.current !== userId) {
            console.log('[useAuth] Admin role not checked yet for INITIAL_SESSION, checking now...');
            adminCheckedForUser.current = userId;
            checkAdminRole(userId);
          } else {
            console.log('[useAuth] Admin role already checked for this user, skipping');
          }
        } else if (!session) {
          // No session in INITIAL_SESSION - only clear if we're sure there's no session
          // Don't aggressively clear - user might just not be logged in
          console.log('[useAuth] No session in INITIAL_SESSION - user not logged in');
          // Only update if state is different to avoid unnecessary re-renders
          setSession((prev) => prev !== null ? null : prev);
          setUser((prev) => prev !== null ? null : prev);
          setIsAdmin(false);
          setLoading(false);
          adminCheckedForUser.current = null;
        }
        return;
      }
      
      if (event === 'TOKEN_REFRESHED') {
        console.log('[useAuth] Token refreshed successfully');
        // Token was refreshed, update session but don't re-check admin role
        // This prevents unnecessary database queries and potential race conditions
        if (session) {
          setSession(session);
          setUser(session.user ?? null);
          // Keep current admin status - don't re-check
        }
        return;
      }
      
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        console.log('[useAuth] User signed in or updated');
        setSession(session);
        setUser(session?.user ?? null);
        // Reset initialization flag so useEffect can run if needed
        isInitializing.current = false;
        
        if (session?.user) {
          // Reset admin check tracker for new user
          adminCheckedForUser.current = null;
          // Check admin role - this will set loading to false when complete
          await checkAdminRole(session.user.id);
        } else {
          // No user in session - set loading to false immediately
          setLoading(false);
        }
        return;
      }
      
      // Default: update session and user
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        // Only check admin role if we haven't checked for this user yet
        const userId = session.user.id;
        if (adminCheckedForUser.current !== userId) {
          await checkAdminRole(userId);
        } else {
          // Already checked for this user, just ensure loading is false
          setLoading(false);
        }
      } else {
        setIsAdmin(false);
        setLoading(false);
        adminCheckedForUser.current = null;
      }
    });
    
    // Set up periodic session refresh check (every 5 minutes)
    // This proactively refreshes tokens before they expire to prevent random logouts
    // Access tokens typically expire in 1 hour, so checking every 5 minutes ensures we refresh in time
    // IMPORTANT: Never clear session automatically - only refresh tokens
    let refreshInterval: NodeJS.Timeout | null = null;
    let isRefreshing = false; // Prevent multiple simultaneous refreshes
    
    if (typeof window !== 'undefined') {
      refreshInterval = setInterval(async () => {
        // Skip if already refreshing
        if (isRefreshing) {
          console.log('[useAuth] Refresh already in progress, skipping...');
          return;
        }
        
        try {
          const { data: { session: currentSession } } = await supabaseClient.auth.getSession();
          if (!currentSession) {
            console.log('[useAuth] No session found during periodic check - keeping existing state');
            // Don't clear state - user might have session in storage
            return;
          }
          
          // Check if token is close to expiring (within 10 minutes)
          const expiresAt = currentSession.expires_at;
          if (!expiresAt) {
            console.log('[useAuth] No expiration time found, skipping refresh');
            return;
          }
          
          const expiresIn = expiresAt - Math.floor(Date.now() / 1000);
          console.log('[useAuth] Token check - expires in:', expiresIn, 'seconds');
          
          // Only refresh if token expires within 10 minutes
          if (expiresIn < 600) {
            isRefreshing = true;
            console.log('[useAuth] Token expiring soon, refreshing proactively...');
            
            try {
              const { data: { session: refreshedSession }, error } = await supabaseClient.auth.refreshSession();
              
              if (error) {
                console.error('[useAuth] Error refreshing session:', error);
                // NEVER clear session automatically - only user can close session via signOut button
                // Keep existing session state even on errors - let Supabase handle token refresh automatically
                console.warn('[useAuth] Refresh error - KEEPING existing session (user must manually sign out):', error.message);
                // Don't touch session state at all - let Supabase's auto-refresh handle it
              } else if (refreshedSession) {
                console.log('[useAuth] Session refreshed successfully');
                // Don't manually update state here - let onAuthStateChange handle it
                // This prevents race conditions and double updates
              } else {
                console.warn('[useAuth] Refresh succeeded but no session returned - keeping existing session');
                // Don't clear - keep existing session
              }
            } finally {
              isRefreshing = false;
            }
          } else {
            console.log('[useAuth] Token still valid, no refresh needed');
          }
        } catch (error) {
          console.error('[useAuth] Error checking session:', error);
          // Never clear session on errors - keep existing state
          isRefreshing = false;
        }
      }, 5 * 60 * 1000); // Check every 5 minutes
    }

    return () => {
      subscription.unsubscribe();
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
      // Reset initialization flag when component unmounts
      isInitializing.current = false;
    };
  }, []);

  async function checkAdminRole(userId: string) {
    // Prevent duplicate checks for the same user, but allow if loading is still true (means we need to finish)
    if (adminCheckedForUser.current === userId && !loading) {
      console.log('[useAuth] Already checked admin role for user:', userId, '- skipping');
      // Ensure loading is false
      setLoading(false);
      return;
    }
    
    try {
      console.log('[useAuth] ========== CHECKING ADMIN ROLE ==========');
      console.log('[useAuth] Checking admin role for user:', userId);
      
      // Mark as checked to prevent duplicates
      adminCheckedForUser.current = userId;
      
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
        console.warn('[useAuth] Error checking admin role (non-blocking):', {
          message: error.message,
          code: error.code,
        });
        // Default to false but don't block the app
        setIsAdmin(false);
        setLoading(false);
        console.log('[useAuth] ========== ADMIN CHECK COMPLETE (error) ==========');
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
      console.log('[useAuth] Calling supabaseClient.auth.signInWithPassword...');
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });
      
      console.log('[useAuth] Sign in response:', { data, error });
      
      if (error) {
        console.error('[useAuth] Supabase auth error:', error);
        return { error };
      }
      
      // Immediately get session and update state if available
      // This ensures the state updates right away, not waiting for onAuthStateChange
      if (data?.session) {
        console.log('[useAuth] Session available immediately, updating state...');
        setSession(data.session);
        setUser(data.session.user ?? null);
        isInitializing.current = false;
        
        if (data.session.user) {
          // Reset admin check tracker for new user
          adminCheckedForUser.current = null;
          // Check admin role - this will set loading to false when complete
          checkAdminRole(data.session.user.id);
        } else {
          setLoading(false);
        }
      }
      
      // Session will also be updated via onAuthStateChange listener (backup)
      return { error: null };
    } catch (err: any) {
      console.error('[useAuth] Exception in signIn:', err);
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

