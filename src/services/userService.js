import { supabase } from './supabase';

/**
 * Fetches all user profiles from the database by calling the
 * 'get_all_users_as_admin' RPC function. This function should only
 * succeed if called by a user with the 'admin' role.
 */
export const getAllUsers = async () => {
  // Call the RPC function instead of a direct select
  const { data, error } = await supabase.rpc('get_all_users_as_admin');

  if (error) {
    console.error('Error fetching all users:', error);
    throw new Error(error.message);
  }

  return data;
};

export const updateProfile = async (userId, updates) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    if (error.code === '23505') { // Unique violation on username
      throw new Error('이미 사용 중인 아이디입니다.');
    }
    throw error;
  }
  return data;
};
