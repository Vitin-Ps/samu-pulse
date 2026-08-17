import React, {InputHTMLAttributes} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {IconProp} from '@fortawesome/fontawesome-svg-core';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  iconLeft?: IconProp;
  iconRight?: IconProp;
  onIconRightClick?: () => void;
  onIconLeftClick?: () => void;
}

export const Input: React.FC<InputProps> = ({
  label,
  iconLeft,
  iconRight,
  onIconRightClick,
  onIconLeftClick,
  required,
  id,
  className = '',
  ...props
}) => {
  return (
    <div className={`w-full mb-5 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-samu-text mb-1.5" htmlFor={id}>
          {label} {required && <span className="text-samu-danger">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        {iconLeft && (
          <FontAwesomeIcon
            icon={iconLeft}
            onClick={onIconLeftClick}
            className={`absolute left-4 text-samu-neutral ${onIconLeftClick ? 'cursor-pointer hover:text-samu-primary' : ''}`}
          />
        )}

        <input
          id={id}
          required={required}
          className={`
            w-full rounded-xl border border-samu-border bg-samu-bg/30 py-3 text-samu-text outline-none 
            focus:border-samu-primary focus:ring-1 focus:ring-samu-primary transition-all
            disabled:opacity-60 disabled:cursor-not-allowed
            ${iconLeft ? 'pl-11' : 'px-4'}
            ${iconRight ? 'pr-11' : 'px-4'}
          `}
          {...props}
        />

        {iconRight && (
          <FontAwesomeIcon
            icon={iconRight}
            onClick={onIconRightClick}
            className={`absolute right-4 text-samu-neutral ${onIconRightClick ? 'cursor-pointer hover:text-samu-primary' : ''}`}
          />
        )}
      </div>
    </div>
  );
};
