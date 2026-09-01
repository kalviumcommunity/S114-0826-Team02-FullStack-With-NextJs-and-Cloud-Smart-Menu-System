import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    async function loadCurrentUser() {
      if (token) {
        try {
          const data = await authService.getMe();
          setUser(data.user);
        } catch (err) {
          console.error('Session validation failed, logging out...');
          handleLogout();
        }
      }
      setAuthLoading(false);
    }
    loadCurrentUser();
  }, [token]);

  const handleLogin = async (email, password) => {
    setAuthLoading(true);
    try {
      const data = await authService.login(email, password);
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);
      return data.user;
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignup = async (username, email, password) => {
    setAuthLoading(true);
    try {
      const data = await authService.signup(username, email, password);
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);
      return data.user;
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const isOwner = user?.role === 'owner';
  const isCustomer = user?.role === 'customer';

  const value = {
    user,
    token,
    authLoading,
    login: handleLogin,
    signup: handleSignup,
    logout: handleLogout,
    isOwner,
    isCustomer
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
export default AuthContext;
