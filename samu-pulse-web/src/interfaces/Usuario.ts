export enum TipoUsuario {
  ADMIN = 'ADMIN',
  LIDER = 'LIDER',
  USER = 'USER',
}

export interface Usuario {
  id?: number;
  login?: string;
  senha?: string;
  tipoUsuario: TipoUsuario;
}

export interface UsuarioAlteracaoJson {
  id?: number;
  login?: string;
  perfilResponsavel?: string;
}
