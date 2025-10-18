import { createContext, useEffect, useState, useCallback } from 'react';
import { getProfile } from '../services/authService';

const AuthContext = createContext();

// The key Supabase uses to store session data in localStorage
const SUPABASE_AUTH_KEY = 'sb-vndlucbrusifyvhgxcdv-auth-token';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchUserRole = useCallback(async (user) => {
    if (!user) {
      setIsAdmin(false);
      return;
    }
    try {
      const profile = await getProfile(user.id);
      if (profile && profile.role === 'admin') {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    } catch (error) {
      console.error("Failed to fetch user role", error);
      setIsAdmin(false);
    }
  }, []);

  // On initial load, try to read the session from localStorage
  useEffect(() => {
    try {
      const sessionStr = window.localStorage.getItem(SUPABASE_AUTH_KEY);
      if (sessionStr) {
        const session = JSON.parse(sessionStr);
        // A basic check to see if the session is valid
        if (session.user && session.access_token) {
          setUser(session.user);
          fetchUserRole(session.user);
        }
      }
    } catch (error) {
      console.error("Failed to parse session from localStorage", error);
    }
    // This guarantees the loading screen will disappear
    setLoading(false);
  }, [fetchUserRole]);

  // This function will be called by Login/Logout components to update the state
  const setAuthSession = useCallback(async (session) => {
    if (session) {
      window.localStorage.setItem(SUPABASE_AUTH_KEY, JSON.stringify(session));
      setUser(session.user);
      await fetchUserRole(session.user);
    } else {
      window.localStorage.removeItem(SUPABASE_AUTH_KEY);
      setUser(null);
      setIsAdmin(false);
    }
  }, [fetchUserRole]);

  const value = {
    user,
    isAdmin,
    loading,
    setAuthSession,
    // Deprecate setUser, use setAuthSession instead
    setUser: (newUser) => {
        if (!newUser) {
            setAuthSession(null);
        }
    }
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;