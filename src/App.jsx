import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import PostList from './views/PostList';
import PostDetail from './views/PostDetail';
import NewPost from './views/NewPost';
import EditPost from './views/EditPost';
import SignUp from './views/SignUp';
import Login from './views/Login';
import { useAuth } from './contexts/AuthContext';
import { logout } from './services/authService';

function App() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="App">
      <header>
        <h1><Link to="/">My Blog</Link></h1>
        <nav>
          {user ? (
            <>
              <span>{user.email}</span>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/signup">Sign Up</Link>
              <Link to="/login">Login</Link>
            </>
          )}
        </nav>
      </header>
      <Routes>
        <Route path="/" element={<PostList />} />
        <Route path="/posts/:id" element={<PostDetail />} />
        <Route path="/new-post" element={<NewPost />} />
        <Route path="/edit-post/:id" element={<EditPost />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
