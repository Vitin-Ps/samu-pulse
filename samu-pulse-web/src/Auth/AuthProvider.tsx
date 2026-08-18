import React, {useEffect, useState} from 'react';
import {AuthContext} from './AuthContext';
import {useNavigate} from 'react-router-dom';
import {Usuario} from '../interfaces/Usuario';
import {useToken, useAuth} from '../hooks';
import {  
  addUserStorage,
  getUserStorage,
  MessageService,
  removeUserDefinidoStorage,
  removeUserStorage,
} from '../services';

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [user, setUser] = useState<Usuario | null>(null);

  const {fazerLogin} = useAuth();
  const {addToken, getToken, infoToken, removeToken, validadeToken} = useToken();
  const navigate = useNavigate();

  useEffect(() => {
    const validaToken = async () => {
      const token = getToken();

      if (token) {
        const tokenValidado = validadeToken(token);

        if (tokenValidado) {
          const dadosToken = infoToken(token);
          const userStored = getUserStorage();

          // Verifica se o usuário armazenado corresponde ao token
          if (userStored && dadosToken && userStored.id === dadosToken.id) {
            setUser(userStored);
          } else {
            // Se não corresponder, busca novamente ou limpa tudo
            if (dadosToken) {
              setUser({
                login: '',
                id: dadosToken.id,
                tipoUsuario: dadosToken.role as any,
              });
              addUserStorage({
                login: '',
                id: dadosToken.id,
                tipoUsuario: dadosToken.role as any,
              });
            } else {
              // Se não conseguir buscar o usuário, limpa tudo
              removeToken();
              removeUserStorage();
              removeUserDefinidoStorage();
            }
          }
        } else {
          // Token inválido, limpa tudo
          removeToken();
          removeUserStorage();
          removeUserDefinidoStorage();
          setUser(null);
        }
      }
    };

    validaToken();
  }, []);

  const signin = async (
    login: string,
    senha: string,
    lembrar: boolean,
  ): Promise<boolean> => {
    // Limpa qualquer dado anterior antes de fazer novo login
    setUser(null);
    removeToken();
    removeUserStorage();
    removeUserDefinidoStorage();
    localStorage.clear();
    sessionStorage.clear();

    const data = await fazerLogin(login, senha);

    if (!data || data.error) {
      MessageService.alertMessage(data?.message || 'Erro ao fazer login');
      return false;
    }

    if (data?.tokenJWT) {
      const validaToken = validadeToken(data.tokenJWT);

      if (validaToken) {
        addToken(data.tokenJWT, lembrar);
        const dadosToken = infoToken(data.tokenJWT);
        if (dadosToken) {
          // const resUser = await detalharUsuario(dadosToken.id);
          // if (resUser) {
            // setUser(resUser);
            // addUserStorage(resUser);

            // const resUserDefinido = await detalharUsuarioDefinido(resUser.id);
            // if (resUserDefinido) {
              // addUserDefinidoStorage(resUserDefinido);
            // }

          // }
          return true;
        }
      }
    }
    return false;
  };

  const signout = (rota?: string) => {
    setUser(null);

    removeToken();
    removeUserStorage();
    removeUserDefinidoStorage();

    localStorage.clear();
    sessionStorage.clear();

    navigate(`${rota ? `/${rota}` : '/auth/sign-in'}`);
  };

  return (
    <AuthContext.Provider value={{user, signin, signout}}>
      {children}
    </AuthContext.Provider>
  );
};
