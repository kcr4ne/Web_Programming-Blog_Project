import { createContext, useEffect, useState, useCallback } from 'react';

const AuthContext = createContext();

// The key Supabase uses to store session data in localStorage
const SUPABASE_AUTH_KEY = 'sb-vndlucbrusifyvhgxcdv-auth-token';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On initial load, try to read the session from localStorage
  useEffect(() => {
    try {
      const sessionStr = window.localStorage.getItem(SUPABASE_AUTH_KEY);
      if (sessionStr) {
        const session = JSON.parse(sessionStr);
        // A basic check to see if the session is valid
        if (session.user && session.access_token) {
          setUser(session.user);
        }
      }
    } catch (error) {
      console.error("Failed to parse session from localStorage", error);
    }
    // This guarantees the loading screen will disappear
    setLoading(false);
  }, []);

  // This function will be called by Login/Logout components to update the state
  const setAuthSession = useCallback((session) => {
    if (session) {
      window.localStorage.setItem(SUPABASE_AUTH_KEY, JSON.stringify(session));
      setUser(session.user);
    } else {
      window.localStorage.removeItem(SUPABASE_AUTH_KEY);
      setUser(null);
    }
  }, []);

  const value = {
    user,
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