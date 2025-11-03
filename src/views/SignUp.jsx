import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signUp } from '../services/authService';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification'; // Import useNotification

function SignUp() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showNotification } = useNotification();

  // If user is already logged in, redirect to home
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      showNotification('비밀번호가 일치하지 않습니다.', 'error');
      return;
    }
    setLoading(true);
    try {
      await signUp(username, password);
      showNotification('회원가입이 완료되었습니다! 자동으로 로그인됩니다.', 'success');
      navigate('/');
    } catch (error) {
      showNotification(error.message || '회원가입에 실패했습니다.', 'error');
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>계정 생성</h2>
      <form onSubmit={handleSignUp}> {/* Corrected onSubmit handler */}
        <div className="form-group">
          <label htmlFor="username">사용자 이름</label>
          <input
            id="username"
            type="text"
            placeholder="사용자 이름"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">비밀번호</label>
          <input
            id="password"
            type="password"
            placeholder="비밀번호 (6자 이상)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">비밀번호 확인</label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="비밀번호 확인"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <button type="submit" disabled={loading} className="button button-primary" style={{ width: '100%' }}>
          {loading ? '가입 중...' : '가입하기'}
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '2rem' }}>
        이미 계정이 있으신가요? <Link to="/login">로그인</Link>
      </p>
    </div>
  );
}

export default SignUp;
