import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { resetUnauthorizedHandler } from './api.js';

export interface AuthContextType {
  setAccessToken: (access_token: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {


  const setAccessToken = async (access_token: string): Promise<boolean> => {
    localStorage.setItem('auth_token', access_token);
    resetUnauthorizedHandler();
    return true;
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
  };

  const isAuthenticated = () => localStorage.getItem('auth_token') !== null;


  return (
    <AuthContext.Provider
      value={{
        setAccessToken,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}