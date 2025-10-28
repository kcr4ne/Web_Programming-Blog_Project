import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';
import { logout } from '../services/authService';
import { useSearch } from '../contexts/SearchContext';
import { useSidebar } from '../contexts/SidebarContext';
import ProfileDropdown from './ProfileDropdown';

const Navbar = () => {
  const { user, profile, setAuthSession } = useAuth();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  
  const { toggleSidebar, isSidebarVisible } = useSidebar();

  const handleLogout = () => {
    logout().catch(err => console.error("Background logout failed:", err));
    setAuthSession(null);
    navigate('/login');
    showNotification('성공적으로 로그아웃되었습니다.', 'success');
  };

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem',
      backgroundColor: '#1a1a1a',
      color: 'white',
      borderBottom: '1px solid #333'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button 
          className={`hamburger-button ${isSidebarVisible ? 'is-active' : ''}`}
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <span className="hamburger-box">
            <span className="hamburger-inner"></span>
          </span>
        </button>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem', fontWeight: 'bold' }}>
          블로그
        </Link>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {user ? (
            <>
              <Link to="/new" className="button">
                새 게시물
              </Link>
              <ProfileDropdown user={user} profile={profile} onLogout={handleLogout} />
            </>
          ) : (
            <>
              <Link to="/login" className="button">
                로그인
              </Link>
              <Link to="/signup" className="button button-primary">
                가입하기
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
