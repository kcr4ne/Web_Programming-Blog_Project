import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';
import { logout } from '../services/authService';

function ProfileDropdown() {
  const { user, profile, isAdmin, setAuthSession } = useAuth(); // Use the hook internally
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const handleToggle = () => setIsOpen(!isOpen);

  const handleLogout = async () => {
    try {
      await logout();
      // After logout, onAuthStateChanged in AuthContext will automatically update the state.
      navigate('/login');
      showNotification('성공적으로 로그아웃되었습니다.', 'success');
    } catch (err) {
      showNotification('로그아웃 중 오류가 발생했습니다.', 'error');
      console.error("Logout failed:", err);
    }
    setIsOpen(false); // Close dropdown
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // If auth is loading or user/profile is not available, render nothing.
  if (!user || !profile) {
    return null;
  }

  return (
    <div className="profile-dropdown" ref={dropdownRef}>
      <button onClick={handleToggle} className="profile-dropdown-toggle">
        {profile.username || profile.email}
      </button>
      {isOpen && (
        <div className="profile-dropdown-menu">
          {isAdmin && (
            <Link to="/admin/dashboard" className="dropdown-item" onClick={() => setIsOpen(false)}>
              관리자 대시보드
            </Link>
          )}
          <Link to="/edit-profile" className="dropdown-item" onClick={() => setIsOpen(false)}>프로필 수정</Link>
          <button onClick={handleLogout} className="dropdown-item dropdown-item-button">
            로그아웃
          </button>
        </div>
      )}
    </div>
  );
}

export default ProfileDropdown;