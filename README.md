# React & Firebase 기반 블로그 플랫폼

## 📖 프로젝트 소개 (About)
이 프로젝트는 **React**와 **Firebase**를 중심으로 구축된 최신 블로그 플랫폼입니다. Vite를 통해 빠른 개발 환경을 구성했으며, 사용자 인증부터 이미지 업로드, 마크다운 편집기까지 사용자 편의성을 고려하여 설계되었습니다.

---

## ✨ 주요 기능 (Features)

- **사용자 인증**: Firebase Authentication을 통한 안전한 회원가입 및 로그인.
- **게시물 CRUD**: 게시물 생성, 읽기, 수정, 삭제 기능.
- **마크다운 에디터**: `react-markdown`을 사용한 실시간 미리보기 및 툴바 제공.
- **이미지 스토리지**: Vercel Blob Storage를 연동하여 게시물 이미지 업로드 처리.
- **검색 및 정렬**: 실시간 검색 기능 및 최신순/인기순 정렬.
- **반응형 UI**: 사이드바, 드롭다운 메뉴, 알림 시스템.
- **관리자 기능**: 관리자 계정을 위한 사용자 관리 대시보드.

## 🛠️ 기술 스택 (Tech Stack)

### Frontend
- **Framework:** [React](https://react.dev/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Routing:** [React Router](https://reactrouter.com/)
- **State Management:** React Context API
- **Language:** JavaScript

### Backend & Services (BaaS)
- **[Firebase](https://firebase.google.com/):**
  - **Authentication:** 사용자 인증
  - **Firestore:** 데이터베이스 (게시물, 사용자 프로필 등)
- **[Vercel](https://vercel.com/):**
  - **Blob Storage:** 이미지 파일 업로드 및 호스팅
  - **Serverless Functions:** 백엔드 API 로직 실행

### Development & Deployment
- **Linting:** ESLint
- **Package Manager:** npm
- **Deployment:** Vercel

## 📂 프로젝트 구조 (Project Structure)

```
/
├── api/                    # Vercel 서버리스 함수 (백엔드 API)
│   └── upload.js           # 이미지 업로드 처리 API
│
└── src/
    ├── App.jsx             # 메인 애플리케이션 레이아웃 및 라우팅
    ├── main.jsx            # 애플리케이션 진입점
    │
    ├── components/         # 재사용 가능한 UI 컴포넌트
    ├── contexts/           # React Context API를 사용한 전역 상태 관리
    ├── hooks/              # 커스텀 훅
    ├── services/           # 외부 서비스(Firebase)와의 통신 로직
    │   ├── authService.js
    │   ├── firebase.js
    │   └── postService.js
    │
    └── views/              # 페이지 단위의 컴포넌트
```

## 🚀 시작하기 (Getting Started)

### Prerequisites

- Node.js (v18 or higher)
- npm
- Vercel CLI (`npm install -g vercel`)

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
    - 프로젝트 루트에 `.env.local` 파일을 생성합니다.
    - 아래 내용을 복사하여 파일에 붙여넣고, 자신의 Firebase 및 Vercel 프로젝트 키로 값을 변경합니다.
    ```env
    # Vercel Blob Storage Token
    # Get this from your Vercel project's Storage tab.
    BLOB_READ_WRITE_TOKEN=YOUR_BLOB_READ_WRITE_TOKEN_HERE

    # Firebase Configuration
    # Get these values from your Firebase project's settings.
    VITE_FIREBASE_API_KEY=YOUR_API_KEY_HERE
    VITE_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN_HERE
    VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID_HERE
    VITE_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET_HERE
    VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID_HERE
    VITE_FIREBASE_APP_ID=YOUR_APP_ID_HERE
    VITE_FIREBASE_MEASUREMENT_ID=YOUR_MEASUREMENT_ID_HERE
    ```

### Running the Development Server

이 프로젝트는 Vercel 서버리스 함수(이미지 업로드 API)를 포함하고 있으므로, 로컬 개발 시 Vercel CLI를 사용해야 합니다.

```bash
vercel dev
```

## 📜 사용 가능한 스크립트 (Available Scripts)

- `vercel dev`: Vercel 환경과 동일한 로컬 개발 서버를 시작합니다.
- `npm run build`: 프로덕션용으로 앱을 빌드합니다.
- `npm run lint`: ESLint로 코드 스타일을 검사합니다.
- `npm run preview`: 프로덕션 빌드를 로컬에서 미리 봅니다.