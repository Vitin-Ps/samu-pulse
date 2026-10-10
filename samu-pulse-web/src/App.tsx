import {Outlet} from 'react-router-dom';
import {GlobalContext} from './contexts';
import {MessageServer} from './pages/components/MessageServer';
import {Loading} from './pages/components/Loading/Loading';
import {Footer} from './pages/Footer';
import {Header} from './pages/Header';
import {AuthProvider} from './Auth/AuthProvider';
import {PwaBootstrap} from './pages/components/PwaBootstrap';

export default function App() {
  return (
    <div className="App relative min-h-screen bg-samu-bg font-sans w-full">
      <AuthProvider>
        <GlobalContext>
          <Header />
          <Loading />
          <MessageServer />
          <div className="min-h-[80vh] flex items-start justify-start flex-row md:flex-col">
            <Outlet />
          </div>
          <Footer />
          <PwaBootstrap />
        </GlobalContext>
      </AuthProvider>
    </div>
  );
}
