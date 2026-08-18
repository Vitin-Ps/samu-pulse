import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
  faUserPlus,
  faArrowLeft,
  faCheck,
  faCamera,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import {useNavigate} from 'react-router-dom';
import {
  AspectRatio,
  Button,
  ImageCropModal,
  Input,
  TextArea,
} from '../components/Elements';
import {FC} from 'react';
import {useAddMemberModel} from './useAddMemberModel';
import {formatarNumero} from '../../services/Extra/FuncionalidadesService';
import SelectWithElement from '../components/Elements/SelectWithElement';
import {statusMembroOptions} from '../ListMembers/useListMembersModel';

export const AddMemberView: FC<ReturnType<typeof useAddMemberModel>> = ({
  stateModel,
  salvarMembro,
}) => {
  const navigate = useNavigate();

  const previewImage =
    stateModel.data.imagensSelecionadas.length > 0
      ? URL.createObjectURL(stateModel.data.imagensSelecionadas[0])
      : null;

  return (
    <main className="grow flex items-start justify-center px-4 pb-16 pt-10 w-full">
      <div className="w-full max-w-150 bg-white rounded-3xl shadow-sm border border-samu-border overflow-hidden">
        <div className="px-8 pt-8 pb-6 border-b border-samu-border">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-samu-neutral hover:text-samu-primary transition-colors text-sm font-medium cursor-pointer mb-5">
            <FontAwesomeIcon icon={faArrowLeft} className="text-xs" />
            Voltar
          </button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-samu-text leading-tight">
                Novo Cadastro
              </h1>
            </div>
            <div className="w-12 h-12 rounded-xl bg-samu-primary-lighter flex items-center justify-center text-samu-primary shrink-0">
              <FontAwesomeIcon icon={faUserPlus} className="text-lg" />
            </div>
          </div>
        </div>

        {/* Formulário com Componentes Reutilizáveis */}
        <form className="px-8 py-8 flex flex-col gap-4" onSubmit={salvarMembro}>
          {/* === CAMPO DE FOTO (1:1 / Square) === */}
          <div className="flex flex-col items-center mb-6">
            <label className="block text-sm font-medium text-samu-text mb-3 self-start">
              Foto do Membro
            </label>
            <div className="relative group">
              <div
                onClick={() => stateModel.updateState('isCropModalOpen', true)}
                className="w-28 h-28 rounded-full border-2 border-dashed border-samu-border bg-samu-bg/50 flex items-center justify-center overflow-hidden cursor-pointer hover:border-samu-primary transition-all shadow-inner">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Foto do Membro"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center text-samu-neutral">
                    <FontAwesomeIcon icon={faCamera} className="text-2xl mb-1" />
                    <span className="text-[11px] font-medium">Adicionar</span>
                  </div>
                )}
              </div>

              {previewImage && (
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    stateModel.updateState('imagensSelecionadas', []);
                  }}
                  className="absolute bottom-0 right-0 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
                  title="Remover foto">
                  <FontAwesomeIcon icon={faTrash} className="text-xs" />
                </button>
              )}
            </div>
            <span className="text-xs text-samu-neutral mt-2">
              Clique na foto para recortar (Proporção 1:1)
            </span>
          </div>

          <Input
            id="nome"
            label="Nome Completo"
            placeholder="Ex: Maria dos Santos Oliveira"
            value={stateModel.data.nome}
            onChange={e => stateModel.updateState('nome', e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5">
            <Input
              id="telefone"
              type="tel"
              label="Telefone"
              placeholder="(00) 00000-0000"
              value={formatarNumero(
                stateModel.data.telefone ? stateModel.data.telefone : '',
              )}
              onChange={e => stateModel.updateState('telefone', e.target.value)}
              required
            />
            <Input
              id="nascimento"
              type="date"
              label="Data de Nascimento"
              value={stateModel.data.dataNascimento}
              onChange={e => stateModel.updateState('dataNascimento', e.target.value)}
            />
          </div>

          <SelectWithElement
            label="Status do Membro"
            placeholder="Selecione o status"
            data={statusMembroOptions}
            valor={stateModel.data.status}
            setValor={novoStatus => stateModel.updateState('status', novoStatus)}
            obrigatorio={true}
          />

          <Input
            id="endereco"
            label="Endereço"
            placeholder="Rua, número, bairro, cidade"
            value={stateModel.data.endereco}
            onChange={e => stateModel.updateState('endereco', e.target.value)}
          />

          <TextArea
            id="observacao"
            label="Observação"
            helperText="anotações, necessidades"
            value={stateModel.data.observacao}
            onChange={e => stateModel.updateState('observacao', e.target.value)}
            placeholder="Registre informações importantes para o acompanhamento..."
          />

          <p className="text-xs text-samu-neutral mb-6 -mt-4">
            <span className="text-samu-danger font-bold">*</span> Campos obrigatórios
          </p>

          <div className="border-t border-samu-border mb-6"></div>

          {/* Botões Reutilizáveis */}
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3">
            <Button variant="secondary" onClick={() => navigate(-1)} type="button">
              Cancelar
            </Button>

            <Button variant="primary" icon={faCheck} type="submit">
              Salvar Cadastro
            </Button>
          </div>
        </form>
      </div>

      <ImageCropModal
        isOpen={stateModel.data.isCropModalOpen}
        onClose={() => stateModel.updateState('isCropModalOpen', false)}
        limit={1}
        aspect={AspectRatio.SQUARE}
        mandatoryAspect={true}
        imagensSelecionadas={stateModel.data.imagensSelecionadas}
        setImagensSelecionadas={(arquivos: File[]) =>
          stateModel.updateState('imagensSelecionadas', arquivos)
        }
        onSave={(arquivos: any) => {
          stateModel.updateState('imagensSelecionadas', arquivos);
        }}
      />
    </main>
  );
};
