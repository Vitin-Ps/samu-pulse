import {useEffect, useRef} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faChevronLeft, faChevronRight, faComment, faEdit, faPlus, faTrash} from '@fortawesome/free-solid-svg-icons';
import {Button, TextArea} from '../../components/Elements';
import Spinner from '../../components/Elements/Spinner';
import {formatDateOfPattern} from '../../../services/Extra/FuncionalidadesService';
import {useMemberMessagesModel} from '../useMemberMessagesModel';

export const MemberMessagesSection = ({idMembro}: {idMembro: number}) => {
  const model = useMemberMessagesModel(idMembro);
  const {data, updateState} = model.stateModel;
  const editor = useRef<HTMLDivElement>(null);
  const texto = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (data.editorAberto) {
      editor.current?.scrollIntoView({block: 'nearest', behavior: 'smooth'});
      texto.current?.focus({preventScroll: true});
    }
  }, [data.editorAberto, data.mensagemEmEdicao?.id]);

  return (
    <section className="border-t border-samu-border pt-5 space-y-4" aria-labelledby="historico-mensagens-titulo">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-samu-primary-lighter text-samu-primary flex items-center justify-center shrink-0">
          <FontAwesomeIcon icon={faComment} />
        </div>
        <div>
          <h4 id="historico-mensagens-titulo" className="font-semibold text-samu-text">Histórico de mensagens</h4>
          <p className="text-xs text-samu-neutral">
            {data.erroConsulta ? 'Histórico indisponível' : `${data.totalElements} ${data.totalElements === 1 ? 'mensagem registrada' : 'mensagens registradas'}`}
          </p>
        </div>
      </div>

      <div aria-live="polite" aria-busy={data.carregando}>
        {data.carregando ? (
          <div role="status" className="flex items-center justify-center gap-3 py-8 text-sm text-samu-text">
            <Spinner size={0.7} /> Carregando mensagens...
          </div>
        ) : data.erroConsulta ? (
          <div role="alert" className="p-4 border border-samu-border rounded-2xl bg-samu-bg text-sm text-samu-text space-y-3">
            <p>Não foi possível carregar o histórico de mensagens.</p>
            <Button type="button" variant="secondary" onClick={model.recarregar}>Tentar novamente</Button>
          </div>
        ) : data.mensagens.length === 0 ? (
          <p className="text-sm text-samu-text/70 text-center rounded-2xl border border-samu-border bg-samu-bg p-6">
            Nenhuma mensagem registrada. Adicione a primeira mensagem abaixo.
          </p>
        ) : (
          <div className="space-y-3">
            {data.mensagens.map(mensagem => (
              <article key={mensagem.id} className="rounded-2xl border border-samu-border bg-samu-bg/60 p-4 space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-samu-text wrap-anywhere">
                      {mensagem.perfilResponsavel || mensagem.usuario.perfilResponsavel || mensagem.usuario.login}
                      {model.podeAlterar(mensagem) && <span className="ml-2 text-xs font-normal text-samu-primary">Você</span>}
                    </p>
                    <p className="text-xs text-samu-text/70 wrap-anywhere">{mensagem.usuario.login}</p>
                    <time dateTime={mensagem.dataRegistro} className="text-xs text-samu-text/70">
                      {formatDateOfPattern(mensagem.dataRegistro, 'DD/MM/YYYY [às] HH:mm')}
                    </time>
                  </div>
                  {model.podeAlterar(mensagem) && (
                    <div className="flex gap-1">
                      <button type="button" title="Editar mensagem" aria-label="Editar mensagem"
                        disabled={model.ocupado} onClick={() => model.abrirEditor(mensagem)}
                        className="w-9 h-9 rounded-xl text-samu-primary hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button type="button" title="Excluir mensagem" aria-label="Excluir mensagem"
                        disabled={model.ocupado} onClick={() => model.excluir(mensagem)}
                        className="w-9 h-9 rounded-xl text-samu-danger hover:bg-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">
                        {data.excluindoId === mensagem.id ? <Spinner size={0.5} /> : <FontAwesomeIcon icon={faTrash} />}
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-sm text-samu-text leading-relaxed whitespace-pre-wrap wrap-anywhere">
                  {mensagem.mensagem || 'Mensagem sem conteúdo.'}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>

      {!data.erroConsulta && data.totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-samu-border pt-3">
          <span className="text-xs text-samu-text/70">Página {data.page + 1} de {data.totalPages}</span>
          <div className="flex gap-2">
            <button type="button" aria-label="Página anterior de mensagens"
              disabled={data.page === 0 || data.carregando || model.ocupado}
              onClick={() => updateState('page', data.page - 1)}
              className="w-9 h-9 rounded-xl border border-samu-border text-samu-text hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <button type="button" aria-label="Próxima página de mensagens"
              disabled={data.page >= data.totalPages - 1 || data.carregando || model.ocupado}
              onClick={() => updateState('page', data.page + 1)}
              className="w-9 h-9 rounded-xl border border-samu-border text-samu-text hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
        </div>
      )}

      <div ref={editor} className="border-t border-samu-border pt-4">
        {data.editorAberto ? (
          <form onSubmit={model.salvar} aria-label={data.mensagemEmEdicao ? 'Editar mensagem' : 'Nova mensagem'}>
            <h5 className="font-semibold text-samu-text mb-3">{data.mensagemEmEdicao ? 'Editar mensagem' : 'Nova mensagem'}</h5>
            <TextArea ref={texto} id="conteudo-mensagem" label="Mensagem" required rows={4}
              placeholder="Registre uma mensagem sobre este membro..."
              value={data.conteudo} disabled={model.ocupado}
              onChange={event => updateState('conteudo', event.target.value)} />
            {model.erroOperacao && <p role="alert" className="text-sm text-samu-danger mb-3">{model.erroOperacao}</p>}
            <div className="flex flex-col sm:flex-row justify-end gap-2">
              <Button type="button" variant="secondary" onClick={model.cancelarEdicao} disabled={model.ocupado}
                className="disabled:opacity-40 disabled:cursor-not-allowed">Cancelar</Button>
              <Button type="submit" disabled={model.ocupado || !data.conteudo.trim()}
                className="disabled:opacity-40 disabled:cursor-not-allowed">
                {data.salvando && <Spinner size={0.5} colorInit="white" colorFinal="white" />}
                {data.salvando ? 'Salvando...' : 'Salvar mensagem'}
              </Button>
            </div>
          </form>
        ) : (
          <Button type="button" icon={faPlus} onClick={() => model.abrirEditor()} disabled={model.ocupado}
            className="disabled:opacity-40 disabled:cursor-not-allowed">Nova mensagem</Button>
        )}
      </div>
    </section>
  );
};
