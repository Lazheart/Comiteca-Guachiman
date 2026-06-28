import type { Copy } from '@/interfaces';
import api from './api';

/** Servicio para consumir los endpoints de Copias */
export const copyService = {
  /**
   * Obtiene todas las copias.
   */
  async getAll(): Promise<Copy[]> {
    const { data } = await api.get<Copy[]>('/copies');
    return data;
  },

  /**
   * Obtiene solo las copias disponibles.
   */
  async getAvailable(): Promise<Copy[]> {
    const { data } = await api.get<Copy[]>('/copies/available');
    return data;
  },

  /**
   * Obtiene copias de un material específico.
   */
  async getByMaterial(materialId: number): Promise<Copy[]> {
    const { data } = await api.get<Copy[]>(`/copies/${materialId}`);
    return data;
  },
};
