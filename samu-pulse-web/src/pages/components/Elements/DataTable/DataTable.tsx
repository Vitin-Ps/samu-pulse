import {FC, ReactNode, useEffect, useState} from 'react';
import {SortLabel} from './SortLabel';
import TableToolBar from './TableToolBar';
import TablePagination from './TablePagination';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowLeft, faArrowRight, faBoxOpen} from '@fortawesome/free-solid-svg-icons';
import Table from './Table';
import {
  removerAcentuacoes,
  replaceSpaceWithCharacter,
} from '../../../../services/Extra/FuncionalidadesService';
import Spinner from '../Spinner';

export enum Order {
  ASC = 'asc',
  DESC = 'desc',
}

export interface Data {
  acoes: any;
}

interface HeadCell {
  disablePadding?: boolean;
  id?: keyof Data | any;
  label: string;
  numeric?: boolean;
}

interface DataTableProps {
  headColumns: any[];
  rows: any[];
  loading: boolean;
  formatRows: any;
  placeholderSearch?: string;
  onRefresh?: () => void;
  titleTable?: string;
  router?: string;
  otherFilters?: ReactNode;
  additionalButtonsContainer?: ReactNode;
  showToolBar?: boolean;
  search: string;
  countRows: number;
  page: number;
  noDataMessage?: string;
  handleRowsPerPage?: (value: number) => void;
  handleSearch?: (value: string) => Promise<void>;
  handleChangeRowsPerPage?: (value: number) => Promise<void>;
  handleChangePage?: (value: number) => Promise<void>;
  handleRequestSort?: (value: string) => Promise<void>;
  rowsPerPageOptions?: number[];
  rowsPerPage: number;
  order: Order;
  orderBy: string;
}

interface MountedTableHeaderProps {
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
  headColumns?: HeadCell[];
}

const DataTable: FC<DataTableProps> = ({
  headColumns,
  rows,
  loading,
  formatRows,
  placeholderSearch,
  router,
  titleTable,
  countRows,
  search,
  page,
  otherFilters,
  additionalButtonsContainer,
  noDataMessage,
  showToolBar = true,
  rowsPerPageOptions = [5, 10, 25, 50, 100],
  rowsPerPage,
  handleChangeRowsPerPage,
  onRefresh,
  handleSearch,
  handleChangePage,
  handleRequestSort,
  order,
  orderBy,
}) => {
  const [loadedRows, setLoadedRows] = useState<boolean>(false);
  const [notEnoughCharacters, setNotEnoughCharacters] = useState<boolean>(false);
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    setLoadedRows(true);
    setResults(rows);
    setLoadedRows(false);
  }, [rows, order, orderBy]);

  const MountedTableHeader = (props: MountedTableHeaderProps) => {
    const {order, orderBy, onRequestSort, headColumns} = props;
    const createSortHandler =
      (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
        onRequestSort(event, property);
      };

    return (
      <Table.Head>
        <Table.Row>
          {headColumns?.map(headCell => (
            <Table.HeadColumn
              key={
                headCell.id !== 'none'
                  ? headCell.id
                  : `${replaceSpaceWithCharacter(removerAcentuacoes(headCell.label), '-')}-${headCell.id}`
              }>
              {headCell.id !== 'none' ? (
                <SortLabel
                  active={orderBy === headCell.id}
                  direction={orderBy === headCell.id ? order : 'asc'}
                  onClick={createSortHandler(headCell?.id)}>
                  {headCell.label}
                </SortLabel>
              ) : (
                <p className="cursor-not-allowed font-semibold">{headCell.label}</p>
              )}
            </Table.HeadColumn>
          ))}
        </Table.Row>
      </Table.Head>
    );
  };

  const handleSearchInDataTable = async (value: string) => {
    if (value && value.length < 3) {
      setNotEnoughCharacters(true);
    } else {
      setNotEnoughCharacters(false);
      handleSearch && (await handleSearch(value));
    }
  };

  return (
    <div className="w-full bg-white rounded-3xl shadow-sm border border-samu-border flex flex-col">
      {showToolBar && (
        <TableToolBar
          onRefresh={onRefresh}
          search={search}
          router={router}
          titleTable={titleTable}
          placeholderSearch={placeholderSearch}
          handleSearch={handleSearchInDataTable}
          additionalButtonsContainer={additionalButtonsContainer}
          loading={loadedRows}
          setLoading={setLoadedRows}
        />
      )}

      {otherFilters && (
        <div className="px-8 py-4 border-b border-samu-border">{otherFilters}</div>
      )}

      {!loadedRows ? (
        !notEnoughCharacters ? (
          <>
            <Table>
              <MountedTableHeader
                order={order}
                orderBy={orderBy}
                onRequestSort={(e, property) =>
                  handleRequestSort && handleRequestSort(property)
                }
                rowCount={countRows}
                headColumns={headColumns}
              />
              <Table.Body>
                {loading ? (
                  <Table.Row>
                    <Table.Column colSpan={headColumns.length}>
                      <div className="flex justify-center items-center py-8">
                        <Spinner />
                      </div>
                    </Table.Column>
                  </Table.Row>
                ) : results && results.length > 0 ? (
                  results.map((row: any) => formatRows(row, `enhanced-table-checkbox-`))
                ) : (
                  <Table.Row>
                    <Table.Column colSpan={headColumns.length}>
                      {/* Empty State visual do Samu Pulse */}
                      <div className="flex flex-col items-center justify-center py-16 text-center">
                        <FontAwesomeIcon
                          icon={faBoxOpen}
                          className="text-5xl text-samu-border mb-4"
                        />
                        <h3 className="text-lg font-medium text-samu-text">
                          Nenhum dado encontrado
                        </h3>
                        <p className="text-sm text-samu-neutral max-w-sm mt-1">
                          {noDataMessage ||
                            'Não conseguimos encontrar registros para a pesquisa informada.'}
                        </p>
                      </div>
                    </Table.Column>
                  </Table.Row>
                )}
              </Table.Body>
            </Table>

            <TablePagination
              labelRowsPerPage={'Qtd. por página'}
              labelDisplayedRows={({from, to, count}) => `${from}-${to} de ${count}`}
              rowsPerPageOptions={rowsPerPageOptions}
              count={countRows}
              rowsPerPage={rowsPerPage}
              page={page}
              backIconButtonProps={{icon: <FontAwesomeIcon icon={faArrowLeft} />}}
              nextIconButtonProps={{icon: <FontAwesomeIcon icon={faArrowRight} />}}
              onPageChange={(e, page) =>
                handleChangePage && handleChangePage(Number(page))
              }
              onRowsPerPageChange={e =>
                handleChangeRowsPerPage &&
                handleChangeRowsPerPage(Number(e.target.value))
              }
            />
          </>
        ) : (
          <div className="w-full py-16 text-center text-samu-neutral">
            <p>Digite ao menos 3 caracteres para pesquisar...</p>
          </div>
        )
      ) : (
        <div className="w-full py-16 flex justify-center items-center">
          <Spinner />
        </div>
      )}
    </div>
  );
};

export default DataTable;
