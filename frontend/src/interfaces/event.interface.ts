/**
 * Interfaces para Eventos
 * Alineadas con el schema real de la DB (tabla Evento).
 * Columnas reales: id, tema, fecha, horaInicio, horaFin, numeroDePiso, idZona
 */

export interface Event {
  /** ID único del evento */
  id: number;
  /** Tema / nombre del evento */
  tema: string;
  /** Fecha del evento (ISO string YYYY-MM-DD) */
  fecha: string;
  /** Hora de inicio (HH:MM:SS) */
  horaInicio?: string;
  /** Hora de fin (HH:MM:SS) */
  horaFin?: string;
  /** Número de piso donde se realiza */
  numeroDePiso?: number | null;
  /** Zona del piso */
  idZona?: string | null;
  /* Campos derivados que puede devolver la API mediante JOINs */
  /** Total de asistentes (count de Asistencia + Inscripcion) */
  total_asistentes?: number;
  /** Nombre de institución organizadora (OrganizacionEvento JOIN Institucion) */
  institucion_nombre?: string;
  /** ID de institución organizadora */
  institucion_id?: number;
}

/** Evento patrocinado (GET /institutions/{id}/sponsored-events) */
export interface SponsoredEvent extends Event {
  /** Monto del patrocinio (tabla Patrocinado) */
  montopatrocinio?: number;
  montoPatrocinio?: number;
}

export interface EventFilters {
  date?: string;
  from?: string;
  to?: string;
}
