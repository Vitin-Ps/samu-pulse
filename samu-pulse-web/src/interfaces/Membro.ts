export enum TipoConversao {
  RECONCILIANDO = 'RECONCILIANDO',
  ACEITANDO = 'ACEITANDO',
}

export enum TipoMembro {
  MEMBRO = 'MEMBRO',
  NOVO_CONVERTIDO = 'NOVO_CONVERTIDO',
}

export interface Membro {
  id?: number;
  nome: string;
  telefone?: string;
  dataConversao?: string;
  tipoConversao?: TipoConversao;
  isbatizado?: boolean;
  endereco?: string;
  observacao?: string;
  dataUltimoContato?: string;
  dataNascimento?: string;
  tipo: TipoMembro;
  ativo: boolean;
}

export interface MembroJson {
  nome: string;
  telefone?: string;
  dataConversao?: string;
  tipoConversao?: TipoConversao;
  isbatizado?: boolean;
  endereco?: string;
  observacao?: string;
  dataUltimoContato?: string;
  dataNascimento?: string;
}
