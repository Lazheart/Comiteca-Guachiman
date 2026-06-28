import type {
  MostLoanedMaterial,
  EventAttendance,
  MaterialAvailabilityRow,
  MaterialAvailabilitySummary,
  TopDonor,
  SanctionStat,
  OverdueLoan,
} from '@/interfaces';
import api from './api';

function summarizeAvailability(rows: MaterialAvailabilityRow[]): MaterialAvailabilitySummary {
  const total_ejemplares = rows.reduce((sum, row) => sum + Number(row.cantidad), 0);
  const disponibles = rows
    .filter((row) => row.disponibilidad === 'Disponible')
    .reduce((sum, row) => sum + Number(row.cantidad), 0);

  return {
    total_ejemplares,
    disponibles,
    no_disponibles: total_ejemplares - disponibles,
    por_disponibilidad: rows,
  };
}

/** Servicio para consumir los endpoints de Estadísticas */
export const statisticsService = {
  async getMostLoanedMaterials(): Promise<MostLoanedMaterial[]> {
    const { data } = await api.get<MostLoanedMaterial[]>('/statistics/most-loaned-materials');
    return data;
  },

  async getEventsAttendance(): Promise<EventAttendance[]> {
    const { data } = await api.get<EventAttendance[]>('/statistics/events-attendance');
    return data;
  },

  async getMaterialAvailability(): Promise<MaterialAvailabilitySummary> {
    const { data } = await api.get<MaterialAvailabilityRow[]>('/statistics/material-availability');
    return summarizeAvailability(data);
  },

  async getMaterialAvailabilityRows(): Promise<MaterialAvailabilityRow[]> {
    const { data } = await api.get<MaterialAvailabilityRow[]>('/statistics/material-availability');
    return data;
  },

  async getTopDonors(): Promise<TopDonor[]> {
    const { data } = await api.get<TopDonor[]>('/statistics/top-donors');
    return data;
  },

  async getSanctions(): Promise<SanctionStat[]> {
    const { data } = await api.get<SanctionStat[]>('/statistics/sanctions');
    return data;
  },

  async getOverdueLoans(): Promise<OverdueLoan[]> {
    const { data } = await api.get<OverdueLoan[]>('/statistics/overdue-loans');
    return data;
  },
};
