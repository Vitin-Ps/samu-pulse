import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
  faPhone,
  faLocationDot,
  faCalendar,
  faArrowUpRightFromSquare,
  faEdit,
} from '@fortawesome/free-solid-svg-icons';
import {Avatar} from '../../components/Avatar';
import {
  formatarNumero,
  formatDateOfPattern,
} from '../../../services/Extra/FuncionalidadesService';
import {Membro} from '../../../interfaces/Membro';

interface MemberCardProps {
  membro: Membro;
  getUrlCarregarImg: () => string;
  onOpenDetails: (membro: Membro) => void;
  onOpenEdit?: (membro: Membro) => void;
}

export const MemberCard: React.FC<MemberCardProps> = ({
  membro,
  getUrlCarregarImg,
  onOpenDetails,
  onOpenEdit,
}) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'ATIVO':
        return {label: 'Ativo', color: 'bg-green-100 text-green-700 border-green-200'};
      case 'DISTANTE':
        return {
          label: 'Distante',
          color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        };
      case 'AFASTADO':
        return {label: 'Afastado', color: 'bg-red-100 text-red-700 border-red-200'};
      case 'OUTRA_IGREJA':
        return {
          label: 'Outra Igreja',
          color: 'bg-blue-100 text-blue-700 border-blue-200',
        };
      default:
        return {
          label: status || 'Status não informado',
          color: 'bg-gray-100 text-gray-700 border-gray-200',
        };
    }
  };
  return (
    <section className=" relative bg-white rounded-3xl border border-samu-border shadow-sm p-6 flex flex-col gap-4 hover:shadow-md transition-shadow">
      <div>
        <FontAwesomeIcon
          icon={faEdit}
          className="text-samu-primary text-lg absolute top-5 right-5 cursor-pointer"
          onClick={() => onOpenEdit && onOpenEdit(membro)}
        />
      </div>

      <div className="flex items-center gap-3">
        <Avatar
          altText={membro.nome}
          imageUrl={membro.imagemUrl}
          baseUrlImage={getUrlCarregarImg()}
          sizeClass="w-16 h-16"
        />

        <div>
          <h2 className="text-base font-semibold text-samu-text leading-tight">
            {membro.nome}
          </h2>
          <span className="text-xs text-samu-neutral">Membro ativo</span>
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-samu-bg flex items-center justify-center shrink-0">
            <FontAwesomeIcon icon={faPhone} className="text-samu-primary text-xs" />
          </div>
          <span className="text-sm text-samu-text">
            {membro.telefone ? formatarNumero(membro.telefone) : '-'}
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-samu-bg flex items-center justify-center shrink-0">
            <FontAwesomeIcon
              icon={faLocationDot}
              className="text-samu-primary text-xs"
            />
          </div>
          <span className="text-sm text-samu-text truncate">
            {membro.endereco || 'Endereço não informado'}
          </span>
        </div>

        {/* Exemplo de uso dentro do Card */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-samu-bg flex items-center justify-center shrink-0">
            <FontAwesomeIcon
              icon={faLocationDot}
              className="text-samu-primary text-xs"
            />
          </div>

          {/* Badge com cor dinâmica e Tooltip */}
          <span
            title={`Status atual: ${getStatusConfig(membro.status).label}`}
            className={`text-xs font-medium px-2.5 py-1 rounded-full border truncate cursor-help ${getStatusConfig(membro.status).color}`}>
            {getStatusConfig(membro.status).label}
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-samu-bg flex items-center justify-center shrink-0">
            <FontAwesomeIcon icon={faCalendar} className="text-samu-primary text-xs" />
          </div>
          <span className="text-sm text-samu-text">
            {formatDateOfPattern(membro.dataNascimento, 'DD/MM/YYYY')}
          </span>
        </div>
      </div>

      <div className="pt-3 border-t border-samu-border mt-auto">
        <p className="text-xs font-medium text-samu-neutral mb-1">Observação:</p>
        <p className="text-sm text-samu-text line-clamp-2 leading-relaxed">
          {membro.observacao || 'Nenhuma observação registrada.'}
        </p>

        <button
          type="button"
          onClick={() => onOpenDetails(membro)}
          className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-samu-primary hover:text-blue-700 transition-colors cursor-pointer">
          Ver detalhes
          <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-[10px]" />
        </button>
      </div>
    </section>
  );
};
