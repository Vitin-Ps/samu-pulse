import {MembroJson} from '../interfaces/Membro';
import {MembroService} from '../services';
import useTratadorErroApi from './useTratadorErroApi';

export const useMembro = () => {
  const {loading, error, clearError, handleRequest} = useTratadorErroApi();
  const membroService = MembroService;

  const cadastrarMembro = async (membro: MembroJson) => {
    return handleRequest(() => membroService.cadastrarMembro(membro));
  };

  const deletarMembro = async (id: number) => {
    return handleRequest(() => membroService.deletarMembro(id));
  };

  const listarPageMembros = async (
    search?: string,
    size?: number,
    page?: number,
    sort?: string,
    direction?: string,
  ) => {
    return handleRequest(() =>
      membroService.listarPageMembros(search, size, page, sort, direction),
    );
  };

  const detalharMembro = async (idMembro: number) => {
    return handleRequest(() => membroService.detalharMembro(idMembro));
  };

  const atualizarMembro = async (membro: MembroJson) => {
    return handleRequest(() => membroService.atualizarMembro(membro));
  };

  const alterarLogoMembro = async (image: File, idMembro: number) => {
    return handleRequest(() => membroService.alterarLogoMembro(image, idMembro));
  };

  const delImgMembro = async (imgUrl: string, idMembro: number) => {
    return handleRequest(() => membroService.delImgMembro(imgUrl, idMembro));
  };

  return {
    loading,
    error,
    delImgMembro,
    alterarLogoMembro,
    cadastrarMembro,
    deletarMembro,
    listarPageMembros,
    detalharMembro,
    atualizarMembro,
    clearError,
  };
};
