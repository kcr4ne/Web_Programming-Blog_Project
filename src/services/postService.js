import { supabase } from "./supabase.js";

export const getPosts = async (orderBy = "created_at", ascending = false) => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*, profiles(username)')
      .order(orderBy, { ascending });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
};

export const getPostById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*, profiles(username)')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`[DEBUG] Supabase fetch for getPostById(${id}) failed:`, error);
    return null;
  }
};

export const deletePost = async (id) => {
  try {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error(`[DEBUG] Supabase call for deletePost(${id}) failed:`, error);
    return false;
  }
};

export const createPost = async (post) => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .insert([post])
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`[DEBUG] Supabase call for createPost failed:`, error);
    return null;
  }
};

export const updatePost = async (id, post) => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .update(post)
      .eq('id', id)
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`[DEBUG] Supabase call for updatePost(${id}) failed:`, error);
    return null;
  }
};

export const incrementPostView = async (postId) => {
  try {
    const { error } = await supabase.rpc('increment_views', { 
      post_id_to_update: postId 
    });
    if (error) throw error;
  } catch (error) {
      console.error('Error incrementing post view:', error);
  }
};

export const uploadImage = async (file) => {
  try {
    const filePath = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from('images')
      .upload(filePath, file);

    if (error) {
      throw error;
    }

    const { data: publicUrlData } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;

  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

export const getPostsByUserId = async (userId) => {
  if (!userId) return [];
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`[DEBUG] Supabase fetch for getPostsByUserId(${userId}) failed:`, error);
    return [];
  }
};
