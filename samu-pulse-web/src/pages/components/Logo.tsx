import React, {ImgHTMLAttributes} from 'react';

interface LogoProps extends ImgHTMLAttributes<HTMLImageElement> {
  className?: string;
  alt?: string;
}

export const Logo: React.FC<LogoProps> = ({
  className = 'w-12 h-12',
  alt = 'Logo Samu Pulse',
  ...props
}) => {
  return (
    <img
      src="/samu_pulse.svg"
      alt={alt}
      className={`object-contain ${className}`}
      {...props}
    />
  );
};
