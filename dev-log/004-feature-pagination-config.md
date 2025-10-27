# Dev Log: Pagination Configuration

- **날짜**: 2025-10-23
- **기능**: 게시글 목록 페이지네이션 표시 개수 조정
- **기술**: React, JavaScript

## 진행 과정

1.  **요구사항**: 사용자가 게시글 목록의 페이지당 표시 개수를 24개에서 18개로 변경해달라고 요청했습니다.
2.  **코드 분석**: 페이지네이션 관련 설정이 `src/contexts/PostsContext.jsx` 파일 내의 `POSTS_PER_PAGE` 상수로 관리되고 있음을 확인했습니다.
3.  **수정**: 해당 상수의 값을 `24`에서 `18`로 변경하여 요청사항을 반영했습니다.

## 산출물

- `src/contexts/PostsContext.jsx` 파일의 `POSTS_PER_PAGE` 상수 값 변경
