/**
 * Interfaces para Préstamos (Loans)
 * Basadas en las respuestas reales de la API.
 */

export interface Loan {
  /** ID único del préstamo */
  id: number;
  /** DNI del miembro */
  miembro_dni: number;
  /** Nombre del miembro */
  miembro_nombre?: string;
  /** ID del material prestado */
  material_id: number;
  /** Título del material */
  material_titulo?: string;
  /** ID de la copia específica */
  copia_id?: number;
  /** Fecha de préstamo (ISO string) */
  fecha_prestamo: string;
  /** Fecha de devolución acordada (ISO string) */
  fecha_devolucion: string;
  /** Fecha de devolución real (ISO string, null si no devuelto) */
  fecha_devolucion_real?: string | null;
  /** Estado del préstamo (activo, devuelto, vencido) */
  estado?: string;
  /** Sanción asociada (si aplica) */
  sancion?: number | null;
}
