import React, { useState, useEffect, useRef } from 'react';
import { uploadImage } from '../services/postService';
import { useNotification } from '../hooks/useNotification';

function PostForm({ initialData = {}, onSubmit, loading, submitButtonText = 'Submit' }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const contentRef = useRef(null);
  const { showNotification } = useNotification();

  useEffect(() => {
    if (initialData && initialData.id) {
      setTitle(initialData.title || '');
      setContent(initialData.content || '');
    }
  }, [initialData]);

  const handlePaste = async (e) => {
    const imageFile = Array.from(e.clipboardData.files).find(file => file.type.startsWith('image/'));
    if (!imageFile) return;

    e.preventDefault();
    const placeholder = `
![Uploading ${imageFile.name}...]()
`;
    const textarea = contentRef.current;
    const cursorPosition = textarea.selectionStart;

    const newContent = `${content.substring(0, cursorPosition)}${placeholder}${content.substring(cursorPosition)}`;
    setContent(newContent);

    try {
      showNotification('Uploading image...', 'info');
      const imageUrl = await uploadImage(imageFile);
      const finalMarkdown = `
![${imageFile.name}](${imageUrl})
`;
      setContent(currentContent => currentContent.replace(placeholder, finalMarkdown));
      showNotification('Image uploaded successfully!', 'success');
    } catch (error) {
      console.error('Image upload failed:', error);
      setContent(currentContent => currentContent.replace(placeholder, '\n[Image upload failed]\n'));
      showNotification('Image upload failed.', 'error');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) {
      showNotification('Title is required.', 'error');
      return;
    }
    onSubmit({ title, content });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="form-input"
        />
      </div>
      <div className="form-group">
        <label htmlFor="content">Content (paste an image!)</label>
        <textarea
          id="content"
          ref={contentRef}
          value={content}
          onPaste={handlePaste}
          onChange={(e) => setContent(e.target.value)}
          className="form-input"
        />
      </div>
      <button type="submit" disabled={loading} className="button button-primary">
        {loading ? 'Saving...' : submitButtonText}
      </button>
    </form>
  );
}

export default PostForm;