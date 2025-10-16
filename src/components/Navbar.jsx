import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';
import { logout } from '../services/authService';

const Navbar = () => {
  const { user, setAuthSession } = useAuth(); // Get setAuthSession from context
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const handleLogout = () => {
    // Fire-and-forget the server-side logout.
    logout().catch(err => console.error("Background logout failed:", err));

    // Immediately clear the client-side session and UI state.
    setAuthSession(null);
    
    navigate('/login');
    showNotification('Successfully logged out.', 'success');
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
        Blog
      </Link>
      <div style={{ display: 'flex', gap: '1rem' }}>
        {user ? (
          <>
            <Link to="/new" className="button">
              New Post
            </Link>
            <button onClick={handleLogout} className="button">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="button">
              Login
            </Link>
            <Link to="/signup" className="button button-primary">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
