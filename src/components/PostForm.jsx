import React, { useState, useEffect } from 'react';

function PostForm({ initialData = {}, onSubmit, loading, submitButtonText = 'Submit' }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    // Only set form data if we are editing (i.e., initialData has an id)
    if (initialData && initialData.id) {
      setTitle(initialData.title || '');
      setContent(initialData.content || '');
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) {
      alert('Title is required.');
      return;
    }
    onSubmit({ title, content });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Saving...' : submitButtonText}
      </button>
    </form>
  );
}

export default PostForm;
