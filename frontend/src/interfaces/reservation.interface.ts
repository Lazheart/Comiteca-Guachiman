/**
 * Interfaces para Reservas (ReservaGestionada)
 * Alineadas con el schema real de la DB (tabla ReservaGestionada).
 * Columnas reales: miembro_DNI, bibliotecario_DNI, material_id,
 *                  numeroCopia, fechaReserva, estadoReserva
 * PK compuesta: (miembro_DNI, material_id, numeroCopia) — NO existe campo id.
 * Valores reales de estadoReserva: "Cancelada" | "Pendiente" | "Completada"
 */

export interface Reservation {
  /** DNI del miembro que realiza la reserva */
  miembro_DNI: number;
  /** DNI del bibliotecario que gestiona la reserva */
  bibliotecario_DNI?: number;
  /** ID del material reservado */
  material_id: number;
  /** Número de copia reservada */
  numeroCopia: number;
  /** Fecha en que se realizó la reserva (YYYY-MM-DD) */
  fechaReserva: string;
  /** Estado de la reserva: "Pendiente" | "Completada" | "Cancelada" */
  estadoReserva?: string;
  /* Campos derivados que puede devolver la API mediante JOINs */
  /** Nombre completo del miembro (JOIN con Persona) */
  miembro_nombre?: string;
  /** Título del material (JOIN con Material) */
  material_titulo?: string;
}
