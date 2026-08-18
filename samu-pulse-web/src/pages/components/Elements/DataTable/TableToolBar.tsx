import {
  faArrowLeft,
  faMagnifyingGlass,
  faRedo,
  faFilter,
  faTimes,
  faTable,
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import React, {FC, ReactNode, useRef} from 'react';
import {useNavigate} from 'react-router-dom';

interface TableToolBarProps {
  titleTable?: string;
  placeholderSearch?: string;
  search?: string;
  onRefresh?: () => void;
  handleSearch?: (value: string) => void;
  router?: string;
  additionalButtonsContainer?: ReactNode;
  loading: boolean;
  setLoading: (value: boolean) => void;
}

const TableToolBar: FC<TableToolBarProps> = ({
  titleTable,
  placeholderSearch = 'Busque por registros...',
  search,
  handleSearch,
  onRefresh,
  setLoading,
  router,
  additionalButtonsContainer,
}) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  const handleChange = (value: string) => {
    setLoading(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      setLoading(false);
      handleSearch && handleSearch(value);
    }, 500);
  };

  return (
    <div className="w-full flex flex-col">
      {/* 1. Header Section */}
      <section className="px-8 pt-8 pb-6 border-b border-samu-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white">
        <div className="flex items-center gap-4">
          {router && (
            <button
              className="text-samu-neutral hover:text-samu-primary transition-colors cursor-pointer mr-2"
              onClick={() => navigate(router)}>
              <FontAwesomeIcon icon={faArrowLeft} className="text-xl" />
            </button>
          )}
          <div className="w-12 h-12 bg-samu-bg text-samu-primary rounded-xl flex items-center justify-center text-xl shadow-sm border border-samu-border/50 shrink-0">
            <FontAwesomeIcon icon={faTable} />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-samu-text">
              {titleTable || 'Listagem de Dados'}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {onRefresh && (
            <button
              className="w-11 h-11 bg-white border border-samu-border hover:border-samu-primary text-samu-neutral hover:text-samu-primary rounded-xl flex items-center justify-center transition-all shadow-sm shrink-0"
              onClick={onRefresh}>
              <FontAwesomeIcon icon={faRedo} />
            </button>
          )}
          {additionalButtonsContainer}
        </div>
      </section>

      {/* 2. Search Section */}
      <section className="px-8 py-6 border-b border-samu-border bg-gray-50/50">
        <label className="block text-sm font-medium text-samu-text mb-2">
          Pesquisar
        </label>
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-samu-neutral">
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </div>
            <input
              type="text"
              value={search}
              onChange={e => handleChange(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 bg-white border border-samu-border rounded-xl text-sm focus:ring-2 focus:ring-samu-primary focus:border-samu-primary transition-all outline-none text-samu-text placeholder:text-samu-neutral"
              placeholder={placeholderSearch}
            />
            {search && search.length > 0 && (
              <button
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-samu-neutral hover:text-samu-danger transition"
                onClick={() => {
                  handleChange('');
                  handleSearch && handleSearch('');
                }}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            )}
          </div>
          <button
            type="button"
            className="w-11 h-11 bg-white border border-samu-border hover:border-samu-primary text-samu-text hover:text-samu-primary rounded-xl flex items-center justify-center transition-all shadow-sm">
            <FontAwesomeIcon icon={faFilter} />
          </button>
        </div>
      </section>
    </div>
  );
};

export default TableToolBar;
