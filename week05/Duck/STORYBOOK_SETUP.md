# Storybook 설정 가이드

## 설치

Storybook 패키지를 설치하려면 다음 명령어를 실행하세요:

```bash
npm install --save-dev @storybook/react-vite @storybook/react @storybook/addon-essentials @storybook/addon-interactions @storybook/test storybook
```

또는 네트워크 문제가 있을 경우:

```bash
npm install --save-dev @storybook/react-vite@^8.3.0 @storybook/react@^8.3.0 @storybook/addon-essentials@^8.3.0 @storybook/addon-interactions@^8.3.0 @storybook/test@^8.3.0 storybook@^8.3.0
```

## 실행

Storybook을 실행하려면:

```bash
npm run storybook
```

브라우저에서 `http://localhost:6006`으로 접속하면 Storybook을 확인할 수 있습니다.

## 생성된 스토리

다음 컴포넌트들의 스토리가 생성되었습니다:

- `Header.stories.tsx` - 로그인/로그아웃 상태별 헤더
- `AuthHeader.stories.tsx` - 인증 페이지 헤더 (로그인, 회원가입 등)
- `SocialLogin.stories.tsx` - 소셜 로그인 버튼
- `ProtectedRoute.stories.tsx` - 보호된 라우트 (인증/미인증 상태)

## 주요 설정

- `.storybook/main.ts` - Storybook 메인 설정 파일
- `.storybook/preview.ts` - 전역 스토리 설정 (Tailwind CSS 스타일 포함)
