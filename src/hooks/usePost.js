import { useState, useEffect, useCallback } from 'react';
import { getPostBySlug } from '../services/postService';
import { useNotification } from './useNotification';

export const usePost = (postSlug) => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showNotification } = useNotification();

  const fetchPost = useCallback(async () => {
    if (!postSlug) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await getPostBySlug(postSlug);
      setPost(data);
    } catch (err) {
      setError(err);
      showNotification('Error fetching post.', 'error');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [postSlug, showNotification]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  return { post, loading, error, refetch: fetchPost };
};
