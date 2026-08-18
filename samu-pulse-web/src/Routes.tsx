import {RouteObject} from 'react-router-dom';
import {Home, ErrorPage, AddMemberPage, ListMembersPage} from './pages';
import App from './App';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'add-member',
        element: <AddMemberPage />,
      },
      {
        path: 'list-members',
        element: <ListMembersPage />,
      },
    ],
  },
];
