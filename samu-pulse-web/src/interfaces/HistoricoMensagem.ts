export interface HistoricoMensagem {
  id: number;
  idMembro: number;
  nomeExibicao: string | null;
  perfilResponsavel: string;
  mensagem: string | null;
  dataRegistro: string;
  dataAlteracao: string | null;
  podeAlterar: boolean;
}

export interface DadosHistoricoMensagemRequest {
  mensagem: string;
}
