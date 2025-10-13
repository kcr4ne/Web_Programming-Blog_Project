import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../services/postService';
import PostForm from '../components/PostForm';
import { useAuth } from '../contexts/AuthContext';

function NewPost() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleCreate = async (postData) => {
    if (!user) {
      alert('You must be logged in to create a post.');
      return;
    }

    try {
      setLoading(true);
      await createPost({ ...postData, user_id: user.id });
      alert('Post created successfully!');
      navigate('/');
    } catch (error) {
      alert(`Error creating post: ${error.message}`);
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
