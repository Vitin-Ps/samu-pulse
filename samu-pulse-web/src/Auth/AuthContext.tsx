import {createContext} from 'react';
import {Usuario} from '../interfaces/Usuario';

export type AuthContentType = {
  user: Usuario | null;
  signin: (login: string, senha: string, lembrar: boolean) => Promise<boolean>;
  signout: (rota?: string) => void;
};

export const AuthContext = createContext<AuthContentType>(null!);
