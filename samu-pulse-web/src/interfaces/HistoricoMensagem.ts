import {TipoUsuario} from './Usuario';

export interface HistoricoMensagem {
  id: number;
  idMembro: number;
  idUsuario: number;
  usuario: {
    login: string;
    perfilResponsavel: string;
    tipoUsuario: TipoUsuario;
  };
  perfilResponsavel: string;
  mensagem: string | null;
  dataRegistro: string;
}

export interface DadosHistoricoMensagemRequest {
  mensagem: string;
}
