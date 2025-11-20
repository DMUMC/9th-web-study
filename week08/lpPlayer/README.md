# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

## Vite에서 SVG 활용하기

### 정리

1. **인라인 React 컴포넌트**: SVG 태그를 그대로 JSX로 옮기면 별도 플러그인 없이 props/className으로 쉽게 제어할 수 있습니다. 이번 과제에 추가한 `HamburgerIcon`이 이 패턴입니다.
2. **자산 URL (`?url`) import**: `import vinylUrl from './vinyl.svg?url'`처럼 가져오면 `<img src={vinylUrl} />` 또는 `background-image` 형태로 쓸 수 있어 최적화된 정적 자산 흐름을 그대로 활용합니다.
3. **문자열 원본 (`?raw`) import**: `?raw`를 붙이면 SVG XML 문자열을 받아 아이콘 폰트 생성, SSR 템플릿 삽입 등 커스텀 로직에 사용할 수 있습니다.
4. **SVGR 플러그인 연동**: 대규모 아이콘 세트라면 `@svgr/rollup`을 Vite 플러그인으로 추가하고 `import { ReactComponent as Icon } from './icon.svg';` 패턴으로 자동 React 컴포넌트를 생성할 수 있습니다.

상황에 맞게 위 옵션을 조합하면 Vite에서도 SVG를 매우 유연하게 다룰 수 있습니다.
