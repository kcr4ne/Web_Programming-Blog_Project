import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { updatePost } from '../services/postService';
import PostForm from '../components/PostForm';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';
import { usePost } from '../hooks/usePost';

function EditPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin, loading: authLoading } = useAuth();
  const { showNotification } = useNotification();
  
  const { post, loading: postLoading } = usePost(slug);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async (postData) => {
    if (!post || !post.id) return;
    setIsUpdating(true);
    try {
      const updatedPost = await updatePost(post.id, postData);
      showNotification('게시물이 성공적으로 업데이트되었습니다!', 'success');
      navigate(`/post/${updatedPost.slug || post.id}`);
    } catch (error) {
      showNotification(`게시물 업데이트 오류: ${error.message}`, 'error');
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    if (authLoading || postLoading) return;
    if (!post) {
      showNotification('수정할 게시물을 찾을 수 없습니다.', 'error');
      navigate('/');
      return;
    }
    const isOwner = user && user.uid === post.authorId;
    if (!isOwner && !isAdmin) {
      showNotification('이 게시물을 수정할 권한이 없습니다.', 'error');
      navigate('/');
    }
  }, [authLoading, postLoading, post, user, isAdmin, navigate, showNotification]);

  if (postLoading || authLoading || !post) {
    return <p>게시물 정보를 불러오고 권한을 확인하는 중...</p>;
  }
  
  const isOwner = user && user.uid === post.authorId;
  if (!isOwner && !isAdmin) {
      return <p>권한이 없어 페이지를 이동합니다...</p>;
  }

  return (
    <main>
      <h2 style={{ marginTop: 0, marginBottom: '2rem' }}>게시물 수정</h2>
      <PostForm
        initialData={post}
        onSubmit={handleUpdate}
        loading={isUpdating}
        submitButtonText="게시물 업데이트"
      />
    </main>
  );
}

export default EditPost;
