import React, {ButtonHTMLAttributes} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {IconProp} from '@fortawesome/fontawesome-svg-core';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  icon?: IconProp;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  icon,
  className = '',
  ...props
}) => {
  const baseStyle =
    'px-6 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto active:scale-95 duration-200';

  const variants = {
    primary: 'bg-samu-primary text-white hover:bg-samu-primary-dark shadow-sm',
    secondary: 'border border-samu-border text-samu-text hover:bg-samu-bg',
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {icon && (
        <FontAwesomeIcon
          icon={icon}
          className={variant === 'primary' ? 'text-sm' : 'text-sm text-samu-neutral'}
        />
      )}
      {children}
    </button>
  );
};
