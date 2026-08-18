import React from 'react';
import {Modal} from '../../components/Elements';
import {
  formatarNumero,
  formatDateOfPattern,
  getUrlCarregarImg,
} from '../../../services/Extra/FuncionalidadesService';
import {Avatar} from '../../components/Avatar';
import { Membro } from '../../../interfaces/Membro';


interface MemberDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  membro: Membro | null;
}

export const MemberDetailsModal: React.FC<MemberDetailsModalProps> = ({
  isOpen,
  onClose,
  membro,
}) => {
  if (!membro) return null;

  return (
    <Modal
      showModal={isOpen}
      setShowModal={onClose}
      className="max-w-4xl p-6 rounded-3xl border border-samu-border">
      {/* Cabeçalho */}
      <div className="flex items-start justify-between gap-4 mb-5 border-b border-samu-border pb-4">
        <div className="flex flex-col items-start gap-3">
          <p className="text-xs font-medium text-samu-neutral uppercase tracking-wider mb-1">
            Detalhes do Membro
          </p>
          <div className="flex gap-2 items-center">
            <Avatar
              altText={membro.nome}
              imageUrl={membro.imagemUrl}
              baseUrlImage={getUrlCarregarImg()}
              sizeClass="w-20 h-20"
            />
            <h3 className="text-xl font-semibold text-samu-text break-all">
              {membro.nome}
            </h3>
          </div>
        </div>
      </div>

      {/* Corpo com Informações Condicionais */}
      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
        {/* Informações Principais Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {membro.telefone && (
            <div className="bg-samu-bg rounded-2xl p-3 border border-samu-border">
              <span className="block text-[11px] font-semibold text-samu-neutral uppercase">
                Telefone
              </span>
              <span className="text-sm text-samu-text font-medium break-all">
                {formatarNumero(membro.telefone)}
              </span>
            </div>
          )}

          {membro.dataNascimento && (
            <div className="bg-samu-bg rounded-2xl p-3 border border-samu-border">
              <span className="block text-[11px] font-semibold text-samu-neutral uppercase">
                Data de Nascimento
              </span>
              <span className="text-sm text-samu-text font-medium">
                {formatDateOfPattern(membro.dataNascimento, 'DD/MM/YYYY')}
              </span>
            </div>
          )}

          {membro.dataConversao && (
            <div className="bg-samu-bg rounded-2xl p-3 border border-samu-border">
              <span className="block text-[11px] font-semibold text-samu-neutral uppercase">
                Data de Conversão
              </span>
              <span className="text-sm text-samu-text font-medium">
                {membro.dataConversao}
              </span>
            </div>
          )}

          {membro.tipoConversao && (
            <div className="bg-samu-bg rounded-2xl p-3 border border-samu-border">
              <span className="block text-[11px] font-semibold text-samu-neutral uppercase">
                Tipo de Conversão
              </span>
              <span className="text-sm text-samu-text font-medium break-all">
                {membro.tipoConversao}
              </span>
            </div>
          )}

          {membro.dataUltimoContato && (
            <div className="bg-samu-bg rounded-2xl p-3 border border-samu-border">
              <span className="block text-[11px] font-semibold text-samu-neutral uppercase">
                Último Contato
              </span>
              <span className="text-sm text-samu-text font-medium">
                {membro.dataUltimoContato}
              </span>
            </div>
          )}

          {membro.isbatizado !== undefined && (
            <div className="bg-samu-bg rounded-2xl p-3 border border-samu-border">
              <span className="block text-[11px] font-semibold text-samu-neutral uppercase">
                Batizado
              </span>
              <span className="text-sm text-samu-text font-medium">
                {membro.isbatizado ? 'Sim' : 'Não'}
              </span>
            </div>
          )}
        </div>

        {/* Endereço */}
        {membro.endereco && (
          <div className="bg-samu-bg rounded-2xl p-3 border border-samu-border">
            <span className="block text-[11px] font-semibold text-samu-neutral uppercase">
              Endereço
            </span>
            <span className="text-sm text-samu-text font-medium break-all">
              {membro.endereco}
            </span>
          </div>
        )}

        {/* Observação */}
        {membro.observacao && (
          <div className="bg-samu-bg rounded-2xl p-4 border border-samu-border">
            <span className="block text-[11px] font-semibold text-samu-neutral uppercase mb-1">
              Observação
            </span>
            <p className="text-sm text-samu-text leading-relaxed break-all">
              {membro.observacao}
            </p>
          </div>
        )}
      </div>

      {/* Rodapé / Fechar */}
      <div className="mt-6 flex justify-end pt-4 border-t border-samu-border">
        <button
          type="button"
          onClick={onClose}
          className="px-5 py-2.5 bg-samu-primary hover:bg-blue-600 text-white text-sm font-medium rounded-xl transition-all cursor-pointer">
          Fechar
        </button>
      </div>
    </Modal>
  );
};
