# Web_Programming-Blog_Project
웹 프로그래밍 실무 웹 개발 수행평가

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite-tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

---

## 🛠️ 기술 스택 (Tech Stack)

- **Framework:** React
- **Build Tool:** Vite
- **Backend & Database:** Supabase
- **Routing:** React Router (`react-router-dom`)
- **Markdown Rendering:** React Markdown (`react-markdown`)
- **Language:** JavaScript (ES2022)

## 📂 프로젝트 구조 (Project Structure)

```
/src
├── components/  # 공통 UI 컴포넌트 (Navbar, PostItem 등)
├── contexts/    # 전역 상태 관리 (Auth, Posts, Notification)
├── hooks/       # 커스텀 훅 (useAuth, usePosts 등)
├── services/    # 외부 서비스 연동 (Supabase, AuthService)
└── views/       # 페이지 단위 컴포넌트 (PostList, Login 등)
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
    - Create a `.env.local` file in the root directory.
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