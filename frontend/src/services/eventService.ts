import type { Event, EventFilters } from '@/interfaces';
import api from './api';

/** Servicio para consumir los endpoints de Eventos */
export const eventService = {
  /**
   * Obtiene todos los eventos con filtros opcionales de fecha.
   */
  async getAll(filters?: EventFilters): Promise<Event[]> {
    const params: Record<string, string> = {};
    if (filters?.date) params['date'] = filters.date;
    if (filters?.from) params['from'] = filters.from;
    if (filters?.to) params['to'] = filters.to;
    const { data } = await api.get<Event[]>('/events', { params });
    return data;
  },

  /**
   * Obtiene los próximos eventos.
   */
  async getUpcoming(): Promise<Event[]> {
    const { data } = await api.get<Event[]>('/events/upcoming');
    return data;
  },

  /**
   * Obtiene un evento por su ID.
   */
  async getById(id: number): Promise<Event> {
    const { data } = await api.get<Event>(`/events/${id}`);
    return data;
  },
};
