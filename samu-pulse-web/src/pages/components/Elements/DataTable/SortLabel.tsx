import {faSortDown, faSortUp} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {FC, HTMLAttributes, ReactNode} from 'react';

interface TableSortLabelProps extends HTMLAttributes<HTMLDivElement> {
  active?: boolean;
  direction?: 'asc' | 'desc';
  children: ReactNode;
  onClick?: (e: any) => void;
}

export const SortLabel: FC<TableSortLabelProps> = ({
  active = false,
  direction = 'asc',
  children,
  onClick,
  ...props
}) => {
  return (
    <div
      className={`inline-flex items-center cursor-pointer font-semibold transition-colors uppercase tracking-wider ${
        active ? 'text-samu-primary' : 'text-samu-neutral hover:text-samu-text'
      }`}
      onClick={onClick}
      {...props}>
      {children}
      {active && (
        <span className="ml-2 text-sm transition-transform text-samu-primary">
          {direction === 'asc' ? (
            <FontAwesomeIcon icon={faSortUp} />
          ) : (
            <FontAwesomeIcon icon={faSortDown} />
          )}
        </span>
      )}
    </div>
  );
};
