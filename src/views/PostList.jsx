import React, { useState, useEffect } from 'react';
import PostItem from '../components/PostItem';
import { usePosts } from '../hooks/usePosts';
import { useSearch } from '../contexts/SearchContext';
import { useDebounce } from '../hooks/useDebounce';

const POSTS_PER_PAGE = 12;

function PostList() {
  const [sortBy, setSortBy] = useState('created_at');
  const { searchQuery, setSearchQuery } = useSearch();
  const [inputValue, setInputValue] = useState(searchQuery);
  const debouncedSearchQuery = useDebounce(inputValue, 500);

  useEffect(() => {
    setSearchQuery(debouncedSearchQuery);
  }, [debouncedSearchQuery, setSearchQuery]);

  const { posts, loading, totalCount, currentPage, setCurrentPage } = usePosts(sortBy, searchQuery);

  const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE);
  const noPostsFound = !loading && posts.length === 0;
  
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    for (let i = 0; i < totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          disabled={currentPage === i}
          className="button"
          style={{ fontWeight: currentPage === i ? 'bold' : 'normal' }}
        >
          {i + 1}
        </button>
      );
    }

    return (
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem' }}>
        <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 0} className="button">
          이전
        </button>
        {pageNumbers}
        <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages - 1} className="button">
          다음
        </button>
      </div>
    );
  };

  return (
    <section>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => setSortBy('created_at')} disabled={sortBy === 'created_at'} className="button">최신순</button>
          <button onClick={() => setSortBy('views')} disabled={sortBy === 'views'} className="button">인기순</button>
        </div>
        <input
          type="search"
          placeholder="게시글 검색..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="form-input"
          style={{ width: '250px' }}
        />
      </div>
      
      {loading ? (
        <p>게시물을 불러오는 중...</p>
      ) : noPostsFound ? (
        <div style={{ textAlign: 'center', padding: '4rem', border: '1px dashed #444', borderRadius: '8px' }}>
          <h3>{searchQuery ? `'${searchQuery}'에 대한 검색 결과가 없습니다.` : '게시물을 찾을 수 없습니다.'}</h3>
          <p>{searchQuery ? '다른 검색어를 시도해 보세요.' : '첫 번째 게시물을 작성해 보세요.'}</p>
        </div>
      ) : (
        <>
          <div className="post-list">
            {posts.map((post) => (
              <PostItem key={post.id} post={post} />
            ))}
          </div>
          {renderPagination()}
        </>
      )}
    </section>
  );
}

export default PostList;