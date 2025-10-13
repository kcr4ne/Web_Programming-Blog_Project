import { supabase } from './supabase.js';

export const getPosts = async (orderBy = 'created_at', ascending = false) => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order(orderBy, { ascending });

  if (error) {
    console.error('Error fetching posts:', error.message);
    throw new Error(error.message);
  }

  return data;
};

export const getPostById = async (id) => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching post by id:', error.message);
    throw new Error(error.message);
  }

  return data;
};

export const deletePost = async (id) => {
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting post:', error.message);
    throw new Error(error.message);
  }
};

export const createPost = async (post) => {
  const { data, error } = await supabase
    .from('posts')
    .insert(post)
    .select();

  if (error) {
    console.error('Error creating post:', error.message);
    throw new Error(error.message);
  }

  return data;
};

export const updatePost = async (id, post) => {
  const { data, error } = await supabase
    .from('posts')
    .update(post)
    .eq('id', id)
    .select();

  if (error) {
    console.error('Error updating post:', error.message);
    throw new Error(error.message);
  }

  return data;
};

export const incrementPostView = async (postId) => {
  const { error } = await supabase.rpc('increment_views', { post_id_to_update: postId });

  if (error) {
    console.error('Error incrementing post view:', error.message);
    throw new Error(error.message);
  }
};
