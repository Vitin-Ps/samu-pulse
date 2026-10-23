import api from './api';
import {StatusMembro} from '../interfaces/StatusMembro';

class StatusMembroService {
  async atualizar(codStatus: number, nome: string, cor: string): Promise<StatusMembro> {
    const res = await api.patch(`/status-membro/${codStatus}`, {nome, cor});
    return res.data;
  }

  async listar(): Promise<StatusMembro[]> {
    const res = await api.get('/status-membro');
    return res.data;
  }

  async criar(nome: string, cor: string): Promise<StatusMembro> {
    const res = await api.post('/status-membro', {nome, cor});
    return res.data;
  }

  async excluir(codStatus: number): Promise<boolean> {
    const res = await api.delete(`/status-membro/${codStatus}`);
    return res.status === 204;
  }
}

export default new StatusMembroService();
