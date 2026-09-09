# Inativação e histórico de mensagens

## Estrutura existente e decisões

- `membro` e `usuario` usam PK `SERIAL`, mapeada como `Integer`. O status de inativação é `membro.ativo`/`Membro.ativo`; não existe `cod_ativo`. O enum `StatusMembro` tem outra finalidade e permanece inalterado.
- Listagem, edição e operações de imagem já consideram apenas membros ativos. O modal de detalhes usa o membro recebido pela listagem; o controller não possui endpoint de detalhamento implementado. As operações de mensagens seguem o acesso autenticado existente e exigem membro ativo.
- A V1 já criou `historico_mensagem`, com PK `BIGSERIAL`/`Long`, FKs `id_membro` e `id_usuario`, `perfil_responsavel`, `mensagem TEXT` e `data_registro TIMESTAMP`. A entidade e o repository já existiam, mas o service estava vazio.
- A V7 adiciona somente o índice para consulta paginada por membro, data e ID. As migrations anteriores, os dados e as constraints existentes são preservados.
- O JWT é validado pelo `SecurityFilter`, que carrega `Usuario` e o coloca no `SecurityContextHolder`. A autoria vem desse contexto; o corpo da requisição fornece somente o conteúdo. O perfil do responsável é registrado no momento da criação, conforme a coluna existente.
- `@EnableMethodSecurity` já está habilitado. A inativação exige `ROLE_ADMIN` no service; mensagens exigem autenticação e edição/exclusão comparam o ID do usuário autenticado ao autor persistido. Administradores não podem editar/excluir mensagens de outro autor.
- O tratamento de erros existente foi ampliado para reconhecer também `AccessDeniedException` do Spring Security como HTTP 403.

## Contrato HTTP

Todos os endpoints exigem `Authorization: Bearer <token>`. O prefixo `/api` vem de `server.servlet.context-path`.

| Método | Caminho | Resultado |
| --- | --- | --- |
| DELETE | `/api/membro/{id}` | ADMIN: altera somente `ativo` para `false`; 204 |
| GET | `/api/membro/{idMembro}/mensagens` | Página de mensagens; 200 |
| POST | `/api/membro/{idMembro}/mensagens` | Cria mensagem com o usuário autenticado; 200 |
| PUT | `/api/membro/{idMembro}/mensagens/{id}` | Autor: atualiza somente o conteúdo; 200 |
| DELETE | `/api/membro/{idMembro}/mensagens/{id}` | Autor: exclui a mensagem; 204 |

POST e PUT recebem:

```json
{"mensagem":"Contato realizado com o membro."}
```

Criação e edição retornam:

```json
{
  "id": 42,
  "idMembro": 10,
  "idUsuario": 3,
  "usuario": {
    "login": "lider",
    "perfilResponsavel": "Responsável da juventude",
    "tipoUsuario": "LIDER"
  },
  "perfilResponsavel": "Responsável da juventude",
  "mensagem": "Contato realizado com o membro.",
  "dataRegistro": "2026-09-08T22:00:00"
}
```

O GET retorna esses objetos em `content`, com os metadados de `Page`, como na listagem de membros. Aceita `page`, `size` e `sort`; o padrão é página 0, tamanho 10 e ordenação por `dataRegistro DESC, id DESC`. Datas seguem `LocalDateTime`/`TIMESTAMP` já existentes, sem offset. A edição preserva autor, membro, perfil registrado e data original.

Erros:

- 400: mensagem ausente, nula, vazia ou composta de espaços; formato de validação existente (`campo`, `mensagem`).
- 400: tentativa de inativar membro já inativo, com texto `Membro já está inativo!`.
- 403: falta de autenticação, permissão administrativa ou autoria, conforme a configuração de segurança existente.
- 404: membro inexistente; membro inativo nas operações de mensagens; mensagem inexistente ou pertencente a outro membro.

A inativação preserva o membro e seu histórico no banco. Membros inativos saem das consultas existentes e seu histórico deixa de estar acessível por esses endpoints.

## Testes

`MembroMensagensIntegrationTests` usa Spring completo, MockMvc, JWT real, repositories e PostgreSQL com Flyway. Os testes fazem rollback dos registros de cada cenário. As migrations são aplicadas no banco informado, portanto use um banco exclusivo de testes.

Na pasta do backend, em PowerShell:

```powershell
$env:SAMU_TEST_DB_URL='jdbc:postgresql://127.0.0.1:55432/postgres'
$env:SAMU_TEST_DB_USERNAME='postgres'
$env:SAMU_TEST_DB_PASSWORD=''
mvn '-Dtest=MembroMensagensIntegrationTests' test
```

Sem `SAMU_TEST_DB_URL`, essa classe é ignorada. Para rodar também o teste de contexto preexistente com `mvn test`, configure `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` e `SITE_URL` para o ambiente de testes.

Cobertura: inativação sem exclusão física, repetição, papéis USER/LIDER/ADMIN, autenticação obrigatória, criação com autoria imutável, leitura compartilhada, edição/exclusão pelo autor, bloqueio de outros autores inclusive ADMIN, validação de conteúdo, isolamento por membro, membro inativo, persistência e paginação com desempate por ID.
