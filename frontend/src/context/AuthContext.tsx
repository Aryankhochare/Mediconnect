// src/context/AuthContext.tsx
'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

type User = {
  _id: string;
  name: string;
  email: string;
  isAdmin?: boolean;
  isDoctor?: boolean;
  notification?: [];
  seennotification?: [];
};

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

// Create the context with a default undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Export the provider component
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Load user from localStorage on initial render
  useEffect(() => {
    // Check if we're in the browser environment
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
        getUserData(storedToken);
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const getUserData = async (authToken: string) => {
    try {
      const res = await axios.post(
        '/api/user/getUserData',
        {},
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      if (res.data.success) {
        setUser(res.data.data);
      }
    } catch (error) {
      localStorage.removeItem('token');
      setToken(null);
    }
    setLoading(false);
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const res = await axios.post('/api/user/login', { email, password });
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        
        // Redirect based on user role
        if (res.data.user.isAdmin) {
          router.push('/app/pages/admin');
        } else if (res.data.user.isDoctor) {
          router.push('/app/pages/doctor');
        } else {
          router.push('/');
        }
      }
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      setLoading(true);
      const res = await axios.post('/api/user/register', userData);
      if (res.data.success) {
        return res.data;
      }
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    setUser(null);
    setToken(null);
    router.push('@/app/pages/login');
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Export the hook to use this context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}