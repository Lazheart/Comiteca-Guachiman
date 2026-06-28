/** Resuelve campos de respuestas API con variantes camelCase / minúsculas de PostgreSQL */
export function apiField<T>(row: object, ...keys: string[]): T | undefined {
  const record = row as Record<string, unknown>;
  for (const key of keys) {
    const direct = record[key];
    if (direct !== undefined && direct !== null && direct !== '') {
      return direct as T;
    }
    const lower = key.toLowerCase();
    if (lower !== key) {
      const lowerVal = record[lower];
      if (lowerVal !== undefined && lowerVal !== null && lowerVal !== '') {
        return lowerVal as T;
      }
    }
  }
  return undefined;
}
