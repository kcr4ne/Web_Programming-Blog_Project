import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { usePosts } from '../hooks/usePosts';

const MyPostsSidebar = () => {
  const { user } = useAuth();
  // We pass the userId to our custom hook.
  // The hook will refetch automatically when userId changes.
  const { posts: myPosts, loading } = usePosts(undefined, user?.id);
  const location = useLocation();

  

  if (!user) {
    return null; // Don't render anything if not logged in
  }

  return (
    <aside style={{
      width: '250px',
      flexShrink: 0,
      padding: '1rem',
      backgroundColor: '#1a1a1a',
      borderRight: '1px solid #333',
      height: 'calc(100vh - 70px)', // Adjust height based on Navbar
      overflowY: 'auto'
    }}>
      <h3 style={{ marginTop: 0, marginBottom: '1.5rem' }}>My Posts</h3>
      {loading ? (
        <p>Loading...</p>
      ) : myPosts.length === 0 ? (
        <p style={{ color: '#aaa' }}>You haven't written any posts yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {myPosts.map(post => (
            <li key={post.id}>
              <Link
                to={`/post/${post.id}`}
                style={{
                  color: location.pathname === `/post/${post.id}` ? '#bb86fc' : 'inherit',
                  fontWeight: location.pathname === `/post/${post.id}` ? 'bold' : 'normal',
                  display: 'block',
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  backgroundColor: location.pathname === `/post/${post.id}` ? 'rgba(187, 134, 252, 0.1)' : 'transparent',
                }}
              >
                {post.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
};

export default MyPostsSidebar;
