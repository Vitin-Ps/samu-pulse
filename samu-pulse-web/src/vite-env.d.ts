/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  // Adicione outras variáveis do seu .env aqui se precisar
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}