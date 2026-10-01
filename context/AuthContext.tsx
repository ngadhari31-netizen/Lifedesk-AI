'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'CUSTOMER' | 'AGENT' | 'ADMIN';
  language: string;
  avatarUrl?: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  language: string;
  theme: 'light' | 'dark';
  setLanguage: (lang: string) => Promise<void>;
  toggleTheme: () => void;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  quickLogin: (role: 'CUSTOMER' | 'AGENT' | 'ADMIN') => Promise<void>;
  register: (data: { name: string; email: string; password: string; role?: string; language?: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguageState] = useState('en');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const router = useRouter();

  // Load theme & session on mount
  useEffect(() => {
    // Theme preference
    const savedTheme = localStorage.getItem('ai_lifedesk_theme') as 'light' | 'dark' | null;
    const initialTheme = savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTheme(initialTheme);
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Language preference
    const savedLang = localStorage.getItem('ai_lifedesk_lang') || 'en';
    setLanguageState(savedLang);

    // Fetch user
    refreshUser();
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('ai_lifedesk_theme', nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const setLanguage = async (newLang: string) => {
    setLanguageState(newLang);
    localStorage.setItem('ai_lifedesk_lang', newLang);
    if (user) {
      try {
        await fetch('/api/auth/me', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ language: newLang }),
        });
        setUser({ ...user, language: newLang });
      } catch (e) {
        console.error('Failed to update language on backend:', e);
      }
    }
  };

  const refreshUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        if (data.user?.language) {
          setLanguageState(data.user.language);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Login failed' };
      }
      setUser(data.user);
      if (data.user.language) setLanguageState(data.user.language);

      // Route based on role
      if (data.user.role === 'ADMIN') router.push('/admin');
      else if (data.user.role === 'AGENT') router.push('/agent');
      else router.push('/dashboard');

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const quickLogin = async (role: 'CUSTOMER' | 'AGENT' | 'ADMIN') => {
    const email =
      role === 'ADMIN'
        ? 'admin@lifedesk.ai'
        : role === 'AGENT'
        ? 'agent@lifedesk.ai'
        : 'customer@lifedesk.ai';
    await login(email, 'password123');
  };

  const register = async (data: {
    name: string;
    email: string;
    password: string;
    role?: string;
    language?: string;
  }) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, language }),
      });
      const resData = await res.json();
      if (!res.ok) {
        return { success: false, error: resData.error || 'Registration failed' };
      }
      setUser(resData.user);
      router.push('/dashboard');
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        language,
        theme,
        setLanguage,
        toggleTheme,
        login,
        quickLogin,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
