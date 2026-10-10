/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/react" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  // Adicione outras variáveis do seu .env aqui se precisar
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}