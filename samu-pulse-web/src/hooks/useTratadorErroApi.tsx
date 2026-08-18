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

      // Tratamento de erro com response
      if (error.response && error.response.data) {
        // Verifica se é um array de erros (validação de campos)
        if (Array.isArray(error.response.data) && error.response.data.length > 0) {
          // Se tem estrutura de campo/mensagem, constrói mensagem formatada
          if (error.response.data[0].campo && error.response.data[0].mensagem) {
            errorData.message = construirMensagemDeErro(error.response.data);
          } else if (error.response.data[0].mensagem) {
            // Se tem apenas mensagem
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
        // Adiciona código de status HTTP se disponível
        if (error.response.status) {
          const status = error.response.status;
          const statusMessages: Record<number, string> = {
            400: 'Requisição inválida',
            401: 'Não autorizado',
            403: 'Acesso negado',
            404: 'Recurso não encontrado',
            409: 'Conflito',
            422: 'Entidade não processável',
            500: 'Erro interno do servidor',
            502: 'Bad Gateway',
            503: 'Serviço indisponível',
          };

          // Se a mensagem estiver vazia, usa a mensagem do status
          if (!errorData.message) {
            errorData.message = statusMessages[status] || `Erro ${status}`;
          }

          errorData.error = `${errorData.error} (${status})`;
        }
      }
      // Erro sem response (problemas de rede/timeout)
      else {
        errorData.message = 'Erro na conexão com a API. Tente novamente mais tarde';

        if (error.message) {
          errorData.message += ` - ${error.message}`;
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
