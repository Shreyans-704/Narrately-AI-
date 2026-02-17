import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

interface ProtectedAdminRouteProps {
  element: React.ReactElement;
}

export function ProtectedAdminRoute({ element }: ProtectedAdminRouteProps) {
  const { user } = useAuthStore();

  // Only allow access if user is authenticated and has admin role
  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return element;
}
