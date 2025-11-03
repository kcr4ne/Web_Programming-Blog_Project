import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../services/postService';
import PostForm from '../components/PostForm';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';
import { PostsContext } from '../contexts/PostsContext';

function NewPost() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const { addPost, refetchMyPosts } = useContext(PostsContext);

  const handleCreate = async (postData) => {
    if (!user) {
      showNotification('게시물을 작성하려면 로그인해야 합니다.', 'error');
      throw new Error('User not authenticated'); // Throw error to re-enable form
    }

    try {
      const finalPostData = { ...postData, authorId: user.uid };
      const newPost = await createPost(finalPostData);

      if (newPost && newPost.id) {
        addPost(newPost);
        refetchMyPosts();
        showNotification('게시물이 성공적으로 작성되었습니다!', 'success');
        navigate(`/post/${newPost.slug || newPost.id}`);
      } else {
        throw new Error('게시물을 작성하지 못했습니다. 서버 응답이 없습니다.');
      }
    } catch (error) {
      showNotification(error.message, 'error');
      throw error; // Re-throw error so PostForm can catch it and re-enable the button
    }
  };

  return (
    <main style={{ maxWidth: '100%', padding: '0 2rem' }}>
      <h1 style={{ marginTop: 0 }}>새 게시물 작성</h1>
      <PostForm
        onSubmit={handleCreate}
        submitButtonText="게시물 작성"
      />
    </main>
  );
}

export default NewPost;