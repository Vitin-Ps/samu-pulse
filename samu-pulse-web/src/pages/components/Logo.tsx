import React, {ImgHTMLAttributes, useState} from 'react';
import logo from '../../assets/samu-pulse-logo.png';
import Spinner from './Elements/Spinner';

interface LogoProps extends ImgHTMLAttributes<HTMLImageElement> {
  className?: string;
  alt?: string;
}

export const Logo: React.FC<LogoProps> = ({
  className = 'w-12 h-12',
  alt = 'Logo Samu Pulse',
  src = logo,
  onError,
  ...props
}) => {
  const [failedSrc, setFailedSrc] = useState<string>();
  if (failedSrc === src) return <span role="img" aria-label={alt} className={`inline-flex items-center justify-center ${className}`}><Spinner /></span>;
  return (
    <img
      src={src}
      alt={alt}
      className={`object-contain ${className}`}
      {...props}
      onError={event => { setFailedSrc(src); onError?.(event); }}
    />
  );
};
