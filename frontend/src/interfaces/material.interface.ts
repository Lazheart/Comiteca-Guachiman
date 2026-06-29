/**
 * Interfaces para Materiales (Material, Ejemplar)
 * Alineadas con el schema real de la DB.
 *
 * Tabla Material: id, titulo, autor, genero, ilustracion, editorial, fechaPublicacion, paisOrigen
 * Subtipos: Comic (id, tipoComic, serializacion), Manga (id), Novela (id, narracion)
 * Tabla Ejemplar: material_id, numeroCopia, estadoConservacion, disponibilidad
 *   PK compuesta: (material_id, numeroCopia)
 */

export interface Material {
  /** ID único del material */
  id: number;
  /** Título del material */
  titulo: string;
  /** Autor(es) del material */
  autor: string;
  /** Género o categoría */
  genero: string;
  /** Ilustrador */
  ilustracion?: string;
  /** Editorial */
  editorial?: string;
  /** Fecha de publicación (YYYY-MM-DD) */
  fechaPublicacion?: string;
  /** País de origen */
  paisOrigen?: string;
  /* Campos de subtipo (pueden venir si el endpoint hace JOIN) */
  /** Solo Comic: tipo de cómic */
  tipoComic?: string;
  /** Solo Comic: tipo de serialización */
  serializacion?: string;
  /** Solo Novela: tipo de narración */
  narracion?: string;
  /* Campos derivados calculados por el backend */
  /** Total de copias (count de Ejemplar por material_id) */
  total_copias?: number;
  /** Copias con disponibilidad = 'Disponible' */
  copias_disponibles?: number;
}

/**
 * Ejemplar (copia física de un material)
 * PK compuesta: (material_id, numeroCopia) — NO existe campo id autogenerado.
 */
export interface Copy {
  /** ID del material al que pertenece */
  material_id: number;
  /** Número de copia (parte de la PK compuesta) */
  numeroCopia: number;
  /** Estado de conservación del ejemplar */
  estadoConservacion?: string;
  /** Disponibilidad del ejemplar (VARCHAR en DB: "Disponible" | "No Disponible") */
  disponibilidad?: string;
}

export interface MaterialFilters {
  genre?: string;
  author?: string;
  country?: string;
}
