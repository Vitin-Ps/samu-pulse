import {FormEvent, useRef, useState} from 'react';
import {Link} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTags, faUsers, faPlus, faPalette, faLock, faTrash, faShieldHalved, faArrowRight, faUserShield, faPen, faCheck} from '@fortawesome/free-solid-svg-icons';
import {useStatusMembro} from '../../hooks/useStatusMembro';
import {useStateData} from '../../hooks';
import useTratadorErroApi from '../../hooks/useTratadorErroApi';
import StatusMembroService from '../../services/StatusMembroService';
import {MessageService} from '../../services';
import {StatusMembro} from '../../interfaces/StatusMembro';
import {Button, Input, Modal} from '../components/Elements';
import {useBodyScrollLock} from '../../hooks/useBodyScrollLock';

export const AdminPage = () => {
  const {status, carregarStatus, loading: carregandoStatus} = useStatusMembro();
  const {handleRequest, loading} = useTratadorErroApi();
  const stateModel = useStateData({nome: '', cor: '#15803d'});
  const ocupado = useRef(false);
  const [editando, setEditando] = useState<StatusMembro | null>(null);
  useBodyScrollLock(!!editando);
  const membrosVinculados = status.reduce((total, item) => total + (item.membrosAssociados || 0), 0);

  const criarStatus = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (ocupado.current) return;
    ocupado.current = true;
    try {
      const resultado = await handleRequest(() => StatusMembroService.criar(stateModel.data.nome, stateModel.data.cor));
      if (resultado) {
        stateModel.updateState('nome', '');
        MessageService.successMessage('Status cadastrado com sucesso!');
        await carregarStatus();
      }
    } finally {
      ocupado.current = false;
    }
  };

  const salvarStatus = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editando || ocupado.current) return;
    ocupado.current = true;
    try {
      const resultado = await handleRequest(() => StatusMembroService.atualizar(editando.cod_status, editando.nome, editando.cor));
      if (resultado) {
        setEditando(null);
        MessageService.successMessage('Status atualizado com sucesso!');
        await carregarStatus();
      }
    } finally {
      ocupado.current = false;
    }
  };

  const excluirStatus = (item: StatusMembro) => {
    if (ocupado.current || item.membrosAssociados) return;
    MessageService.confirmMessage(`Deseja excluir o status ${item.nome}?`, async () => {
      if (ocupado.current) return;
      ocupado.current = true;
      try {
        const resultado = await handleRequest(() => StatusMembroService.excluir(item.cod_status));
        if (resultado) MessageService.successMessage('Status excluído com sucesso!');
        await carregarStatus();
      } finally {
        ocupado.current = false;
      }
    });
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-12">
      <div className="flex flex-wrap items-center justify-between gap-5 pb-7 border-b border-samu-border">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white border border-samu-border shadow-sm flex items-center justify-center text-samu-primary shrink-0">
            <FontAwesomeIcon icon={faTags} className="text-xl" />
          </div>
          <div>
            <p className="text-xs font-medium text-samu-primary mb-1">Gestão do sistema</p>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-samu-text">Administração</h1>
            <p className="text-sm text-samu-text/60 mt-2 max-w-md">Organize os status para acompanhar cada membro com mais clareza.</p>
          </div>
        </div>
        <Link to="/admin/membros" className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white border border-samu-border text-samu-text text-sm font-medium hover:border-samu-primary hover:text-samu-primary transition-colors">
          <FontAwesomeIcon icon={faUsers} /> Gerenciar membros <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
        </Link>
      </div>
      <nav aria-label="Administração" className="flex items-center gap-2 py-5 mb-2">
        <span aria-current="page" className="inline-flex items-center gap-2 rounded-xl bg-samu-primary text-white px-4 py-2.5 text-sm font-medium">
          <FontAwesomeIcon icon={faTags} /> Status
        </span>
        <Link to="/admin/usuarios" className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-samu-text/70 hover:bg-white transition-colors">
          <FontAwesomeIcon icon={faUserShield} /> Usuários
        </Link>
      </nav>
      <div className="grid grid-cols-2 gap-3 sm:gap-5 mb-7">
        <div className="bg-white/70 border border-samu-border rounded-2xl p-4 sm:p-5 flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-samu-primary-lighter text-samu-primary items-center justify-center hidden sm:flex"><FontAwesomeIcon icon={faTags} /></span>
          <div><p className="text-2xl font-semibold text-samu-text">{carregandoStatus ? '—' : status.length}</p><p className="text-xs sm:text-sm text-samu-text/60">Status cadastrados</p></div>
        </div>
        <div className="bg-white/70 border border-samu-border rounded-2xl p-4 sm:p-5 flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-samu-primary-lighter text-samu-primary items-center justify-center hidden sm:flex"><FontAwesomeIcon icon={faUsers} /></span>
          <div><p className="text-2xl font-semibold text-samu-text">{carregandoStatus ? '—' : membrosVinculados}</p><p className="text-xs sm:text-sm text-samu-text/60">Membros vinculados</p></div>
        </div>
      </div>
      <div className="grid lg:grid-cols-[340px_minmax(0,1fr)] gap-6 items-start">
        <div className="bg-white rounded-3xl border border-samu-border p-5 sm:p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <span className="w-9 h-9 rounded-xl bg-samu-primary-lighter text-samu-primary flex items-center justify-center"><FontAwesomeIcon icon={faPlus} /></span>
            <div><h2 className="text-base font-semibold text-samu-text">Novo status</h2><p className="text-xs text-samu-text/60 mt-0.5">Um nome e uma cor para identificar.</p></div>
          </div>
          <form onSubmit={criarStatus} className="space-y-5">
            <Input id="status-nome" label="Nome do status" placeholder="Ex.: Em acompanhamento" value={stateModel.data.nome}
              required maxLength={255} onChange={event => stateModel.updateState('nome', event.target.value)} />
            <div>
              <label htmlFor="status-cor" className="block text-sm font-medium text-samu-text mb-2">Cor de identificação</label>
              <div className="flex items-center gap-3 rounded-xl border border-samu-border p-2.5">
                <input id="status-cor" type="color" value={stateModel.data.cor}
                  onChange={event => stateModel.updateState('cor', event.target.value)}
                  className="w-12 h-10 rounded-lg cursor-pointer border-0 bg-transparent shrink-0" />
                <div><p className="font-mono text-sm text-samu-text uppercase">{stateModel.data.cor}</p><p className="text-xs text-samu-text/60 mt-0.5">Clique na cor para escolher</p></div>
                <FontAwesomeIcon icon={faPalette} className="ml-auto mr-1 text-samu-text/40" />
              </div>
            </div>
            <div className="rounded-2xl bg-samu-bg/70 border border-dashed border-samu-border p-4">
              <p className="text-xs text-samu-text/60 mb-3">Prévia do status</p>
              <span className="inline-flex items-center gap-2 max-w-full rounded-full px-3 py-1.5 border bg-white text-sm text-samu-text"
                style={{borderColor: `${stateModel.data.cor}66`}}>
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{backgroundColor: stateModel.data.cor}} />
                <span className="truncate">{stateModel.data.nome.trim() || 'Nome do status'}</span>
              </span>
            </div>
            <Button type="submit" icon={faPlus} className="w-full! justify-center text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading || carregandoStatus}>Cadastrar status</Button>
          </form>
        </div>
        <div>
          <div className="flex items-start justify-between gap-3 mb-4 px-1">
            <div><h2 className="text-lg font-semibold text-samu-text">Status dos membros</h2><p className="text-sm text-samu-text/60 mt-1">Identificações disponíveis para a sua congregação.</p></div>
          </div>
          {carregandoStatus && <p role="status" className="bg-white border border-samu-border rounded-2xl p-6 text-sm text-samu-text/60">Carregando status...</p>}
          {!carregandoStatus && status.length === 0 && (
            <div className="bg-white border border-dashed border-samu-border rounded-3xl py-12 px-6 text-center">
              <FontAwesomeIcon icon={faTags} className="text-3xl text-samu-primary/40 mb-4" />
              <p className="text-sm font-medium text-samu-text">Nenhum status cadastrado</p>
              <p className="text-sm text-samu-text/60 mt-2">Crie o primeiro status pelo formulário.</p>
            </div>
          )}
          <ul className="space-y-3">
            {status.map(item => (
              <li key={item.cod_status} className="bg-white rounded-2xl border border-samu-border p-4 sm:p-5 shadow-sm">
                <div className="flex items-center gap-3 sm:gap-4">
                  <span className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border" style={{backgroundColor: `${item.cor}12`, borderColor: `${item.cor}26`, color: item.cor}}>
                    <FontAwesomeIcon icon={faTags} />
                  </span>
                  <div className="min-w-0 grow">
                    <h3 className="text-sm sm:text-base font-semibold text-samu-text break-words">{item.nome}</h3>
                    <p className="text-xs text-samu-text/55 mt-1 font-mono uppercase">{item.cor}</p>
                  </div>
                  <button type="button" onClick={() => setEditando({...item})}
                    aria-label={`Editar status ${item.nome}`} title="Editar nome e cor"
                    disabled={loading || carregandoStatus}
                    className="w-9 h-9 rounded-xl border border-samu-border flex items-center justify-center text-samu-primary hover:bg-samu-primary-lighter disabled:opacity-40 transition-colors cursor-pointer shrink-0">
                    <FontAwesomeIcon icon={faPen} className="text-xs" />
                  </button>
                  <button type="button" onClick={() => excluirStatus(item)}
                    aria-label={`Excluir status ${item.nome}`}
                    title={item.membrosAssociados ? 'Não é possível excluir um status associado a membros.' : `Excluir ${item.nome}`}
                    disabled={loading || carregandoStatus || !!item.membrosAssociados}
                    className="w-9 h-9 rounded-xl border border-samu-border flex items-center justify-center text-samu-danger hover:bg-samu-danger/5 hover:border-samu-danger/30 disabled:text-samu-text/30 disabled:hover:bg-transparent disabled:hover:border-samu-border disabled:cursor-not-allowed transition-colors cursor-pointer shrink-0">
                    <FontAwesomeIcon icon={item.membrosAssociados ? faLock : faTrash} className="text-xs" />
                  </button>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-3 border-t border-samu-border/70">
                  <span className="inline-flex items-center gap-2 text-xs text-samu-text/65"><FontAwesomeIcon icon={faUsers} className="text-samu-primary/70" />{item.membrosAssociados || 0} {item.membrosAssociados === 1 ? 'membro vinculado' : 'membros vinculados'}</span>
                  <span className={`text-xs font-medium ${item.membrosAssociados ? 'text-samu-text/50' : 'text-samu-success'}`}>{item.membrosAssociados ? 'Em uso · exclusão bloqueada' : 'Disponível para exclusão'}</span>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex items-start gap-3 mt-5 px-1 text-samu-text/60">
            <FontAwesomeIcon icon={faShieldHalved} className="text-samu-primary mt-0.5" />
            <p className="text-xs leading-relaxed">Status com membros vinculados são protegidos e não podem ser excluídos. Essa regra também vale para membros inativos.</p>
          </div>
        </div>
      </div>
      <Modal showModal={!!editando} setShowModal={() => setEditando(null)} className="max-w-md p-6 rounded-3xl border border-samu-border">
        {editando && (
          <form onSubmit={salvarStatus} className="space-y-5">
            <h2 className="text-xl font-semibold text-samu-text pr-7">Editar status</h2>
            <Input id="editar-status-nome" label="Nome do status" value={editando.nome} required maxLength={255}
              onChange={event => setEditando({...editando, nome: event.target.value})} />
            <div>
              <label htmlFor="editar-status-cor" className="block text-sm font-medium text-samu-text mb-2">Cor de identificação</label>
              <div className="flex items-center gap-3 rounded-xl border border-samu-border p-2.5">
                <input id="editar-status-cor" type="color" value={editando.cor}
                  onChange={event => setEditando({...editando, cor: event.target.value})}
                  className="w-12 h-10 rounded-lg cursor-pointer border-0 bg-transparent shrink-0" />
                <span className="font-mono text-sm text-samu-text uppercase">{editando.cor}</span>
              </div>
            </div>
            <p className="text-xs text-samu-text/60 leading-relaxed">O nome e a cor serão atualizados também nos membros vinculados a este status.</p>
            <div className="flex flex-wrap justify-end gap-2">
              <Button type="button" variant="secondary" onClick={() => setEditando(null)}>Cancelar</Button>
              <Button type="submit" icon={faCheck} disabled={loading} className="disabled:opacity-50">Salvar alterações</Button>
            </div>
          </form>
        )}
      </Modal>
    </section>
  );
};
