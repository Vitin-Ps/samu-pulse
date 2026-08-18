import axios from 'axios';
import {useState} from 'react';
import {ErrorMessage} from '../interfaces/ErrorMessage';
import {MessageService} from '../services';

const useTratadorErroApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Converte um array de erros em uma string formatada
   */
  const construirMensagemDeErro = (
    erros: {campo: string; mensagem: string}[],
  ): string => {
    if (erros.map) {
      const mensagens = erros.map(erro => `${erro.campo}: ${erro.mensagem}`);
      return mensagens.join('\n');
    }
    return erros.toString();
  };

  /**
   * Trata erros de API e retorna uma mensagem formatada
   */
  const handleApiError = (error: any): string => {
    const errorData: ErrorMessage = {error: '', message: ''};

    // Verifica se é um erro do Axios
    if (axios.isAxiosError(error)) {
      errorData.error = error.code || 'AXIOS_ERROR';

      // Tratamento de erro com response (O back-end conseguiu responder)
      if (error.response && error.response.data) {
        // Verifica erro 413 (Payload Too Large) explicitamente, caso o backend consiga enviá-lo
        if (error.response.status === 413) {
          errorData.message =
            'A imagem selecionada é muito pesada. Por favor, recorte a imagem ou escolha uma menor (Limite: 5MB).';
        }
        // Verifica se é um array de erros (validação de campos)
        else if (Array.isArray(error.response.data) && error.response.data.length > 0) {
          if (error.response.data[0].campo && error.response.data[0].mensagem) {
            errorData.message = construirMensagemDeErro(error.response.data);
          } else if (error.response.data[0].mensagem) {
            errorData.message = error.response.data[0].mensagem;
          } else {
            errorData.message = error.response.data.toString();
          }
        }
        // Verifica se tem uma mensagem específica
        else if (error.response.data.message) {
          errorData.message = error.response.data.message;
        }
        // Verifica se tem um erro específico
        else if (error.response.data.error) {
          errorData.message = error.response.data.error;
        }
        // Tenta converter data para string
        else if (typeof error.response.data === 'string') {
          errorData.message = error.response.data;
        } else {
          errorData.message = JSON.stringify(error.response.data);
        }
      } else if (error.response && error.response.status) {
        // Adiciona código de status HTTP se disponível, sem mensagem no body
        if (error.response.status) {
          const status = error.response.status;
          const statusMessages: Record<number, string> = {
            400: 'Requisição inválida',
            401: 'Não autorizado',
            403: 'Acesso negado',
            404: 'Recurso não encontrado',
            409: 'Conflito',
            413: 'Arquivo muito grande. O limite máximo foi excedido.',
            422: 'Entidade não processável',
            500: 'Erro interno do servidor',
            502: 'Bad Gateway',
            503: 'Serviço indisponível',
          };

          if (!errorData.message) {
            errorData.message = statusMessages[status] || `Erro ${status}`;
          }

          errorData.error = `${errorData.error} (${status})`;
        }
      }
      // Erro sem response (problemas de rede/timeout ou CORS por causa do Tomcat 413)
      else {
        console.error('Erro de conexão com a API:', error);

        // Se for Network Error e o config do Axios envolvia multipart/form-data (upload de imagem)
        // É quase 100% de chance de ser o Tomcat cortando a requisição por tamanho.
        const isUploadRequest = error.config?.headers?.['Content-Type']
          ?.toString()
          .includes('multipart/form-data');

        if (error.message === 'Network Error' && isUploadRequest) {
          errorData.message =
            'Erro ao enviar a imagem. Ela pode ser muito grande ou pesada. Tente recortá-la antes de salvar.';
        } else {
          errorData.message =
            'Erro na conexão com a API. Verifique sua internet ou tente novamente.';
          if (error.message) {
            errorData.message += ` (${error.message})`;
          }
        }
      }
    }
    // Trata outros tipos de erro
    else if (error?.message) {
      errorData.error = 'Erro desconhecido';
      errorData.message = error.message;
    } else if (error?.error) {
      errorData.error = 'Erro desconhecido';
      errorData.message = error.error;
    } else if (typeof error === 'string') {
      errorData.error = 'Erro';
      errorData.message = error;
    } else {
      errorData.error = 'Erro desconhecido';
      errorData.message = 'Ocorreu um erro inesperado';
    }

    // Exibe a mensagem de erro
    MessageService.errorMessage(errorData.message);

    return errorData.message;
  };

  /**
   * Wrapper genérico para executar requisições com loading e tratamento de erro
   */
  const handleRequest = async <T,>(
    serviceMethod: () => Promise<T>,
  ): Promise<T | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await serviceMethod();
      return result;
    } catch (err) {
      const errorMessageHandled = handleApiError(err);
      setError(errorMessageHandled);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return {handleApiError, handleRequest, loading, error, clearError, setError};
};

export default useTratadorErroApi;
