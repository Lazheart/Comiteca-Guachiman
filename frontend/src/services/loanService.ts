import type { Loan, PaginatedResponse, PaginationParams } from '@/interfaces';
import api from './api';

export const loanService = {
  async getAll(pagination?: PaginationParams, signal?: AbortSignal): Promise<PaginatedResponse<Loan>> {
    const { data } = await api.get<PaginatedResponse<Loan>>('/loans', { params: pagination, signal });
    return data;
  },

  async getActive(pagination?: PaginationParams, signal?: AbortSignal): Promise<PaginatedResponse<Loan>> {
    const { data } = await api.get<PaginatedResponse<Loan>>('/loans/active', { params: pagination, signal });
    return data;
  },

  async getExpired(pagination?: PaginationParams, signal?: AbortSignal): Promise<PaginatedResponse<Loan>> {
    const { data } = await api.get<PaginatedResponse<Loan>>('/loans/expired', { params: pagination, signal });
    return data;
  },

  async getByMember(dni: number, pagination?: PaginationParams, signal?: AbortSignal): Promise<PaginatedResponse<Loan>> {
    const { data } = await api.get<PaginatedResponse<Loan>>(`/loans/member/${dni}`, { params: pagination, signal });
    return data;
  },

  async getByMaterial(materialId: number, pagination?: PaginationParams, signal?: AbortSignal): Promise<PaginatedResponse<Loan>> {
    const { data } = await api.get<PaginatedResponse<Loan>>(`/loans/material/${materialId}`, { params: pagination, signal });
    return data;
  },
};
