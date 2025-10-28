import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useMyPosts } from '../contexts/PostsContext';

const MyPostsSidebar = () => {
  const { user, loading: authLoading } = useAuth();
  const { myPosts, postsLoading } = useMyPosts();

  if (authLoading) {
    return (
      <aside style={{
        width: '250px',
        flexShrink: 0,
        padding: '1rem',
        backgroundColor: '#1a1a1a',
        borderRight: '1px solid #333',
        overflowY: 'auto'
      }}>
<h3 style={{ marginTop: 0, marginBottom: '1.5rem' }}>내 게시물</h3>
        <p>사용자 정보 로딩 중...</p>
      </aside>
    );
  }

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
      overflowY: 'auto'
    }}>
      <h3 style={{ marginTop: 0, marginBottom: '1.5rem' }}>My Posts</h3>
      {postsLoading ? (
        <p>로딩 중...</p>
      ) : myPosts.length === 0 ? (
        <p style={{ color: '#aaa' }}>아직 작성한 게시물이 없습니다.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {myPosts.map(post => (
            <li key={post.id}>
              <NavLink
                to={`/post/${post.slug}`}
                style={({ isActive }) => ({
                  color: isActive ? '#bb86fc' : 'inherit',
                  fontWeight: isActive ? 'bold' : 'normal',
                  display: 'block',
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  backgroundColor: isActive ? 'rgba(187, 134, 252, 0.1)' : 'transparent',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                })}
              >
                {post.title}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
};

export default MyPostsSidebar;
