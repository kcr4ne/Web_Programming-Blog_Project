import { useState, useEffect } from 'react';
import { getPostById } from '../services/postService';
import { useNotification } from './useNotification';

export const usePost = (postId) => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showNotification } = useNotification();

  useEffect(() => {
    if (!postId) return;

    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getPostById(postId);
        setPost(data);
      } catch (err) {
        setError(err);
        showNotification('Error fetching post.', 'error');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId, showNotification]);

  return { post, loading, error };
};
