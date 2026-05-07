import React, { createContext, useContext, useState, useEffect } from 'react';
import { Storage } from '../services/storage';

type AuthContextType = {
  isAuthenticated: boolean | null;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    Storage.getToken().then((token) => {
      setIsAuthenticated(!!token);
    });
  }, []);

  const login = async (token: string) => {
    await Storage.saveToken(token);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    await Storage.deleteToken();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
