import {FormEvent, useEffect, useRef, useState} from 'react';
import {useStateData} from '../../hooks';
import {useHistoricoMensagem} from '../../hooks/useHistoricoMensagem';
import {HistoricoMensagem} from '../../interfaces/HistoricoMensagem';
import {MessageService} from '../../services';

interface MemberMessagesState {
  mensagens: HistoricoMensagem[];
  page: number;
  totalPages: number;
  totalElements: number;
  carregando: boolean;
  erroConsulta: boolean;
  salvando: boolean;
  excluindoId: number | null;
  editorAberto: boolean;
  mensagemEmEdicao: HistoricoMensagem | null;
  conteudo: string;
}

export const useMemberMessagesModel = (idMembro: number) => {
  const api = useHistoricoMensagem();
  const [refresh, setRefresh] = useState(0);
  const ativo = useRef(true);
  const operacaoEmCurso = useRef(false);
  const stateModel = useStateData<MemberMessagesState>({
    mensagens: [], page: 0, totalPages: 0, totalElements: 0,
    carregando: true, erroConsulta: false, salvando: false, excluindoId: null,
    editorAberto: false, mensagemEmEdicao: null, conteudo: '',
  });
  const {data, updateState, updateMultipleStates} = stateModel;

  useEffect(() => {
    ativo.current = true;
    return () => { ativo.current = false; };
  }, []);

  useEffect(() => {
    let cancelado = false;
    updateMultipleStates({carregando: true, erroConsulta: false});
    const carregar = async () => {
      const resposta = await api.listarMensagens(idMembro, data.page);
      if (cancelado) return;
      if (!resposta) {
        updateMultipleStates({carregando: false, erroConsulta: true, mensagens: []});
        return;
      }
      if (data.page > 0 && data.page >= resposta.totalPages) {
        updateState('page', Math.max(0, resposta.totalPages - 1));
        return;
      }
      updateMultipleStates({
        mensagens: resposta.content, totalPages: resposta.totalPages,
        totalElements: resposta.totalElements, carregando: false,
      });
    };
    void carregar();
    return () => { cancelado = true; };
  }, [idMembro, data.page, refresh]);

  const ocupado = data.salvando || data.excluindoId !== null;
  const podeAlterar = (mensagem: HistoricoMensagem) =>
    mensagem.podeAlterar === true;

  const abrirEditor = (mensagem?: HistoricoMensagem) => {
    if (ocupado || (mensagem && !podeAlterar(mensagem))) return;
    api.clearError();
    updateMultipleStates({editorAberto: true, mensagemEmEdicao: mensagem ?? null, conteudo: mensagem?.mensagem ?? ''});
  };

  const cancelarEdicao = () => {
    if (operacaoEmCurso.current) return;
    api.clearError();
    updateMultipleStates({editorAberto: false, mensagemEmEdicao: null, conteudo: ''});
  };

  const salvar = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (operacaoEmCurso.current) return;
    const mensagem = data.conteudo.trim();
    if (!mensagem) {
      MessageService.alertMessage('Escreva o conteúdo da mensagem.');
      return;
    }
    if (data.mensagemEmEdicao && !podeAlterar(data.mensagemEmEdicao)) return;
    operacaoEmCurso.current = true;
    updateState('salvando', true);
    try {
      const resposta = data.mensagemEmEdicao
        ? await api.editarMensagem(idMembro, data.mensagemEmEdicao.id, {mensagem})
        : await api.criarMensagem(idMembro, {mensagem});
      if (!ativo.current || !resposta) return;
      updateMultipleStates({
        editorAberto: false, mensagemEmEdicao: null, conteudo: '',
        page: data.mensagemEmEdicao ? data.page : 0,
      });
      MessageService.successMessage(data.mensagemEmEdicao ? 'Mensagem atualizada com sucesso!' : 'Mensagem criada com sucesso!');
      setRefresh(value => value + 1);
    } finally {
      operacaoEmCurso.current = false;
      if (ativo.current) updateState('salvando', false);
    }
  };

  const excluir = (mensagem: HistoricoMensagem) => {
    if (ocupado || !podeAlterar(mensagem)) return;
    MessageService.confirmMessage('Deseja excluir esta mensagem? Essa ação não pode ser desfeita.', async () => {
      if (!ativo.current || operacaoEmCurso.current) return;
      operacaoEmCurso.current = true;
      updateState('excluindoId', mensagem.id);
      try {
        const sucesso = await api.excluirMensagem(idMembro, mensagem.id);
        if (!ativo.current || !sucesso) return;
        if (data.mensagemEmEdicao?.id === mensagem.id) {
          updateMultipleStates({editorAberto: false, mensagemEmEdicao: null, conteudo: ''});
        }
        updateState('mensagens', data.mensagens.filter(item => item.id !== mensagem.id));
        MessageService.successMessage('Mensagem excluída com sucesso!');
        setRefresh(value => value + 1);
      } finally {
        operacaoEmCurso.current = false;
        if (ativo.current) updateState('excluindoId', null);
      }
    });
  };

  return {
    stateModel, ocupado, podeAlterar, abrirEditor, cancelarEdicao, salvar, excluir,
    erroOperacao: api.error,
    recarregar: () => setRefresh(value => value + 1),
  };
};
