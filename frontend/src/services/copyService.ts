import type { Copy, PaginatedResponse, PaginationParams } from '@/interfaces';
import api from './api';

export const copyService = {
  async getAll(pagination?: PaginationParams, signal?: AbortSignal): Promise<PaginatedResponse<Copy>> {
    const { data } = await api.get<PaginatedResponse<Copy>>('/copies', { params: pagination, signal });
    return data;
  },

  async getAvailable(pagination?: PaginationParams, signal?: AbortSignal): Promise<PaginatedResponse<Copy>> {
    const { data } = await api.get<PaginatedResponse<Copy>>('/copies/available', { params: pagination, signal });
    return data;
  },

  async getByMaterialId(materialId: number, pagination?: PaginationParams, signal?: AbortSignal): Promise<PaginatedResponse<Copy>> {
    const { data } = await api.get<PaginatedResponse<Copy>>(`/copies/${materialId}`, { params: pagination, signal });
    return data;
  },
};
