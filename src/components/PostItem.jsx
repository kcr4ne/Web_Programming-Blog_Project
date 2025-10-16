import React from 'react';
import { Link } from 'react-router-dom';

const PostItem = ({ post }) => {
  const postDate = new Date(post.created_at).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Basic stripping of markdown/html for the snippet
  const snippet = post.content.replace(/(\*\*|__|\*|~|`|>|#)/g, '').substring(0, 150);

  return (
    <Link to={`/post/${post.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <article className="post-item" style={{
        border: '1px solid #333',
        borderRadius: '8px',
        padding: '1.5rem',
        backgroundColor: '#1e1e1e',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease-in-out, transform 0.2s ease-in-out',
      }}>
        <h2 style={{ marginTop: 0, marginBottom: '0.5rem', fontSize: '1.75rem' }}>{post.title}</h2>
        <p style={{ fontSize: '0.9rem', color: '#aaa', margin: '0 0 1rem 0' }}>
          {postDate} &bull; {post.views || 0} views
        </p>
        <p style={{ margin: 0, lineHeight: 1.6 }}>
          {snippet}{post.content.length > 150 ? '...' : ''}
        </p>
      </article>
    </Link>
  );
};

export default PostItem;
