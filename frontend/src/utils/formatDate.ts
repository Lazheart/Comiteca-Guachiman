/**
 * Utilidades para formateo de fechas y horas.
 */

/**
 * Formatea una fecha ISO al formato local legible.
 * Ejemplo: "2024-03-15" → "15 mar 2024"
 */
export function formatDate(isoDate: string): string {
  if (!isoDate) return '—';
  try {
    return new Date(isoDate).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return isoDate;
  }
}

/**
 * Formatea fecha y hora ISO.
 * Ejemplo: "2024-03-15T18:30:00" → "15 mar 2024, 6:30 PM"
 */
export function formatDateTime(isoDate: string): string {
  if (!isoDate) return '—';
  try {
    return new Date(isoDate).toLocaleString('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoDate;
  }
}

/**
 * Retorna la diferencia en días entre una fecha y hoy.
 * Positivo = en el futuro. Negativo = en el pasado.
 */
export function daysFromNow(isoDate: string): number {
  const target = new Date(isoDate).getTime();
  const now = Date.now();
  return Math.round((target - now) / (1000 * 60 * 60 * 24));
}

/**
 * Verifica si una fecha ya pasó.
 */
export function isPast(isoDate: string): boolean {
  return new Date(isoDate).getTime() < Date.now();
}

/**
 * Obtiene un label relativo (Hoy, Mañana, en X días, Hace X días).
 */
export function relativeDateLabel(isoDate: string): string {
  const days = daysFromNow(isoDate);
  if (days === 0) return 'Hoy';
  if (days === 1) return 'Mañana';
  if (days === -1) return 'Ayer';
  if (days > 1) return `En ${days} días`;
  return `Hace ${Math.abs(days)} días`;
}
