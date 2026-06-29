/**
 * Interfaces para Estadísticas — alineadas con las respuestas reales de la API.
 */

/** GET /statistics/most-loaned-materials */
export interface MostLoanedMaterial {
  titulo: string;
  total_prestamos: number;
}

/** GET /statistics/events-attendance */
export interface EventAttendance {
  tema: string;
  fecha: string;
  total_asistentes: number;
}

/** GET /statistics/material-availability — una fila por título y disponibilidad */
export interface MaterialAvailabilityRow {
  titulo: string;
  disponibilidad: string;
  cantidad: number;
}

/** Resumen calculado en el frontend a partir de MaterialAvailabilityRow[] */
export interface MaterialAvailabilitySummary {
  total_ejemplares: number;
  disponibles: number;
  no_disponibles: number;
  por_disponibilidad: MaterialAvailabilityRow[];
}

/** GET /statistics/top-donors */
export interface TopDonor {
  institucion_donante: string;
  total_ejemplares: number;
}

/** GET /statistics/sanctions — agregado por motivo */
export interface SanctionStat {
  motivo: string;
  cantidad: number;
}

/** GET /statistics/overdue-loans — vista vista_prestamos_alertas */
export interface OverdueLoan {
  id_prestamo: number;
  miembro_nombre: string;
  titulo_material: string;
  fechaPrestamo: string;
  fechaLimite: string;
  fechaDevolucion?: string | null;
  estado_registro?: string;
  estado_tiempo_real: string;
}
