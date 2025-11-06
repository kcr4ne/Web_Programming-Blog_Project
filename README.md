# Web_Programming-Blog_Project React & Firebase 기반 블로그 플랫폼
웹 프로그래밍 실무 웹 개발 수행평가

## 📖 프로젝트 소개 (About)
이 프로젝트는 **React**와 **Firebase**를 중심으로 구축된 기능이 풍부한 최신 블로그 플랫폼입니다. Vite를 통해 빠른 개발 환경을 구성했으며, 사용자 인증부터 실시간 미리보기를 지원하는 마크다운 편집기까지 개발자 경험과 사용자 편의성을 모두 고려하여 설계되었습니다.

---

## ✨ 주요 기능 (Features)

- **사용자 인증**: Firebase Authentication을 통한 안전한 아이디/비밀번호 기반 회원가입 및 로그인.
- **게시물 CRUD**: 게시물 생성, 읽기, 수정, 삭제 기능 (본인 및 관리자만 수정/삭제 가능).
- **마크다운 에디터**:
  - `react-markdown`을 사용한 실시간 미리보기.
  - 이미지 붙여넣기 시 자동 업로드 및 URL 삽입 기능.
  - **굵게**, *기울임꼴*, 링크, 코드 블록 등을 쉽게 적용할 수 있는 마크다운 툴바.
  - `Ctrl+Z` / `Ctrl+Y`를 지원하는 실행 취소/다시 실행 기능.
- **이미지 스토리지**: Supabase Storage를 연동하여 게시물 이미지 업로드 처리.
- **검색 및 정렬**: 실시간 검색 기능 및 최신순/인기순 정렬.
- **반응형 UI**: 사용자의 편의를 위한 사이드바, 드롭다운 메뉴, 알림 시스템.
- **관리자 기능**: 관리자 계정을 위한 사용자 관리 대시보드.

## 🛠️ 기술 스택 (Tech Stack)

### Frontend
- **Framework:** [React](https://react.dev/) (v19)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Routing:** [React Router](https://reactrouter.com/) (`react-router-dom`)
- **State Management:** React Context API
- **Markdown Rendering:** [React Markdown](https://github.com/remarkjs/react-markdown)
- **Language:** JavaScript (ES2022)

### Backend & Database (BaaS)
- **[Firebase](https://firebase.google.com/):**
  - **Authentication:** 사용자 인증 처리
  - **Database:** Firestore (게시물, 사용자 프로필 등 데이터 저장)
- **[Supabase](https://supabase.io/):**
  - **Storage:** 이미지 파일 업로드 및 호스팅

### Development & Deployment
- **Linting:** [ESLint](https://eslint.org/)
- **Package Manager:** npm
- **Deployment:** [Vercel](https://vercel.com/)

## 📂 프로젝트 구조 (Project Structure)

```
/src
├── App.jsx                 # 메인 애플리케이션 레이아웃 및 라우팅 설정
├── index.css               # 전역 CSS 스타일
├── main.jsx                # 애플리케이션 진입점 (React DOM 렌더링)
│
├── components/             # 재사용 가능한 UI 컴포넌트
│   ├── AdminRoute.jsx
│   ├── MyPostsSidebar.jsx
│   ├── Navbar.jsx
│   ├── Notification.jsx
│   ├── Pagination.jsx
│   ├── PostForm.jsx
│   ├── PostItem.jsx
│   ├── PrivateRoute.jsx
│   └── ProfileDropdown.jsx
│
├── contexts/               # React Context API를 사용한 전역 상태 관리
│   ├── Auth.js
│   ├── AuthContext.jsx
│   ├── NotificationContext.jsx
│   ├── Posts.js
│   ├── PostsContext.jsx
│   ├── Search.js
│   ├── SearchContext.jsx
│   ├── Sidebar.js
│   └── SidebarContext.jsx
│
├── hooks/                  # 비즈니스 로직과 상태 관리를 분리하기 위한 커스텀 훅
│   ├── useAuth.js
│   ├── useDebounce.js
│   ├── useMyPosts.js
│   ├── useNotification.js
│   ├── usePost.js
│   ├── usePosts.js
│   ├── useSearch.js
│   ├── useSidebar.js
│   └── useUserPosts.js
│
├── services/               # Firebase, Supabase 등 외부 서비스와의 통신 로직
│   ├── authService.js
│   ├── firebase.js
│   ├── postService.js
│   ├── supabase.js
│   └── userService.js
│
└── views/                  # 페이지 단위의 컴포넌트 (라우팅 단위)
    ├── AdminDashboard.jsx
    ├── EditPost.jsx
    ├── EditProfile.jsx
    ├── Login.jsx
    ├── NewPost.jsx
    ├── PostDetail.jsx
    ├── PostList.jsx
    └── SignUp.jsx
```

## 🚀 시작하기 (Getting Started)

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/kcr4ne/Web_Programming-Blog_Project.git
    cd Web_Programming-Blog_Project
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**
    - 프로젝트 루트 디렉터리에 `.env.local` 파일을 생성합니다.
    - 아래 내용을 복사하여 파일에 붙여넣고, 자신의 Firebase 및 Supabase 프로젝트 키로 값을 변경합니다.
    ```env
    # Firebase Configuration
    VITE_FIREBASE_API_KEY=your_firebase_api_key
    VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
    VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
    VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
    VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
    VITE_FIREBASE_APP_ID=your_firebase_app_id
    VITE_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id

    # Supabase Configuration
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

### Running the Development Server

```bash
npm run dev
```

## 📜 사용 가능한 스크립트 (Available Scripts)

- `npm run dev`: 개발 서버를 시작합니다.
- `npm run build`: 프로덕션용으로 앱을 빌드합니다.
- `npm run lint`: ESLint로 코드 스타일을 검사합니다.
- `npm run preview`: 프로덕션 빌드를 로컬에서 미리 봅니다.
