import {Outlet} from 'react-router-dom';
import GlobalContext from './contexts/GlobalContext';

export default function App() {
  return (
    <div className="App relative">
      <GlobalContext>
        <div className="min-h-[80vh] w-screen flex items-start justify-start flex-row md:flex-col">
          <Outlet />
        </div>
      </GlobalContext>
    </div>
  );
}
