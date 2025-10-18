import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Notification from './components/Notification';
import MyPostsSidebar from './components/MyPostsSidebar';
import PostList from './views/PostList';
import PostDetail from './views/PostDetail';
import NewPost from './views/NewPost';
import EditPost from './views/EditPost';
import SignUp from './views/SignUp';
import Login from './views/Login';
import PrivateRoute from './components/PrivateRoute';
import { PostsProvider } from './contexts/PostsContext';
import { SearchProvider } from './contexts/SearchContext';

function App() {
  return (
    <div className="App">
      <SearchProvider>
        <Navbar />
        <Notification />
        <PostsProvider>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <MyPostsSidebar />
            <main style={{ flex: 1, padding: '1rem 2rem' }}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<PostList />} />
                <Route path="/post/:id" element={<PostDetail />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/login" element={<Login />} />

                {/* Protect routes that require authentication */}
                <Route element={<PrivateRoute />}>
                  <Route path="/new" element={<NewPost />} />
                  <Route path="/edit/:id" element={<EditPost />} />
                </Route>
              </Routes>
            </main>
          </div>
        </PostsProvider>
      </SearchProvider>
    </div>
  );
}

export default App;