import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useSidebar } from '../hooks/useSidebar';
import { useSearch } from '../hooks/useSearch';
import { useDebounce } from '../hooks/useDebounce';
import ProfileDropdown from './ProfileDropdown';

const Navbar = () => {
  const { user } = useAuth();
  const { isSidebarVisible, toggleSidebar } = useSidebar();
  const navigate = useNavigate();

  // Search Input Logic
  const { searchQuery, setSearchQuery } = useSearch();
  const [inputValue, setInputValue] = useState(searchQuery);
  const debouncedSearchQuery = useDebounce(inputValue, 500);

  useEffect(() => {
    setSearchQuery(debouncedSearchQuery);
  }, [debouncedSearchQuery, setSearchQuery]);

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      zIndex: 1001,
      backgroundColor: '#000000',
      borderBottom: '1px solid #333',
    }}>
      {/* Sliding Container */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.5rem 2rem',
        marginLeft: isSidebarVisible && user ? '250px' : '0',
        transition: 'margin-left 0.3s ease-in-out',
      }}>
        {/* Left Section (Placeholder for spacing) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', visibility: 'hidden' }}>
          {user && (
            <button className={`hamburger-button`}>
              <span className="hamburger-box">
                <span className="hamburger-inner"></span>
              </span>
            </button>
          )}
          <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Blog</Link>
        </div>

        {/* Center Section: Search Bar */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', padding: '0 2rem' }}>
          <input
            type="search"
            placeholder="검색..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="form-input"
            style={{ maxWidth: '400px', width: '100%' }}
          />
        </div>

        {/* Right Section: New Post and Auth buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/new" className="button button-primary">새 게시물</Link>
          {user ? (
            <ProfileDropdown />
          ) : (
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Link to="/login" className="button">로그인</Link>
              <Link to="/signup" className="button button-primary">회원가입</Link>
            </div>
          )}
        </div>
      </div>

      {/* Static Left Section (Overlay) */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        padding: '0.5rem 2rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', transform: 'translateY(-6px)' }}>
          {user && (
            <button
              onClick={toggleSidebar}
              className={`hamburger-button ${isSidebarVisible ? 'is-active' : ''}`}>
              <span className="hamburger-box">
                <span className="hamburger-inner"></span>
              </span>
            </button>
          )}
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit', fontSize: '1.5rem', fontWeight: 'bold' }}>블로그</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
