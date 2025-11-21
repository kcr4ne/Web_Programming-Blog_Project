import { useState, useEffect } from 'react';
import { getCommentsByPostId } from '../services/commentService';

const useComments = (postId) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchComments = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedComments = await getCommentsByPostId(postId);
      setComments(fetchedComments);
    } catch (err) {
      console.error("Error fetching comments:", err);
      setError(err.message || "댓글을 불러오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (postId) {
      fetchComments();
    }
  }, [postId]);

  return { comments, loading, error, refetchComments: fetchComments };
};

export default useComments;
