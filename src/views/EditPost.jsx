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
      showNotification('You are not authorized to edit this post.', 'error');
      navigate('/');
    }
  }, [user, initialData, authLoading, postLoading, navigate, showNotification, isAdmin]);

  const handleUpdate = async (postData) => {
    try {
      setFormLoading(true);
      await updatePost(id, postData);
      showNotification('Post updated successfully!', 'success');
      navigate(`/post/${id}`);
    } catch (error) {
      showNotification(`Error updating post: ${error.message}`, 'error');
    } finally {
      setFormLoading(false);
    }
  };

  if (authLoading || postLoading || !initialData) {
    return <p>Loading and verifying...</p>;
  }

  // Final check to ensure the correct user is editing
  if (!user || (user.id !== initialData.user_id && !isAdmin)) {
    return <p>Verifying user...</p>;
  }

  return (
    <main>
      <h2>Edit Post</h2>
      <PostForm
        initialData={initialData}
        onSubmit={handleUpdate}
        loading={formLoading}
        submitButtonText="Update Post"
      />
    </main>
  );
}

export default EditPost;