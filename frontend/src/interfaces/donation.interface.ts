/**
 * Interfaces para Donaciones
 * Basadas en las respuestas reales de la API.
 */

export interface Donation {
  /** ID único de la donación */
  id: number;
  /** ID de la institución donante */
  institucion_id: number;
  /** Nombre de la institución donante */
  institucion_nombre?: string;
  /** Fecha de la donación (ISO string) */
  fecha: string;
  /** Descripción / detalle de la donación */
  descripcion?: string;
  /** Monto monetario (si aplica) */
  monto?: number;
  /** Tipo de donación (material, económica, etc.) */
  tipo?: string;
  /** Cantidad de materiales donados */
  cantidad_materiales?: number;
}

export interface DonationStatistics {
  /** Total de donaciones */
  total_donaciones?: number;
  /** Monto total donado */
  monto_total?: number;
  /** Institución con más donaciones */
  top_institucion?: string;
  /** PROVISIONAL - ajustar según respuesta real del backend */
  [key: string]: unknown;
}
