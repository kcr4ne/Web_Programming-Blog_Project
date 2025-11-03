import { useState, useEffect, useCallback } from 'react';
import { getPosts, getPostsCount } from '../services/postService';

const POSTS_PER_PAGE = 12;

export const usePosts = (orderByField = 'createdAt') => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch total count to calculate total pages
  useEffect(() => {
    setLoading(true);
    getPostsCount().then(count => {
      const total = Math.ceil(count / POSTS_PER_PAGE);
      setTotalPages(total > 0 ? total : 1);
      setLoading(false);
    });
  }, []);

  const fetchPage = useCallback(async (page) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getPosts(orderByField, page);
      setPosts(data);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [orderByField]);

  // Fetch posts when page or sorting changes
  useEffect(() => {
    fetchPage(currentPage);
  }, [currentPage, fetchPage]);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages || newPage === currentPage) {
      return;
    }
    setCurrentPage(newPage);
  }

  return { posts, loading, error, currentPage, totalPages, handlePageChange, setPosts }; // Expose setPosts
};