/**
 * Interfaces para Eventos
 * Basadas en las respuestas reales de la API.
 */

export interface Event {
  /** ID único del evento */
  id: number;
  /** Nombre del evento */
  nombre: string;
  /** Descripción del evento */
  descripcion?: string;
  /** Fecha del evento (ISO string) */
  fecha: string;
  /** Hora de inicio */
  hora_inicio?: string;
  /** Hora de fin */
  hora_fin?: string;
  /** Lugar/dirección del evento */
  lugar?: string;
  /** Número de piso (si aplica) */
  numero_de_piso?: number | null;
  /** Capacidad máxima */
  capacidad?: number;
  /** Asistentes registrados */
  asistentes?: number;
  /** ID de la institución patrocinadora */
  institucion_id?: number;
  /** Nombre de la institución patrocinadora */
  institucion_nombre?: string;
}

export interface EventFilters {
  date?: string;
  from?: string;
  to?: string;
}
