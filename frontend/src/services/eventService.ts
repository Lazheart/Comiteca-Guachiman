import type { Event, EventFilters, PaginatedResponse, PaginationParams } from '@/interfaces';
import api from './api';

export const eventService = {
  async getAll(filters?: EventFilters, pagination?: PaginationParams, signal?: AbortSignal): Promise<PaginatedResponse<Event>> {
    const params: Record<string, any> = { ...pagination };
    if (filters?.date) params['date'] = filters.date;
    if (filters?.from) params['from'] = filters.from;
    if (filters?.to) params['to'] = filters.to;
    const { data } = await api.get<PaginatedResponse<Event>>('/events', { params, signal });
    return data;
  },

  async getUpcoming(pagination?: PaginationParams, signal?: AbortSignal): Promise<PaginatedResponse<Event>> {
    const { data } = await api.get<PaginatedResponse<Event>>('/events/upcoming', { params: pagination, signal });
    return data;
  },

  async getById(id: number, signal?: AbortSignal): Promise<Event> {
    const { data } = await api.get<Event>(`/events/${id}`, { signal });
    return data;
  },
};
