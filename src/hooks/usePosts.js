import { useState, useEffect, useCallback } from 'react';
import { getPosts, getPostsCount, getAllPosts } from '../services/postService'; // getAllPosts 추가

const POSTS_PER_PAGE = 12;

export const usePosts = (orderByField = 'createdAt', searchQuery = '') => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPage = useCallback(async (page) => {
    setLoading(true);
    setError(null);
    try {
      // 검색어가 있으면 모든 포스트를 가져와서 필터링
      if (searchQuery) {
        const allPosts = await getAllPosts(orderByField);
        const filtered = allPosts.filter(post => {
            const title = post.title?.toLowerCase() || '';
            const summary = post.summary?.toLowerCase() || '';
            const content = post.content?.toLowerCase() || '';
            const searchTerm = searchQuery.toLowerCase();
            return title.includes(searchTerm) || summary.includes(searchTerm) || content.includes(searchTerm);
        });
        setPosts(filtered);
        setTotalPages(1); // 검색 결과는 한 페이지에 모두 표시
        setCurrentPage(1);
      } else {
        // 검색어가 없으면 페이지네이션 적용
        const count = await getPostsCount();
        const total = Math.ceil(count / POSTS_PER_PAGE);
        setTotalPages(total > 0 ? total : 1);
        const { data } = await getPosts(orderByField, page);
        setPosts(data);
      }
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [orderByField, searchQuery]);

  // 페이지나 정렬, 검색어가 바뀔 때 다시 불러옴
  useEffect(() => {
    fetchPage(currentPage);
  }, [currentPage, fetchPage]);
  
  // 검색어가 바뀌면 첫 페이지로 리셋
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);


  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages || newPage === currentPage) {
      return;
    }
    setCurrentPage(newPage);
  }

  return { posts, loading, error, currentPage, totalPages, handlePageChange, setPosts };
};