import type {
  MostLoanedMaterial,
  EventAttendance,
  MaterialAvailability,
  TopDonor,
  Sanction,
  OverdueLoan,
} from '@/interfaces';
import api from './api';

/** Servicio para consumir los endpoints de Estadísticas */
export const statisticsService = {
  /**
   * Obtiene los materiales más prestados.
   */
  async getMostLoanedMaterials(): Promise<MostLoanedMaterial[]> {
    const { data } = await api.get<MostLoanedMaterial[]>('/statistics/most-loaned-materials');
    return data;
  },

  /**
   * Obtiene estadísticas de asistencia a eventos.
   */
  async getEventsAttendance(): Promise<EventAttendance[]> {
    const { data } = await api.get<EventAttendance[]>('/statistics/events-attendance');
    return data;
  },

  /**
   * Obtiene estadísticas de disponibilidad de materiales.
   */
  async getMaterialAvailability(): Promise<MaterialAvailability> {
    const { data } = await api.get<MaterialAvailability>('/statistics/material-availability');
    return data;
  },

  /**
   * Obtiene los principales donantes.
   */
  async getTopDonors(): Promise<TopDonor[]> {
    const { data } = await api.get<TopDonor[]>('/statistics/top-donors');
    return data;
  },

  /**
   * Obtiene estadísticas de sanciones.
   */
  async getSanctions(): Promise<Sanction[]> {
    const { data } = await api.get<Sanction[]>('/statistics/sanctions');
    return data;
  },

  /**
   * Obtiene los préstamos vencidos.
   */
  async getOverdueLoans(): Promise<OverdueLoan[]> {
    const { data } = await api.get<OverdueLoan[]>('/statistics/overdue-loans');
    return data;
  },
};
