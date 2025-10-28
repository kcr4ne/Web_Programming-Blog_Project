import { supabase } from './supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Helper for auth fetch calls
const authFetch = async (endpoint, options = {}) => {
    if (!supabaseUrl || !supabaseAnonKey) {
        console.error('[DEBUG] Missing Supabase URL or Key for auth fetch.');
        throw new Error('Missing Supabase URL or Key');
    }

    const response = await fetch(`${supabaseUrl}/auth/v1/${endpoint}`, {
        ...options,
        headers: {
            'apikey': supabaseAnonKey,
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

    // For logout, no content is returned on success
    if (response.status === 204) {
        return null;
    }

    const data = await response.json();

    if (!response.ok) {
        console.error(`[DEBUG] Auth fetch error for endpoint ${endpoint}:`, data);
        throw new Error(data.error_description || data.msg || 'An authentication error occurred.');
    }

    return data;
};

export const getProfile = async (userId) => {
  if (!userId) return null;
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*') // Select all profile data
      .eq('id', userId)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`[DEBUG] Supabase fetch for getProfile(${userId}) failed:`, error);
    return null;
  }
};

export const signUp = async (email, password) => {
    return await authFetch('signup', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });
};

export const login = async (email, password) => {
    const data = await authFetch('token?grant_type=password', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });
    return data;
};

export const logout = async () => {
    const { data: { session } } = await supabase.auth.getSession();

    if (session?.access_token) {
        authFetch('logout', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${session.access_token}` }
        }).catch(err => console.error("Server-side logout failed:", err));
    }
};

export const updatePassword = async (newPassword) => {
  const { data, error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) {
    throw error;
  }
  return data;
};

export const getUser = () => {
  return supabase.auth.getUser();
};