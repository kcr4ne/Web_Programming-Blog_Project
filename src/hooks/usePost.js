import { useState, useEffect, useCallback } from 'react';
import { getPostBySlug, getPostById } from '../services/postService';
import { useNotification } from './useNotification';

export const usePost = (slugOrId) => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showNotification } = useNotification();

  const fetchPost = useCallback(async () => {
    if (!slugOrId) return;

    setLoading(true);
    setError(null);
    try {
      // Try fetching by slug first
      const data = await getPostBySlug(slugOrId);
      setPost(data);
    } catch (slugError) {
      // If slug fails, try fetching by ID
      try {
        const data = await getPostById(slugOrId);
        setPost(data);
      } catch (idError) {
        const finalError = new Error('게시물을 불러오는 데 실패했습니다.');
        setError(finalError);
        showNotification(finalError.message, 'error');
      }
    } finally {
      setLoading(false);
    }
  }, [slugOrId, showNotification]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  return { post, loading, error, refetch: fetchPost };
};
