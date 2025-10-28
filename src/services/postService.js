import { supabase } from "./supabase.js";

const POSTS_PER_PAGE = 12;

export const getPosts = async (orderBy = "created_at", ascending = false, page = 0, searchQuery = '') => {
  try {
    const from = page * POSTS_PER_PAGE;
    const to = from + POSTS_PER_PAGE - 1;

    let query = supabase
      .from('posts_with_author')
      .select('*', { count: 'exact' });

    if (searchQuery) {
      // Search in both title and content
      query = query.or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`);
    }

    const { data, error, count } = await query
      .order(orderBy, { ascending })
      .range(from, to);

    if (error) throw error;
    return { data, count };
  } catch (error) {
    console.error('Error fetching posts:', error);
    return { data: [], count: 0 };
  }
};

export const getPostBySlug = async (slug) => {
  try {
    const { data, error } = await supabase
      .from('posts_with_author')
      .select(`*`)
      .eq('slug', slug)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`[DEBUG] Supabase fetch for getPostBySlug(${slug}) failed:`, error);
    throw new Error('게시물을 불러오는 데 실패했습니다.');
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
