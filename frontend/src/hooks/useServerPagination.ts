import { useState, useEffect, useCallback, useRef } from 'react';
import type { PaginatedResponse, PaginationParams } from '@/interfaces';

interface UseServerPaginationOptions<T> {
  fetcher: (params: PaginationParams, signal: AbortSignal) => Promise<PaginatedResponse<T>>;
  initialPageSize?: number;
  deps?: unknown[];
}

interface UseServerPaginationReturn<T> {
  items: T[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
  search: string;
  sortBy: string | undefined;
  order: 'asc' | 'desc';
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setSearch: (search: string) => void;
  setSortBy: (field: string, order?: 'asc' | 'desc') => void;
  refetch: () => void;
}

/**
 * Hook para paginación server-side con búsqueda, ordenamiento y cancelación de peticiones.
 */
export function useServerPagination<T>({
  fetcher,
  initialPageSize = 20,
  deps = [],
}: UseServerPaginationOptions<T>): UseServerPaginationReturn<T> {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSizeState] = useState(initialPageSize);
  const [search, setSearchState] = useState('');
  const [sortBy, setSortByState] = useState<string | undefined>(undefined);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [trigger, setTrigger] = useState(0);

  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);

  const abortRef = useRef<AbortController | null>(null);

  const refetch = useCallback(() => setTrigger((n) => n + 1), []);

  useEffect(() => {
    // Cancel previous request
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    const params: PaginationParams = {
      page: currentPage,
      page_size: pageSize,
      search: search || undefined,
      sort_by: sortBy,
      order,
    };

    fetcher(params, controller.signal)
      .then((result) => {
        if (!controller.signal.aborted) {
          setItems(result.items);
          setTotalItems(result.total_items);
          setTotalPages(result.total_pages);
          setHasNext(result.has_next);
          setHasPrevious(result.has_previous);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!controller.signal.aborted) {
          const message =
            err instanceof Error ? err.message : 'Error al cargar los datos';
          setError(message);
          setLoading(false);
        }
      });

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize, search, sortBy, order, trigger, ...deps]);

  const setPage = useCallback((page: number) => {
    setCurrentPage(Math.max(1, page));
  }, []);

  const setPageSize = useCallback((size: number) => {
    setPageSizeState(size);
    setCurrentPage(1);
  }, []);

  const setSearch = useCallback((newSearch: string) => {
    setSearchState(newSearch);
    setCurrentPage(1);
  }, []);

  const setSortBy = useCallback((field: string, newOrder: 'asc' | 'desc' = 'asc') => {
    setSortByState(field);
    setOrder(newOrder);
    setCurrentPage(1);
  }, []);

  return {
    items,
    loading,
    error,
    currentPage,
    totalPages,
    totalItems,
    pageSize,
    hasNext,
    hasPrevious,
    search,
    sortBy,
    order,
    setPage,
    setPageSize,
    setSearch,
    setSortBy,
    refetch,
  };
}
