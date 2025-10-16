import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PostItem from '../components/PostItem';
import { usePosts } from '../hooks/usePosts';

function PostList() {
  const [sortBy, setSortBy] = useState('created_at'); // created_at for latest, views for popular
  const { posts, loading } = usePosts(sortBy);

  return (
    <section>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => setSortBy('created_at')} disabled={sortBy === 'created_at'} className="button">최신순</button>
          <button onClick={() => setSortBy('views')} disabled={sortBy === 'views'} className="button">인기순</button>
        </div>
      </div>
      
      {loading ? (
        <p>Loading posts...</p>
      ) : posts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', border: '1px dashed #444', borderRadius: '8px' }}>
          <h3>No posts found.</h3>
          <p>Why not be the first to write one?</p>
        </div>
      ) : (
        <div className="post-list">
          {posts.map((post) => (
            <PostItem key={post.id} post={post} />
          ))}
        </div>
      )}
    </section>
  );
}

export default PostList;