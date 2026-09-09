import HistoricoMensagemService from '../services/HistoricoMensagemService';
import {DadosHistoricoMensagemRequest} from '../interfaces/HistoricoMensagem';
import useTratadorErroApi from './useTratadorErroApi';

export const useHistoricoMensagem = () => {
  const {handleRequest, loading, error, clearError} = useTratadorErroApi();

  return {
    loading,
    error,
    clearError,
    listarMensagens: (idMembro: number, page: number) =>
      handleRequest(() => HistoricoMensagemService.listarMensagens(idMembro, page)),
    criarMensagem: (idMembro: number, dados: DadosHistoricoMensagemRequest) =>
      handleRequest(() => HistoricoMensagemService.criarMensagem(idMembro, dados)),
    editarMensagem: (idMembro: number, id: number, dados: DadosHistoricoMensagemRequest) =>
      handleRequest(() => HistoricoMensagemService.editarMensagem(idMembro, id, dados)),
    excluirMensagem: (idMembro: number, id: number) =>
      handleRequest(() => HistoricoMensagemService.excluirMensagem(idMembro, id)),
  };
};
