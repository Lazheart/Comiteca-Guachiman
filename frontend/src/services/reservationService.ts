import type { Reservation } from '@/interfaces';
import api from './api';

/** Servicio para consumir los endpoints de Reservas */
export const reservationService = {
  /**
   * Obtiene todas las reservas.
   */
  async getAll(): Promise<Reservation[]> {
    const { data } = await api.get<Reservation[]>('/reservations');
    return data;
  },

  /**
   * Obtiene las reservas pendientes.
   */
  async getPending(): Promise<Reservation[]> {
    const { data } = await api.get<Reservation[]>('/reservations/pending');
    return data;
  },

  /**
   * Obtiene las reservas de un miembro por DNI.
   */
  async getByMember(dni: number): Promise<Reservation[]> {
    const { data } = await api.get<Reservation[]>(`/reservations/member/${dni}`);
    return data;
  },
};
