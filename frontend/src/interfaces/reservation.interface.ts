/**
 * Interfaces para Reservas (Reservations)
 * Basadas en las respuestas reales de la API.
 */

export interface Reservation {
  /** ID único de la reserva */
  id: number;
  /** DNI del miembro */
  miembro_dni: number;
  /** Nombre del miembro */
  miembro_nombre?: string;
  /** ID del material reservado */
  material_id: number;
  /** Título del material */
  material_titulo?: string;
  /** Fecha de la reserva (ISO string) */
  fecha_reserva: string;
  /** Fecha de expiración de la reserva */
  fecha_expiracion?: string;
  /** Estado de la reserva (pendiente, completada, cancelada) */
  estado?: string;
}
