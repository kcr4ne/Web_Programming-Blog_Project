import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import PostItem from '../components/PostItem';
import { usePosts } from '../hooks/usePosts';
import { useSearch } from '../contexts/SearchContext';

function PostList() {
  const [sortBy, setSortBy] = useState('created_at'); // created_at for latest, views for popular
  const { posts, loading } = usePosts(sortBy);
  const { searchQuery } = useSearch();

  const filteredPosts = useMemo(() => {
    if (!searchQuery) return posts;
    return posts.filter(post =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [posts, searchQuery]);

  const noPostsFound = filteredPosts.length === 0;

  return (
    <section>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => setSortBy('created_at')} disabled={sortBy === 'created_at'} className="button">최신순</button>
          <button onClick={() => setSortBy('views')} disabled={sortBy === 'views'} className="button">인기순</button>
        </div>
      </div>
      
      {loading ? (
        <p>게시물을 불러오는 중...</p>
      ) : noPostsFound ? (
        <div style={{ textAlign: 'center', padding: '4rem', border: '1px dashed #444', borderRadius: '8px' }}>
          <h3>{searchQuery ? `'${searchQuery}'에 대한 검색 결과가 없습니다.` : '게시물을 찾을 수 없습니다.'}</h3>
          <p>{searchQuery ? '다른 검색어를 시도해 보세요.' : '첫 번째 게시물을 작성해 보세요.'}</p>
        </div>
      ) : (
        <div className="post-list">
          {filteredPosts.map((post) => (
            <PostItem key={post.id} post={post} />
          ))}
        </div>
      )}
    </section>
  );
}

export default PostList;