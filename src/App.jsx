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
import { PostsProvider } from './contexts/PostsContext';
import { SearchProvider } from './contexts/SearchContext';
import { useSidebar } from './contexts/SidebarContext';

function App() {
  const location = useLocation();
  const { isSidebarVisible } = useSidebar();

  const fullWidthPages = ['/new', '/edit', '/login', '/signup', '/edit-profile'];
  const isFullWidthPage = fullWidthPages.some(path => location.pathname.startsWith(path));

  const showSidebar = !isFullWidthPage && isSidebarVisible;

  return (
    <div className="App">
      <SearchProvider>
        <Navbar />
        <Notification />
        <PostsProvider>
          <div style={{ display: 'flex', gap: showSidebar ? '2rem' : 0, minHeight: 'calc(100vh - 70px)' }}>
            {showSidebar && <MyPostsSidebar />}
            <main style={{ flex: 1, padding: '1rem 2rem', maxWidth: showSidebar ? 'calc(100% - 250px - 2rem)' : '100%' }}>
              <Routes>
                <Route path="/" element={<PostList />} />
                <Route path="/post/:slug" element={<PostDetail />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/login" element={<Login />} />
                <Route element={<PrivateRoute />}>
                  <Route path="/new" element={<NewPost />} />
                  <Route path="/edit/:slug" element={<PrivateRoute><EditPost /></PrivateRoute>} />
                  <Route path="/edit-profile" element={<EditProfile />} />
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