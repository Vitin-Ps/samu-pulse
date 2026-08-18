import { jwtDecode } from 'jwt-decode';

export interface MeuJwtPayload {
  sub: string;
  role: string;
  id: number;
  exp: number;
}

class TokenService {
  validadeToken(token: string): boolean {
    if (!token) {
      // Se não houver token, consideramos como expirado
      return false;
    }

    const decodedToken = this.infoToken(token);

    if (!decodedToken || !decodedToken.exp) {
      // Se não houver data de expiração no token, consideramos como expirado
      return false;
    }

    // Obtenha a data de expiração em segundos
    const expiraEmSegundos = decodedToken.exp;

    // Obtenha a data atual em segundos
    const dataAtualEmSegundos = Math.floor(Date.now() / 1000);

    // Verifique se a data de expiração é anterior à data atual
    return expiraEmSegundos > dataAtualEmSegundos;
  }

  infoToken(token: string): MeuJwtPayload | null {
    try {
      const infoToken: MeuJwtPayload = jwtDecode(token);
      return infoToken;
    } catch (error) {
      console.error('Erro ao decodificar o token:', error);
      return null;
    }
  }

  removeToken() {
    if (typeof localStorage !== 'undefined') localStorage.removeItem('token');
    if (typeof sessionStorage !== 'undefined') sessionStorage.removeItem('token');
  }

  addToken(token: string, lembrar: boolean) {
    if (lembrar) localStorage.setItem('token', token);
    else sessionStorage.setItem('token', token);
  }

  getToken() {
    let token = null;
    if (typeof localStorage !== 'undefined') {
      token = localStorage.getItem('token');
    }
    if (token == null && typeof sessionStorage !== 'undefined') {
      token = sessionStorage.getItem('token');
    }
    return token;
  }
}

export default new TokenService();
