import React, { useState } from 'react';
import { signUp } from '../services/authService';
import { useNotification } from '../hooks/useNotification';

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { showNotification } = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signUp(email, password);
      showNotification('가입이 완료되었습니다! 이메일을 확인하여 계정을 활성화해주세요.', 'success');
      setEmail('');
      setPassword('');
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  return (
    <div className="form-container">
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>계정 생성</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="비밀번호 (6자 이상)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <button type="submit" className="button button-primary" style={{ width: '100%' }}>가입하기</button>
      </form>
    </div>
  );
}

export default SignUp;