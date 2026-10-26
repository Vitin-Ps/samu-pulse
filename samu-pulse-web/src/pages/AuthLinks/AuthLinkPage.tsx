import {FormEvent, useEffect, useState} from 'react';
import {Link, useNavigate, useSearchParams} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faHeartPulse, faEnvelope, faLock, faUserPlus} from '@fortawesome/free-solid-svg-icons';
import {Button, Input} from '../components/Elements';
import FluxoTokenService from '../../services/FluxoTokenService';
import useTratadorErroApi from '../../hooks/useTratadorErroApi';
import {MessageService} from '../../services';
import {TipoUsuario} from '../../interfaces/Usuario';

export const AuthLinkPage = ({modo}: {modo: 'cadastro' | 'recuperar' | 'senha'}) => {
  const [params] = useSearchParams();
  const token = params.get(modo === 'cadastro' ? 'token-transparente' : 'token') || '';
  const [dados, setDados] = useState({login: '', email: '', nomeExibicao: '', perfilResponsavel: '', senha: '', confirmaSenha: ''});
  const [tipo, setTipo] = useState<TipoUsuario | null>(null);
  const [verificando, setVerificando] = useState(modo === 'cadastro');
  const [mensagem, setMensagem] = useState('');
  const {handleRequest, loading, error} = useTratadorErroApi();
  const navigate = useNavigate();
  const atualizar = (campo: keyof typeof dados, valor: string) => setDados(atual => ({...atual, [campo]: valor}));

  useEffect(() => {
    if (modo !== 'cadastro') return;
    let cancelado = false;
    setVerificando(true);
    void handleRequest(() => FluxoTokenService.consultar(token)).then(resposta => {
      if (!cancelado) { setTipo(resposta?.tipoUsuario ?? null); setVerificando(false); }
    });
    return () => { cancelado = true; };
  }, [modo, token]);

  const salvar = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;
    if (modo !== 'recuperar' && dados.senha !== dados.confirmaSenha) {
      MessageService.alertMessage('Senhas não são iguais.');
      return;
    }
    if (modo === 'recuperar') {
      const resposta = await handleRequest(() => FluxoTokenService.recuperar(dados.email));
      if (resposta) setMensagem(resposta.message);
    } else if (modo === 'cadastro') {
      if (await handleRequest(() => FluxoTokenService.cadastrar({...dados, rawToken: token}))) {
        MessageService.successMessage('Perfil criado com sucesso! Entre com seu login e senha.');
        navigate('/auth/sign-in');
      }
    } else if (await handleRequest(() => FluxoTokenService.redefinir(token, dados.senha, dados.confirmaSenha))) {
      MessageService.successMessage('Senha atualizada com sucesso!');
      navigate('/auth/sign-in');
    }
  };

  const titulo = modo === 'cadastro' ? 'Crie seu perfil' : modo === 'recuperar' ? 'Esqueceu sua senha?' : 'Redefinir senha';
  const indisponivel = modo === 'cadastro' ? !tipo : modo === 'senha' && !token;

  return (
    <main className="w-full min-h-[80vh] flex justify-center items-start px-4 py-8 sm:py-12">
      <section className="w-full max-w-lg bg-white rounded-3xl border border-samu-border p-6 sm:p-8 shadow-sm">
        <div className="w-12 h-12 rounded-2xl bg-samu-primary-lighter text-samu-primary flex items-center justify-center text-xl mb-5"><FontAwesomeIcon icon={faHeartPulse} /></div>
        <p className="text-xs text-samu-primary font-medium mb-2">Samu Pulse</p>
        <h1 className="text-2xl font-semibold tracking-tight text-samu-text">{titulo}</h1>
        <p className="text-sm text-samu-text/65 mt-3 mb-6">{modo === 'cadastro' ? 'Preencha seus dados para acessar o sistema.' : modo === 'recuperar' ? 'Informe o e-mail cadastrado no seu perfil para receber o link de recuperação.' : 'Escolha sua nova senha e confirme abaixo.'}</p>
        {verificando ? <p role="status" className="text-sm text-samu-text/65">Verificando convite...</p> : mensagem ? (
          <div role="status" className="rounded-2xl bg-samu-primary-lighter p-4 text-sm text-samu-text space-y-2"><p>{mensagem}</p><p>Confira também a pasta de spam. O link tem validade de 2 horas.</p></div>
        ) : indisponivel ? (
          <p role="alert" className="text-sm text-samu-danger">{error || 'Link ausente, expirado ou inválido. Solicite um novo link.'}</p>
        ) : (
          <form onSubmit={salvar} className="space-y-4">
            {modo === 'cadastro' && <>
              <p className="text-xs text-samu-primary bg-samu-primary-lighter rounded-xl p-3">Perfil: {tipo === TipoUsuario.ADMIN ? 'Administrador' : tipo === TipoUsuario.LIDER ? 'Líder' : 'Usuário'}</p>
              <Input id="cadastro-nome" label="Nome de exibição" autoComplete="name" required maxLength={255} value={dados.nomeExibicao} onChange={e => atualizar('nomeExibicao', e.target.value)} disabled={loading} />
              <Input id="cadastro-perfil" label="Perfil responsável" required maxLength={255} value={dados.perfilResponsavel} onChange={e => atualizar('perfilResponsavel', e.target.value)} disabled={loading} />
              <Input id="cadastro-login" label="Login (opcional)" maxLength={100} autoComplete="username" placeholder="Se não informado, usaremos seu e-mail" value={dados.login} onChange={e => atualizar('login', e.target.value)} disabled={loading} />
            </>}
            {modo !== 'senha' && <Input id="fluxo-email" type="email" label="E-mail" required maxLength={255} autoComplete="email" value={dados.email} onChange={e => atualizar('email', e.target.value)} disabled={loading} />}
            {modo !== 'recuperar' && <>
              <Input id="fluxo-senha" type="password" label={modo === 'senha' ? 'Nova senha' : 'Senha'} required autoComplete="new-password" value={dados.senha} onChange={e => atualizar('senha', e.target.value)} disabled={loading} />
              <Input id="fluxo-confirmar" type="password" label="Confirme a senha" required autoComplete="new-password" value={dados.confirmaSenha} onChange={e => atualizar('confirmaSenha', e.target.value)} disabled={loading} />
            </>}
            {error && <p role="alert" className="text-sm text-samu-danger">{error}</p>}
            <Button type="submit" disabled={loading} icon={modo === 'cadastro' ? faUserPlus : modo === 'recuperar' ? faEnvelope : faLock} className="w-full! justify-center disabled:opacity-50">
              {loading ? 'Aguarde...' : modo === 'cadastro' ? 'Criar perfil' : modo === 'recuperar' ? 'Enviar link por e-mail' : 'Salvar nova senha'}
            </Button>
          </form>
        )}
        <Link to="/auth/sign-in" className="block text-center text-sm font-medium text-samu-primary mt-6 hover:underline">Voltar para entrar</Link>
      </section>
    </main>
  );
};
