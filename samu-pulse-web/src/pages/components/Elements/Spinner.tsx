import React, {FC, useId} from 'react';

interface SpinnerProps {
  size?: number; // Multiplicador de tamanho. Padrão: 1 (35px)
  colorInit?: string;
  colorFinal?: string;
}

const Spinner: FC<SpinnerProps> = ({
  size = 1,
  colorInit = 'var(--color-samu-primary, #2587D7)',
  colorFinal = 'var(--color-samu-primary-light, #5AA7E2)',
}) => {  
  const gradientId = useId();

  // Cálculos dinâmicos baseados no tamanho
  const svgSize = size * 35;
  const center = svgSize / 2;
  const strokeWidth = size * 4;
  const radius = center - strokeWidth / 2; // Garante que a borda não corte
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * 0.25; // Deixa 25% do círculo "vazio"

  return (
    <svg
      className="animate-spin" // Classe nativa do Tailwind para girar
      style={{width: `${svgSize}px`, height: `${svgSize}px`}}
      viewBox={`0 0 ${svgSize} ${svgSize}`}
      xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colorInit} />
          <stop offset="100%" stopColor={colorFinal} />
        </linearGradient>
      </defs>
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="transparent"
        stroke={`url(#${gradientId})`}
        strokeWidth={strokeWidth}
        strokeLinecap="round" // Deixa a ponta da linha arredondada
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        className="transition-all duration-300 ease-in-out"
      />
    </svg>
  );
};

export default Spinner;
