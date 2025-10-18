# Quickstart: 블로그 사이트 개발 환경 설정

**Date**: 2025-10-11

이 문서는 `Blog_kyle` 프로젝트의 프론트엔드 개발 환경을 설정하고 실행하는 방법을 안내합니다.

## Prerequisites

- Node.js (v18.x 이상)
- npm 또는 yarn
- Git

## 1. Supabase 프로젝트 설정

1.  [Supabase](https://supabase.com/)에 가입하고 새로운 프로젝트를 생성합니다.
2.  프로젝트 대시보드의 **Settings > API** 메뉴로 이동하여 `Project URL`과 `anon public` 키를 복사해 둡니다.
3.  **SQL Editor** 메뉴로 이동하여 `specs/001-react-supabase-gemini/data-model.md` 파일에 정의된 테이블(`users`, `posts`, `tabs`, `post_tabs`)을 생성하는 SQL 쿼리를 실행합니다.
4.  **Storage** 메뉴로 이동하여 이미지 저장을 위한 새로운 버킷(bucket)을 생성합니다. (예: `post-images`)

## 2. 로컬 개발 환경 설정

1.  **프로젝트 클론 및 브랜치 이동**:
    ```bash
    # 아직 프로젝트를 받지 않았다면:
    # git clone <repository_url>
    # cd Blog_kyle

    # 001-react-supabase-gemini 브랜치에 있는지 확인
    git checkout 001-react-supabase-gemini
    ```

2.  **환경 변수 설정**:
    - `frontend` 디렉터리 최상단에 `.env` 파일을 생성합니다.
    - Supabase에서 복사한 키를 아래 형식으로 파일에 추가합니다.
      ```
      REACT_APP_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
      REACT_APP_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
      ```

3.  **의존성 설치**:
    ```bash
    cd frontend
    npm install
    # 또는 yarn install
    ```

## 3. 애플리케이션 실행

1.  **개발 서버 시작**:
    ```bash
    # frontend 디렉터리에서 실행
    npm start
    # 또는 yarn start
    ```

2.  브라우저에서 `http://localhost:3000` 주소로 접속하여 애플리케이션을 확인합니다.

## 4. 최초 관리자 지정

1.  사이트에 관리자로 지정하고 싶은 계정으로 먼저 회원가입을 합니다.
2.  Supabase 대시보드의 **Table Editor > users** 테이블로 이동하여 해당 유저의 `role` 컬럼 값을 `'user'`에서 `'admin'`으로 직접 수정합니다.
    - *참고: 이는 초기 설정 방식이며, 추후 `FR-014` 요구사항에 따라 CLI 명령어로 관리자를 지정하는 기능이 개발될 수 있습니다.*
