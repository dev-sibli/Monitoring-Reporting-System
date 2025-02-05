'use client'

import React, { createContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/types/types';
import store from '@/lib/store';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      const parsedUser = JSON.parse(loggedInUser);
      // Ensure dates are properly parsed
      if (parsedUser.createdAt) parsedUser.createdAt = new Date(parsedUser.createdAt);
      if (parsedUser.updatedAt) parsedUser.updatedAt = new Date(parsedUser.updatedAt);
      setUser(parsedUser);
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const userData = await response.json();
      // Ensure dates are properly parsed
      if (userData.createdAt) userData.createdAt = new Date(userData.createdAt);
      if (userData.updatedAt) userData.updatedAt = new Date(userData.updatedAt);
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      router.push('/');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    router.push('/');
  };

  const value = { user, loading, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

