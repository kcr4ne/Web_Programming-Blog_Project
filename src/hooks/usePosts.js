import { useState, useEffect, useCallback } from 'react';
import { getPosts, getPostsByUserId } from '../services/postService';
import { useNotification } from './useNotification';

/**
 * Custom hook to fetch posts.
 * @param {string} [sortBy] - The field to sort by (e.g., 'created_at', 'views').
 * @param {string} [userId] - The ID of the user to fetch posts for. If provided, fetches posts for that user.
 * @param {boolean} [enabled=true] - Whether the query is enabled and should run.
 */
export const usePosts = (sortBy, userId, enabled = true) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showNotification } = useNotification();

  const fetchPosts = useCallback(async () => {
    if (!enabled) {
      setPosts([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      let data;
      if (userId) {
        data = await getPostsByUserId(userId);
      } else {
        const ascending = false; // Always descending for now
        data = await getPosts(sortBy, ascending);
      }
      
      setPosts(data);
    } catch (err) {
      setError(err);
      showNotification('Error fetching posts.', 'error');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [sortBy, userId, showNotification, enabled]);

  const addPost = (post) => {
    setPosts(prevPosts => [post, ...prevPosts]);
  };

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return { posts, loading, error, refetch: fetchPosts, addPost };
};
