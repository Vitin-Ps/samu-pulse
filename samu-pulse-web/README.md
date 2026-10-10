# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Instalação como PWA

O build de produção gera `manifest.webmanifest`, `sw.js` e os ícones de instalação.
Publique o conteúdo completo de `dist/` em HTTPS. O servidor deve servir `sw.js`
e o manifesto como arquivos, sem redirecioná-los para `index.html`, e permitir
revalidação de `sw.js` (por exemplo, `Cache-Control: no-cache`). O fallback de
rotas da SPA continua necessário. Localhost pode ser usado para validação local.

```sh
npm run build
npm run preview
```

No navegador compatível, use a opção de instalar o aplicativo. No iPhone/iPad,
use Compartilhar → Adicionar à Tela de Início no Safari.

O registro do service worker começa após o carregamento da página, com uma espera
mínima de três segundos e preferência por um período ocioso do navegador. O cache
inicial inclui somente a entrada do aplicativo e suas dependências estáticas.
As demais telas, bibliotecas e imagens são carregadas sob demanda e armazenadas
quando requisitadas sob controle do service worker. Portanto, telas ainda não
armazenadas exigem conexão para abrir.

Cadastro, consulta e mensagens dependem da API e exigem conexão; não há fila de
operações offline nem cache de dados autenticados. O módulo PWA exibe um aviso
quando detecta falta de conexão, após ser carregado.

Execute `npm run check:pwa` para gerar o build e verificar os limites do JavaScript
inicial, a cobertura do cache e a exclusão dos módulos sob demanda do precache.
Essa verificação mede os arquivos gerados, não o tempo de carregamento na rede.

Atualizações exibem um aviso com “Atualizar” e “Agora não”, para que a pessoa possa
salvar formulários antes de recarregar. O PWA está desabilitado no servidor de
desenvolvimento: valide com o build e preview. Após publicar uma nova versão,
reabra o aplicativo para verificar a atualização.

A logo do loading é importada de `src/assets/samu-pulse-logo.png`, recebe hash no
build e entra no precache. Se a imagem falhar, o componente usa o spinner existente.
Os ícones em `public/pwa-*.png` foram derivados da logo já utilizada pelo projeto.

Referência: [Vite PWA — registro e atualizações](https://vite-pwa-org.netlify.app/guide/prompt-for-update.html).
