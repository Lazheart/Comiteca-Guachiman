/**
 * Interfaces para Materiales (cómics, manga, novelas gráficas, etc.)
 * Basadas en las respuestas reales de la API.
 * Ajustar si el backend modifica los schemas.
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
  /** País de origen */
  pais?: string;
  /** Año de publicación */
  anio?: number;
  /** Editorial */
  editorial?: string;
  /** Número de páginas */
  num_paginas?: number;
  /** Descripción o sinopsis */
  descripcion?: string;
  /** URL de portada/imagen */
  imagen_url?: string;
  /** Si el material está disponible para préstamo */
  disponible?: boolean;
  /** Total de copias */
  total_copias?: number;
  /** Copias disponibles */
  copias_disponibles?: number;
}

export interface Copy {
  /** ID de la copia */
  id: number;
  /** ID del material al que pertenece */
  material_id: number;
  /** Estado de la copia (bueno, regular, dañado) */
  estado?: string;
  /** Si la copia está disponible */
  disponible?: boolean;
  /** Notas adicionales */
  notas?: string;
}

export interface MaterialFilters {
  genre?: string;
  author?: string;
  country?: string;
  available?: boolean;
}
