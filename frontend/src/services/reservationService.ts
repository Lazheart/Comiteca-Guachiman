import type { Reservation, PaginatedResponse, PaginationParams } from '@/interfaces';
import api from './api';

export const reservationService = {
  async getAll(pagination?: PaginationParams, signal?: AbortSignal): Promise<PaginatedResponse<Reservation>> {
    const { data } = await api.get<PaginatedResponse<Reservation>>('/reservations', { params: pagination, signal });
    return data;
  },

  async getPending(pagination?: PaginationParams, signal?: AbortSignal): Promise<PaginatedResponse<Reservation>> {
    const { data } = await api.get<PaginatedResponse<Reservation>>('/reservations/pending', { params: pagination, signal });
    return data;
  },

  async getByMember(dni: number, pagination?: PaginationParams, signal?: AbortSignal): Promise<PaginatedResponse<Reservation>> {
    const { data } = await api.get<PaginatedResponse<Reservation>>(`/reservations/member/${dni}`, { params: pagination, signal });
    return data;
  },
};
