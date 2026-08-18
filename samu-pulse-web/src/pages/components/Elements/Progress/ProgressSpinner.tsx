import React, {FC} from 'react';
import {CircularProgress} from '@mui/material';

interface ProgressSpinnerProps {
  progress: number;
  size?: number;
  thickness?: number;
  colorProgress?: string;
  colorBackground?: string;
  strokeRounded?: boolean;
  classNumberProgress?: string;
}

export const ProgressSpinner: FC<ProgressSpinnerProps> = ({
  progress,
  colorBackground = 'var(--color-samu-border, #DDE9E8)', // Fundo clarinho por padrão
  colorProgress = 'var(--color-samu-primary, #2587D7)', // Azul principal por padrão
  classNumberProgress = 'text-samu-text text-sm', // Texto escuro por padrão
  thickness = 3,
  size = 40,
  strokeRounded = true,
}) => {
  // Garante que o progresso fique sempre entre 0 e 100
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className="relative inline-flex items-center justify-center">
      {/* Círculo de fundo (trilho) */}
      <CircularProgress
        variant="determinate"
        sx={{color: colorBackground}}
        size={size}
        value={100}
        thickness={thickness}
      />

      {/* Círculo de progresso */}
      <CircularProgress
        variant="determinate"
        value={clampedProgress}
        size={size}
        thickness={thickness}
        sx={{
          color: colorProgress,
          position: 'absolute',
          left: 0,
          // Deixa as pontas arredondadas de forma suave
          [`& .MuiCircularProgress-circle`]: {
            strokeLinecap: strokeRounded ? 'round' : 'inherit',
          },
        }}
      />

      {/* Porcentagem no centro */}
      <p
        className={`font-bold absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center ${classNumberProgress}`}>
        {Math.round(clampedProgress)}%
      </p>
    </div>
  );
};
