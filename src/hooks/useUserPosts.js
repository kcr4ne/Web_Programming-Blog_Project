import { useState, useEffect, useCallback } from 'react';
import { getPostsByUserId, createPost } from '../services/postService';

export const useUserPosts = (userId, enabled = true) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserPosts = useCallback(async () => {
    if (!userId || !enabled) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getPostsByUserId(userId);
      setPosts(data);
    } catch (err) {
      setError(err);
      console.error("Failed to fetch user posts:", err);
    } finally {
      setLoading(false);
    }
  }, [userId, enabled]);

  useEffect(() => {
    fetchUserPosts();
  }, [fetchUserPosts]);

  const addPost = useCallback(async (postData) => {
    try {
      const newPost = await createPost({ ...postData, authorId: userId });
      setPosts((prevPosts) => [newPost, ...prevPosts]);
      return newPost;
    } catch (err) {
      setError(err);
      console.error("Failed to add post:", err);
      throw err;
    }
  }, [userId]);

  return { posts, loading, error, refetch: fetchUserPosts, addPost };
};