import React from 'react';
import CommentItem from './CommentItem';

const CommentList = ({ comments, onCommentDeleted }) => {
  return (
    <section className="comment-list mt-8">
      <h3 className="text-xl lg:text-2xl font-bold text-white mb-4" style={{ borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>
        {comments.length}개의 댓글
      </h3>
      
      {(!comments || comments.length === 0) && (
         <div className="text-center py-10 px-4" style={{ backgroundColor: '#1e1e1e', borderRadius: '8px', border: '1px solid #333' }}>
           <p style={{ color: '#aaa' }}>아직 댓글이 없습니다.</p>
         </div>
      )}

      {comments && comments.length > 0 && (
        <div>
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onCommentDeleted={onCommentDeleted}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default CommentList;
