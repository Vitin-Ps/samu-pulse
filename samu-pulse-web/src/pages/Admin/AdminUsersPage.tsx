import {FormEvent, useContext, useEffect, useRef, useState} from 'react';
import {Link} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faUserShield, faTags, faMagnifyingGlass, faPen, faChevronLeft, faChevronRight, faCheck, faUsers} from '@fortawesome/free-solid-svg-icons';
import {AuthContext} from '../../Auth/AuthContext';
import {TipoUsuario, UsuarioAdmin} from '../../interfaces/Usuario';
import UsuarioService from '../../services/UsuarioService';
import {MessageService} from '../../services';
import useTratadorErroApi from '../../hooks/useTratadorErroApi';
import {useStateData} from '../../hooks';
import {useBodyScrollLock} from '../../hooks/useBodyScrollLock';
import {Button, Input, Modal} from '../components/Elements';
import Select from '../components/Elements/Select';

const permissoes = [
  {value: TipoUsuario.ADMIN, text: 'Administrador'},
  {value: TipoUsuario.LIDER, text: 'Líder'},
  {value: TipoUsuario.USER, text: 'Usuário'},
];

export const AdminUsersPage = () => {
  const auth = useContext(AuthContext);
  const {handleRequest, loading} = useTratadorErroApi();
  const stateModel = useStateData({usuarios: [] as UsuarioAdmin[], search: '', page: 0, totalPages: 0, totalElements: 0});
  const [selecionado, setSelecionado] = useState<UsuarioAdmin | null>(null);
  const salvando = useRef(false);
  const tituloRef = useRef<HTMLHeadingElement>(null);
  const paginaCarregada = useRef(0);
  useBodyScrollLock(!!selecionado);

  const carregarUsuarios = async (page = stateModel.data.page) => {
    const resposta = await handleRequest(() => UsuarioService.listar(stateModel.data.search, page));
    if (resposta) {
      stateModel.updateMultipleStates({usuarios: resposta.content, totalPages: resposta.totalPages, totalElements: resposta.totalElements});
      if (page !== paginaCarregada.current) {
        paginaCarregada.current = page;
        tituloRef.current?.focus({preventScroll: true});
        window.scrollTo({top: 0, left: 0, behavior: 'instant'});
      }
    }
  };

  useEffect(() => { carregarUsuarios(); }, [stateModel.data.page]);

  const pesquisar = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (stateModel.data.page !== 0) stateModel.updateState('page', 0);
    else carregarUsuarios(0);
  };

  const irParaPagina = (page: number) => {
    if (!loading && Number.isInteger(page) && page >= 0 && page < stateModel.data.totalPages)
      stateModel.updateState('page', page);
  };

  const salvarAcesso = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selecionado || salvando.current) return;
    salvando.current = true;
    try {
      const resultado = await handleRequest(() => UsuarioService.atualizarAcesso(selecionado.id, selecionado.tipoUsuario, selecionado.ativo));
      if (!resultado) return;
      setSelecionado(null);
      MessageService.successMessage('Acesso do usuário atualizado com sucesso!');
      if (resultado.id === auth.user?.id && (!resultado.ativo || resultado.tipoUsuario !== TipoUsuario.ADMIN)) {
        auth.signout();
        return;
      }
      await carregarUsuarios();
    } finally {
      salvando.current = false;
    }
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-12">
      <div className="flex items-start gap-4 pb-7 border-b border-samu-border">
        <div className="w-12 h-12 rounded-2xl bg-white border border-samu-border shadow-sm flex items-center justify-center text-samu-primary shrink-0"><FontAwesomeIcon icon={faUserShield} className="text-xl" /></div>
        <div>
          <p className="text-xs font-medium text-samu-primary mb-1">Gestão do sistema</p>
          <h1 ref={tituloRef} tabIndex={-1} className="text-2xl sm:text-3xl font-semibold tracking-tight text-samu-text outline-none">Usuários</h1>
          <p className="text-sm text-samu-text/60 mt-2">Controle quem tem acesso e o que cada pessoa pode gerenciar.</p>
        </div>
      </div>
      <nav aria-label="Administração" className="flex items-center gap-2 py-5 mb-2">
        <Link to="/admin" className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-samu-text/70 hover:bg-white transition-colors"><FontAwesomeIcon icon={faTags} /> Status</Link>
        <span aria-current="page" className="inline-flex items-center gap-2 rounded-xl bg-samu-primary text-white px-4 py-2.5 text-sm font-medium"><FontAwesomeIcon icon={faUserShield} /> Usuários</span>
      </nav>
      <div className="bg-white rounded-3xl border border-samu-border shadow-sm">
        <div className="p-5 sm:p-6 border-b border-samu-border flex flex-wrap items-center justify-between gap-4">
          <div><h2 className="font-semibold text-samu-text">Usuários cadastrados</h2><p className="text-sm text-samu-text/60 mt-1">{stateModel.data.totalElements} {stateModel.data.totalElements === 1 ? 'usuário encontrado' : 'usuários encontrados'}</p></div>
          <form onSubmit={pesquisar} className="flex items-center gap-2 w-full sm:w-auto">
            <Input id="search-usuarios" aria-label="Pesquisar usuários" placeholder="Buscar por nome ou login" value={stateModel.data.search}
              onChange={event => stateModel.updateState('search', event.target.value)} />
            <button type="submit" aria-label="Pesquisar" disabled={loading} className="w-11 h-11 rounded-xl bg-samu-primary text-white flex items-center justify-center shrink-0 cursor-pointer disabled:opacity-50"><FontAwesomeIcon icon={faMagnifyingGlass} /></button>
          </form>
        </div>
        {loading && <p role="status" className="px-6 pt-4 text-sm text-samu-text/60">Carregando...</p>}
        {!loading && stateModel.data.usuarios.length === 0 && <div className="text-center px-6 py-12"><FontAwesomeIcon icon={faUsers} className="text-3xl text-samu-primary/40 mb-3" /><p className="text-sm text-samu-text/60">Nenhum usuário encontrado.</p></div>}
        <ul className="divide-y divide-samu-border">
          {stateModel.data.usuarios.map(usuario => (
            <li key={usuario.id} className="p-5 sm:px-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-11 h-11 rounded-2xl bg-samu-primary-lighter text-samu-primary flex items-center justify-center font-semibold shrink-0">{(usuario.nomeExibicao || usuario.login).trim().charAt(0).toUpperCase()}</span>
                <div className="min-w-0"><h3 className="font-semibold text-sm text-samu-text break-words">{usuario.nomeExibicao || usuario.login}{usuario.id === auth.user?.id && <span className="ml-2 text-xs font-normal text-samu-primary">Você</span>}</h3><p className="text-xs text-samu-text/55 mt-1 break-all">{usuario.login}</p></div>
              </div>
              <div className="flex items-center flex-wrap gap-3">
                <span className="text-xs text-samu-text/65 bg-samu-bg rounded-lg px-2.5 py-1.5">{permissoes.find(item => item.value === usuario.tipoUsuario)?.text}</span>
                <span className={`inline-flex items-center gap-1.5 text-xs font-medium rounded-full px-2.5 py-1 ${usuario.ativo ? 'bg-samu-success/10 text-samu-success' : 'bg-samu-danger/10 text-samu-danger'}`}><span className="w-1.5 h-1.5 rounded-full bg-current" />{usuario.ativo ? 'Ativo' : 'Inativo'}</span>
                <button type="button" aria-label={`Alterar acesso de ${usuario.nomeExibicao || usuario.login}`} onClick={() => setSelecionado({...usuario})}
                  disabled={loading} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-samu-border text-samu-primary text-xs font-medium hover:bg-samu-primary-lighter disabled:opacity-50 transition-colors cursor-pointer"><FontAwesomeIcon icon={faPen} /> Alterar acesso</button>
              </div>
            </li>
          ))}
        </ul>
        {stateModel.data.totalPages > 0 && (
          <div className="p-5 sm:px-6 border-t border-samu-border flex flex-wrap items-center justify-between gap-4">
            <span className="text-xs text-samu-text/60">Página {stateModel.data.page + 1} de {stateModel.data.totalPages}</span>
            <div className="flex items-center gap-2">
              <button type="button" aria-label="Página anterior" disabled={loading || stateModel.data.page === 0} onClick={() => irParaPagina(stateModel.data.page - 1)} className="w-9 h-9 rounded-xl border border-samu-border text-samu-text disabled:opacity-40 cursor-pointer"><FontAwesomeIcon icon={faChevronLeft} /></button>
              <Select label="Página" flexDirection="row" width="auto" optionDefaultShow={false} valor={stateModel.data.page}
                setValor={value => irParaPagina(Number(value))} data={Array.from({length: stateModel.data.totalPages}, (_, page) => ({value: page, text: String(page + 1)}))} />
              <button type="button" aria-label="Próxima página" disabled={loading || stateModel.data.page >= stateModel.data.totalPages - 1} onClick={() => irParaPagina(stateModel.data.page + 1)} className="w-9 h-9 rounded-xl border border-samu-border text-samu-text disabled:opacity-40 cursor-pointer"><FontAwesomeIcon icon={faChevronRight} /></button>
            </div>
          </div>
        )}
      </div>
      <Modal showModal={!!selecionado} setShowModal={() => setSelecionado(null)} className="max-w-md p-6 rounded-3xl border border-samu-border max-h-[90dvh] overflow-y-auto">
        {selecionado && (
          <form onSubmit={salvarAcesso} className="space-y-5">
            <div className="pr-7"><h2 className="text-xl font-semibold text-samu-text">Alterar acesso</h2><p className="text-sm text-samu-text/60 mt-2 break-words">{selecionado.nomeExibicao || selecionado.login}</p></div>
            <Select label="Permissão" optionDefaultShow={false} valor={selecionado.tipoUsuario} data={permissoes}
              disabled={selecionado.id === auth.user?.id || loading}
              setValor={tipoUsuario => setSelecionado({...selecionado, tipoUsuario})} />
            <Select label="Status do acesso" optionDefaultShow={false} valor={String(selecionado.ativo)}
              data={[{value: 'true', text: 'Ativo'}, {value: 'false', text: 'Inativo'}]}
              setValor={ativo => setSelecionado({...selecionado, ativo: ativo === 'true'})} />
            <p className="text-xs text-samu-text/60 leading-relaxed">Usuários inativos não podem entrar nem continuar acessando o sistema. As permissões passam a valer nas próximas requisições.</p>
            {selecionado.id === auth.user?.id && <p className="text-xs text-samu-primary bg-samu-primary-lighter rounded-xl p-3 leading-relaxed">Você não pode alterar seu próprio tipo de usuário. Ao inativar seu acesso, sua sessão será encerrada.</p>}
            <div className="flex flex-wrap justify-end gap-2 pt-2">
              <Button type="button" variant="secondary" onClick={() => setSelecionado(null)}>Cancelar</Button>
              <Button type="submit" icon={faCheck} disabled={loading} className="disabled:opacity-50">Salvar alterações</Button>
            </div>
          </form>
        )}
      </Modal>
    </section>
  );
};
