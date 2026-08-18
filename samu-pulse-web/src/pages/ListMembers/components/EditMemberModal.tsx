import React, {FormEvent} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faUserPen, faCheck, faTrash, faPen} from '@fortawesome/free-solid-svg-icons';
import {Button, Input, TextArea, Modal} from '../../components/Elements';
import {
  formatarNumero,
  getUrlCarregarImg,
} from '../../../services/Extra/FuncionalidadesService';
import {Avatar} from '../../components/Avatar';
import {statusMembroOptions} from '../useListMembersModel';
import SelectWithElement from '../../components/Elements/SelectWithElement';

interface EditMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  stateModel: any;
  alterarMembro: (e: FormEvent<HTMLFormElement>) => void;
  alterarLogo: (isDelete: boolean, files?: File[]) => void;
}

export const EditMemberModal: React.FC<EditMemberModalProps> = ({
  isOpen,
  onClose,
  stateModel,
  alterarMembro,
  alterarLogo,
}) => {
  const [previewImage, setPreviewImage] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (
      stateModel.data.membroSelecionado &&
      stateModel.data.membroSelecionado.imagemUrl
    ) {
      const imageUrl =
        getUrlCarregarImg() + stateModel.data.membroSelecionado.imagemUrl;
      setPreviewImage(imageUrl);
    } else {
      setPreviewImage(null);
    }
  }, [stateModel.data.membroSelecionado]);

  return (
    <Modal
      showModal={isOpen}
      setShowModal={onClose}
      className="max-w-2xl p-0 rounded-3xl border border-samu-border overflow-hidden max-h-[90vh] flex flex-col">
      <div className="px-8 pt-8 pb-6 border-b border-samu-border bg-white sticky top-0 z-10">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-samu-text leading-tight">
              Editar Membro
            </h1>
            <p className="text-sm text-samu-neutral mt-0.5">
              Atualize as informações do cadastro
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-samu-primary-lighter flex items-center justify-center text-samu-primary shrink-0">
            <FontAwesomeIcon icon={faUserPen} className="text-lg" />
          </div>
        </div>
      </div>

      <div className="overflow-y-auto px-8 py-6 custom-scrollbar">
        {stateModel.data.membroSelecionado && (
          <form id="edit-member-form" onSubmit={alterarMembro}>
            <div className="flex flex-col items-center mb-6">
              <label className="block text-sm font-medium text-samu-text mb-3 self-start">
                Foto do Membro
              </label>
              <div className="relative group">
                <Avatar altText="Foto do Membro" imageUrl={previewImage} />

                <div className="absolute bottom-0 right-0 flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => stateModel.updateState('isCropModalOpen', true)}
                    className="w-8 h-8 bg-samu-primary text-white rounded-full flex items-center justify-center shadow-md hover:bg-blue-600 transition-colors cursor-pointer"
                    title="Alterar foto">
                    <FontAwesomeIcon icon={faPen} className="text-xs" />
                  </button>

                  {stateModel.data.membroSelecionado.imagemUrl && (
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        alterarLogo(true);
                      }}
                      className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-md hover:bg-red-600 transition-colors cursor-pointer"
                      title="Remover foto">
                      <FontAwesomeIcon icon={faTrash} className="text-xs" />
                    </button>
                  )}
                </div>
              </div>
              <span className="text-xs text-samu-neutral mt-2">
                Clique na foto para recortar (Proporção 1:1)
              </span>
            </div>

            <Input
              id="nome"
              label="Nome Completo"
              placeholder="Ex: Maria dos Santos Oliveira"
              value={stateModel.data.membroSelecionado.nome || ''}
              onChange={e =>
                stateModel.updateState('membroSelecionado', {
                  ...stateModel.data.membroSelecionado,
                  nome: e.target.value,
                })
              }
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5">
              <Input
                id="telefone"
                type="tel"
                label="Telefone"
                placeholder="(00) 00000-0000"
                value={formatarNumero(
                  stateModel.data.membroSelecionado.telefone
                    ? stateModel.data.membroSelecionado.telefone
                    : '',
                )}
                onChange={e =>
                  stateModel.updateState('membroSelecionado', {
                    ...stateModel.data.membroSelecionado,
                    telefone: e.target.value,
                  })
                }
                required
              />
              <Input
                id="nascimento"
                type="date"
                label="Data de Nascimento"
                value={stateModel.data.membroSelecionado.dataNascimento || ''}
                onChange={e =>
                  stateModel.updateState('membroSelecionado', {
                    ...stateModel.data.membroSelecionado,
                    dataNascimento: e.target.value,
                  })
                }
              />
            </div>

            <SelectWithElement
              label="Status do Membro"
              placeholder="Selecione o status"
              data={statusMembroOptions}
              valor={stateModel.data.membroSelecionado.status}
              setValor={novoStatus =>
                stateModel.updateState('membroSelecionado', {
                  ...stateModel.data.membroSelecionado,
                  status: novoStatus,
                })
              }
              obrigatorio={true}
            />

            <Input
              id="endereco"
              label="Endereço"
              placeholder="Rua, número, bairro, cidade"
              value={stateModel.data.membroSelecionado.endereco || ''}
              onChange={e =>
                stateModel.updateState('membroSelecionado', {
                  ...stateModel.data.membroSelecionado,
                  endereco: e.target.value,
                })
              }
            />

            <TextArea
              id="observacao"
              label="Observação"
              helperText="anotações, necessidades"
              value={stateModel.data.membroSelecionado.observacao || ''}
              onChange={e =>
                stateModel.updateState('membroSelecionado', {
                  ...stateModel.data.membroSelecionado,
                  observacao: e.target.value,
                })
              }
              placeholder="Registre informações importantes para o acompanhamento..."
            />

            <p className="text-xs text-samu-neutral mb-2">
              <span className="text-samu-danger font-bold">*</span> Campos obrigatórios
            </p>
          </form>
        )}
      </div>

      <div className="px-8 py-4 border-t border-samu-border bg-white flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 mt-auto">
        <Button variant="secondary" onClick={onClose} type="button">
          Cancelar
        </Button>

        <Button variant="primary" icon={faCheck} type="submit" form="edit-member-form">
          Salvar Alterações
        </Button>
      </div>
    </Modal>
  );
};
