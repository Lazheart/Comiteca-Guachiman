import type {
  MostLoanedMaterial,
  EventAttendance,
  MaterialAvailabilityRow,
  TopDonor,
  SanctionStat,
  OverdueLoan,
  PaginatedResponse,
  PaginationParams
} from '@/interfaces';
import api from './api';

export const statisticsService = {
  async getMostLoanedMaterials(pagination?: PaginationParams, signal?: AbortSignal): Promise<PaginatedResponse<MostLoanedMaterial>> {
    const { data } = await api.get<PaginatedResponse<MostLoanedMaterial>>('/statistics/most-loaned-materials', { params: pagination, signal });
    return data;
  },

  async getEventsAttendance(pagination?: PaginationParams, signal?: AbortSignal): Promise<PaginatedResponse<EventAttendance>> {
    const { data } = await api.get<PaginatedResponse<EventAttendance>>('/statistics/events-attendance', { params: pagination, signal });
    return data;
  },

  async getMaterialAvailability(pagination?: PaginationParams, signal?: AbortSignal): Promise<PaginatedResponse<MaterialAvailabilityRow>> {
    const { data } = await api.get<PaginatedResponse<MaterialAvailabilityRow>>('/statistics/material-availability', { params: pagination, signal });
    return data;
  },

  async getTopDonors(pagination?: PaginationParams, signal?: AbortSignal): Promise<PaginatedResponse<TopDonor>> {
    const { data } = await api.get<PaginatedResponse<TopDonor>>('/statistics/top-donors', { params: pagination, signal });
    return data;
  },

  async getSanctions(pagination?: PaginationParams, signal?: AbortSignal): Promise<PaginatedResponse<SanctionStat>> {
    const { data } = await api.get<PaginatedResponse<SanctionStat>>('/statistics/sanctions', { params: pagination, signal });
    return data;
  },

  async getOverdueLoans(pagination?: PaginationParams, signal?: AbortSignal): Promise<PaginatedResponse<OverdueLoan>> {
    const { data } = await api.get<PaginatedResponse<OverdueLoan>>('/statistics/overdue-loans', { params: pagination, signal });
    return data;
  },
};
