import type { Institution } from '@/interfaces';
import type { Donation } from '@/interfaces';
import type { Event } from '@/interfaces';
import api from './api';

/** Servicio para consumir los endpoints de Instituciones */
export const institutionService = {
  /**
   * Obtiene todas las instituciones.
   */
  async getAll(): Promise<Institution[]> {
    const { data } = await api.get<Institution[]>('/institutions');
    return data;
  },

  /**
   * Obtiene una institución por su ID.
   */
  async getById(id: number): Promise<Institution> {
    const { data } = await api.get<Institution>(`/institutions/${id}`);
    return data;
  },

  /**
   * Obtiene las donaciones de una institución.
   */
  async getDonations(id: number): Promise<Donation[]> {
    const { data } = await api.get<Donation[]>(`/institutions/${id}/donations`);
    return data;
  },

  /**
   * Obtiene los eventos patrocinados por una institución.
   */
  async getSponsoredEvents(id: number): Promise<Event[]> {
    const { data } = await api.get<Event[]>(`/institutions/${id}/sponsored-events`);
    return data;
  },
};
