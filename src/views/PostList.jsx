import React, { useState, useEffect } from 'react';
import PostItem from '../components/PostItem';
import Pagination from '../components/Pagination';
import { usePosts } from '../hooks/usePosts';

function PostList() {
  const [sortBy, setSortBy] = useState('createdAt');
  const { posts, loading, error, currentPage, totalPages, handlePageChange } = usePosts(sortBy);

  const noPostsFound = !loading && posts.length === 0;

  return (
    <section>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => setSortBy('createdAt')} disabled={sortBy === 'createdAt'} className="button">최신순</button>
          <button onClick={() => setSortBy('views')} disabled={sortBy === 'views'} className="button">인기순</button>
        </div>
        {/* Search input is temporarily disabled */}
      </div>
      
      {loading ? (
        <p>게시물을 불러오는 중...</p>
      ) : noPostsFound ? (
        <div style={{ textAlign: 'center', padding: '4rem', border: '1px dashed #444', borderRadius: '8px' }}>
          <h3>게시물을 찾을 수 없습니다.</h3>
          <p>첫 번째 게시물을 작성해 보세요.</p>
        </div>
      ) : (
        <>
          <div className="post-list">
            {posts.map((post) => (
              <PostItem key={post.id} post={post} />
            ))}
          </div>
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
      {error && <p style={{ color: 'red' }}>오류: {error.message}</p>}
    </section>
  );
}

export default PostList;