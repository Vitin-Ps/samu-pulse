import {MeuJwtPayload, TokenService} from '../services';

export const useToken = () => {
  const tokenService = TokenService;

  const validadeToken = (token: string): boolean => {
    return tokenService.validadeToken(token);
  };

  const infoToken = (token: string): MeuJwtPayload | null => {
    return tokenService.infoToken(token);
  };

  const removeToken = (): void => {
    tokenService.removeToken();
  };

  const addToken = (token: string, lembrar: boolean): void => {
    tokenService.addToken(token, lembrar);
  };

  const getToken = (): string | null => {
    return tokenService.getToken();
  };

  return {
    validadeToken,
    infoToken,
    removeToken,
    addToken,
    getToken,
  };
};
