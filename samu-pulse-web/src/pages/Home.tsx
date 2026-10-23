import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faUserPlus, faUsers, faTags, faUserShield} from '@fortawesome/free-solid-svg-icons';
import {useContext} from 'react';
import {AuthContext} from '../Auth/AuthContext';
import {TipoUsuario} from '../interfaces/Usuario';
import {Header, Footer} from './index';
import CardHome from './components/CardHome';

export const Home = () => {
  const {user} = useContext(AuthContext);
  return (
    <section className="grow flex items-start justify-center px-4 py-4 max-w-5xl mx-auto mt-16 sm:mt-0 min-h-screen">
      <div className="w-full flex flex-col items-center justify-center ">
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
          {user?.tipoUsuario === TipoUsuario.ADMIN && (
            <>
              <CardHome title="Administração" description="Gerenciar os status dos membros e personalizar suas cores."
                link="/admin" icon={faTags} />
              <CardHome title="Usuários" description="Gerenciar acessos e permissões dos usuários do sistema."
                link="/admin/usuarios" icon={faUserShield} />
            </>
          )}
        </div>
      </div>
    </section>
  );
};
