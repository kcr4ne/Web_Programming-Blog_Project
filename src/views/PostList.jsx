import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPosts } from '../services/postService';
import { useAuth } from '../contexts/AuthContext';

function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('created_at'); // created_at for latest, views for popular
  const { user } = useAuth();

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true);
        const ascending = sortBy === 'created_at' ? false : false; // Both should be descending
        const data = await getPosts(sortBy, ascending);
        setPosts(data);
      } catch (error) {
        alert('Error fetching posts.');
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, [sortBy]);

  return (
    <main>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Posts</h2>
        <div>
          <button onClick={() => setSortBy('created_at')}>최신순</button>
          <button onClick={() => setSortBy('views')}>인기순</button>
          {user && <Link to="/new-post" style={{ marginLeft: '1rem' }}>Create New Post</Link>}
        </div>
      </div>
      {loading ? (
        <p>Loading posts...</p>
      ) : posts.length === 0 ? (
        <p>No posts found. (Check if the 'posts' table exists and has data in Supabase.)</p>
      ) : (
        <ul>
          {posts.map((post) => (
            <li key={post.id}>
              <Link to={`/posts/${post.id}`}>
                <h3>{post.title ?? 'Untitled Post'}</h3>
                <p>Views: {post.views ?? 0}</p> 
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

export default PostList;
