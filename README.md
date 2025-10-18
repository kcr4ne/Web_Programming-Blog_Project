# Web_Programming-Blog_Project
웹 프로그래밍 실무 웹 개발 수행평가

## 📖 프로젝트 소개 (About)
이 프로젝트는 React와 Supabase를 사용하여 구축한 블로그 플랫폼입니다. 사용자 인증, 게시물 CRUD(생성, 읽기, 수정, 삭제), 마크다운 편집 기능을 제공하며, Vite를 통해 빠른 개발 환경을 구성했습니다.

---

## 🛠️ 기술 스택 (Tech Stack)

### Frontend
- **Framework:** [React](https://react.dev/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Routing:** [React Router](https://reactrouter.com/) (`react-router-dom`)
- **Markdown Rendering:** [React Markdown](https://github.com/remarkjs/react-markdown) (`react-markdown`)
- **Language:** JavaScript (ES2022)

### Backend & Database
- **Backend-as-a-Service (BaaS):** [Supabase](https://supabase.io/)
  - **Authentication:** Supabase Auth
  - **Database:** Supabase (PostgreSQL)
  - **Storage:** Supabase Storage

### Development Tools
- **Linting:** [ESLint](https://eslint.org/)
- **Package Manager:** npm

## ✨ 개발 워크플로우 (Development Workflow)
이 프로젝트는 AI 기반의 개발 도구를 활용하여 생산성을 높이고 체계적인 개발 프로세스를 따릅니다.

- **[Gemini CLI](https://developers.google.com/gemini/cli):** Google의 Gemini 모델을 커맨드 라인에서 사용하여 코드 생성, 리팩토링, 문서화 등 다양한 개발 작업을 자동화하고 지원합니다.
- **Speckit:** 프로젝트의 요구사항 정의(`specify`), 계획(`plan`), 작업 분할(`tasks`) 등을 관리하는 명세 기반 개발 프레임워크입니다. Gemini CLI와 연동하여 일관성 있고 효율적인 개발을 돕습니다.

## 📂 프로젝트 구조 (Project Structure)

```
/src
├── components/  # 재사용 가능한 공통 UI 컴포넌트
│   ├── Navbar.jsx         # 상단 네비게이션 바
│   ├── PostItem.jsx       # 게시글 목록의 개별 아이템
│   ├── PostForm.jsx       # 새 글 작성 및 수정 폼
│   └── ...
│
├── contexts/    # React Context API를 사용한 전역 상태 관리
│   ├── AuthContext.jsx      # 사용자 인증 상태
│   ├── PostsContext.jsx     # 게시글 데이터
│   └── ...
│
├── hooks/       # 비즈니스 로직과 상태 관리를 분리하기 위한 커스텀 훅
│   ├── useAuth.js         # 인증 관련 로직
│   ├── usePosts.js        # 게시글 관련 로직
│   └── ...
│
├── services/    # 외부 API 및 서비스 연동 로직
│   ├── supabase.js        # Supabase 클라이언트 초기화
│   ├── authService.js     # Supabase 인증 API 호출
│   └── postService.js     # Supabase DB (posts 테이블) API 호출
│
└── views/       # 페이지 단위의 컴포넌트 (라우팅 단위)
    ├── PostList.jsx       # 메인 페이지 (게시글 목록)
    ├── PostDetail.jsx     # 게시글 상세 페이지
    ├── Login.jsx          # 로그인 페이지
    └── ...
```

## 🚀 시작하기 (Getting Started)

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/Web_Programming-Blog_Project.git
    cd Web_Programming-Blog_Project
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Supabase:**
    - Create a `.env` file in the root directory.
    - Add your Supabase project URL and anon key:
      ```
      VITE_SUPABASE_URL=your-supabase-url
      VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
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
