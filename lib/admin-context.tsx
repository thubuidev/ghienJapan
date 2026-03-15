'use client';

import { createContext, useContext, useState, useEffect } from 'react';

interface AdminUser {
  id: string;
  email: string;
}

interface AdminContextType {
  admin: AdminUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedAdmin = localStorage.getItem('admin');
    if (storedAdmin) {
      try {
        setAdmin(JSON.parse(storedAdmin));
      } catch {
        localStorage.removeItem('admin');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    if (email === 'admin@japanese.shop' && password === 'Admin@123') {
      const adminUser: AdminUser = {
        id: '1',
        email,
      };
      setAdmin(adminUser);
      localStorage.setItem('admin', JSON.stringify(adminUser));
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem('admin');
  };

  return (
    <AdminContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
}
