import { supabase } from '../supabase.server.js';
import type { APIContext } from 'astro';

export async function verifyAuth(context: APIContext): Promise<{
  authenticated: boolean;
  user: any;
  isAdmin: boolean;
  error?: string;
}> {
  try {
    console.log('[Auth] Verifying authentication...');
    
    // Get authorization header
    const authHeader = context.request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('[Auth] Missing or invalid authorization header');
      return {
        authenticated: false,
        user: null,
        isAdmin: false,
        error: 'Missing or invalid authorization header',
      };
    }

    const token = authHeader.substring(7);
    console.log('[Auth] Token received, length:', token.length);

    // Verify token with Supabase
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError) {
      console.error('[Auth] Token verification error:', authError);
      return {
        authenticated: false,
        user: null,
        isAdmin: false,
        error: `Invalid or expired token: ${authError.message}`,
      };
    }

    if (!user) {
      console.log('[Auth] No user returned from token verification');
      return {
        authenticated: false,
        user: null,
        isAdmin: false,
        error: 'Invalid or expired token',
      };
    }

    console.log('[Auth] User authenticated:', user.id, user.email);

    // Check if user is admin
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError) {
      // PGRST116 means no rows returned (profile doesn't exist)
      // This is expected for non-admin users, not an error condition
      if (profileError.code === 'PGRST116') {
        console.log('[Auth] Profile not found for user:', user.id);
        return {
          authenticated: true,
          user,
          isAdmin: false,
          error: 'User profile not found',
        };
      }
      
      // Other errors (RLS policy, network, etc.) are actual errors
      console.error('[Auth] Profile fetch error:', {
        code: profileError.code,
        message: profileError.message,
        details: profileError.details,
      });
      return {
        authenticated: true,
        user,
        isAdmin: false,
        error: `Error checking admin role: ${profileError.message}`,
      };
    }

    if (!profile) {
      console.log('[Auth] Profile not found for user:', user.id);
      return {
        authenticated: true,
        user,
        isAdmin: false,
        error: 'User profile not found',
      };
    }

    const isAdmin = profile.role === 'admin' || profile.role === 'super_admin';
    console.log('[Auth] User role:', profile.role, 'isAdmin:', isAdmin);

    return {
      authenticated: true,
      user,
      isAdmin,
    };
  } catch (error: any) {
    console.error('[Auth] Auth verification exception:', error);
    return {
      authenticated: false,
      user: null,
      isAdmin: false,
      error: error.message || 'Authentication error',
    };
  }
}

export function requireAuth(handler: (context: APIContext, user: any) => Promise<Response>) {
  return async (context: APIContext) => {
    const authResult = await verifyAuth(context);

    if (!authResult.authenticated) {
      return new Response(
        JSON.stringify({ error: authResult.error || 'Unauthorized' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    if (!authResult.isAdmin) {
      return new Response(
        JSON.stringify({ error: 'Forbidden: Admin access required' }),
        {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return handler(context, authResult.user);
  };
}

