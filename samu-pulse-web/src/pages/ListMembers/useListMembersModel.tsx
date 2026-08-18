import {useEffect, FormEvent} from 'react';
import {useMembro, useStateData} from '../../hooks';
import {useFunctionsProvider} from '../../contexts/FunctionsProvider';
import {Membro, MembroJson} from '../../interfaces/Membro';
import {Response} from '../../interfaces/Pageable';
import {MessageService} from '../../services';
import {
  extrairNumeros,
  formatDateOfPattern,
} from '../../services/Extra/FuncionalidadesService';
import {useNavigate} from 'react-router-dom';

export interface ListMembersStateModel {
  membros: Membro[];
  search: string;
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
  membroSelecionado?: Membro | null;
  imagensSelecionadas?: File[];
  isCropModalOpen: boolean;
}

export const useListMembersModel = () => {
  const {listarPageMembros, alterarLogoMembro, atualizarMembro, delImgMembro} =
    useMembro();
  const {setLoading} = useFunctionsProvider();
  const navigate = useNavigate();

  const stateModel = useStateData<ListMembersStateModel>({
    membros: [],
    search: '',
    page: 0,
    size: 10,
    totalPages: 0,
    totalElements: 0,
    membroSelecionado: null,
    imagensSelecionadas: [],
    isCropModalOpen: false,
  });

  const fetchMembros = async () => {
    setLoading(true);
    try {
      const res: Response<Membro[]> = await listarPageMembros(
        stateModel.data.search,
        stateModel.data.size,
        stateModel.data.page,
        'nome',
        'asc',
      );

      if (res && res.content) {
        stateModel.updateMultipleStates({
          ...stateModel.data,
          membros: res.content,
          totalPages: res.totalPages,
          totalElements: res.totalElements,
        });
      }
    } catch (error) {
      console.error('Erro ao buscar membros:', error);
    } finally {
      setLoading(false);
    }
  };

  // Busca inicial e ao trocar de página
  useEffect(() => {
    fetchMembros();
  }, [stateModel.data.page]);

  // Função acionada ao enviar o formulário de busca
  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    stateModel.updateState('page', 0);
    fetchMembros();
  };

  // Controles de paginação
  const nextPage = () => {
    if (stateModel.data.page < stateModel.data.totalPages - 1)
      stateModel.updateState('page', stateModel.data.page + 1);
  };

  const prevPage = () => {
    if (stateModel.data.page > 0)
      stateModel.updateState('page', stateModel.data.page - 1);
  };

  const alterarMembro = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (
      !stateModel.data.membroSelecionado?.nome ||
      !stateModel.data.membroSelecionado?.telefone
    ) {
      MessageService.alertMessage('Preencha os campos obrigatórios (*)');
      setLoading(false);
      return;
    }

    const novosDadosMembro: MembroJson = {
      nome: stateModel.data.membroSelecionado?.nome || '',
      telefone: extrairNumeros(stateModel.data.membroSelecionado?.telefone || ''),
      dataNascimento: stateModel.data.membroSelecionado?.dataNascimento
        ? formatDateOfPattern(
            stateModel.data.membroSelecionado?.dataNascimento,
            'DD/MM/YYYY',
          )
        : undefined,
      endereco: stateModel.data.membroSelecionado?.endereco || '',
      observacao: stateModel.data.membroSelecionado?.observacao || '',
    };

    try {
      const resAtualiza = await atualizarMembro(novosDadosMembro);

      if (resAtualiza) {
        MessageService.alertMessage(
          `Membro ${novosDadosMembro.nome} atualizado com sucesso!`,
        );
        navigate('/');
      }
    } catch (error) {
      console.error('Erro ao atualizar membro:', error);
      MessageService.alertMessage(
        'Ocorreu um erro ao atualizar o cadastro. Tente novamente.',
      );
    } finally {
      setLoading(false);
    }
  };

  const alterarLogo = async (isDelete: boolean) => {
    // setLoading(true);
  };

  return {
    stateModel,
    handleSearch,
    nextPage,
    prevPage,
    alterarMembro,
    alterarLogo,
  };
};
