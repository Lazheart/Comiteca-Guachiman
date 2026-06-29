import type { DonationRecord, DonationStatisticsRow, PaginatedResponse, PaginationParams } from '@/interfaces';
import api from './api';

export const donationService = {
  async getAll(pagination?: PaginationParams, signal?: AbortSignal): Promise<PaginatedResponse<DonationRecord>> {
    const { data } = await api.get<PaginatedResponse<DonationRecord>>('/donations', { params: pagination, signal });
    return data;
  },

  async getStatistics(signal?: AbortSignal): Promise<DonationStatisticsRow[]> {
    const { data } = await api.get<DonationStatisticsRow[]>('/donations/statistics', { signal });
    return data;
  },
};
