import React, {JSX, useContext, useEffect} from 'react';
import {AuthContext} from './AuthContext';
import {TipoUsuario} from '../interfaces/Usuario';
import {useNavigate} from 'react-router-dom';
import {useToken} from '../hooks';
import {MessageService} from '../services';
import {Loading} from '../pages/components/Loading/Loading';

interface RequireAuthProps {
  children: JSX.Element;
  tipoUsuario?: TipoUsuario;
}

export const RequireAuth: React.FC<RequireAuthProps> = ({
  children,
  tipoUsuario = TipoUsuario.USER,
}) => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const {getToken, validadeToken} = useToken();

  useEffect(() => {
    const newToken = getToken();
    if (!newToken || !validadeToken(newToken)) {
      // window.location.href = '/auth/sign-in';
      navigate('/auth/sign-in');
    }
  }, []);

  if (auth.user) {
    if (
      tipoUsuario !== TipoUsuario.USER &&
      auth.user.tipoUsuario !== TipoUsuario.ADMIN &&
      auth.user.tipoUsuario !== tipoUsuario
    ) {
      MessageService.alertMessage(
        'Esse usuário não tem permissão para acessar esta página!',
      );
      navigate('/');
      return <Loading />;
    } else {
      return children;
    }
  } else {
    return <Loading />;
  }
};
