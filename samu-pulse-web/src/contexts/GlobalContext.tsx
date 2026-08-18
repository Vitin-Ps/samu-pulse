import {ReactNode} from 'react';
import {FunctionsProvider} from './FunctionsProvider';

interface GlobalProviderProps {
  children: ReactNode;
}

export const GlobalContext = ({children}: GlobalProviderProps) => {
  return <FunctionsProvider>{children}</FunctionsProvider>;
};
