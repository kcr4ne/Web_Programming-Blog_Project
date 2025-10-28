import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

function ProfileDropdown({ user, profile, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleToggle = () => setIsOpen(!isOpen);

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

  if (!profile) {
    return null;
  }

  return (
    <div className="profile-dropdown" ref={dropdownRef}>
      <button onClick={handleToggle} className="profile-dropdown-toggle">
        {profile.username || user.email}
      </button>
      {isOpen && (
        <div className="profile-dropdown-menu">
          <Link to="/edit-profile" className="dropdown-item dropdown-item-button">프로필 수정</Link>
          <button onClick={onLogout} className="dropdown-item dropdown-item-button">
            로그아웃
          </button>
        </div>
      )}
    </div>
  );
}

export default ProfileDropdown;
