# Cadastro por convite e recuperação de senha

## Referência e comportamento preservado

Implementação baseada em `D:/Estudo/GitHub/Barbearia_app/develop`:

| Referência | Adaptação no Samu Pulse |
| --- | --- |
| `infra/rawToken/TokenTransparenteService.java` | Mesmo `KeyBasedPersistenceTokenService`, segredo baseado no hash da senha do usuário, inteiro de servidor 22, `SecureRandomFactoryBean` e formato Base64. Validade ajustada para 2 horas por solicitação posterior. |
| `controller/RawTokenController.java` | Confirmação da senha do usuário autenticado antes de gerar o link; recuperação por e-mail com resposta genérica para endereço desconhecido. |
| `domain/funcionario/FuncionarioService.java` | Cadastro por token de um usuário com autoridade; perfil adaptado aos tipos já existentes no Samu. |
| `domain/usuario/UsuarioService.java` | Login informado ou e-mail quando omitido, senha BCrypt, comparação de senha e confirmação na redefinição. |
| `infra/email/EmailService.java` | Mesmo envio SMTP com `JavaMailSender`, `MimeMessageHelper`, UTF-8 e corpo HTML. |
| `infra/FuncionalidadesService.java` | Mensagens de convite e recuperação com identidade visual do Samu Pulse. |
| `GeradorToken.tsx`, `SignUp.tsx`, `ForgotPassword.tsx`, `PasswordReset.tsx` | Modal na home do ADMIN e páginas públicas com os componentes existentes do Samu. |

O código da referência expira tokens em 5 minutos. Por solicitação posterior, convites e recuperação agora valem **2 horas**, informadas também na interface e nos e-mails. O uso continua único: após cadastro ou redefinição concluídos, o link é invalidado.

O JWT de login usa `JWT_EXPIRATION_MS=604800000`, equivalente a **7 dias**. A API respeita essa propriedade, sem a expiração fixa de duas horas que existia antes. O padrão do projeto, o `.env` local e os arquivos do pacote de produção foram atualizados. Essa validade se aplica a novos logins; JWTs já emitidos conservam o vencimento assinado. O servidor de produção precisa receber a nova versão da API e recarregar o ambiente; o deploy não foi executado nesta alteração.

Usuários USER podem consultar a lista, os detalhes e o histórico dos membros, sem criar, editar, inativar ou alterar fotos e mensagens. ADMIN e LIDER mantêm as operações de cadastro/edição de membros; administração de usuários e status continua exclusiva para ADMIN. O ADMIN pode inativar e reativar contas, mas não mudar seu próprio tipo de usuário, inclusive por chamada direta à API.

O controle de uso continua em memória, sem uma tabela de tokens. A validação de consumo foi sincronizada para manter uso único também em requisições simultâneas. Os metadados do convite guardam o perfil escolhido pelo ADMIN e distinguem cadastro de recuperação; o destinatário não pode trocar o perfil pelo endereço do link nem usar um convite para redefinir a senha de quem o gerou. Abrir/consultar o convite não o consome. Reiniciar o backend descarta os convites e recuperações pendentes; é necessário gerar novos links.

## Fluxos

1. Na home, ADMIN abre **Convidar usuário**, escolhe o tipo de perfil existente e confirma sua própria senha.
2. O backend autentica essa senha e gera o link de uso único. O ADMIN pode copiá-lo ou enviá-lo para o e-mail informado.
3. O destinatário abre `/auth/sign-up?token-transparente=...`, preenche nome de exibição, perfil responsável, login opcional, e-mail e senha/confirmacão. O perfil é obtido do convite no backend.
4. Na tela de login, **Esqueceu sua senha?** abre `/auth/sign-in/forgot-password`. A solicitação usa o e-mail cadastrado e responde de forma genérica, como na referência.
5. O e-mail leva a `/auth/sign-in/password-reset?token=...`; a redefinição valida o token, compara as senhas e grava o novo hash BCrypt. O token não pode ser reutilizado.

## Campo e-mail e migration

A adição do e-mail ao usuário foi confirmada pelo desenvolvedor na conversa. A migration `V10__add_email_usuario.sql` adiciona `usuario.email`, nullable para preservar usuários antigos, e um índice que impede duplicidade entre e-mails de contas ativas, seguindo a validação da referência. Os logins existentes não são modificados.

Usuários antigos podem cadastrar seu endereço em **Meu perfil → E-mail para recuperação de senha**. Nenhum endereço foi inventado ou extraído dos dados de membros.

A V10 foi validada apenas num PostgreSQL temporário de testes, junto com as demais migrations. Não foi executada na base restaurada ou em produção. O Flyway a aplicará ao iniciar a API atualizada no ambiente de destino. Faça backup e use o processo de implantação já existente.

## Configuração SMTP

O `.env.example` documenta as variáveis. Preencher no `.env` do backend conforme o provedor real, sem versionar credenciais:

```dotenv
SITE_URL=http://localhost:5173
MAIL_HOST=smtp.seu-provedor
MAIL_PORT=587
MAIL_USERNAME=
MAIL_PASSWORD=
MAIL_FROM=
MAIL_SMTP_AUTH=true
MAIL_STARTTLS=true
```

`SITE_URL` deve ser a URL pública do frontend no ambiente que enviará os convites. `MAIL_FROM` é o remetente aceito pelo provedor. Não foram copiados segredos do projeto de referência, configurado um provedor por suposição ou enviados e-mails reais durante os testes. O envio real depende dessas variáveis.

## Rotas

| Método e rota da API | Acesso |
| --- | --- |
| `POST /token/gerar` | ADMIN + confirmação da própria senha |
| `POST /token/enviar-convite` | ADMIN |
| `POST /token/consultar-convite` | Público, com convite válido |
| `POST /auth/sign-up` | Público, com convite válido |
| `POST /token/token-senha` | Público, solicitação por e-mail |
| `PUT /token/senha` | Público, com token de recuperação válido |
| `GET/PUT /auth/perfil` | Usuário autenticado; e-mail incluído no perfil existente |

As rotas da API são relativas ao prefixo `/api`. A autenticação existente e o cadastro inicial de ADMIN não foram substituídos.

## Verificação

- Build de produção do frontend aprovado.
- 77 testes de backend aprovados: gerador, fluxos de convite/recuperação, regras de status e regressão de membros/usuários.
- Testes de integração em instância PostgreSQL temporária exclusiva, desligada ao terminar.
- Todo envio de e-mail de testes foi simulado; nenhum destinatário real foi contatado.
- A aplicação local não foi iniciada. A validação visual interativa e o envio SMTP real continuam dependentes de executar o projeto e preencher a configuração do provedor.
