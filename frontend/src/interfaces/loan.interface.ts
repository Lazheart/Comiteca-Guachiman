/**
 * Interfaces para Préstamos (Loans)
 * Alineadas con el schema real de la DB (tabla Prestamo).
 * Columnas reales: id, miembro_DNI, bibliotecario_DNI, material_id,
 *                  numeroCopia, fechaPrestamo, fechaLimite, fechaDevolucion, estado
 * Valores reales de estado: "En Curso" | "" (vacío = devuelto)
 */

export interface Loan {
  /** ID único del préstamo */
  id: number;
  /** DNI del miembro que realiza el préstamo */
  miembro_DNI: number;
  /** DNI del bibliotecario que gestiona el préstamo */
  bibliotecario_DNI?: number;
  /** ID del material prestado */
  material_id: number;
  /** Número de copia del ejemplar (parte de PK compuesta en Ejemplar) */
  numeroCopia: number;
  /** Fecha en que se realizó el préstamo (YYYY-MM-DD) */
  fechaPrestamo: string;
  /** Fecha límite de devolución acordada (YYYY-MM-DD) */
  fechaLimite: string;
  /** Fecha real de devolución (YYYY-MM-DD, vacío/null si aún no fue devuelto) */
  fechaDevolucion?: string | null;
  /** Estado del préstamo: "En Curso" | "" o null (devuelto) */
  estado?: string;
  /* Campos derivados que puede devolver la API mediante JOINs */
  /** Nombre completo del miembro (JOIN con Persona) */
  miembro_nombre?: string;
  /** Título del material (JOIN con Material) */
  material_titulo?: string;
}
