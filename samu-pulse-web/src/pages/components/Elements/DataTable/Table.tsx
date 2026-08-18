import {FC, HTMLAttributes, ReactNode} from 'react';

interface TableProps extends HTMLAttributes<HTMLTableElement> {
  children: ReactNode;
}

interface SectionProps extends HTMLAttributes<HTMLTableSectionElement> {
  children: ReactNode;
}

interface RowProps extends HTMLAttributes<HTMLTableRowElement> {
  children: ReactNode;
}

interface ColumnProps extends HTMLAttributes<HTMLTableCellElement> {
  children: ReactNode;
  colSpan?: number;
  rowSpan?: number;
}

const Table: FC<TableProps> & {
  Head: FC<SectionProps>;
  HeadColumn: FC<ColumnProps>;
  Body: FC<SectionProps>;
  Row: FC<RowProps>;
  Column: FC<ColumnProps>;
} = ({children, className, ...props}) => {
  return (
    <div className="w-full overflow-x-auto min-h-100">
      <table
        className={`w-full text-left border-collapse whitespace-nowrap ${className}`}
        {...props}>
        {children}
      </table>
    </div>
  );
};

Table.Head = ({children, className, ...props}: SectionProps) => (
  <thead
    className={`bg-gray-50/80 border-b border-samu-border ${className}`}
    {...props}>
    {children}
  </thead>
);

Table.Body = ({children, className, ...props}: SectionProps) => (
  <tbody className={`divide-y divide-samu-border ${className}`} {...props}>
    {children}
  </tbody>
);

Table.Row = ({children, className, ...props}: RowProps) => (
  <tr className={`hover:bg-samu-bg/50 transition-colors group ${className}`} {...props}>
    {children}
  </tr>
);

Table.HeadColumn = ({children, className, colSpan, rowSpan, ...props}: ColumnProps) => (
  <th
    className={`px-8 py-4 text-xs font-semibold text-samu-neutral uppercase tracking-wider ${className}`}
    colSpan={colSpan}
    rowSpan={rowSpan}
    {...props}>
    {children}
  </th>
);

Table.Column = ({children, className, colSpan, rowSpan, ...props}: ColumnProps) => (
  <td
    className={`px-8 py-4 text-sm text-samu-text ${className}`}
    colSpan={colSpan}
    rowSpan={rowSpan}
    {...props}>
    {children}
  </td>
);

export default Table;
