import { useState, useEffect } from 'react';
import { auth } from '../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getProfile } from '../services/authService';
import { AuthContext } from './Auth';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        const profileData = await getProfile(currentUser.uid);
        setProfile(profileData);
        setIsAdmin(profileData?.role === 'admin');
      } else {
        setProfile(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getFreshToken = async () => {
    if (!auth.currentUser) return null;
    return auth.currentUser.getIdToken(true);
  };

  const value = { user, profile, isAdmin, loading, getFreshToken }; // Add getFreshToken

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};