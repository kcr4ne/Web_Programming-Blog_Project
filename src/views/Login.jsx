import React, { useState, useEffect } from 'react'; // Import useEffect
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/authService';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(username, password);
      // AuthContext's onAuthStateChanged will handle setting the user state.
      showNotification('성공적으로 로그인되었습니다!', 'success');
      navigate('/'); // Redirect to home page on successful login
    } catch (error) {
      showNotification(error.message || '로그인에 실패했습니다.', 'error');
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>로그인</h2>
      <form onSubmit={handleLogin}> {/* Corrected from handleSubmit to handleLogin */}
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
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <button type="submit" disabled={loading} className="button button-primary" style={{ width: '100%' }}>
          {loading ? '로그인 중...' : '로그인'}
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '2rem' }}>
        계정이 없으신가요? <Link to="/signup">회원가입</Link>
      </p>
    </div>
  );
}

export default Login;
