import { useState, useCallback } from 'react';

interface UseSearchState<T> {
  results: T[];
  loading: boolean;
  error: string | null;
  query: string;
  setQuery: (q: string) => void;
  search: (q: string) => Promise<void>;
  clear: () => void;
}

/**
 * Hook para manejo de búsquedas con estado.
 *
 * @param searcher - Función async que recibe el query y retorna resultados
 */
export function useSearch<T>(
  searcher: (query: string) => Promise<T[]>,
): UseSearchState<T> {
  const [results, setResults] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQueryState] = useState('');

  const search = useCallback(
    async (q: string) => {
      if (!q.trim()) {
        setResults([]);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const data = await searcher(q);
        setResults(data);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'Error en la búsqueda';
        setError(message);
        setResults([]);
      } finally {
        setLoading(false);
      }
    },
    [searcher],
  );

  const setQuery = useCallback((q: string) => {
    setQueryState(q);
  }, []);

  const clear = useCallback(() => {
    setResults([]);
    setQueryState('');
    setError(null);
  }, []);

  return { results, loading, error, query, setQuery, search, clear };
}
