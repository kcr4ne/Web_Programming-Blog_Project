import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';
import { logout } from '../services/authService';

import { useSearch } from '../contexts/SearchContext';

const Navbar = () => {
  const { user, setAuthSession } = useAuth(); // Get setAuthSession from context
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const { searchQuery, setSearchQuery } = useSearch();

  const handleLogout = () => {
    // Fire-and-forget the server-side logout.
    logout().catch(err => console.error("Background logout failed:", err));

    // Immediately clear the client-side session and UI state.
    setAuthSession(null);
    
    navigate('/login');
    showNotification('성공적으로 로그아웃되었습니다.', 'success');
  };

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 2rem',
      backgroundColor: '#1a1a1a',
      color: 'white',
      borderBottom: '1px solid #333'
    }}>
      <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem', fontWeight: 'bold' }}>
        블로그
      </Link>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {user && (
          <input
            type="search"
            placeholder="게시글 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input"
            style={{ width: '250px' }} // Adjust width as needed
          />
        )}
        <div style={{ display: 'flex', gap: '1rem' }}>
          {user ? (
            <>
              <Link to="/new" className="button">
                새 게시물
              </Link>
              <button onClick={handleLogout} className="button">
                로그아웃
              </button>
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
