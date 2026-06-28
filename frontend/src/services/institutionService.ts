import type { Institution, DonationRecord, SponsoredEvent } from '@/interfaces';
import api from './api';

/** Servicio para consumir los endpoints de Instituciones */
export const institutionService = {
  async getAll(): Promise<Institution[]> {
    const { data } = await api.get<Institution[]>('/institutions');
    return data;
  },

  async getById(id: number): Promise<Institution> {
    const { data } = await api.get<Institution>(`/institutions/${id}`);
    return data;
  },

  /** GET /institutions/{id}/donations — tabla Donacion */
  async getDonations(id: number): Promise<DonationRecord[]> {
    const { data } = await api.get<DonationRecord[]>(`/institutions/${id}/donations`);
    return data;
  },

  /** GET /institutions/{id}/sponsored-events — Evento + montoPatrocinio */
  async getSponsoredEvents(id: number): Promise<SponsoredEvent[]> {
    const { data } = await api.get<SponsoredEvent[]>(`/institutions/${id}/sponsored-events`);
    return data;
  },
};
