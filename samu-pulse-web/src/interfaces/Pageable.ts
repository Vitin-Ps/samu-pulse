export interface Response<T> {
  message?: string;
  content: T;
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  pageable: Pageable;
  size: number;
  sort: SortInfo;
  totalElements: number;
  totalPages: number;
}

interface SortInfo {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: SortInfo;
  offset: number;
  unpaged: boolean;
  paged: boolean;
}
