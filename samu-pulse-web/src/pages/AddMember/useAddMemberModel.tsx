import {FormEvent} from 'react';
import {useMembro, useStateData} from '../../hooks';
import {useFunctionsProvider} from '../../contexts/FunctionsProvider';
import {MessageService} from '../../services';
import {extrairNumeros} from '../../services/Extra/FuncionalidadesService';
import {useNavigate} from 'react-router-dom';
import {MembroJson} from '../../interfaces/Membro';

interface AddMemberModelProps {}

export const useAddMemberModel = ({}: AddMemberModelProps) => {
  const {cadastrarMembro} = useMembro();
  const {setLoading} = useFunctionsProvider();
  const navigate = useNavigate();

  const stateModel = useStateData<{
    nome: string;
    telefone?: string;
    endereco?: string;
    observacao?: string;
    dataNascimento?: string;
  }>({
    nome: '',
    telefone: '',
    endereco: '',
    observacao: '',
    dataNascimento: '',
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
        ? stateModel.data.dataNascimento
        : undefined,
      endereco: stateModel.data.endereco,
      observacao: stateModel.data.observacao,
    };

    try {
      const resCadastro = await cadastrarMembro(novoMembro);

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
