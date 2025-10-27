# Dev Log: Critical Bug Fixes (White Screen)

- **날짜**: 2025-10-23
- **기능**: 앱 렌더링을 막는 자바스크립트 오류 수정
- **기술**: React, JavaScript

## 진행 과정

지속적으로 화면이 표시되지 않는 '백지 현상' 오류가 발생하여 원인을 추적하고 해결했습니다.

1.  **잘못된 Hook 참조 오류 수정**
    - **원인**: `MyPostsSidebar.jsx` 와 `NewPost.jsx` 컴포넌트가 존재하지 않는 `useMyPosts` 훅을 `PostsContext`에서 가져오려고 시도하여 앱이 중단되었습니다.
    - **해결**: 올바른 훅인 `useUserPosts`를 `hooks/useUserPosts.js` 파일에서 가져오도록 import 경로와 훅 호출 코드를 수정했습니다.

2.  **모듈 Export 부재 오류 수정**
    - **원인**: `PostsContext.jsx` 파일에서 `PostsContext` 객체를 `export` 하지 않아, 다른 파일에서 이를 `import` 할 수 없는 문제가 있었습니다.
    - **해결**: `PostsContext` 선언부에 `export` 키워드를 추가하여 문제를 해결했습니다.

3.  **Null 값 처리 오류 수정**
    - **원인**: `PostItem.jsx`에서 게시글 요약(`summary`)이나 본문(`content`)이 없는(null) 경우를 처리하지 않고 `.length` 나 `.replace` 같은 메소드를 호출하여 런타임 에러가 발생했습니다.
    - **해결**: 요약이나 본문 내용이 존재하는지 먼저 확인하는 조건문을 추가하여, null 값으로 인한 앱 중단 현상을 방지했습니다.

## 산출물

- `src/components/MyPostsSidebar.jsx`: 훅 참조 수정
- `src/views/NewPost.jsx`: 훅 참조 수정
- `src/contexts/PostsContext.jsx`: `export` 키워드 추가
- `src/components/PostItem.jsx`: Null 값 예외 처리 로직 추가
