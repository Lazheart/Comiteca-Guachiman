import type { Material, Copy, MaterialFilters, PaginatedResponse, PaginationParams } from '@/interfaces';
import api from './api';

export const materialService = {
  async getAll(filters?: MaterialFilters, pagination?: PaginationParams, signal?: AbortSignal): Promise<PaginatedResponse<Material>> {
    const params: Record<string, any> = { ...pagination };
    if (filters?.genre) params['genre'] = filters.genre;
    if (filters?.author) params['author'] = filters.author;
    if (filters?.country) params['country'] = filters.country;
    const { data } = await api.get<PaginatedResponse<Material>>('/materials', { params, signal });
    return data;
  },

  async getById(id: number, signal?: AbortSignal): Promise<Material> {
    const { data } = await api.get<Material>(`/materials/${id}`, { signal });
    return data;
  },

  async getCopies(materialId: number, pagination?: PaginationParams, signal?: AbortSignal): Promise<PaginatedResponse<Copy>> {
    const { data } = await api.get<PaginatedResponse<Copy>>(`/materials/${materialId}/copies`, { params: pagination, signal });
    return data;
  },
};
