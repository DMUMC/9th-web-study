/// <reference types="vite-plugin-svgr/client" />
interface ImportMetaEnv {
  readonly VITE_TMDB_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}   