import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { updatePost } from '../services/postService';
import PostForm from '../components/PostForm';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';
import { usePost } from '../hooks/usePost';

function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin, loading: authLoading } = useAuth();
  const { showNotification } = useNotification();
  const { post: initialData, loading: postLoading } = usePost(id);
  const [formLoading, setFormLoading] = useState(false);

  // Security check: Redirect if not the author or admin
  useEffect(() => {
    if (authLoading || postLoading) return;

    const isOwner = initialData && user && user.id === initialData.user_id;

    if (!user || (!isOwner && !isAdmin)) {
      showNotification('이 게시물을 수정할 권한이 없습니다.', 'error');
      navigate('/');
    }
  }, [user, initialData, authLoading, postLoading, navigate, showNotification, isAdmin]);

  const handleUpdate = async (postData) => {
    try {
      setFormLoading(true);
      await updatePost(id, postData);
      showNotification('게시물이 성공적으로 업데이트되었습니다!', 'success');
      navigate(`/post/${id}`);
    } catch (error) {
      showNotification(`게시물 업데이트 오류: ${error.message}`, 'error');
    } finally {
      setFormLoading(false);
    }
  };

  if (authLoading || postLoading || !initialData) {
    return <p>로딩 및 확인 중...</p>;
  }

  // Final check to ensure the correct user is editing
  if (!user || (user.id !== initialData.user_id && !isAdmin)) {
    return <p>사용자 확인 중...</p>;
  }

  return (
    <main>
      <h2>게시물 수정</h2>
      <PostForm
        initialData={initialData}
        onSubmit={handleUpdate}
        loading={formLoading}
        submitButtonText="게시물 업데이트"
      />
    </main>
  );
}

export default EditPost;