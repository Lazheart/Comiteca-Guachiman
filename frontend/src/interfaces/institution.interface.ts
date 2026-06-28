/**
 * Interfaces para Instituciones
 * Alineadas con el schema real de la DB (tabla Institucion).
 * Columnas reales: id, nombre, tipoInstitucion, direccion, telefono,
 *                  correo, representante, estado
 */

export interface Institution {
  /** ID único de la institución */
  id: number;
  /** Nombre de la institución */
  nombre: string;
  /** Tipo de institución */
  tipoInstitucion?: string;
  /** Dirección física */
  direccion?: string;
  /** Teléfono de contacto */
  telefono?: string;
  /** Correo electrónico de contacto */
  correo?: string;
  /** Nombre del representante */
  representante?: string;
  /** Estado de la institución (ej. "Activa", "Inactiva") */
  estado?: string;
  /* Campos derivados calculados por el backend */
  /** Total de donaciones realizadas (count desde Donacion) */
  total_donaciones?: number;
  /** Total de eventos patrocinados (count desde Patrocinado) */
  total_eventos_patrocinados?: number;
}
