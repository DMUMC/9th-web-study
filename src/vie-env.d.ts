/// <reference types="vite/client" />
interface ImportMetaEnv{
  readonly VITE_TMDB_KET: string;
}

interface ImportMeta{
  readonly env: ImportMetaEnv;
}