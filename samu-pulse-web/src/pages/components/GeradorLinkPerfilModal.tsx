import {FormEvent, useRef, useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faLink, faCopy, faEnvelope} from '@fortawesome/free-solid-svg-icons';
import {Button, Input, Modal} from './Elements';
import Select from './Elements/Select';
import {TipoUsuario} from '../../interfaces/Usuario';
import FluxoTokenService, {LinkCadastro} from '../../services/FluxoTokenService';
import useTratadorErroApi from '../../hooks/useTratadorErroApi';
import {useBodyScrollLock} from '../../hooks/useBodyScrollLock';
import {MessageService} from '../../services';

export const GeradorLinkPerfilModal = ({onClose}: {onClose: () => void}) => {
  const [tipo, setTipo] = useState(TipoUsuario.LIDER);
  const [senha, setSenha] = useState('');
  const [email, setEmail] = useState('');
  const [gerado, setGerado] = useState<LinkCadastro | null>(null);
  const {handleRequest, loading, error} = useTratadorErroApi();
  const ocupado = useRef(false);
  useBodyScrollLock(true);

  const gerar = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (ocupado.current) return;
    ocupado.current = true;
    try {
      const resposta = await handleRequest(() => FluxoTokenService.gerar(senha, tipo));
      if (resposta) { setGerado(resposta); setSenha(''); }
    } finally { ocupado.current = false; }
  };

  const enviar = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!gerado || ocupado.current) return;
    ocupado.current = true;
    try {
      if (await handleRequest(() => FluxoTokenService.enviar(gerado.token, email))) {
        MessageService.successMessage('E-mail enviado com sucesso!');
        onClose();
      }
    } finally { ocupado.current = false; }
  };

  const copiar = async () => {
    if (!gerado) return;
    try {
      await navigator.clipboard.writeText(gerado.link);
      MessageService.successMessage('Link copiado!');
    } catch {
      MessageService.alertMessage('Não foi possível copiar automaticamente. Selecione o link e copie.');
    }
  };

  return (
    <Modal showModal setShowModal={() => { if (!ocupado.current) onClose(); }} showCloseModal={!loading}
      className="max-w-lg p-6 sm:p-8 rounded-3xl border border-samu-border max-h-[90dvh] overflow-y-auto">
      <div className="w-12 h-12 mb-4 rounded-2xl bg-samu-primary-lighter text-samu-primary flex items-center justify-center"><FontAwesomeIcon icon={faLink} /></div>
      <h2 className="text-xl font-semibold text-samu-text pr-6">Criar perfil por link</h2>
      <p className="text-sm text-samu-text/65 mt-2 mb-6">Gere um convite de uso único, válido por 2 horas, e envie por e-mail ou copie o link.</p>
      {!gerado ? (
        <form onSubmit={gerar} className="space-y-5">
          <Select label="Tipo de perfil" valor={tipo} setValor={setTipo} optionDefaultShow={false}
            data={[{value: TipoUsuario.LIDER, text: 'Líder'}, {value: TipoUsuario.USER, text: 'Usuário'}, {value: TipoUsuario.ADMIN, text: 'Administrador'}]} />
          <Input id="senha-gerar-link" type="password" label="Confirme sua senha" required value={senha} autoComplete="current-password"
            onChange={event => setSenha(event.target.value)} disabled={loading} />
          <Button type="submit" icon={faLink} disabled={loading} className="w-full! justify-center disabled:opacity-50">{loading ? 'Gerando...' : 'Gerar link'}</Button>
        </form>
      ) : (
        <div className="space-y-5">
          <div className="rounded-2xl border border-samu-border bg-samu-bg/60 p-4 space-y-3">
            <p className="text-sm font-medium text-samu-text">Link gerado com sucesso!</p>
            <Input id="link-perfil" aria-label="Link de criação de perfil" value={gerado.link} readOnly onFocus={event => event.target.select()} />
            <Button type="button" variant="secondary" icon={faCopy} onClick={copiar}>Copiar link</Button>
          </div>
          <form onSubmit={enviar} className="space-y-4">
            <Input id="email-convite" label="Enviar convite por e-mail" type="email" required value={email}
              onChange={event => setEmail(event.target.value)} disabled={loading} placeholder="pessoa@exemplo.com" />
            <Button type="submit" icon={faEnvelope} disabled={loading} className="w-full! justify-center disabled:opacity-50">{loading ? 'Enviando...' : 'Enviar e-mail'}</Button>
          </form>
        </div>
      )}
      {error && <p role="alert" className="text-sm text-samu-danger mt-4">{error}</p>}
    </Modal>
  );
};
