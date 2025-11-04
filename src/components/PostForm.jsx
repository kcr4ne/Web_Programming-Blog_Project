import React, { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { uploadImage } from '../services/postService';
import { useNotification } from '../hooks/useNotification';
import { useAuth } from '../hooks/useAuth';

// The form no longer needs the `loading` prop from the parent.
function PostForm({ initialData = {}, onSubmit, submitButtonText = '제출' }) {
  const [title, setTitle] = useState(initialData.title || '');
  const [summary, setSummary] = useState(initialData.summary || '');
  const [content, setContent] = useState(initialData.content || '');
  
  // Internal loading state to control the submit button
  const [isSubmitting, setIsSubmitting] = useState(false);

  const contentRef = useRef(null);
  const { showNotification } = useNotification();
  const { user } = useAuth();

  const handlePaste = async (e) => {
    if (isSubmitting) return;
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent multiple submissions

    if (!title) {
      showNotification('제목은 필수입니다.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({ title, summary, content });
    } catch (error) {
      // Parent component will show notification, but we must re-enable the form.
      setIsSubmitting(false);
    }
    // On success, the parent component will navigate away, so we don't need to set isSubmitting to false here.
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="form-input"
          placeholder="제목을 입력하세요"
          style={{ flex: 1, fontSize: '1.5rem', padding: '0.5rem' }}
        />
        <button type="submit" disabled={isSubmitting} className="button button-primary" style={{ height: 'fit-content', alignSelf: 'center' }}>
          {isSubmitting ? '처리 중...' : submitButtonText}
        </button>
      </div>
      <textarea
        id="summary"
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        className="form-input"
        rows="2"
        placeholder="요약을 입력하세요 (선택 사항)"
        style={{ marginBottom: '1rem', resize: 'none' }}
      />
      <div style={{ display: 'flex', flex: 1, gap: '1rem', overflow: 'hidden' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <label htmlFor="content" style={{ marginBottom: '0.5rem' }}>내용 (이미지 붙여넣기 가능)</label>
          <textarea
            id="content"
            ref={contentRef}
            value={content}
            onPaste={handlePaste}
            onChange={(e) => setContent(e.target.value)}
            className="form-input"
            style={{ flex: 1, resize: 'none', borderRight: '1px solid #333' }}
          />
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 1rem' }}>
          <h3 style={{ marginTop: 0 }}>미리보기</h3>
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    </form>
  );
}

export default PostForm;
