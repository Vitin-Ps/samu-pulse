import {FormEvent} from 'react';
import {useMembro, useStateData} from '../../hooks';
import {useFunctionsProvider} from '../../contexts/FunctionsProvider';
import {MessageService} from '../../services';
import {
  extrairNumeros,
  formatDateOfPattern,
} from '../../services/Extra/FuncionalidadesService';
import {useNavigate} from 'react-router-dom';
import {MembroJson, StatusMembro} from '../../interfaces/Membro';
import {OptionWithIcon} from '../components/Elements/SelectWithElement';

interface AddMemberModelProps {}

export const useAddMemberModel = ({}: AddMemberModelProps) => {
  const {cadastrarMembro, alterarLogoMembro} = useMembro();
  const {setLoading} = useFunctionsProvider();
  const navigate = useNavigate();

  const stateModel = useStateData<{
    nome: string;
    telefone?: string;
    endereco?: string;
    observacao?: string;
    dataNascimento?: string;
    isCropModalOpen: boolean;
    imagensSelecionadas: File[];
    status: StatusMembro;
  }>({
    nome: '',
    telefone: '',
    endereco: '',
    observacao: '',
    dataNascimento: '',
    isCropModalOpen: false,
    imagensSelecionadas: [],
    status: StatusMembro.ATIVO,
  });

  const salvarMembro = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (!stateModel.data.nome || !stateModel.data.telefone) {
      MessageService.alertMessage('Preencha os campos obrigatórios (*)');
      setLoading(false);
      return;
    }

    const novoMembro: MembroJson = {
      nome: stateModel.data.nome,
      telefone: extrairNumeros(stateModel.data.telefone || ''),
      dataNascimento: stateModel.data.dataNascimento
        ? formatDateOfPattern(stateModel.data.dataNascimento, 'DD/MM/YYYY')
        : undefined,
      endereco: stateModel.data.endereco,
      observacao: stateModel.data.observacao,
      status: stateModel.data.status,
    };

    try {
      const resCadastro = await cadastrarMembro(novoMembro);

      if (!resCadastro) {
        return;
      }

      if (stateModel.data.imagensSelecionadas.length > 0) {
        const atualizarLogo = await alterarLogoMembro(
          stateModel.data.imagensSelecionadas[0],
          resCadastro.id,
        );

        if (!atualizarLogo) {
          MessageService.alertMessage(
            'Membro cadastrado, mas houve um erro ao enviar a imagem. Tente novamente.',
          );
        }
      }

      if (resCadastro) {
        MessageService.alertMessage(
          `Membro ${novoMembro.nome} cadastrado com sucesso!`,
        );
        navigate('/');
      }
    } catch (error) {
      console.error('Erro ao cadastrar membro:', error);
      MessageService.alertMessage(
        'Ocorreu um erro ao salvar o cadastro. Tente novamente.',
      );
    } finally {
      setLoading(false);
    }
  };
  return {
    stateModel,
    salvarMembro,
  };
};
