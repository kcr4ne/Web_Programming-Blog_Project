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
    <div className="comment-item py-5" style={{ borderBottom: '1px solid #333' }}>
      <div className="flex items-center justify-between">
        <div>
          <span className="font-bold text-white">{authorName}</span>
          <p className="text-sm mt-1" style={{ color: '#aaa' }}>{formattedDate}</p>
        </div>
        {(isAuthor || isAdmin) && (
          <button
            onClick={handleDelete}
            className="text-sm opacity-60 hover:opacity-100 transition-opacity"
            style={{ color: '#cf6679' }}
          >
            삭제
          </button>
        )}
      </div>
      <p className="mt-3" style={{ color: '#eee', lineHeight: '1.6' }}>{comment.content}</p>
    </div>
  );
};

export default CommentItem;
