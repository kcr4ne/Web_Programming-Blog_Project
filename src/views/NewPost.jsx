import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../services/postService';
import PostForm from '../components/PostForm';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';
import { useMyPosts } from '../contexts/PostsContext';

function NewPost() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const { addPost } = useMyPosts();

  const handleCreate = async (postData) => {
    if (!user) {
      showNotification('게시물을 작성하려면 로그인해야 합니다.', 'error');
      return;
    }

    try {
      setLoading(true);
      const newPosts = await createPost({ ...postData, user_id: user.id });
      if (newPosts && newPosts.length > 0) {
        const newPost = newPosts[0];
        showNotification('게시물이 성공적으로 작성되었습니다!', 'success');
        addPost(newPost); // Add the new post to the context state
        navigate(`/post/${newPost.slug}`);
      } else {
        throw new Error('게시물을 작성하지 못했습니다. 다시 시도해 주세요.');
      }
    } catch (error) {
      showNotification(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ maxWidth: '100%', padding: '0 2rem' }}>
      <h1 style={{ marginTop: 0 }}>새 게시물 작성</h1>
      <PostForm
        onSubmit={handleCreate}
        loading={loading}
        submitButtonText="게시물 작성"
      />
    </main>
  );
}

export default NewPost;