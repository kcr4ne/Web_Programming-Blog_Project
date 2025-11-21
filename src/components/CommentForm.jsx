import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/Auth';
import { createComment } from '../services/commentService';

const CommentForm = ({ postId, onCommentAdded }) => {
  const { user } = useContext(AuthContext);
  const [commentContent, setCommentContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commentContent.trim()) {
      setError('댓글 내용을 입력해주세요.');
      return;
    }
    if (!user) {
      setError('댓글을 작성하려면 로그인해야 합니다.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await createComment(postId, user.uid, commentContent);
      setCommentContent('');
      if (onCommentAdded) {
        onCommentAdded();
      }
    } catch (err) {
      console.error("Failed to add comment:", err);
      setError(err.message || '댓글 추가에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="mt-6 p-4" style={{ backgroundColor: '#1e1e1e', borderRadius: '8px', border: '1px solid #333' }}>
        <p className="text-gray-400 text-center">
          댓글을 작성하려면 <a href="/login">로그인</a>이 필요합니다.
        </p>
      </div>
    );
  }

  return (
    <div className="comment-form-container mt-6">
      <form onSubmit={handleSubmit}>
        <div className="flex items-start">
          <div className="flex-1">
            <textarea
              className="form-input"
              rows="3"
              placeholder="댓글을 추가하세요..."
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              disabled={isSubmitting}
              style={{ minHeight: '80px' }}
            />
          </div>
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        <div className="flex justify-end mt-2">
          <button
            type="submit"
            className="button button-primary"
            disabled={isSubmitting || !commentContent.trim()}
          >
            {isSubmitting ? '전송 중...' : '댓글 달기'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommentForm;
