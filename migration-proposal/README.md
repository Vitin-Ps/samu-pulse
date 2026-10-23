# Migração de status e ambiente local

A proposta foi aprovada e integrada em `api/samu-pulse/src/main/resources/db/migration/V9__migrate_member_status.sql`, mantendo o Flyway existente.

## Estrutura e preservação

- `status_membro(cod_status SERIAL PRIMARY KEY, nome VARCHAR(255) NOT NULL, cor VARCHAR(7) NOT NULL)` aceita cores hexadecimais livres.
- Registros iniciais: OUTRA_IGREJA → Outra Igreja (#1d4ed8), AFASTADO → Afastado (#b91c1c), ATIVO → Ativo (#15803d), DISTANTE → Distante (#a16207).
- `membro.cod_status` referencia a nova tabela com `ON DELETE RESTRICT`, inclusive para membros inativos. Índice apoia filtros e verificação de associações.
- A conversão considera todos os membros, conserva valores nulos e interrompe a transação diante de qualquer valor desconhecido antes de remover a coluna antiga. O relacionamento aceita nulos legados; cadastro e edição continuam exigindo status válido, como antes.
- A implantação deve ocorrer com aplicação parada, backup e Flyway transacional. Não executar parcialmente nem reiniciar a aplicação antiga após a migração: a coluna textual é removida. Implantar frontend e backend atualizados juntos.

## Aplicação

Requisições de cadastro/edição e filtro de membros usam `cod_status`. A resposta inclui o identificador e o objeto `status` com nome e cor.

`GET /status-membro` permite leitura autenticada para os fluxos existentes. `POST /status-membro` e `DELETE /status-membro/{codStatus}` usam `@PreAuthorize("hasRole('ADMIN')")` no serviço. A consulta conta membros ativos e inativos; a exclusão valida associações e trata violação da FK em caso de concorrência. A role ADMIN e o fluxo de autenticação foram reutilizados.

O menu de usuário oferece Administração para ADMIN, com rotas protegidas `/admin` e `/admin/membros`. A primeira permite criar e excluir status; a segunda reutiliza a listagem existente. Cadastro, edição, filtros e badge/tooltip usam dados dinâmicos. O cadastro mantém a seleção inicial de Ativo quando o registro existe; caso removido, o usuário seleciona um status disponível.

A home possui cartões Administração e Usuários somente para ADMIN. A administração exibe contagens, prévia da cor e vínculos dos status em layout responsivo. A rota `/admin/usuarios` permite pesquisar e paginar usuários e alterar acesso ativo/inativo e perfil ADMIN/LIDER/USER. `GET /admin/usuarios` e `PATCH /admin/usuarios/{id}` são protegidos no controller e no serviço; as respostas não incluem senha. A estrutura existente de `usuario` já possui `ativo` e `tipo_usuario`, dispensando outra migration.

A inativação passa a ser respeitada por `Usuario.isEnabled()` no login e pelo filtro de segurança em cada requisição com JWT. As authorities continuam sendo carregadas do banco, portanto alterações de perfil valem mesmo para tokens emitidos anteriormente. Ao alterar o próprio acesso para inativo ou retirar a própria role ADMIN, a interface encerra a sessão.

## Scroll e paginação

O model escrevia `body.style.overflow` manualmente ao abrir/fechar detalhes e edição. O Loading salvava `hidden` durante a operação e podia restaurá-lo após o modal fechar. Ambos agora usam `useBodyScrollLock`, que restaura o valor original ao liberar o último bloqueio, inclusive na desmontagem.

A listagem carrega 20 membros por página e oferece seleção pelo número, mantendo as setas. Pesquisar ou limpar filtros retorna à primeira página sem consultar o número antigo.

## Ambiente local solicitado

O backup `20261023-185317-625` foi verificado pelo SHA256 e restaurado em uma instância exclusiva em `127.0.0.1:5433`, base `samu_pulse_local`, com o PostgreSQL 18 já instalado na máquina. A instância preexistente na porta 5432 foi preservada. O backup contém 202 membros (49 Ativo, 110 Distante, 35 Afastado, 8 Outra Igreja), uma mensagem e 200 uploads. O Flyway aplica a V9 sobre o histórico V1–V8 restaurado.

Os dados locais, logs, PIDs e credenciais geradas ficam em `api/samu-pulse/target/local`, ignorado pelo Git. As configurações `.env` existentes foram preservadas. A API usa porta 8080 e o frontend 5173, com acesso local. O Java usa `target/tmp` como diretório temporário curto para evitar a falha de criação de socket Unix do JDK 17 quando o caminho TEMP do ambiente excede o limite.

## Validação

- `npm run build` e `node --test scripts/check-scroll-lock.test.mjs` no frontend.
- `mvn -Dtest=StatusMembroServiceTests test` usa repositories simulados e contexto mínimo de segurança, sem datasource.
- A suíte de integração existente foi adaptada à entidade dinâmica. Executá-la apenas com `SAMU_TEST_DB_URL` apontando para uma base de testes exclusiva.
- No ambiente de destino, verificar histórico Flyway, contagens e distribuição dos status antes/depois, e testar as permissões administrativas.

## Resultado da validação local

50 testes de backend aprovados (42 de integração e 8 de regras/permissões), 4 testes de scroll aprovados, build de produção e diff --check concluídos. A interface foi conferida no navegador: cartões administrativos na home, layout de status, listagem de usuários, modal de acesso e seleção direta da página 10. A API local rejeitou com HTTP 400 a exclusão de um status associado. Os 202 membros permanecem preservados, com 193 ativos na listagem e 13 registros na última página.

## Arquivos criados e modificados

- api/samu-pulse/src/main/java/com/example/samu_pulse/controller/MembroController.java
- api/samu-pulse/src/main/java/com/example/samu_pulse/controller/StatusMembroController.java
- api/samu-pulse/src/main/java/com/example/samu_pulse/controller/UsuarioAdminController.java
- api/samu-pulse/src/main/java/com/example/samu_pulse/domain/membro/dto/DadosMembroRequest.java
- api/samu-pulse/src/main/java/com/example/samu_pulse/domain/membro/dto/DadosMembroUpdate.java
- api/samu-pulse/src/main/java/com/example/samu_pulse/domain/membro/dto/DadosStatusRequest.java
- api/samu-pulse/src/main/java/com/example/samu_pulse/domain/membro/dto/MembroResponse.java
- api/samu-pulse/src/main/java/com/example/samu_pulse/domain/membro/dto/StatusMembroResponse.java
- api/samu-pulse/src/main/java/com/example/samu_pulse/domain/membro/Membro.java
- api/samu-pulse/src/main/java/com/example/samu_pulse/domain/membro/MembroService.java
- api/samu-pulse/src/main/java/com/example/samu_pulse/domain/membro/StatusMembro.java
- api/samu-pulse/src/main/java/com/example/samu_pulse/domain/membro/StatusMembroService.java
- api/samu-pulse/src/main/java/com/example/samu_pulse/domain/usuario/dto/DadosAcessoUsuarioUpdate.java
- api/samu-pulse/src/main/java/com/example/samu_pulse/domain/usuario/dto/UsuarioAdminResponse.java
- api/samu-pulse/src/main/java/com/example/samu_pulse/domain/usuario/Usuario.java
- api/samu-pulse/src/main/java/com/example/samu_pulse/domain/usuario/UsuarioService.java
- api/samu-pulse/src/main/java/com/example/samu_pulse/infra/exception/TratadorDeErros.java
- api/samu-pulse/src/main/java/com/example/samu_pulse/infra/security/SecurityFilter.java
- api/samu-pulse/src/main/java/com/example/samu_pulse/repository/MembroRepository.java
- api/samu-pulse/src/main/java/com/example/samu_pulse/repository/StatusMembroRepository.java
- api/samu-pulse/src/main/java/com/example/samu_pulse/repository/UsuarioRepository.java
- api/samu-pulse/src/main/resources/db/migration/V9__migrate_member_status.sql
- api/samu-pulse/src/test/java/com/example/samu_pulse/MembroMensagensIntegrationTests.java
- api/samu-pulse/src/test/java/com/example/samu_pulse/StatusMembroServiceTests.java
- migration-proposal/README.md
- samu-pulse-web/scripts/check-scroll-lock.test.mjs
- samu-pulse-web/src/hooks/useBodyScrollLock.ts
- samu-pulse-web/src/hooks/useMembro.tsx
- samu-pulse-web/src/hooks/useStatusMembro.ts
- samu-pulse-web/src/interfaces/Membro.ts
- samu-pulse-web/src/interfaces/StatusMembro.ts
- samu-pulse-web/src/interfaces/Usuario.ts
- samu-pulse-web/src/pages/AddMember/AddMemberView.tsx
- samu-pulse-web/src/pages/AddMember/useAddMemberModel.tsx
- samu-pulse-web/src/pages/Admin/AdminPage.tsx
- samu-pulse-web/src/pages/Admin/AdminUsersPage.tsx
- samu-pulse-web/src/pages/components/Loading/Loading.tsx
- samu-pulse-web/src/pages/Header.tsx
- samu-pulse-web/src/pages/Home.tsx
- samu-pulse-web/src/pages/ListMembers/components/EditMemberModal.tsx
- samu-pulse-web/src/pages/ListMembers/components/MemberCard.tsx
- samu-pulse-web/src/pages/ListMembers/ListMembersView.tsx
- samu-pulse-web/src/pages/ListMembers/useListMembersModel.tsx
- samu-pulse-web/src/Routes.tsx
- samu-pulse-web/src/services/MembroService.ts
- samu-pulse-web/src/services/StatusMembroService.ts
- samu-pulse-web/src/services/UsuarioService.ts
