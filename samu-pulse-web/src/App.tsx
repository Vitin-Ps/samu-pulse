import {Outlet} from 'react-router-dom';
import {GlobalContext} from './contexts';
import {MessageServer} from './pages/components/MessageServer';
import {Loading} from './pages/components/Loading/Loading';
import {Footer, Header} from './pages';
import {AuthProvider} from './Auth/AuthProvider';

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
        </GlobalContext>
      </AuthProvider>
    </div>
  );
}
