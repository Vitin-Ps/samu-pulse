import React, {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import {MediaQuery} from '../interfaces/MediaQuery';

interface FunctionsProviderProps {
  windowWidth: number;
  screenSize: MediaQuery;
  loading: boolean;
  setLoading: (value: boolean) => void;
  progress: number | null;
  setProgress: (value: number | null) => void;
}

const Functions = createContext<FunctionsProviderProps>({} as FunctionsProviderProps);

export const FunctionsProvider = ({children}: {children: ReactNode}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
  const [screenSize, setScreenSize] = useState<MediaQuery>({
    sm: false,
    md: false,
    lg: false,
    xl: false,
    xl2: false,
  });

  useEffect(() => {
    const handleResize = () => {
      const newWindowWidth = window.innerWidth;
      setWindowWidth(newWindowWidth);

      const newSm = newWindowWidth >= 480;
      const newMd = newWindowWidth >= 768;
      const newLg = newWindowWidth >= 992;
      const newXl = newWindowWidth >= 1200;
      const newXl2 = newWindowWidth >= 1400;

      setScreenSize({
        sm: newSm,
        md: newMd,
        lg: newLg,
        xl: newXl,
        xl2: newXl2,
      });
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return (
    <Functions.Provider
      value={{windowWidth, screenSize, loading, setLoading, progress, setProgress}}>
      {children}
    </Functions.Provider>
  );
};

export const useFunctionsProvider = () => {
  const context = useContext(Functions);
  if (!context) {
    throw new Error(
      'useFunctionsProvider deve ser usado dentro de um FunctionsProviderProvider',
    );
  }
  return context;
};
