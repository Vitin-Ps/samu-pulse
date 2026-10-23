import api from './api';
import {TipoUsuario, UsuarioAdmin} from '../interfaces/Usuario';
import {Response} from '../interfaces/Pageable';

class UsuarioService {
  async listar(search: string, page: number): Promise<Response<UsuarioAdmin[]>> {
    const res = await api.get('/admin/usuarios', {params: {search, page, size: 20}});
    return res.data;
  }

  async atualizarAcesso(id: number, tipoUsuario: TipoUsuario, ativo: boolean): Promise<UsuarioAdmin> {
    const res = await api.patch(`/admin/usuarios/${id}`, {tipoUsuario, ativo});
    return res.data;
  }
}

export default new UsuarioService();
