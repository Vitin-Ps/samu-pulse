import React, {FC, HTMLAttributes} from 'react';

interface LabelDisplayedRowsArgs {
  from: number;
  to: number;
  count: number;
  page: number;
}

interface PaginationProps extends HTMLAttributes<HTMLDivElement> {
  count: number;
  rowsPerPage: number;
  page: number;
  onPageChange: (event: React.MouseEvent<HTMLButtonElement>, page: number) => void;
  onRowsPerPageChange?: React.ChangeEventHandler<HTMLSelectElement>;
  rowsPerPageOptions?: ReadonlyArray<number | {value: number; label: string}>;
  labelRowsPerPage?: React.ReactNode;
  labelDisplayedRows?: (paginationInfo: LabelDisplayedRowsArgs) => React.ReactNode;
  backIconButtonProps?: {icon: React.ReactNode};
  nextIconButtonProps?: {icon: React.ReactNode};
}

const TablePagination: FC<PaginationProps> = ({
  count,
  rowsPerPage,
  page,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPageOptions = [10, 25, 50],
  labelRowsPerPage,
  labelDisplayedRows,
  backIconButtonProps,
  nextIconButtonProps,
  ...props
}) => {
  const totalPages = count === 0 ? 1 : Math.ceil(count / rowsPerPage);
  const from = count === 0 ? 0 : page * rowsPerPage + 1;
  const to = Math.min((page + 1) * rowsPerPage, count);

  return (
    <section className="px-8 py-4 border-t border-samu-border bg-white flex flex-col sm:flex-row items-center justify-between gap-4 mt-auto w-full rounded-b-3xl">
      <div className="flex items-center gap-3">
        {onRowsPerPageChange && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-samu-neutral font-medium">
              {labelRowsPerPage}
            </span>
            <select
              className="px-2 py-1 bg-white border border-samu-border text-samu-text text-sm rounded-lg outline-none focus:border-samu-primary"
              value={rowsPerPage}
              onChange={onRowsPerPageChange}>
              {rowsPerPageOptions.map(option =>
                typeof option === 'number' ? (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ) : (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ),
              )}
            </select>
          </div>
        )}
        <span className="text-sm text-samu-neutral font-medium">
          {labelDisplayedRows
            ? labelDisplayedRows({from, to, count, page})
            : `Página ${page + 1} de ${totalPages}`}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          className={`w-9 h-9 flex items-center justify-center rounded-lg border border-samu-border transition-colors ${
            page === 0
              ? 'text-samu-neutral opacity-50 cursor-not-allowed'
              : 'text-samu-text hover:bg-gray-50 hover:text-samu-primary cursor-pointer'
          }`}
          onClick={e => onPageChange(e, page - 1)}
          disabled={page === 0}>
          {backIconButtonProps?.icon}
        </button>
        <button
          className={`w-9 h-9 flex items-center justify-center rounded-lg border border-samu-border transition-colors ${
            page >= totalPages - 1
              ? 'text-samu-neutral opacity-50 cursor-not-allowed'
              : 'text-samu-text hover:bg-gray-50 hover:text-samu-primary cursor-pointer'
          }`}
          onClick={e => onPageChange(e, page + 1)}
          disabled={page >= totalPages - 1}>
          {nextIconButtonProps?.icon}
        </button>
      </div>
    </section>
  );
};

export default TablePagination;
