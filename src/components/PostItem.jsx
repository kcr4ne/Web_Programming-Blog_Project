import React from 'react';
import { Link } from 'react-router-dom';

const PostItem = ({ post }) => {
  const postDate = post.createdAt ? new Date(post.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }) : '날짜 없음';

  const hasImage = /!\[.*\]\(.*\)/.test(post.content);
  
  const previewContent = post.summary || post.content.replace(/(\*\*|__|\*|~|`|>|#|!\[.*\]\(.*\))/g, '');

  return (
    <Link to={`/post/${post.slug || post.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex' }}>
      <article className="post-item" style={{
        border: '1px solid #333',
        borderRadius: '8px',
        padding: '1.5rem',
        backgroundColor: '#1e1e1e',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease-in-out, transform 0.2s ease-in-out',
        display: 'flex',
        flexDirection: 'column',
        width: '100%', // Ensure article takes full width of the link
        minHeight: '180px' // Set a minimum height to ensure consistent size
      }}>
        <h2 style={{
          marginTop: 0,
          marginBottom: '0.5rem',
          fontSize: '1.75rem'
        }}>
          {post.title.length > 16 ? `${post.title.substring(0, 16)}...` : post.title}
        </h2>
        <hr style={{ border: '0', borderTop: '1px solid #444', margin: '0.5rem 0 1rem' }} />
        <p style={{ fontSize: '0.9rem', color: '#aaa', margin: '0 0 1rem 0' }}>
          {hasImage && '🖼️ • '}
          {postDate} &bull; {post.profiles?.username || post.profiles?.email || '익명'} &bull; {post.views || 0} 조회수
        </p>
        <p className="line-clamp-2" style={{ margin: 0, lineHeight: 1.6, flexGrow: 1 }}>
          {previewContent}
        </p>
      </article>
    </Link>
  );
};

export default PostItem;
