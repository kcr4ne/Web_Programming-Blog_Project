import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';
import { updateProfile } from '../services/userService';
import { updatePassword } from '../services/authService';

const EditProfile = () => {
  const { user, profile, fetchProfile } = useAuth();
  const { showNotification } = useNotification();

  const [username, setUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (profile) {
      setUsername(profile.username || '');
    }
  }, [profile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Password validation
    if (newPassword && newPassword !== confirmPassword) {
      showNotification('새 비밀번호가 일치하지 않습니다.', 'error');
      setIsSubmitting(false);
      return;
    }
    if (newPassword && newPassword.length < 6) {
      showNotification('비밀번호는 6자 이상이어야 합니다.', 'error');
      setIsSubmitting(false);
      return;
    }

    try {
      let updated = false;

      // 1. Update username if changed
      if (username !== profile.username) {
        await updateProfile(user.id, { username });
        updated = true;
      }

      // 2. Update password if provided
      if (newPassword) {
        await updatePassword(newPassword);
        updated = true;
      }

      if (updated) {
        await fetchProfile(user); // Refresh profile data in context
        showNotification('프로필이 성공적으로 업데이트되었습니다.', 'success');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        showNotification('변경 사항이 없습니다.', 'info');
      }

    } catch (error) {
      showNotification(error.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!profile) {
    return <div>프로필을 불러오는 중...</div>;
  }

  return (
    <div className="form-container">
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>프로필 수정</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">아이디</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">이메일 (변경 불가)</label>
          <input
            id="email"
            type="email"
            value={user.email}
            disabled
            className="form-input"
          />
        </div>
        <hr style={{ margin: '2rem 0' }} />
        <h3 style={{ marginBottom: '1rem' }}>비밀번호 변경</h3>
        <div className="form-group">
          <input
            type="password"
            placeholder="새 비밀번호 (6자 이상)"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="새 비밀번호 확인"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="form-input"
          />
        </div>
        <button type="submit" className="button button-primary" style={{ width: '100%' }} disabled={isSubmitting}>
          {isSubmitting ? '저장 중...' : '저장하기'}
        </button>
      </form>
    </div>
  );
};

export default EditProfile;