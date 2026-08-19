import React, {ChangeEvent} from 'react';
import {allColors, getColor} from '../../../interfaces/Colors';

interface InputCheckBoxProps {
  size?: number;
  cor?: string;
  setChecked?: (checked: boolean, value: any) => void;
  checked?: boolean;
  valor?: any;
  disabled?: boolean;
}

const InputCheckBox: React.FC<InputCheckBoxProps> = ({
  valor,
  size = 2,
  disabled = false,
  checked = false,
  setChecked,
  cor = getColor('VeryDarkYellow'),
}) => {
  const handleChecked = (e: ChangeEvent<HTMLInputElement>) => {
    if (setChecked) {
      setChecked(e.target.checked, valor || e.target.value);
    }
  };

  return (
    <label
      className={`flex items-center w-fit ${
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:opacity-80'
      } transition-opacity duration-200`}>
      {/* sr-only (Screen Reader Only) esconde o input visualmente, mas mantém ele acessível para navegação por teclado, diferente do 'hidden' */}
      <input
        type="checkbox"
        checked={checked}
        onChange={handleChecked}
        value={valor}
        className="sr-only"
        disabled={disabled}
      />

      {/* Caixa do Checkbox */}
      <div
        className="relative flex items-center justify-center border-2 rounded transition-all duration-200 ease-in-out shadow-sm"
        style={{
          width: `${size * 10}px`,
          height: `${size * 10}px`,
          backgroundColor: checked ? cor : '#FFF',
          borderColor: checked ? cor : allColors['cinza-tema'] || '#d1d5db',
          marginRight: `${size * 4}px`,
        }}>
        {/* Ícone SVG com animação de escala e opacidade via Tailwind */}
        <svg
          className={`w-4/5 h-4/5 text-white transition-all duration-200 ease-in-out ${
            checked ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
    </label>
  );
};

export default InputCheckBox;
