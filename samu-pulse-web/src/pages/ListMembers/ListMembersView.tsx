import {FC, useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

import {useNavigate} from 'react-router-dom';
import {useListMembersModel} from './useListMembersModel';
import {getUrlCarregarImg} from '../../services/Extra/FuncionalidadesService';
import {
  faBoxOpen,
  faUsers,
  faPlus,
  faMagnifyingGlass,
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import {MemberCard} from './components/MemberCard';
import {MemberDetailsModal} from './components/MemberDetailsModal';
import {EditMemberModal} from './components/EditMemberModal';
import {Membro} from '../../interfaces/Membro';
import {AspectRatio, ImageCropModal} from '../components/Elements';

// Função auxiliar para pegar as iniciais do nome (Ex: João Silva -> JS)
const getInitials = (name: string) => {
  if (!name) return 'UN';
  const words = name.trim().split(' ');
  if (words.length >= 2) {
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

export const ListMembersView: FC<ReturnType<typeof useListMembersModel>> = ({
  stateModel,
  handleSearch,
  nextPage,
  prevPage,
  alterarMembro,
  alterarLogo,
}) => {
  const navigate = useNavigate();

  const [detailsModalOpen, setDetailsModalOpen] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);

  const onOpenDetails = (membro: Membro) => {
    stateModel.updateState('membroSelecionado', membro);
    setDetailsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const onOpenEdit = (membro: Membro) => {
    stateModel.updateState('membroSelecionado', membro);
    setEditModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const onClose = () => {
    setDetailsModalOpen(false);
    setEditModalOpen(false);
    stateModel.updateState('membroSelecionado', null);
    document.body.style.overflow = '';
  };

  return (
    <section className="min-h-screen px-4 sm:px-6 lg:px-8 py-10  w-full">
      <section
        id="section-header"
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-samu-border mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white text-samu-primary rounded-2xl flex items-center justify-center text-xl shadow-sm border border-samu-border">
            <FontAwesomeIcon icon={faUsers} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-samu-text">
              Membros Cadastrados
            </h1>
            <p className="text-sm text-samu-neutral mt-0.5">
              {stateModel.data.totalElements}{' '}
              {stateModel.data.totalElements === 1
                ? 'registro encontrado'
                : 'registros encontrados'}
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate('/add-member')}
          className="w-full sm:w-auto px-5 py-2.5 bg-samu-primary hover:bg-blue-600 text-white font-medium rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer">
          <FontAwesomeIcon icon={faPlus} />
          Novo Membro
        </button>
      </section>

      {/* 2. Search Bar Section */}
      <form onSubmit={handleSearch} id="section-search" className="mb-8">
        <label
          htmlFor="search-input"
          className="block text-sm font-medium text-samu-text mb-2">
          Pesquisar Membros
        </label>
        <div className="flex items-center gap-3 max-w-xl">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className="text-samu-neutral text-sm"
              />
            </div>
            <input
              type="text"
              id="search-input"
              value={stateModel.data.search}
              onChange={e => stateModel.updateState('search', e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-samu-border rounded-xl text-sm focus:ring-2 focus:ring-samu-primary focus:border-samu-primary transition-all outline-none text-samu-text placeholder:text-samu-neutral shadow-sm"
              placeholder="Busque por nome..."
            />
          </div>
          <button
            type="submit"
            className="w-11 h-11 bg-samu-primary hover:bg-blue-600 text-white rounded-xl flex items-center justify-center transition-all shadow-sm shrink-0 cursor-pointer">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
        </div>
      </form>

      {/* 3. Cards Grid Section */}
      <section
        id="section-grid"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stateModel.data.membros.length > 0 ? (
          stateModel.data.membros.map((membro, index) => (
            <MemberCard
              key={index}
              membro={membro}
              getUrlCarregarImg={getUrlCarregarImg}
              onOpenDetails={onOpenDetails}
              onOpenEdit={onOpenEdit}
            />
          ))
        ) : (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-center bg-white rounded-3xl border border-samu-border">
            <FontAwesomeIcon
              icon={faBoxOpen}
              className="text-5xl text-samu-neutral/40 mb-4"
            />
            <h3 className="text-lg font-medium text-samu-text">
              Nenhum membro encontrado
            </h3>
            <p className="text-sm text-samu-neutral mt-1">
              Não conseguimos encontrar nenhum registro com os filtros aplicados.
            </p>
          </div>
        )}
      </section>

      {/* 4. Pagination Section */}
      {stateModel.data.totalPages > 0 && (
        <section
          id="section-pagination"
          className="border-t border-samu-border pt-5 pb-2 flex items-center justify-between">
          <span className="text-sm text-samu-neutral font-medium">
            Página {stateModel.data.page + 1} de {stateModel.data.totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={prevPage}
              disabled={stateModel.data.page === 0}
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-samu-border text-samu-text hover:bg-white hover:text-samu-primary hover:border-samu-primary transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">
              <FontAwesomeIcon icon={faChevronLeft} className="text-sm" />
            </button>
            <button
              onClick={nextPage}
              disabled={stateModel.data.page >= stateModel.data.totalPages - 1}
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-samu-border text-samu-text hover:bg-white hover:text-samu-primary hover:border-samu-primary transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">
              <FontAwesomeIcon icon={faChevronRight} className="text-sm" />
            </button>
          </div>
        </section>
      )}

      <MemberDetailsModal
        isOpen={detailsModalOpen}
        onClose={onClose}
        membro={stateModel.data.membroSelecionado as Membro}
      />

      <EditMemberModal
        isOpen={editModalOpen}
        onClose={onClose}
        stateModel={stateModel}
        alterarMembro={alterarMembro}
        alterarLogo={alterarLogo}
      />

      <ImageCropModal
        isOpen={stateModel.data.isCropModalOpen}
        onClose={() => stateModel.updateState('isCropModalOpen', false)}
        limit={1}
        aspect={AspectRatio.SQUARE}
        mandatoryAspect={true}
        imagensSelecionadas={stateModel.data.imagensSelecionadas || []}
        setImagensSelecionadas={(arquivos: File[]) =>
          stateModel.updateState('imagensSelecionadas', arquivos)
        }
        onSave={(arquivos: any) => {
          stateModel.updateState('imagensSelecionadas', arquivos);
          alterarLogo(false);
        }}
      />
    </section>
  );
};
