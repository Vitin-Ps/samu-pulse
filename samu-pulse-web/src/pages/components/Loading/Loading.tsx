import React, {FC, useEffect} from 'react';
import {CircularProgress} from '@mui/material';
import {useFunctionsProvider} from '../../../contexts';
import {Logo} from '../Logo'; // ⚠️ Ajuste o caminho de importação conforme a sua pasta

interface LoadingProps {
  title?: string;
  text?: string;
}

export const Loading: FC<LoadingProps> = ({title, text}) => {
  const {loading, progress} = useFunctionsProvider();

  useEffect(() => {
    // Trava o scroll da página enquanto o loading estiver ativo
    if (loading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [loading]);

  if (!loading) return null;

  return (
    <div className="fixed top-0 left-0 w-screen h-screen z-9999 flex justify-center items-center bg-white/70 backdrop-blur-md">
      <div className="text-center flex flex-col items-center">
        {/* Container do Ícone / Progresso */}
        <div
          className={`w-24 h-24 mb-6 flex items-center justify-center ${!progress ? 'animate-pulse' : 'animate-none'}`}>
          {progress ? (
            <div className="relative inline-flex items-center justify-center">
              {/* Trilho do fundo */}
              <CircularProgress
                variant="determinate"
                sx={{color: 'var(--color-samu-border, #DDE9E8)'}}
                size={80}
                value={100}
                thickness={3}
              />

              {/* Progresso atual */}
              <CircularProgress
                variant="determinate"
                value={progress}
                size={80}
                thickness={3}
                sx={{
                  color: 'var(--color-samu-primary, #2587D7)',
                  position: 'absolute',
                  left: 0,
                  [`& .MuiCircularProgress-circle`]: {strokeLinecap: 'round'},
                }}
              />
              <p className="font-bold text-samu-primary text-sm absolute">
                {Math.round(progress)}%
              </p>
            </div>
          ) : (
            // Usa a sua nova Logo dinâmica em vez da tesoura!
            <Logo className="w-20 h-20 drop-shadow-md" alt="Carregando..." />
          )}
        </div>

        {/* Textos */}
        <h2 className="text-samu-text font-bold text-xl mb-2 animate-pulse">
          {title || 'Carregando...'}
        </h2>
        <p className="text-samu-text/70 text-sm max-w-62.5">
          {text || 'Aguarde enquanto processamos as informações'}
        </p>
      </div>
    </div>
  );
};
('');
