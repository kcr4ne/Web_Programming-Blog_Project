# API Contracts: 블로그 사이트

**Date**: 2025-10-11
**Status**: Draft

이 문서는 프론트엔드(React)가 백엔드(Supabase)와 상호작용하기 위해 호출할 함수들의 명세를 정의합니다. 모든 함수는 `supabase-js` 클라이언트를 통해 호출됩니다.

## 1. Authentication

### `signUp(email, password)`
- **Description**: 새로운 사용자를 등록합니다. Supabase Auth의 `signUp` 기능을 사용합니다.
- **Parameters**:
    - `email` (string): 사용자 이메일
    - `password` (string): 사용자 비밀번호
- **Returns**: `{ user, session, error }`

### `signIn(email, password)`
- **Description**: 기존 사용자로 로그인합니다. Supabase Auth의 `signIn` 기능을 사용합니다.
- **Parameters**:
    - `email` (string): 사용자 이메일
    - `password` (string): 사용자 비밀번호
- **Returns**: `{ user, session, error }`

### `signOut()`
- **Description**: 현재 사용자를 로그아웃시킵니다.
- **Returns**: `{ error }`

## 2. Posts

### `getPosts(options)`
- **Description**: 게시글 목록을 조회합니다.
- **Parameters**:
    - `options` (object):
        - `sortBy` (string): 'latest' 또는 'popular'. 기본값은 'latest'.
- **Returns**: `Promise<Post[]>`

### `getPostById(id)`
- **Description**: 특정 ID의 게시글 하나를 조회합니다.
- **Parameters**:
    - `id` (uuid): 게시글 ID
- **Returns**: `Promise<Post>`

### `createPost(postData)`
- **Description**: 새로운 게시글을 생성합니다. (로그인 필요)
- **Parameters**:
    - `postData` (object): `{ title, content, tabs }`
- **Returns**: `Promise<Post>`

### `updatePost(id, postData)`
- **Description**: 기존 게시글을 수정합니다. (작성자 또는 관리자만 가능)
- **Parameters**:
    - `id` (uuid): 수정할 게시글 ID
    - `postData` (object): `{ title, content, tabs }`
- **Returns**: `Promise<Post>`

### `deletePost(id)`
- **Description**: 게시글을 삭제합니다. (작성자 또는 관리자만 가능)
- **Parameters**:
    - `id` (uuid): 삭제할 게시글 ID
- **Returns**: `Promise<void>`

## 3. Images (Storage)

### `uploadImage(file)`
- **Description**: 사용자가 붙여넣은 이미지를 Supabase Storage에 업로드하고 공개 URL을 반환합니다.
- **Parameters**:
    - `file` (File): 업로드할 이미지 파일
- **Returns**: `Promise<string>` (Public URL of the uploaded image)
