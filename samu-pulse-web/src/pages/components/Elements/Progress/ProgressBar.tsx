import React, {FC} from 'react';

interface ProgressBarProps {
  progress?: number;
  colorBackground?: string;
  colorProgress?: string;
  classNumberProgress?: string;
}

export const ProgressBar: FC<ProgressBarProps> = ({
  progress = 0,
  colorBackground = 'bg-samu-border', // Fundo cinza/azulado bem claro da nova paleta
  colorProgress = 'bg-samu-primary', // Azul principal
  classNumberProgress = 'text-samu-text', // Cinza escuro para contraste
}) => {
  // Garante que a barra não passe de 100% nem seja menor que 0%
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div
      className={`relative mt-4 rounded-full h-4 ${colorBackground} overflow-hidden shadow-inner`}>
      <div
        className={`h-full rounded-full transition-all duration-300 ease-out ${colorProgress}`}
        style={{width: `${clampedProgress}%`}}></div>
      <p
        className={`text-[10px] font-bold absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${classNumberProgress}`}>
        {clampedProgress}%
      </p>
    </div>
  );
};
