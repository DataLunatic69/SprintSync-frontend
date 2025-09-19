import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore, type AuthState } from '../../../stores/authStore';

export const ProtectedRoute = () => {
  const isAuthenticated = useAuthStore((state: AuthState) => state.isAuthenticated);
  
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};