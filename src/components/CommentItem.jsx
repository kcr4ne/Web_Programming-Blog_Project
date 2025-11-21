import React, { useContext } from 'react';
import { AuthContext } from '../contexts/Auth';
import { deleteComment } from '../services/commentService';

const CommentItem = ({ comment, onCommentDeleted }) => {
  const { user, isAdmin } = useContext(AuthContext);

  const isAuthor = user && user.uid === comment.authorId;

  const handleDelete = async () => {
    if (window.confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
      try {
        await deleteComment(comment.id);
        if (onCommentDeleted) {
          onCommentDeleted();
        }
      } catch (error) {
        console.error("댓글 삭제 실패:", error);
        alert('댓글 삭제에 실패했습니다.');
      }
    }
  };

  const formattedDate = comment.createdAt 
    ? new Date(comment.createdAt).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }) 
    : '날짜 없음';
    
  const authorName = comment.authorProfile?.username || '익명';

  return (
    <div className="comment-item" style={{ backgroundColor: '#1e1e1e', border: '1px solid #444', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex-1" style={{ lineHeight: '1.2' }}>
          <span className="font-bold text-white">{authorName}</span>
          <p className="text-sm" style={{ color: '#aaa' }}>{formattedDate}</p>
        </div>
        {(isAuthor || isAdmin) && (
          <button
            onClick={handleDelete}
            className="button button-danger button-sm"
          >
            삭제
          </button>
        )}
      </div>
      <p style={{ color: '#eee', lineHeight: '1.6' }}>{comment.content}</p>
    </div>
  );
};

export default CommentItem;
