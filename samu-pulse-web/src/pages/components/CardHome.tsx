import {IconProp} from '@fortawesome/fontawesome-svg-core';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {FC} from 'react';
import {useNavigate} from 'react-router-dom';

interface CardHomeProps {
  title: string;
  description: string;
  link: string;
  icon?: IconProp;
}

const CardHome: FC<CardHomeProps> = ({title, description, link, icon}) => {
  const navigate = useNavigate();
  return (
    <div
      id={`card-${title.toLowerCase().replace(/\s+/g, '-')}`}
      className="bg-white rounded-3xl p-10 sm:p-14 flex flex-col items-center justify-center text-center shadow-sm border border-samu-border cursor-pointer aspect-square max-h-100 hover:shadow-md hover:border-samu-primary transition-all duration-300"
      onClick={() => navigate(link)}>
      {icon && (
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-samu-primary-lighter text-samu-primary flex items-center justify-center text-4xl sm:text-5xl mb-8">
          <FontAwesomeIcon icon={icon} />
        </div>
      )}
      <h2 className="text-2xl font-semibold mb-3 text-samu-text">{title}</h2>
      <p className="text-samu-neutral text-sm sm:text-base leading-relaxed max-w-50">
        {description}
      </p>
    </div>
  );
};

export default CardHome;
