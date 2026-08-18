import React from 'react';

interface ProgressBarAnimationProps {
  duration: number; // Duração em milissegundos
  carregar?: boolean;
  corBarra?: string;
  corFundoBarra?: string;
  paused?: boolean;
}

export const ProgressBarAnimation: React.FC<ProgressBarAnimationProps> = ({
  duration,
  corBarra = 'bg-samu-primary', // Azul principal do tema por padrão
  corFundoBarra = 'bg-samu-border', // Fundo discreto do tema por padrão
  carregar = true,
  paused = false,
}) => {
  return (
    <div
      className={`relative w-full h-2 rounded-full overflow-hidden ${corFundoBarra}`}>
      <div
        className={`h-full rounded-full ${corBarra}`}
        style={{
          animation: carregar
            ? `carregaProgress ${duration / 1000}s ease-out forwards`
            : `descarregaProgress ${duration / 1000}s ease-out forwards`,
          animationPlayState: paused ? 'paused' : 'running',
        }}
      />
    </div>
  );
};
