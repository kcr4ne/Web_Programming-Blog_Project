import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Notification from './components/Notification';
import MyPostsSidebar from './components/MyPostsSidebar';
import PostList from './views/PostList';
import PostDetail from './views/PostDetail';
import NewPost from './views/NewPost';
import EditPost from './views/EditPost';
import SignUp from './views/SignUp';
import Login from './views/Login';
import EditProfile from './views/EditProfile';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import AdminDashboard from './views/AdminDashboard';
import { PostsProvider } from './contexts/PostsContext';
import { SearchProvider } from './contexts/SearchContext';
import { useSidebar } from './hooks/useSidebar';
import { useAuth } from './hooks/useAuth';

// Layout for main content (with sidebar)
const MainLayout = () => {
  const { isSidebarVisible } = useSidebar();
  const { user } = useAuth();

  return (
    <div style={{ display: 'flex', paddingTop: '70px', minHeight: 'calc(100vh - 70px)', position: 'relative' }}>
      {user && <MyPostsSidebar />}
      <main style={{
        flex: 1,
        padding: '1rem 2rem',
        marginLeft: isSidebarVisible && user ? '250px' : '0',
        transition: 'margin-left 0.3s ease-in-out',
      }}>
        <Routes>
          <Route path="/" element={<PostList />} />
          <Route path="/post/:slug" element={<PostDetail />} />
          <Route element={<PrivateRoute />}>
            <Route path="/new" element={<NewPost />} />
            <Route path="/edit/:slug" element={<EditPost />} />
            <Route path="/edit-profile" element={<EditProfile />} />
          </Route>
          <Route element={<AdminRoute />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <SearchProvider>
        <PostsProvider>
          <Navbar />
          <Notification />
          <Routes>
            {/* Routes that should not have the main layout */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            
            {/* All other routes use the MainLayout */}
            <Route path="*" element={<MainLayout />} />
          </Routes>
        </PostsProvider>
      </SearchProvider>
    </div>
  );
}

export default App;