import api from './api';
import {DadosHistoricoMensagemRequest, HistoricoMensagem} from '../interfaces/HistoricoMensagem';
import {Response} from '../interfaces/Pageable';

class HistoricoMensagemService {
  private endpoint(idMembro: number) {
    return `/membro/${idMembro}/mensagens`;
  }

  async listarMensagens(idMembro: number, page = 0, size = 10) {
    const res = await api.get<Response<HistoricoMensagem[]>>(this.endpoint(idMembro), {
      params: {page, size},
    });
    return res.data;
  }

  async criarMensagem(idMembro: number, dados: DadosHistoricoMensagemRequest) {
    const res = await api.post<HistoricoMensagem>(this.endpoint(idMembro), dados);
    return res.data;
  }

  async editarMensagem(idMembro: number, id: number, dados: DadosHistoricoMensagemRequest) {
    const res = await api.put<HistoricoMensagem>(`${this.endpoint(idMembro)}/${id}`, dados);
    return res.data;
  }

  async excluirMensagem(idMembro: number, id: number) {
    const res = await api.delete(`${this.endpoint(idMembro)}/${id}`);
    return res.status === 204;
  }
}

export default new HistoricoMensagemService();
