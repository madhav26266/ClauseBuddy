// / <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_CLIENT_ID: string;
  // add other env variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
