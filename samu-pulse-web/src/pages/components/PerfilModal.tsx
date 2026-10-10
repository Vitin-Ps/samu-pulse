import {FormEvent, useEffect, useRef, useState} from 'react';
import {useAuth} from '../../hooks';
import {MessageService} from '../../services';
import {Button} from './Elements/Button';
import {Input} from './Elements/Input';
import {Modal} from './Elements/Modal/Modal';
import Spinner from './Elements/Spinner';

export const PerfilModal = ({onClose}: {onClose: () => void}) => {
  const {consultarPerfil, atualizarPerfil, error} = useAuth();
  const [nomeExibicao, setNomeExibicao] = useState('');
  const [perfilResponsavel, setPerfilResponsavel] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [carregado, setCarregado] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [tentativa, setTentativa] = useState(0);
  const emCurso = useRef(false);

  useEffect(() => {
    let cancelado = false;
    setCarregando(true);
    void consultarPerfil().then(perfil => {
      if (cancelado) return;
      if (perfil) {
        setNomeExibicao(perfil.nomeExibicao ?? '');
        setPerfilResponsavel(perfil.perfilResponsavel);
        setCarregado(true);
      }
      setCarregando(false);
    });
    return () => { cancelado = true; };
  }, [tentativa]);

  const salvar = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (emCurso.current || !nomeExibicao.trim()) return;
    emCurso.current = true;
    setSalvando(true);
    try {
      const perfil = await atualizarPerfil(nomeExibicao.trim());
      if (!perfil) return;
      MessageService.successMessage('Nome de exibição atualizado com sucesso!');
      onClose();
    } finally {
      emCurso.current = false;
      setSalvando(false);
    }
  };

  return (
    <Modal showModal setShowModal={() => { if (!emCurso.current) onClose(); }} showCloseModal={!salvando}
      className="max-w-lg p-6 rounded-3xl border border-samu-border max-h-[90dvh] overflow-y-auto">
      <h2 className="text-xl font-semibold text-samu-text mb-2">Meu perfil</h2>
      <p className="text-sm text-samu-text/70 mb-5">Informe o nome pelo qual você será identificado no histórico de mensagens.</p>
      {carregando ? (
        <div role="status" className="flex items-center gap-3 py-4"><Spinner size={0.7} /> Carregando perfil...</div>
      ) : !carregado ? (
        <div role="alert" className="space-y-3 text-sm text-samu-danger">
          <p>{error || 'Não foi possível carregar seu perfil.'}</p>
          <Button variant="secondary" onClick={() => setTentativa(value => value + 1)}>Tentar novamente</Button>
        </div>
      ) : (
        <form onSubmit={salvar}>
          <Input id="nome-exibicao" label="Nome de exibição" required maxLength={255}
            value={nomeExibicao} onChange={event => setNomeExibicao(event.target.value)} disabled={salvando}
            placeholder="Ex.: Maria Souza" autoComplete="name" />
          <p className="text-sm text-samu-text/70 my-4"><span className="font-medium">Perfil: </span>{perfilResponsavel}</p>
          {error && <p role="alert" className="text-sm text-samu-danger mb-3">{error}</p>}
          <div className="flex flex-col sm:flex-row justify-end gap-2">
            <Button type="button" variant="secondary" onClick={onClose} disabled={salvando}>Cancelar</Button>
            <Button type="submit" disabled={salvando || !nomeExibicao.trim()}
              className="disabled:opacity-40 disabled:cursor-not-allowed">{salvando ? 'Salvando...' : 'Salvar nome'}</Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
