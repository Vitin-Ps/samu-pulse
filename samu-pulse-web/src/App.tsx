import {Outlet} from 'react-router-dom';
import {GlobalContext} from './contexts';
import {MessageServer} from './pages/components/MessageServer';
import {Loading} from './pages/components/Loading/Loading';

export default function App() {
  return (
    <div className="App relative">
      <GlobalContext>
        <Loading />
        <MessageServer />
        <div className="min-h-[80vh] w-screen flex items-start justify-start flex-row md:flex-col">
          <Outlet />
        </div>
      </GlobalContext>
    </div>
  );
}
