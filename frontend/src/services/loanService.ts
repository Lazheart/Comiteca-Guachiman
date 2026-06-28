import type { Loan } from '@/interfaces';
import api from './api';

/** Servicio para consumir los endpoints de Préstamos */
export const loanService = {
  /**
   * Obtiene todos los préstamos.
   */
  async getAll(): Promise<Loan[]> {
    const { data } = await api.get<Loan[]>('/loans');
    return data;
  },

  /**
   * Obtiene los préstamos activos.
   */
  async getActive(): Promise<Loan[]> {
    const { data } = await api.get<Loan[]>('/loans/active');
    return data;
  },

  /**
   * Obtiene los préstamos vencidos.
   */
  async getExpired(): Promise<Loan[]> {
    const { data } = await api.get<Loan[]>('/loans/expired');
    return data;
  },

  /**
   * Obtiene los préstamos de un miembro por DNI.
   */
  async getByMember(dni: number): Promise<Loan[]> {
    const { data } = await api.get<Loan[]>(`/loans/member/${dni}`);
    return data;
  },

  /**
   * Obtiene los préstamos de un material específico.
   */
  async getByMaterial(materialId: number): Promise<Loan[]> {
    const { data } = await api.get<Loan[]>(`/loans/material/${materialId}`);
    return data;
  },
};
