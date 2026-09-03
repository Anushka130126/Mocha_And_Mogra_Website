import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCustomer } from '../lib/shopify-auth';

interface AuthContextType {
  user: any | null;
  loading: boolean;
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessTokenState] = useState<string | null>(
    localStorage.getItem('shopify_access_token')
  );
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const setAccessToken = (token: string | null) => {
    if (token) {
      localStorage.setItem('shopify_access_token', token);
    } else {
      localStorage.removeItem('shopify_access_token');
    }
    setAccessTokenState(token);
  };

  const logout = () => {
    setAccessToken(null);
    setUser(null);
  };

  useEffect(() => {
    async function fetchUser() {
      if (!accessToken) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const customer = await getCustomer(accessToken);
        if (customer) {
          setUser(customer);
        } else {
          // Token might be invalid or expired
          logout();
        }
      } catch (err) {
        console.error('Failed to fetch customer:', err);
        logout();
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [accessToken]);

  return (
    <AuthContext.Provider value={{ user, loading, accessToken, setAccessToken, logout }}>
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
