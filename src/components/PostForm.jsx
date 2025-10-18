import React, { useState, useEffect, useRef } from 'react';
import { uploadImage } from '../services/postService';
import { useNotification } from '../hooks/useNotification';

function PostForm({ initialData = {}, onSubmit, loading, submitButtonText = '제출' }) {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const contentRef = useRef(null);
  const { showNotification } = useNotification();

  useEffect(() => {
    if (initialData && initialData.id) {
      setTitle(initialData.title || '');
      setSummary(initialData.summary || '');
      setContent(initialData.content || '');
    }
  }, [initialData]);

  const handlePaste = async (e) => {
    const imageFile = Array.from(e.clipboardData.files).find(file => file.type.startsWith('image/'));
    if (!imageFile) return;

    e.preventDefault();
    const placeholder = `
![이미지 업로드 중 ${imageFile.name}...]()
`;
    const textarea = contentRef.current;
    const cursorPosition = textarea.selectionStart;

    const newContent = `${content.substring(0, cursorPosition)}${placeholder}${content.substring(cursorPosition)}`;
    setContent(newContent);

    try {
      showNotification('이미지 업로드 중...', 'info');
      const imageUrl = await uploadImage(imageFile);
      const finalMarkdown = `
![${imageFile.name}](${imageUrl})
`;
      setContent(currentContent => currentContent.replace(placeholder, finalMarkdown));
      showNotification('이미지가 성공적으로 업로드되었습니다!', 'success');
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      setContent(currentContent => currentContent.replace(placeholder, '\n[이미지 업로드 실패]\n'));
      showNotification('이미지 업로드 실패.', 'error');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) {
      showNotification('제목은 필수입니다.', 'error');
      return;
    }
    onSubmit({ title, summary, content });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="title">제목</label>
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
        <label htmlFor="summary">요약</label>
        <textarea
          id="summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          className="form-input"
          rows="3"
        />
      </div>
      <div className="form-group">
        <label htmlFor="content">내용 (이미지를 붙여넣으세요!)</label>
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
        {loading ? '저장 중...' : submitButtonText}
      </button>
    </form>
  );
}

export default PostForm;
