import AuthService from '../services/AuthService';
import useTratadorErroApi from './useTratadorErroApi';

export const useAuth = () => {
  const {loading, error, clearError, handleRequest} = useTratadorErroApi();

  const fazerLogin = async (login: string, senha: string) => {
    return handleRequest(() => AuthService.fazerLogin(login, senha));
  };

  return {
    consultarPerfil: () => handleRequest(() => AuthService.consultarPerfil()),
    atualizarPerfil: (nomeExibicao: string, email?: string) => handleRequest(() => AuthService.atualizarPerfil(nomeExibicao, email)),
    loading,
    error,
    fazerLogin,
    clearError,
  };
};
