import type { Institution, Donation, SponsoredEvent, PaginatedResponse, PaginationParams } from '@/interfaces';
import api from './api';

export const institutionService = {
  async getAll(pagination?: PaginationParams, signal?: AbortSignal): Promise<PaginatedResponse<Institution>> {
    const { data } = await api.get<PaginatedResponse<Institution>>('/institutions', { params: pagination, signal });
    return data;
  },

  async getById(id: number, signal?: AbortSignal): Promise<Institution> {
    const { data } = await api.get<Institution>(`/institutions/${id}`, { signal });
    return data;
  },

  async getDonations(institutionId: number, pagination?: PaginationParams, signal?: AbortSignal): Promise<PaginatedResponse<Donation>> {
    const { data } = await api.get<PaginatedResponse<Donation>>(`/institutions/${institutionId}/donations`, { params: pagination, signal });
    return data;
  },

  async getSponsoredEvents(institutionId: number, pagination?: PaginationParams, signal?: AbortSignal): Promise<PaginatedResponse<SponsoredEvent>> {
    const { data } = await api.get<PaginatedResponse<SponsoredEvent>>(`/institutions/${institutionId}/sponsored-events`, { params: pagination, signal });
    return data;
  },
};
