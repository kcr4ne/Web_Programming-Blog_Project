import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getPostById, deletePost, incrementPostView } from '../services/postService';
import { useAuth } from '../contexts/AuthContext';

function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();
  const effectRan = useRef(false);

  useEffect(() => {
    if (effectRan.current === false) {
      // Increment view count without waiting for it to finish
      incrementPostView(id);

      async function fetchPost() {
        try {
          setLoading(true);
          const data = await getPostById(id);
          setPost(data);
        } catch (error) {
          alert('Error fetching post.');
        } finally {
          setLoading(false);
        }
      }

      fetchPost();

      // Mark that the effect has run
      return () => {
        effectRan.current = true;
      };
    }
  }, [id]);

  const handleDelete = async () => {
    const isConfirmed = window.confirm('Are you sure you want to delete this post?');
    if (isConfirmed) {
      try {
        await deletePost(id);
        alert('Post deleted successfully!');
        navigate('/');
      } catch (error) {
        alert(`Error deleting post: ${error.message}`);
      }
    }
  };

  const isAuthor = user && post && user.id === post.user_id;

  return (
    <main>
      {loading ? (
        <p>Loading post...</p>
      ) : !post ? (
        <div>
          <p>Post not found.</p>
          <Link to="/">Back to list</Link>
        </div>
      ) : (
        <article>
          <h2>{post.title}</h2>
          <p>{post.content ?? 'This post has no content.'}</p>
          <hr />
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Link to="/">Back to list</Link>
            {isAuthor && (
              <>
                <Link to={`/edit-post/${id}`}>Edit Post</Link>
                <button onClick={handleDelete} style={{ background: '#ff4d4d', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}>
                  Delete Post
                </button>
              </>
            )}
          </div>
        </article>
      )}
    </main>
  );
}

export default PostDetail;
