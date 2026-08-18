import React from 'react';
import ReactSelect, {
  components,
  OptionProps,
  SingleValueProps,
  StylesConfig,
} from 'react-select';
import {Option} from '../../../interfaces/Option';

export interface OptionWithIcon extends Option {
  icon?: React.ReactNode;
}

interface SelectWithElementProps {
  label?: string;
  setValor?: (valor: any) => void;
  valor?: any;
  obrigatorio?: boolean;
  data: OptionWithIcon[];
  width?: string;
  classLabel?: string;
  classSelect?: string;
  placeholder?: string;
  noOptionsMessage?: () => string;
  maxMenuHeight?: number;
}

const CustomOption: React.FC<OptionProps<OptionWithIcon, false>> = props => (
  <components.Option {...props}>
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center gap-2">
        {props.data.icon && (
          <span className="text-samu-primary">{props.data.icon}</span>
        )}
        <span className="text-sm text-samu-text">{props.data.text}</span>
      </div>
    </div>
  </components.Option>
);

const CustomSingleValue: React.FC<SingleValueProps<OptionWithIcon, false>> = props => (
  <components.SingleValue {...props}>
    <div className="flex items-center gap-2">
      {props.data.icon && <span className="text-samu-primary">{props.data.icon}</span>}
      <span className="text-sm text-samu-text">{props.data.text}</span>
    </div>
  </components.SingleValue>
);

// Configuração de estilos customizados para alinhar com o design system do SAMU
const customStyles: StylesConfig<OptionWithIcon, false> = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: '#ffffff',
    borderColor: state.isFocused ? '#2563eb' : '#e5e7eb', // Ajuste para a cor primária ou borda padrão
    borderRadius: '0.75rem', // Equivalente a rounded-xl
    padding: '2px 4px',
    boxShadow: 'none',
    '&:hover': {
      borderColor: '#2563eb',
    },
    cursor: 'pointer',
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? '#eff6ff' // azul claro leve
      : state.isFocused
        ? '#f9fafb' // cinza bem claro no hover
        : '#ffffff',
    color: '#1f2937',
    cursor: 'pointer',
    padding: '10px 12px',
  }),
  menu: provided => ({
    ...provided,
    borderRadius: '0.75rem',
    overflow: 'hidden',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb',
    zIndex: 30,
  }),
  placeholder: provided => ({
    ...provided,
    color: '#9ca3af',
    fontSize: '0.875rem',
  }),
  singleValue: provided => ({
    ...provided,
    fontSize: '0.875rem',
  }),
};

const SelectWithElement: React.FC<SelectWithElementProps> = ({
  label,
  setValor,
  valor,
  obrigatorio = false,
  data,
  width,
  classLabel,
  classSelect,
  placeholder = 'Selecione',
  noOptionsMessage,
  maxMenuHeight = 200,
}) => {
  return (
    <div
      className="flex flex-col gap-2 font-poppins"
      style={{width: width ? width : '100%'}}>
      {label && (
        <label
          className={`font-medium text-sm md:text-base ${classLabel ? classLabel : 'text-samu-text'}`}>
          {label} {obrigatorio && <span className="text-samu-danger">*</span>}
        </label>
      )}
      <ReactSelect
        className={classSelect}
        styles={customStyles}
        options={data}
        value={data.find(opt => opt.value === valor) || null}
        onChange={selected => setValor && setValor(selected ? selected.value : '')}
        placeholder={placeholder}
        isClearable={!obrigatorio}
        components={{Option: CustomOption, SingleValue: CustomSingleValue}}
        getOptionLabel={option => String(option.text ?? '')}
        getOptionValue={option => option.value}
        noOptionsMessage={noOptionsMessage ?? (() => 'Nenhuma opção encontrada')}
        maxMenuHeight={maxMenuHeight}
      />
    </div>
  );
};

export default SelectWithElement;
