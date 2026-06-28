import type { Donation, DonationStatistics } from '@/interfaces';
import api from './api';

/** Servicio para consumir los endpoints de Donaciones */
export const donationService = {
  /**
   * Obtiene todas las donaciones.
   */
  async getAll(): Promise<Donation[]> {
    const { data } = await api.get<Donation[]>('/donations');
    return data;
  },

  /**
   * Obtiene estadísticas de donaciones.
   */
  async getStatistics(): Promise<DonationStatistics> {
    const { data } = await api.get<DonationStatistics>('/donations/statistics');
    return data;
  },
};
