/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_TMDB_API_KEY: string;
    readonly VITE_TMDB_LANGUAGE?: string;
    readonly VITE_TMDB_REGION?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}