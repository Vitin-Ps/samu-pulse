import React, {RefObject} from 'react';
import {Option} from '../../../interfaces/Option';

interface SelectProps {
  label?: string;
  setValor?: (valor: any) => void;
  onInput?: (valor: any) => void;
  onKeyDown?: (valor: any) => void;
  inputRef?: RefObject<HTMLSelectElement>;
  valor?: any;
  obrigatorio?: boolean;
  onMouseDown?: (valor: any) => void;
  onBlur?: (valor: any) => void;
  onFocus?: (valor: any) => void;
  width?: string;
  data: Option[];
  flexDirection?: string;
  optionDefaultShow?: boolean;
  classLabel?: string;
  classSelect?: string;
}

const Select: React.FC<SelectProps> = ({
  label,
  setValor,
  valor,
  onInput,
  onKeyDown,
  inputRef,
  obrigatorio = false,
  data,
  onMouseDown,
  onFocus,
  onBlur,
  width,
  flexDirection = 'col',
  optionDefaultShow = true,
  classLabel,
  classSelect,
}) => {
  return (
    <div
      className={`flex flex-${flexDirection} gap-2 font-poppins`}
      style={{
        width: width ? width : '100%',
        alignItems: flexDirection === 'row' ? 'center' : 'start',
      }}>
      {label && (
        <label
          className={`font-medium text-sm md:text-base ${classLabel ? classLabel : 'text-samu-text'}`}>
          {label} {obrigatorio && <span className="text-samu-danger">*</span>}
        </label>
      )}
      <select
        className={`w-full bg-white transition-all outline-none ${
          classSelect
            ? classSelect
            : 'px-4 py-2.5 rounded-xl border border-samu-border text-samu-text text-sm focus:border-samu-primary focus:ring-1 focus:ring-samu-primary'
        }`}
        onChange={e => setValor && setValor(e.target.value)}
        onInput={e => onInput && onInput((e.target as HTMLSelectElement).value)}
        onKeyDown={e => onKeyDown && onKeyDown(e)}
        required={obrigatorio}
        value={valor ?? ''}
        ref={inputRef}
        onMouseDown={onMouseDown}
        onFocus={onFocus}
        onBlur={onBlur}>
        {optionDefaultShow && (
          <option value="" disabled>
            Selecione
          </option>
        )}
        {data &&
          data.length > 0 &&
          data.map((option, index) => (
            <option key={index} value={option.value}>
              {option.text}
            </option>
          ))}
      </select>
    </div>
  );
};

export default Select;
