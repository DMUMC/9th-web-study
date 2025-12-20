# DOLIGO - 돌려돌려 LP판

React + Vite + TypeScript + TailwindCSS + TanStack Query + Axios + Zustand + Redux Toolkit 기반의 LP 공유 플랫폼입니다.

## 주요 기능

### 인증
- 로그인/회원가입
- Refresh Token 자동 갱신
- Protected Route
- Google Social Login (준비됨)

### LP 기능
- LP 목록 조회 (무한스크롤)
- LP 상세 조회
- LP 작성/수정/삭제
- 좋아요 기능 (Optimistic Update)
- 태그 시스템
- 정렬 기능 (최신순/오래된순)

### 댓글 기능
- 댓글 목록 조회 (무한스크롤)
- 댓글 작성/수정/삭제
- 댓글 정렬 (최신순/오래된순)

### UI/UX
- 반응형 사이드바
- Skeleton UI
- Debounce/Throttle 최적화
- 모달 시스템

### 상태 관리
- Redux Toolkit (장바구니, 모달)
- Zustand (LP, 사용자, 모달)

## 시작하기

### 설치

```bash
pnpm install
```

### 환경 변수 설정

`.env` 파일을 생성하고 다음 변수를 설정하세요:

```env
VITE_API_BASE_URL=http://localhost:3000
```

### 개발 서버 실행

```bash
pnpm dev
```

### 빌드

```bash
pnpm build
```

## 프로젝트 구조

```
src/
├── apis/              # API 호출 함수
├── components/        # 재사용 가능한 컴포넌트
├── constants/         # 상수 데이터
├── hooks/            # 커스텀 훅
├── pages/            # 페이지 컴포넌트
├── router/           # 라우터 설정
├── store/            # 상태 관리 (Redux, Zustand)
└── utils/            # 유틸리티 함수
```

## 기술 스택

- **React 19** - UI 라이브러리
- **TypeScript** - 타입 안정성
- **Vite** - 빌드 도구
- **TailwindCSS** - 스타일링
- **TanStack Query** - 서버 상태 관리
- **Axios** - HTTP 클라이언트
- **React Router** - 라우팅
- **Redux Toolkit** - 전역 상태 관리
- **Zustand** - 경량 상태 관리
- **React Hook Form** - 폼 관리
- **Zod** - 스키마 검증
- **date-fns** - 날짜 처리

## 주요 기능 상세

### Refresh Token 자동 갱신
Axios 인터셉터를 통해 Access Token 만료 시 자동으로 Refresh Token을 사용해 재발급합니다.

### Optimistic Update
좋아요 기능에서 서버 응답을 기다리지 않고 즉시 UI를 업데이트합니다.

### 무한스크롤
Intersection Observer를 사용하여 스크롤 시 자동으로 다음 페이지를 로드합니다.

### Debounce/Throttle
검색 및 스크롤 이벤트에 Debounce/Throttle을 적용하여 성능을 최적화했습니다.

## 라이선스

MIT
