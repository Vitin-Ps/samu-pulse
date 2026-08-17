import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faUserPlus, faUsers} from '@fortawesome/free-solid-svg-icons';
import {Header, Footer} from './index';
import CardHome from './components/CardHome';

export const Home = () => {
  return (
    <div className="min-h-screen relative bg-samu-bg font-sans w-screen">
      <Header />
      <main
        id="main-content"
        className="grow flex items-center justify-center px-4 py-20 w-full max-w-5xl mx-auto mt-16 sm:mt-0 min-h-screen">
        <div className="w-full flex flex-col items-center justify-center">
          {/* Greeting text (mobile fallback or extra context) */}
          <div className="mb-12 text-center max-w-md mx-auto">
            <h1 className="text-3xl sm:text-4xl font-semibold mb-3 tracking-tight text-samu-text">
              Como podemos cuidar do rebanho hoje?
            </h1>
            <p className="text-samu-neutral text-base sm:text-lg">
              Escolha uma ação abaixo para gerenciar os membros da sua congregação.
            </p>
          </div>

          {/* Central Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 w-full max-w-4xl">
            <CardHome
              title="Adicionar Pessoa"
              description="Cadastrar novo membro ou convertido para acompanhamento pastoral."
              link="/add-member"
              icon={faUserPlus}
            />

            <CardHome
              title="Lista de Membros"
              description="Acessar o rebanho, visualizar histórico e registrar interações."
              link="/list-members"
              icon={faUsers}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
