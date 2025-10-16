import { supabase } from "./supabase.js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Helper function for all database fetch calls
const supabaseFetch = async (endpoint, options = {}) => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('[DEBUG] Missing Supabase URL or Key for native fetch.');
    throw new Error('Missing Supabase URL or Key');
  }

  const defaultHeaders = {
    'apikey': supabaseAnonKey,
    'Authorization': `Bearer ${supabaseAnonKey}`,
    'Content-Type': 'application/json'
  };

  const response = await fetch(`${supabaseUrl}/rest/v1/${endpoint}`, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[DEBUG] Native fetch error for endpoint ${endpoint}:`, errorText);
    throw new Error(`Network response was not ok: ${errorText}`);
  }

  if (response.status === 204) { // No Content for DELETE
    return null;
  }

  return response.json();
};

export const getPosts = async (orderBy = "created_at", ascending = false) => {
  const orderParam = `&order=${orderBy}.${ascending ? 'asc' : 'desc'}`;
  try {
    const data = await supabaseFetch(`posts?select=*${orderParam}`);
    return data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
};

export const getPostById = async (id) => {
  try {
    return await supabaseFetch(`posts?id=eq.${id}&select=*`, {
      headers: { 'Accept': 'application/vnd.pgrst.object+json' }
    });
  } catch (error) {
    console.error(`[DEBUG] Native fetch for getPostById(${id}) failed:`, error);
    return null;
  }
};

export const deletePost = async (id) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('User is not authenticated.');
    }

    await supabaseFetch(`posts?id=eq.${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${session.access_token}`
      }
    });
    return true;
  } catch (error) {
    console.error(`[DEBUG] Native fetch for deletePost(${id}) failed:`, error);
    return false;
  }
};

export const createPost = async (post) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('User is not authenticated.');
    }

    return await supabaseFetch('posts?select=*', {
      method: 'POST',
      headers: {
        'Prefer': 'return=representation',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify(post)
    });
  } catch (error) {
    console.error(`[DEBUG] Native fetch for createPost failed:`, error);
    return null;
  }
};

export const updatePost = async (id, post) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('User is not authenticated.');
    }

    return await supabaseFetch(`posts?id=eq.${id}`, {
      method: 'PATCH',
      headers: {
        'Prefer': 'return=representation',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify(post)
    });
  } catch (error) {
    console.error(`[DEBUG] Native fetch for updatePost(${id}) failed:`, error);
    return null;
  }
};

export const incrementPostView = async (postId) => {
  try {
    await supabaseFetch('rpc/increment_views', {
        method: 'POST',
        body: JSON.stringify({ post_id_to_update: postId })
    });
  } catch (error) {
      console.error('Error incrementing post view:', error);
  }
};

export const uploadImage = async (file) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('User is not authenticated. Cannot upload image.');
    }

    const filePath = `${Date.now()}-${file.name}`;
    const bucketId = 'images';

    const uploadResponse = await fetch(`${supabaseUrl}/storage/v1/object/${bucketId}/${filePath}`, {
      method: 'POST',
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': file.type,
      },
      body: file,
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      throw new Error(`Image upload failed: ${errorText}`);
    }

    const publicUrl = `${supabaseUrl}/storage/v1/object/public/${bucketId}/${filePath}`;
    return publicUrl;

  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

export const getPostsByUserId = async (userId) => {
  if (!userId) return [];
  try {
    return await supabaseFetch(`posts?user_id=eq.${userId}&select=*&order=created_at.desc`);
  } catch (error) {
    console.error(`[DEBUG] Native fetch for getPostsByUserId(${userId}) failed:`, error);
    return [];
  }
};
