# Dev Log: Layout & Truncation Improvements

- **날짜**: 2025-10-23
- **기능**: 게시글 목록 레이아웃 및 텍스트 표시 형식 개선
- **기술**: React, JavaScript, CSS

## 진행 과정

1.  **3열 그리드 레이아웃 적용**
    - **문제**: 게시글 목록이 1열로 길게 표시되어 가독성이 떨어지는 문제가 있었습니다.
    - **수정**: `src/index.css` 파일의 `.post-list` 클래스 스타일을 수정하여, 기본적으로 3열 그리드 레이아웃으로 표시되도록 변경했습니다. 화면 너비에 따라 2열, 1열로 자연스럽게 반응하도록 미디어 쿼리를 조정했습니다.

2.  **제목 및 요약 글자 수 제한 (말줄임 처리)**
    - **문제**: 제목이나 요약이 너무 길 경우 레이아웃이 깨지는 현상이 발생했습니다.
    - **수정**: `src/components/PostItem.jsx` (게시글 목록) 와 `src/components/MyPostsSidebar.jsx` (사이드바) 컴포넌트를 수정했습니다. JavaScript를 사용하여 제목은 14자, 요약은 32자를 초과할 경우 뒷부분을 `...`으로 대체하도록 로직을 구현했습니다.

## 산출물

- `src/index.css`: 그리드 레이아웃 스타일 수정
- `src/components/PostItem.jsx`: 제목 및 요약 텍스트 트렁케이션 로직 추가
- `src/components/MyPostsSidebar.jsx`: 제목 텍스트 트렁케이션 로직 추가
