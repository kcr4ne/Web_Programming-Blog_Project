import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useMyPosts } from '../hooks/useMyPosts';
import { useSidebar } from '../hooks/useSidebar';

const MyPostsSidebar = () => {
  const { user, loading: authLoading } = useAuth();
  const { myPosts, postsLoading } = useMyPosts();
  const { isSidebarVisible } = useSidebar();

  const sidebarStyle = {
    width: '250px',
    flexShrink: 0,
    padding: '1rem',
    backgroundColor: '#000000',
    borderRight: '1px solid #333',
    overflowY: 'auto',
    position: 'fixed',
    top: '70px',
    left: 0,
    height: 'calc(100vh - 70px)',
    transform: isSidebarVisible ? 'translateX(0)' : 'translateX(-100%)',
    transition: 'transform 0.3s ease-in-out',
    zIndex: 1000,
  };

  if (authLoading) {
    return (
      <aside style={sidebarStyle} className="custom-scrollbar">
<h3 style={{ marginTop: 0, marginBottom: '1.5rem' }}>내 게시물</h3>
        <p>사용자 정보를 불러오는 중...</p>
      </aside>
    );
  }

  if (!user) {
    return null; // Don't render anything if not logged in
  }

  return (
    <aside style={sidebarStyle} className="custom-scrollbar">
      <h3 style={{ marginTop: 0, marginBottom: '1.5rem' }}>내 게시물</h3>
      {postsLoading ? (
        <p>게시물을 불러오는 중...</p>
      ) : myPosts.length === 0 ? (
        <p style={{ color: '#aaa' }}>아직 작성한 게시물이 없습니다.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {myPosts.map(post => (
            <li key={post.id}>
              <NavLink
                to={`/post/${post.slug || post.id}`}
                end // Add this prop
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
