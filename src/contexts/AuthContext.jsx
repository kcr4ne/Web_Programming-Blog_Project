import { createContext, useEffect, useState, useCallback } from 'react';
import { getProfile } from '../services/authService';

const AuthContext = createContext();

const SUPABASE_AUTH_KEY = 'sb-vndlucbrusifyvhgxcdv-auth-token';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null); // Add profile state
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = useCallback(async (user) => {
    if (!user) {
      setIsAdmin(false);
      setProfile(null);
      return;
    }
    try {
      const profileData = await getProfile(user.id);
      setProfile(profileData);
      if (profileData && profileData.role === 'admin') {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    } catch (error) {
      console.error("Failed to fetch user profile", error);
      setIsAdmin(false);
      setProfile(null);
    }
  }, []);

  useEffect(() => {
    try {
      const sessionStr = window.localStorage.getItem(SUPABASE_AUTH_KEY);
      if (sessionStr) {
        const session = JSON.parse(sessionStr);
        if (session.user && session.access_token) {
          setUser(session.user);
          fetchUserProfile(session.user);
        }
      }
    } catch (error) {
      console.error("Failed to parse session from localStorage", error);
    }
    setLoading(false);
  }, [fetchUserProfile]);

  const setAuthSession = useCallback(async (session) => {
    if (session) {
      window.localStorage.setItem(SUPABASE_AUTH_KEY, JSON.stringify(session));
      setUser(session.user);
      await fetchUserProfile(session.user);
    } else {
      window.localStorage.removeItem(SUPABASE_AUTH_KEY);
      setUser(null);
      setIsAdmin(false);
      setProfile(null);
    }
  }, [fetchUserProfile]);

  const value = {
    user,
    profile, // Provide profile in context
    isAdmin,
    loading,
    setAuthSession,
    fetchUserProfile, // Provide fetch function
    setUser: (newUser) => {
        if (!newUser) {
            setAuthSession(null);
        }
    }
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;