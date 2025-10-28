import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
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
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 200px)' }}>
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
        <button type="submit" disabled={loading} className="button button-primary" style={{ height: 'fit-content', alignSelf: 'center' }}>
          {loading ? '저장 중...' : submitButtonText}
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
