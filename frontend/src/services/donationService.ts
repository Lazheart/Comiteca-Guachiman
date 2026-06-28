import type { DonationAudit, DonationStatisticsRow } from '@/interfaces';
import api from './api';

/** Servicio para consumir los endpoints de Donaciones */
export const donationService = {
  /** GET /donations — vista vista_auditoria_donaciones */
  async getAll(): Promise<DonationAudit[]> {
    const { data } = await api.get<DonationAudit[]>('/donations');
    return data;
  },

  /** GET /donations/statistics — agregado por institución donante */
  async getStatistics(): Promise<DonationStatisticsRow[]> {
    const { data } = await api.get<DonationStatisticsRow[]>('/donations/statistics');
    return data;
  },
};
