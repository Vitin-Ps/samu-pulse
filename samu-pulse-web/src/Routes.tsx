import {RouteObject} from 'react-router-dom';
import {Home, ErrorPage, AddMemberPage, ListMembersPage} from './pages';
import App from './App';
import {RequireAuth} from './Auth/RequireAuth';
import {TipoUsuario} from './interfaces/Usuario';
import {SignInPage} from './pages/SignIn';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'auth/sign-in',
        element: <SignInPage />,
      },

      {
        index: true,
        element: (
          <RequireAuth tipoUsuario={TipoUsuario.LIDER}>
            <Home />
          </RequireAuth>
        ),
      },
      {
        path: 'add-member',
        element: (
          <RequireAuth tipoUsuario={TipoUsuario.LIDER}>
            <AddMemberPage />
          </RequireAuth>
        ),
      },
      {
        path: 'list-members',
        element: (
          <RequireAuth tipoUsuario={TipoUsuario.LIDER}>
            <ListMembersPage />
          </RequireAuth>
        ),
      },
    ],
  },
];
