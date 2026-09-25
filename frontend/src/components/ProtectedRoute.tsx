import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'wouter';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export default function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const { isAuthenticated, user, loading } = useAuth();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) {
      const currentPath = window.location.pathname + window.location.search;
      const redirectPath: string =
        currentPath && !currentPath.startsWith('/login')
          ? currentPath
          : location || '/dashboard';
      setLocation(`/login?next=${encodeURIComponent(redirectPath)}`);
      return;
    }
    if (adminOnly && user?.role !== 'Admin' && user?.role !== 'Government Official') {
      setLocation('/dashboard');
    }
  }, [isAuthenticated, adminOnly, user?.role, loading, location, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500 text-sm">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (adminOnly && user?.role !== 'Admin' && user?.role !== 'Government Official') {
    return null;
  }

  return <>{children}</>;
}