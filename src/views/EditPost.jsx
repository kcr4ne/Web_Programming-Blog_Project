import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPostById, updatePost } from '../services/postService';
import PostForm from '../components/PostForm';
import { useAuth } from '../contexts/AuthContext';

function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    async function fetchPost() {
      try {
        setLoading(true);
        const data = await getPostById(id);
        setInitialData(data);
      } catch (error) {
        alert('Error fetching post data.');
        navigate('/');
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [id, navigate]);

  // Security check: Redirect if not the author
  useEffect(() => {
    if (loading) return; // Wait for post data to load

    if (!user || (initialData && user.id !== initialData.user_id)) {
      alert('You are not authorized to edit this post.');
      navigate('/');
    }
  }, [user, initialData, loading, navigate]);

  const handleUpdate = async (postData) => {
    try {
      setFormLoading(true);
      await updatePost(id, postData);
      alert('Post updated successfully!');
      navigate(`/posts/${id}`);
    } catch (error) {
      alert(`Error updating post: ${error.message}`);
    } finally {
      setFormLoading(false);
    }
  };

  // Render nothing or a loader while security check is performed
  if (loading || !initialData || !user || user.id !== initialData.user_id) {
    return <p>Loading and verifying...</p>;
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
