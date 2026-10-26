import api from './api';
import {TipoUsuario} from '../interfaces/Usuario';

export interface LinkCadastro {
  token: string;
  link: string;
  tipoUsuario: TipoUsuario;
}

class FluxoTokenService {
  async gerar(senha: string, tipoUsuario: TipoUsuario): Promise<LinkCadastro> {
    return (await api.post('/token/gerar', {senha, tipoUsuario})).data;
  }
  async enviar(rawToken: string, email: string) {
    await api.post('/token/enviar-convite', {rawToken, email});
    return true;
  }
  async consultar(rawToken: string): Promise<{tipoUsuario: TipoUsuario}> {
    return (await api.post('/token/consultar-convite', {rawToken})).data;
  }
  async cadastrar(dados: {rawToken: string; login: string; email: string; senha: string; confirmaSenha: string; nomeExibicao: string; perfilResponsavel: string}) {
    await api.post('/auth/sign-up', dados);
    return true;
  }
  async recuperar(login: string): Promise<{message: string}> {
    return (await api.post('/token/token-senha', {login})).data;
  }
  async redefinir(rawToken: string, novaSenha: string, confirmaSenha: string) {
    await api.put('/token/senha', {rawToken, novaSenha, confirmaSenha});
    return true;
  }
}

export default new FluxoTokenService();
