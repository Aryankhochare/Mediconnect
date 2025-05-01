// src/components/ProtectedRoute.tsx
import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Spinner from './Spinner';

interface ProtectedRouteProps {
  children: ReactNode;
  adminOnly?: boolean;
  doctorOnly?: boolean;
}

const ProtectedRoute = ({ 
  children, 
  adminOnly = false,
  doctorOnly = false
}: ProtectedRouteProps) => {
  const { user, loading, token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!token) {
        router.push('/login');
      } else if (adminOnly && !user?.isAdmin) {
        router.push('/');
      } else if (doctorOnly && !user?.isDoctor) {
        router.push('/');
      }
    }
  }, [user, loading, token, router, adminOnly, doctorOnly]);

  if (loading) {
    return <Spinner />;
  }

  if (!token) {
    return null;
  }

  if ((adminOnly && !user?.isAdmin) || (doctorOnly && !user?.isDoctor)) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;