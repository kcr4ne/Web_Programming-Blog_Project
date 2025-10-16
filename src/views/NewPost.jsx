import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../services/postService';
import PostForm from '../components/PostForm';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';

function NewPost() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showNotification } = useNotification();

  const handleCreate = async (postData) => {
    if (!user) {
      showNotification('You must be logged in to create a post.', 'error');
      return;
    }

    try {
      setLoading(true);
      const newPosts = await createPost({ ...postData, user_id: user.id });
      if (newPosts && newPosts.length > 0) {
        const newPostId = newPosts[0].id;
        showNotification('Post created successfully!', 'success');
        navigate(`/post/${newPostId}`);
      } else {
        throw new Error('Failed to create post. Please try again.');
      }
    } catch (error) {
      showNotification(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <h2>Create a New Post</h2>
      <PostForm
        onSubmit={handleCreate}
        loading={loading}
        submitButtonText="Create Post"
      />
    </main>
  );
}

export default NewPost;