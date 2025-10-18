import { useState, useEffect, useCallback } from 'react';
import { getPostsByUserId } from '../services/postService';
import { useNotification } from './useNotification';

export const useUserPosts = (userId, enabled = true) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showNotification } = useNotification();

  const fetchPosts = useCallback(async () => {
    if (!enabled || !userId) {
      setPosts([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getPostsByUserId(userId);
      setPosts(data);
    } catch (err) {
      setError(err);
      showNotification('Error fetching your posts.', 'error');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [userId, showNotification, enabled]);

  const addPost = (post) => {
    setPosts(prevPosts => [post, ...prevPosts]);
  };

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return { posts, loading, error, refetch: fetchPosts, addPost };
};
