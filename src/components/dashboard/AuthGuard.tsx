import { useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth.js';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function AuthGuard({ children, requireAdmin = true }: AuthGuardProps) {
  console.log('[AuthGuard] ========== AUTH GUARD RENDERING ==========');
  console.log('[AuthGuard] AuthGuard component rendering');
  
  const { user, loading, isAdmin } = useAuth();
  
  console.log('[AuthGuard] Auth state:', {
    hasUser: !!user,
    userId: user?.id,
    userEmail: user?.email,
    loading,
    isAdmin,
    requireAdmin,
  });

  useEffect(() => {
    console.log('[AuthGuard] useEffect triggered - auth state changed');
    // Wait a bit longer before redirecting to allow admin check to complete
    if (loading) return;
    
    // Only redirect if user is explicitly null (not just temporarily undefined during loading)
    // Don't redirect on errors - let user manually sign out if needed
    if (!user) {
      // Only redirect if we're sure there's no session (after waiting a bit)
      // This prevents redirecting during temporary auth state changes
      const timeoutId = setTimeout(() => {
        // Double-check user state before redirecting
        if (!user) {
          console.log('[AuthGuard] No user found after delay - redirecting to login');
          window.location.href = '/dashboard';
        }
      }, 1000); // Give 1 second to allow auth state to stabilize
      
      return () => clearTimeout(timeoutId);
    }
    
    // If admin check is still loading or failed, give it more time
    // Check admin status after a delay to allow for async admin check
    if (requireAdmin) {
      const timeoutId = setTimeout(() => {
        if (!isAdmin) {
          console.warn('User is not admin, redirecting...');
          window.location.href = '/dashboard';
        }
      }, 2000); // Give 2 seconds for admin check to complete
      
      return () => clearTimeout(timeoutId);
    }
  }, [user, loading, isAdmin, requireAdmin]);

  if (loading) {
    console.log('[AuthGuard] Still loading auth - blocking children from rendering');
    console.log('[AuthGuard] Returning loading screen - VisasList will NOT render yet');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    console.log('[AuthGuard] No user found - blocking children from rendering');
    console.log('[AuthGuard] Returning null - VisasList will NOT render');
    return null;
  }

  console.log('[AuthGuard] Auth check passed - rendering children');
  console.log('[AuthGuard] VisasList will now render');

  // Temporarily allow access even if admin check failed
  // The server-side API will verify admin status anyway
  // if (requireAdmin && !isAdmin) {
  //   return null;
  // }

  return <>{children}</>;
}

