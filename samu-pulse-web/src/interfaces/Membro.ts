export enum TipoConversao {
  RECONCILIANDO = 'RECONCILIANDO',
  ACEITANDO = 'ACEITANDO',
}

export enum TipoMembro {
  MEMBRO = 'MEMBRO',
  NOVO_CONVERTIDO = 'NOVO_CONVERTIDO',
}

export enum StatusMembro {
  DISTANTE = 'DISTANTE',
  ATIVO = 'ATIVO',
  AFASTADO = 'AFASTADO',
  OUTRA_IGREJA = 'OUTRA_IGREJA',
}

export interface Membro {
  id: number;
  nome: string;
  telefone?: string;
  dataConversao?: string;
  tipoConversao?: TipoConversao;
  isbatizado?: boolean;
  endereco?: string;
  observacao?: string;
  dataUltimoContato?: string;
  dataNascimento?: string;
  imagemUrl?: string;
  status: StatusMembro;
  tipo: TipoMembro; 
}

export interface MembroJson {
  id?: number;
  nome: string;
  status: StatusMembro;
  telefone?: string;
  dataConversao?: string;
  tipoConversao?: TipoConversao;
  isbatizado?: boolean;
  endereco?: string;
  observacao?: string;
  dataUltimoContato?: string;
  dataNascimento?: string;
}
