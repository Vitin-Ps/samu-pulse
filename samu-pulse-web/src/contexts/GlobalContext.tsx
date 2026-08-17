import React, {Children, ReactNode} from 'react';
import {FunctionsProvider} from './FunctionsProvider';

interface GlobalProviderProps {
  children: ReactNode;
}

const GlobalContext = ({children}: GlobalProviderProps) => {
  return <FunctionsProvider>{children}</FunctionsProvider>;
};

export default GlobalContext;
