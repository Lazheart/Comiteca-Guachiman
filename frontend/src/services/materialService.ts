import type { Material, Copy, MaterialFilters } from '@/interfaces';
import api from './api';

/** Servicio para consumir los endpoints de Materiales */
export const materialService = {
  /**
   * Obtiene todos los materiales con filtros opcionales.
   */
  async getAll(filters?: MaterialFilters): Promise<Material[]> {
    const params: Record<string, string | boolean> = {};
    if (filters?.genre) params['genre'] = filters.genre;
    if (filters?.author) params['author'] = filters.author;
    if (filters?.country) params['country'] = filters.country;
    if (filters?.available !== undefined) params['available'] = filters.available;
    const { data } = await api.get<Material[]>('/materials', { params });
    return data;
  },

  /**
   * Busca materiales por texto libre.
   */
  async search(query: string): Promise<Material[]> {
    const { data } = await api.get<Material[]>('/materials/search', {
      params: { q: query },
    });
    return data;
  },

  /**
   * Obtiene un material por su ID.
   */
  async getById(id: number): Promise<Material> {
    const { data } = await api.get<Material>(`/materials/${id}`);
    return data;
  },

  /**
   * Obtiene las copias de un material específico.
   */
  async getCopies(materialId: number): Promise<Copy[]> {
    const { data } = await api.get<Copy[]>(`/materials/${materialId}/copies`);
    return data;
  },
};
