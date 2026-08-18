import {FormEvent, useContext, useState} from 'react';
import {AuthContext} from '../../Auth/AuthContext';
import {useNavigate} from 'react-router-dom';
import {useFunctionsProvider} from '../../contexts';
import {MessageService} from '../../services';
import {useStateData, useToken} from '../../hooks';

export const useSignInModel = () => {
  const stateModel = useStateData<{
    login: string;
    senha: string;
    senhaShow: boolean;
  }>({
    login: '',
    senha: '',
    senhaShow: false,
  });

  const auth = useContext(AuthContext);  
  const {setLoading, loading} = useFunctionsProvider();
  const {getToken, removeToken} = useToken();

  const signIn = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    try {
      if (!stateModel.data.login || !stateModel.data.senha) {
        MessageService.alertMessage('Preencha todos os Campos');
      }

      if (getToken()) {
        removeToken();
      }

      const isLogged: boolean = await auth.signin(
        stateModel.data.login,
        stateModel.data.senha,
        true,
      );

      if (isLogged) {
        window.location.href = '/';
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return {
    stateModel,
    loading,
    signIn,
  };
};
