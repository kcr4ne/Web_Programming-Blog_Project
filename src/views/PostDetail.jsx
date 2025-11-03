import React, { useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { deletePost, incrementPostView } from '../services/postService';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';
import ReactMarkdown from 'react-markdown';
import { usePost } from '../hooks/usePost';

function PostDetail() {
  const { slug } = useParams();
  const { post, loading } = usePost(slug);
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { showNotification } = useNotification();
  const viewIncremented = useRef(false);

  useEffect(() => {
    if (post && post.id && !viewIncremented.current) {
      incrementPostView(post.id);
      viewIncremented.current = true;
    }
  }, [post]);

  const handleDelete = async () => {
    const isConfirmed = window.confirm('이 게시물을 정말로 삭제하시겠습니까?');
    if (isConfirmed) {
      try {
        await deletePost(post.id);
        showNotification('게시물이 성공적으로 삭제되었습니다!', 'success');
        navigate('/');
      } catch (error) {
        showNotification(`게시물 삭제 오류: ${error.message}`, 'error');
      }
    }
  };

  const canModify = (user && post && user.uid === post.authorId) || isAdmin;

  if (loading) {
    return <p>게시물을 불러오는 중...</p>;
  }

  if (!post) {
    return (
      <div>
        <p>게시물을 찾을 수 없습니다.</p>
        <Link to="/">목록으로 돌아가기</Link>
      </div>
    );
  }

  const postDate = post.createdAt ? new Date(post.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }) : '날짜 없음';

  const authorName = post.profiles?.username || post.profiles?.email || '익명';

  return (
    <main className="post-detail">
      <article>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>{post.title}</h1>
        <p style={{ color: '#aaa', marginBottom: '2rem' }}>
          작성자: {authorName} &bull; 작성일: {postDate}
        </p>
        
        <div className="post-content" style={{ lineHeight: 1.7, fontSize: '1.1rem' }}>
          <ReactMarkdown>{post.content || '이 게시물에는 내용이 없습니다.'}</ReactMarkdown>
        </div>

        <hr style={{ margin: '2rem 0', borderColor: '#333' }} />

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Link to="/" className="button">목록으로 돌아가기</Link>
          {canModify && (
            <>
              <Link to={`/edit/${post.slug || post.id}`} className="button">게시물 수정</Link>
              <button onClick={handleDelete} className="button button-danger">
                게시물 삭제
              </button>
            </>
          )}
        </div>
      </article>
    </main>
  );
}

export default PostDetail;