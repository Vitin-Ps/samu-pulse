import {RouteObject} from 'react-router-dom';
import {lazy, Suspense} from 'react';
import {ErrorPage} from './pages/ErrorPage';
import Spinner from './pages/components/Elements/Spinner';

const Home = lazy(() => import('./pages/Home').then(module => ({default: module.Home})));
const AddMemberPage = lazy(() => import('./pages/AddMember').then(module => ({default: module.AddMemberPage})));
const ListMembersPage = lazy(() => import('./pages/ListMembers').then(module => ({default: module.ListMembersPage})));
const pageFallback = <div role="status" className="flex items-center gap-3 p-6 text-samu-text"><Spinner size={0.7} />Carregando página...</div>;
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
            <Suspense fallback={pageFallback}><Home /></Suspense>
          </RequireAuth>
        ),
      },
      {
        path: 'add-member',
        element: (
          <RequireAuth tipoUsuario={TipoUsuario.LIDER}>
            <Suspense fallback={pageFallback}><AddMemberPage /></Suspense>
          </RequireAuth>
        ),
      },
      {
        path: 'list-members',
        element: (
          <RequireAuth tipoUsuario={TipoUsuario.LIDER}>
            <Suspense fallback={pageFallback}><ListMembersPage /></Suspense>
          </RequireAuth>
        ),
      },
    ],
  },
];
