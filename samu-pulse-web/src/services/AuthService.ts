import {Usuario} from '../interfaces/Usuario';
import api from './api';

export interface DadosRecuperaSenha {
  novaSenha: string;
  confirmaSenha: string;
  rawToken?: string;
  senhaAtual?: string;
}

// Funções de storage permanecem exportadas pois não são API calls
export const removeUserStorage = () => {
  localStorage.removeItem('user');
  sessionStorage.removeItem('user');
};

export const addUserStorage = (user: Usuario) => {
  localStorage.setItem('user', JSON.stringify(user));
  sessionStorage.setItem('user', JSON.stringify(user));
};

export const getUserStorage = (): Usuario | null => {
  const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
  if (storedUser) {
    return JSON.parse(storedUser) as Usuario;
  }
  return null;
};

export const removeUserDefinidoStorage = () => {
  localStorage.removeItem('userDefinido');
  sessionStorage.removeItem('userDefinido');
};

export const addUserDefinidoStorage = (userDefinido: Usuario) => {
  localStorage.setItem('userDefinido', JSON.stringify(userDefinido));
  sessionStorage.setItem('userDefinido', JSON.stringify(userDefinido));
};

export const getUserDefinidoStorage = (): Usuario | null => {
  const storedUser =
    localStorage.getItem('userDefinido') || sessionStorage.getItem('userDefinido');
  if (storedUser) {
    return JSON.parse(storedUser) as Usuario;
  }
  return null;
};

// Classe para métodos de API
class AuthService {
  async fazerLogin(login: string, senha: string) {
    if (!login || !senha) {
      return {
        message: 'Email ou senha vazios',
      };
    }
    const resultado = await api.post('/auth', {login, senha});
    return resultado.data;
  }
}

export default new AuthService();
