/**
 * Interfaces para Instituciones
 * Basadas en las respuestas reales de la API.
 */

export interface Institution {
  /** ID único de la institución */
  id: number;
  /** Nombre de la institución */
  nombre: string;
  /** Tipo de institución */
  tipo?: string;
  /** Dirección */
  direccion?: string;
  /** Teléfono de contacto */
  telefono?: string;
  /** Email de contacto */
  email?: string;
  /** Sitio web */
  sitio_web?: string;
  /** Total de donaciones realizadas */
  total_donaciones?: number;
  /** Eventos patrocinados */
  total_eventos_patrocinados?: number;
}
