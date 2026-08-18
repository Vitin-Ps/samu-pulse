import {FC} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {IconDefinition} from '@fortawesome/fontawesome-svg-core';
import {faUser} from '@fortawesome/free-solid-svg-icons';

interface AvatarProps {
  imageUrl?: string | null;
  baseUrlImage?: string;
  altText?: string;
  sizeClass?: string;
  iconClass?: string;
  fallbackIcon?: IconDefinition;
  onClick?: () => void;
}

export const Avatar: FC<AvatarProps> = ({
  imageUrl,
  baseUrlImage = '',
  altText = 'Foto de perfil',
  sizeClass = 'w-40 h-40',
  iconClass = 'text-3xl md:text-5xl',
  fallbackIcon = faUser,
  onClick,
}) => {
  return (
    <div
      className={`relative ${sizeClass} rounded-full overflow-hidden border-4 border-samu-primary shadow-lg shrink-0`}
      onClick={onClick ? onClick : undefined}>
      {imageUrl ? (
        <img
          className="w-full h-full object-cover"
          src={`${baseUrlImage}${imageUrl}`}
          alt={altText}
        />
      ) : (
        <div className="bg-gray-200 w-full h-full flex justify-center items-center">
          <FontAwesomeIcon
            icon={fallbackIcon}
            className={`text-gray-400 ${iconClass}`}
          />
        </div>
      )}
    </div>
  );
};
