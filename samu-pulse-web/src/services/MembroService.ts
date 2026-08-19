import {MembroJson, StatusMembro} from '../interfaces/Membro';
import api from './api';

class MembroService {
  endPoint = '/membro';

  async cadastrarMembro(membro: MembroJson) {
    const dadosJSON: string = JSON.stringify(membro);
    const res = await api.post(`${this.endPoint}`, dadosJSON, {
      headers: {'Content-Type': 'application/json'},
    });
    return res.data;
  }

  async deletarMembro(id: number) {
    const res = await api.delete(`${this.endPoint}/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return res.data;
  }

  async listarPageMembros(
    search?: string,
    dataNascimento?: string,
    status?: StatusMembro,
    size?: number,
    page?: number,
    sort?: string,
    direction?: string,
  ) {
    const res = await api.get(`${this.endPoint}`, {
      params: {
        search: search ? search : '',
        dataNascimento: dataNascimento ? dataNascimento : '',
        status: status ? status : '',
        size: size ? size : 100,
        page: page ? page : 0,
        sort: sort ? sort : 'nome',
        direction: direction ? direction : 'asc',
      },
    });
    return res.data;
  }

  async detalharMembro(idMembro: number) {
    const res = await api.get(`${this.endPoint}/detail/${idMembro}`);
    return res.data;
  }

  async atualizarMembro(membro: MembroJson) {
    const dadosJSON: string = JSON.stringify(membro);
    const res = await api.put(`${this.endPoint}`, dadosJSON, {
      headers: {'Content-Type': 'application/json'},
    });
    return res.data;
  }

  async alterarLogoMembro(image: File, idMembro: number) {
    const formData = new FormData();

    if (image) formData.append('imagem', image);
    if (idMembro) formData.append('idMembro', String(idMembro));

    const res = await api.post(`${this.endPoint}/img`, formData, {
      headers: {'Content-Type': 'multipart/form-data'},
    });

    return res.data || res.status === 204 || res.status === 200;
  }

  async delImgMembro(imgUrl: string, id: number) {
    const res = await api.delete(`${this.endPoint}/img/${id}/${imgUrl}`);
    return res.data || res.status === 204 || res.status === 200;
  }
}

export default new MembroService();
