# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```

## SVG 활용 정리 (Vite)

1. **인라인 임포트**  
   `import Logo from './logo.svg?url';` 형태로 불러오면 `Logo`에 정적 URL이 담겨 `<img src={Logo} />`로 사용할 수 있습니다.
2. **컴포넌트로 사용 (SVGR)**  
   `npm i -D @svgr/rollup` 후 `vite.config.ts`에 `svgr()` 플러그인을 추가하면 `import { ReactComponent as Icon } from './icon.svg';` 로 가져와 `<Icon />`처럼 JSX에서 직접 렌더링할 수 있습니다.
3. **자산 폴더 사용**  
   `public` 디렉터리에 SVG를 두고 `<img src="/icons/hamburger.svg" />`처럼 참조하면 빌드 시 자동으로 정적 파일로 제공됩니다.

필요한 방식에 따라 URL, 컴포넌트, 정적 자산 중 하나를 선택해 SVG를 재사용할 수 있습니다.
