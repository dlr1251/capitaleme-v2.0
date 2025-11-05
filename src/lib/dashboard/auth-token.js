import { supabaseClient } from '../supabase-client.js';

/**
 * Gets a valid JWT token, refreshing if necessary
 * This prevents random logouts by proactively refreshing tokens before they expire
 */
export async function getAuthToken() {
  try {
    // Get current session
    let { data: { session }, error } = await supabaseClient.auth.getSession();
    
    if (error) {
      // Don't throw immediately on session errors - try to recover first
      console.warn('[auth-token] Session error, attempting recovery:', error.message);
      // Try to refresh the session
      const { data: { session: refreshedSession }, error: refreshError } = await supabaseClient.auth.refreshSession();
      if (!refreshError && refreshedSession) {
        session = refreshedSession;
        console.log('[auth-token] Session recovered via refresh');
      } else {
        // Only throw if refresh also fails
        console.error('[auth-token] Could not recover session:', refreshError || error);
        throw new Error(`Session error: ${error.message}`);
      }
    }
    
    // If no session, try to recover from storage
    if (!session) {
      console.log('[auth-token] No session found, checking localStorage...');
      // Supabase stores session in localStorage, let's check if we can recover
      const storedSession = typeof window !== 'undefined' ? localStorage.getItem('supabase.auth.token') : null;
      if (storedSession) {
        try {
          const parsed = JSON.parse(storedSession);
          if (parsed?.currentSession) {
            console.log('[auth-token] Found stored session, attempting refresh...');
            const { data: { session: refreshedSession }, error: refreshError } = await supabaseClient.auth.refreshSession();
            if (!refreshError && refreshedSession) {
              session = refreshedSession;
              console.log('[auth-token] Session refreshed from storage');
            } else if (refreshError) {
              // Only log the error, don't throw yet - let Supabase handle it
              console.warn('[auth-token] Could not refresh stored session:', refreshError.message);
            }
          }
        } catch (e) {
          console.error('[auth-token] Error parsing stored session:', e);
        }
      }
    }
    
    // Check if token is expired or expiring soon
    if (session) {
      const expiresAt = session.expires_at;
      if (expiresAt) {
        const expiresIn = expiresAt - Math.floor(Date.now() / 1000);
        console.log('[auth-token] Token expires in:', expiresIn, 'seconds');
        
        // If token expires in less than 5 minutes, refresh it proactively
        if (expiresIn < 300) {
          console.log('[auth-token] Token expiring soon, refreshing proactively...');
          const { data: { session: refreshedSession }, error: refreshError } = await supabaseClient.auth.refreshSession();
          if (refreshError) {
            // Only throw if refresh token is truly expired/invalid
            // Otherwise, try to use the existing session
            if (refreshError.message?.includes('refresh_token_not_found') || 
                refreshError.message?.includes('expired') ||
                refreshError.message?.includes('Invalid refresh token')) {
              console.error('[auth-token] Refresh token expired/invalid:', refreshError);
              throw new Error(`Token refresh failed: ${refreshError.message}`);
            } else {
              // Temporary error - log but continue with existing session
              console.warn('[auth-token] Token refresh had temporary error, using existing session:', refreshError.message);
            }
          }
          if (refreshedSession) {
            session = refreshedSession;
            console.log('[auth-token] Token refreshed successfully');
          }
        }
      }
    }
    
    if (!session) {
      console.error('[auth-token] No session found after refresh attempt');
      // Don't throw immediately - check if we're in a retry scenario
      // Try one more time to get session
      const { data: { session: finalSession } } = await supabaseClient.auth.getSession();
      if (!finalSession) {
        throw new Error('Not authenticated - no session found');
      }
      session = finalSession;
    }
    
    if (!session.access_token) {
      console.error('[auth-token] Session exists but no access_token');
      throw new Error('Not authenticated - no access token');
    }
    
    return session.access_token;
  } catch (error) {
    console.error('[auth-token] getAuthToken exception:', error);
    // NEVER redirect automatically - user must manually sign out to close session
    // Let the calling code handle errors gracefully without forcing logouts
    console.warn('[auth-token] Error getting token - but NOT redirecting (user must manually sign out):', error.message);
    // Always throw the error so calling code can handle it
    throw error;
  }
}

