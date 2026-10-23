import {useContext, useEffect, useRef, FormEvent} from 'react';
import {AuthContext} from '../../Auth/AuthContext';
import {TipoUsuario} from '../../interfaces/Usuario';
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
import {OptionWithIcon} from '../components/Elements/SelectWithElement';
import {useBodyScrollLock} from '../../hooks/useBodyScrollLock';
import {useStatusMembro} from '../../hooks/useStatusMembro';

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
  detailsModalOpen: boolean;
  editModalOpen: boolean;
  dataNascimento: string;
  status?: number;
  desc: boolean;
  sort: string;
}

export const camposOptions: OptionWithIcon[] = [
  {value: 'nome', text: 'Nome'},
  {value: 'data_nascimento', text: 'Data de Nascimento'},
  {value: 'data_conversao', text: 'Data de Conversão'},
  {value: 'data_ultimo_contato', text: 'Último Contato'},
  {value: 'tipo', text: 'Tipo de Membro'},
  {value: 'id', text: 'Código (ID)'},
];

export const useListMembersModel = () => {
  const {statusMembroOptions} = useStatusMembro();
  const {listarPageMembros, alterarLogoMembro, atualizarMembro, delImgMembro, deletarMembro} =
    useMembro();
  const {user} = useContext(AuthContext);
  const isAdmin = user?.tipoUsuario === TipoUsuario.ADMIN;
  const inativando = useRef(false);
  const {setLoading} = useFunctionsProvider();
  const navigate = useNavigate();

  const stateModel = useStateData<ListMembersStateModel>({
    membros: [],
    search: '',
    page: 0,
    size: 20,
    totalPages: 0,
    totalElements: 0,
    membroSelecionado: null,
    imagensSelecionadas: [],
    isCropModalOpen: false,
    detailsModalOpen: false,
    editModalOpen: false,
    status: undefined,
    dataNascimento: '',
    desc: false,
    sort: 'nome',
  });

  useBodyScrollLock(stateModel.data.detailsModalOpen || stateModel.data.editModalOpen);

  const hasFilter = Boolean(
    stateModel.data.search ||
    stateModel.data.dataNascimento ||
    stateModel.data.status ||
    stateModel.data.sort !== 'nome' ||
    stateModel.data.desc,
  );

  const handleClearFilters = async () => {
    stateModel.updateState('search', '');
    stateModel.updateState('dataNascimento', '');
    stateModel.updateState('status', undefined); // Use '' em vez de undefined
    stateModel.updateState('page', 0);
    stateModel.updateState('sort', 'nome');
    stateModel.updateState('desc', false);

    if (stateModel.data.page !== 0) return;

    await fetchMembros({
      search: '',
      dataNascimento: '',
      status: undefined,
      page: 0,
      sort: 'nome',
      desc: false,
    });
  };

  const fetchMembros = async ({
    search,
    dataNascimento,
    status,
    page,
    sort,
    desc,
  }: {
    search: string;
    dataNascimento: string;
    status: number | undefined;
    page: number;
    sort: string;
    desc: boolean;
  }) => {
    setLoading(true);
    try {
      const res: Response<Membro[]> = await listarPageMembros(
        search,
        dataNascimento,
        status,
        stateModel.data.size,
        page,
        sort,
        desc ? 'desc' : 'asc',
      );

      if (res && res.content) {
        stateModel.updateState('membros', res.content);
        stateModel.updateState('totalPages', res.totalPages);
        stateModel.updateState('totalElements', res.totalElements);
      }
    } catch (error) {
      console.error('Erro ao buscar membros:', error);
    } finally {
      setLoading(false);
    }
  };

  // Busca inicial e ao trocar de página
  useEffect(() => {
    fetchMembros({
      search: stateModel.data.search,
      dataNascimento: stateModel.data.dataNascimento,
      status: stateModel.data.status,
      page: stateModel.data.page,
      sort: stateModel.data.sort,
      desc: stateModel.data.desc,
    });
  }, [stateModel.data.page]);

  // Função acionada ao enviar o formulário de busca
  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    stateModel.updateState('page', 0);
    if (stateModel.data.page !== 0) return;
    fetchMembros({
      search: stateModel.data.search,
      dataNascimento: stateModel.data.dataNascimento,
      status: stateModel.data.status,
      page: 0,
      sort: stateModel.data.sort,
      desc: stateModel.data.desc,
    });
  };

  // Controles de paginação
  const goToPage = (page: number) => {
    if (Number.isInteger(page) && page >= 0 && page < stateModel.data.totalPages)
      stateModel.updateState('page', page);
  };

  const nextPage = () => {
    goToPage(stateModel.data.page + 1);
  };

  const prevPage = () => {
    goToPage(stateModel.data.page - 1);
  };

  const onOpenDetails = (membro: Membro) => {
    stateModel.updateState('membroSelecionado', membro);
    stateModel.updateState('detailsModalOpen', true);
  };

  const onOpenEdit = (membro: Membro) => {
    stateModel.updateState('membroSelecionado', membro);
    stateModel.updateState('editModalOpen', true);
  };

  const onClose = () => {
    stateModel.updateState('detailsModalOpen', false);
    stateModel.updateState('editModalOpen', false);
    stateModel.updateState('membroSelecionado', null);
    stateModel.updateState('imagensSelecionadas', []);
  };

  const inativarMembro = (membro: Membro) => {
    if (!isAdmin || inativando.current) return;
    MessageService.confirmMessage(
      `Deseja inativar ${membro.nome}? O membro sairá da listagem de ativos. Seu cadastro e histórico serão preservados.`,
      async () => {
        if (inativando.current) return;
        inativando.current = true;
        setLoading(true);
        try {
          const sucesso = await deletarMembro(membro.id);
          if (!sucesso) return;
          stateModel.updateState('membros', stateModel.data.membros.filter(item => item.id !== membro.id));
          stateModel.updateState('totalElements', Math.max(0, stateModel.data.totalElements - 1));
          if (stateModel.data.membroSelecionado?.id === membro.id) onClose();
          MessageService.successMessage(`Membro ${membro.nome} inativado com sucesso!`);
          const page = stateModel.data.membros.length === 1 && stateModel.data.page > 0
            ? stateModel.data.page - 1 : stateModel.data.page;
          if (page !== stateModel.data.page) {
            stateModel.updateState('page', page);
          } else {
            await fetchMembros({...stateModel.data, page});
          }
        } finally {
          inativando.current = false;
          setLoading(false);
        }
      },
    );
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
      id: stateModel.data.membroSelecionado?.id || 0,
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
      cod_status: stateModel.data.membroSelecionado?.cod_status ?? null,
    };

    try {
      const resAtualiza = await atualizarMembro(novosDadosMembro);

      if (resAtualiza) {
        MessageService.alertMessage(
          `Membro ${novosDadosMembro.nome} atualizado com sucesso!`,
        );

        stateModel.updateState(
          'membros',
          stateModel.data.membros.map(membro =>
            membro.id === novosDadosMembro.id
              ? resAtualiza
              : membro,
          ),
        );

        onClose();
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

  const alterarLogo = async (isDelete: boolean, arquivos?: File[]) => {
    setLoading(true);

    try {
      if (isDelete) {
        MessageService.confirmMessage(
          'Deseja realmente deletar a logo do membro?',
          async () => {
            if (
              stateModel.data.membroSelecionado &&
              stateModel.data.membroSelecionado.id &&
              stateModel.data.membroSelecionado.imagemUrl
            ) {
              const resDel = await delImgMembro(
                stateModel.data.membroSelecionado.imagemUrl,
                stateModel.data.membroSelecionado.id,
              );

              if (resDel) {
                MessageService.alertMessage('Logo deletada com sucesso!');
                stateModel.updateState('membroSelecionado', {
                  ...stateModel.data.membroSelecionado,
                  imagemUrl: undefined,
                });

                stateModel.updateState(
                  'membros',
                  stateModel.data.membros.map(membro =>
                    membro.id === stateModel.data.membroSelecionado?.id
                      ? {...membro, imagemUrl: undefined}
                      : membro,
                  ),
                );
              }
            }
          },
        );
      } else {
        if (
          arquivos &&
          arquivos.length > 0 &&
          stateModel.data.membroSelecionado &&
          stateModel.data.membroSelecionado.id
        ) {
          const imageFile = arquivos[0];
          const resAlt = await alterarLogoMembro(
            imageFile,
            stateModel.data.membroSelecionado.id,
          );

          if (!resAlt) {
            return;
          }

          MessageService.alertMessage('Logo alterada com sucesso!');
          stateModel.updateState('membroSelecionado', {
            ...stateModel.data.membroSelecionado,
            imagemUrl: resAlt,
          });
          stateModel.updateState(
            'membros',
            stateModel.data.membros.map(membro =>
              membro.id === stateModel.data.membroSelecionado?.id
                ? {...membro, imagemUrl: resAlt}
                : membro,
            ),
          );
        }
      }
    } catch (error) {
      console.error('Erro:', error);
      MessageService.alertMessage('Ocorreu um erro ao editar a logo. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return {
    statusMembroOptions,
    isAdmin,
    inativarMembro,
    stateModel,
    hasFilter,
    handleSearch,
    nextPage,
    prevPage,
    goToPage,
    alterarMembro,
    alterarLogo,
    navigate,
    onOpenDetails,
    onOpenEdit,
    onClose,
    handleClearFilters,
  };
};
