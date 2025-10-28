import { useState, useEffect, useCallback } from 'react';
import { getPosts } from '../services/postService';
import { useNotification } from './useNotification';

export const usePosts = (sortBy, searchQuery) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const { showNotification } = useNotification();

  const fetchPosts = useCallback(async (page) => {
    try {
      setLoading(true);
      setError(null);
      
      const ascending = false;
      const { data, count } = await getPosts(sortBy, ascending, page, searchQuery);
      
      setPosts(data);
      setTotalCount(count);
    } catch (err) {
      setError(err);
      showNotification('Error fetching posts.', 'error');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [sortBy, searchQuery, showNotification]);

  // Reset to page 0 when search query changes
  useEffect(() => {
    setCurrentPage(0);
  }, [searchQuery]);

  useEffect(() => {
    fetchPosts(currentPage);
  }, [fetchPosts, currentPage]);

  return { posts, loading, error, refetch: () => fetchPosts(currentPage), totalCount, currentPage, setCurrentPage };
};
