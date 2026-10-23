import {StatusMembro} from './StatusMembro';

export enum TipoConversao {
  RECONCILIANDO = 'RECONCILIANDO',
  ACEITANDO = 'ACEITANDO',
}

export enum TipoMembro {
  MEMBRO = 'MEMBRO',
  NOVO_CONVERTIDO = 'NOVO_CONVERTIDO',
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
  cod_status: number | null;
  status: StatusMembro | null;
  tipo: TipoMembro; 
}

export interface MembroJson {
  id?: number;
  nome: string;
  cod_status: number | null;
  telefone?: string;
  dataConversao?: string;
  tipoConversao?: TipoConversao;
  isbatizado?: boolean;
  endereco?: string;
  observacao?: string;
  dataUltimoContato?: string;
  dataNascimento?: string;
}
