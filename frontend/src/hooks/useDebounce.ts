import { useState, useEffect } from 'react';

/**
 * Hook que retarda la actualización de un valor por `delay` ms.
 * Útil para evitar peticiones en cada tecla en búsquedas.
 */
export function useDebounce<T>(value: T, delay = 350): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
