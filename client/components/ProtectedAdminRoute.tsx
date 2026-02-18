import { Navigate } from 'react-router-dom';
import { useAdminStore } from '@/store/adminStore';

interface ProtectedAdminRouteProps {
  element: React.ReactElement;
}

export function ProtectedAdminRoute({ element }: ProtectedAdminRouteProps) {
  const { isAdminAuthenticated } = useAdminStore();

  if (!isAdminAuthenticated) {
    return <Navigate to="/admin-login" replace />;
  }

  return element;
}
