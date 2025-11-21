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
    const placeholder = `\n[이미지 업로드 중: ${imageFile.name}...]\n`;
    const textarea = contentRef.current;
    const cursorPosition = textarea.selectionStart;
    const newContent = `${content.substring(0, cursorPosition)}${placeholder}${content.substring(cursorPosition)}`;
    setContent(newContent);
    try {
      showNotification('이미지 업로드 중...', 'info');
      const imageUrl = await uploadImage(imageFile);
      const finalMarkdown = `![${imageFile.name}](${imageUrl})`;
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

  const applyMarkdown = (startTag, endTag = startTag) => {
    const textarea = contentRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const placeholder = selectedText || '텍스트';
    
    const newContent = 
      content.substring(0, start) +
      startTag + placeholder + endTag +
      content.substring(end);
    
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      const newStart = start + startTag.length;
      const newEnd = newStart + placeholder.length;
      textarea.setSelectionRange(newStart, newEnd);
    }, 0);
  };

  const applyHeading = () => {
    const textarea = contentRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const lineStart = content.lastIndexOf('\n', start - 1) + 1;
    
    const newContent = 
      content.substring(0, lineStart) +
      '### ' +
      content.substring(lineStart);
      
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + 4, start + 4);
    }, 0);
  };

  const MarkdownToolbar = () => (
    <div style={{ marginBottom: '0.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
      <button type="button" onClick={() => applyMarkdown('**')} className="button" title="굵게"><b>B</b></button>
      <button type="button" onClick={() => applyMarkdown('*')} className="button" title="기울임꼴"><i>I</i></button>
      <button type="button" onClick={applyHeading} className="button" title="제목">H</button>
      <button type="button" onClick={() => applyMarkdown('[', '](여기에 URL 입력)')} className="button" title="링크">🔗</button>
      <button type="button" onClick={() => applyMarkdown('\n```\n', '\n```\n')} className="button" title="코드 블록">{'<>'} 
      </button>
    </div>
  );

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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <label htmlFor="content">내용 (이미지 붙여넣기 가능)</label>
            <small style={{ color: '#aaa' }}>마크다운 지원</small>
          </div>
          <MarkdownToolbar />
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
        <div className="post-content" style={{ flex: 1, overflowY: 'auto', padding: '0 1rem' }}>
          <h3 style={{ marginTop: 0 }}>미리보기</h3>
          <ReactMarkdown
            components={{
              a: ({node, ...props}) => <a {...props} target="_blank" rel="noopener noreferrer" />
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </form>
  );
}

export default PostForm;
