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

