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
      showNotification('Sign up successful! Please check your email to confirm your account.', 'success');
      setEmail('');
      setPassword('');
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  return (
    <div className="form-container">
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Create Account</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password (at least 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <button type="submit" className="button button-primary" style={{ width: '100%' }}>Sign Up</button>
      </form>
    </div>
  );
}

export default SignUp;