import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { deletePost } from '../services/postService';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';
import ReactMarkdown from 'react-markdown';
import { usePost } from '../hooks/usePost';

function PostDetail() {
  const { id } = useParams();
  const { post, loading } = usePost(id);
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { showNotification } = useNotification();

  const handleDelete = async () => {
    const isConfirmed = window.confirm('Are you sure you want to delete this post?');
    if (isConfirmed) {
      try {
        await deletePost(id);
        showNotification('Post deleted successfully!', 'success');
        navigate('/');
      } catch (error) {
        showNotification(`Error deleting post: ${error.message}`, 'error');
      }
    }
  };

  const canModify = (user && post && user.id === post.user_id) || isAdmin;

  if (loading) {
    return <p>Loading post...</p>;
  }

  if (!post) {
    return (
      <div>
        <p>Post not found.</p>
        <Link to="/">Back to list</Link>
      </div>
    );
  }

  return (
    <main className="post-detail">
      <article>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>{post.title}</h1>
        <p style={{ color: '#aaa', marginBottom: '2rem' }}>
          Posted on {new Date(post.created_at).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
        
        <div className="post-content" style={{ lineHeight: 1.7, fontSize: '1.1rem' }}>
          <ReactMarkdown>{post.content || 'This post has no content.'}</ReactMarkdown>
        </div>

        <hr style={{ margin: '2rem 0', borderColor: '#333' }} />

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Link to="/" className="button">Back to list</Link>
          {canModify && (
            <>
              <Link to={`/edit/${id}`} className="button">Edit Post</Link>
              <button onClick={handleDelete} className="button button-danger">
                Delete Post
              </button>
            </>
          )}
        </div>
      </article>
    </main>
  );
}

export default PostDetail;