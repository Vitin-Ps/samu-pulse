import {FC, useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

import {useNavigate} from 'react-router-dom';
import {
  camposOptions,
  statusMembroOptions,
  useListMembersModel,
} from './useListMembersModel';
import {
  formatDateOfPattern,
  getUrlCarregarImg,
} from '../../services/Extra/FuncionalidadesService';
import {
  faBoxOpen,
  faUsers,
  faPlus,
  faMagnifyingGlass,
  faChevronLeft,
  faChevronRight,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import {MemberCard} from './components/MemberCard';
import {MemberDetailsModal} from './components/MemberDetailsModal';
import {EditMemberModal} from './components/EditMemberModal';
import {Membro} from '../../interfaces/Membro';
import {AspectRatio, ImageCropModal, Input} from '../components/Elements';
import SelectWithElement from '../components/Elements/SelectWithElement';
import InputCheckBox from '../components/Elements/InputCheckBox';
import {getColor} from '../../interfaces/Colors';

export const ListMembersView: FC<ReturnType<typeof useListMembersModel>> = ({
  stateModel,
  hasFilter,
  handleClearFilters,
  handleSearch,
  nextPage,
  prevPage,
  alterarMembro,
  alterarLogo,
  navigate,
  onOpenDetails,
  onOpenEdit,
  onClose,
}) => {
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

      <form onSubmit={handleSearch} id="section-search" className="mb-8">
        <div className="flex flex-col items-end gap-4 ">
          <div className="w-full lg:flex-1">
            <label
              htmlFor="search-input"
              className="block text-sm font-medium text-samu-text mb-2">
              Pesquisar Membros
            </label>
            <div className="flex items-center gap-3">
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
                  value={stateModel.data.search || ''}
                  onChange={e => stateModel.updateState('search', e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-samu-border rounded-xl text-sm focus:ring-2 focus:ring-samu-primary focus:border-samu-primary transition-all outline-none text-samu-text placeholder:text-samu-neutral shadow-sm"
                  placeholder="Busque por nome..."
                />
              </div>
            </div>
          </div>

          <div className="w-full flex flex-col sm:flex-row sm:flex-wrap items-end justify-between   gap-4">
            <div className="w-full sm:w-48 shrink-0">
              <Input
                id="nascimento"
                type="date"
                label="Data de Nascimento"
                value={stateModel.data.dataNascimento || ''}
                onChange={e => stateModel.updateState('dataNascimento', e.target.value)}
              />
            </div>

            <div className="w-full sm:w-48 shrink-0">
              <SelectWithElement
                label="Status do Membro"
                placeholder="Selecione o status"
                data={statusMembroOptions}
                valor={stateModel.data.status || ''}
                setValor={novoStatus => stateModel.updateState('status', novoStatus)}
                obrigatorio={false}
              />
            </div>

            <div className="w-full sm:w-48 shrink-0">
              <SelectWithElement
                label="Filtrar por Campo"
                placeholder="Selecione o campo"
                data={camposOptions}
                valor={stateModel.data.sort || ''}
                setValor={novoCampo => stateModel.updateState('sort', novoCampo)}
                obrigatorio={false}
              />
            </div>

            <div className="w-full sm:w-auto shrink-0 flex items-center h-11 mb-1 gap-2">
              <InputCheckBox
                checked={stateModel.data.desc || false}
                setChecked={checked => stateModel.updateState('desc', checked)}
                size={2}
                cor={getColor('DarkBlue')}
              />
              <span
                className="text-sm font-medium text-samu-text cursor-pointer"
                onClick={() => stateModel.updateState('desc', !stateModel.data.desc)}>
                Decrescente
              </span>
            </div>

            <div className="flex w-full sm:w-auto items-center gap-2 mt-2 sm:mt-0">
              {hasFilter && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="flex-1 sm:flex-none sm:w-11 h-11 bg-gray-100 hover:bg-gray-200 text-samu-text border border-samu-border rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer">
                  <FontAwesomeIcon icon={faXmark} />
                  <span className="sm:hidden font-medium text-sm">Limpar</span>
                </button>
              )}

              <button
                type="submit"
                className="flex-1 sm:flex-none sm:w-11 h-11 bg-samu-primary hover:bg-blue-600 text-white rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer">
                <FontAwesomeIcon icon={faMagnifyingGlass} />
                <span className="sm:hidden font-medium text-sm">Pesquisar</span>
              </button>
            </div>
          </div>
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
        isOpen={stateModel.data.detailsModalOpen}
        onClose={onClose}
        membro={stateModel.data.membroSelecionado as Membro}
      />

      <EditMemberModal
        isOpen={stateModel.data.editModalOpen}
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
          alterarLogo(false, arquivos);
        }}
      />
    </section>
  );
};
