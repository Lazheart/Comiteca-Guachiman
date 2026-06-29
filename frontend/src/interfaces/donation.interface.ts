/**
 * Interfaces para Donaciones
 *
 * Tabla Donacion: institucion_id, bibliotecario_DNI, material_id, fechaDonacion, cantidad
 * Vista vista_auditoria_donaciones (GET /donations): institucion_donante, material_recibido,
 *   fechaDonacion, ejemplares_donados, bibliotecario_receptor
 */

/** Registro crudo de la tabla Donacion (GET /institutions/{id}/donations) */
export interface DonationRecord {
  institucion_id: number;
  bibliotecario_DNI?: number;
  material_id: number;
  fechaDonacion: string;
  cantidad: number;
}

/** Fila de la vista vista_auditoria_donaciones (GET /donations) */
export interface DonationAudit {
  institucion_donante: string;
  material_recibido: string;
  fechaDonacion: string;
  ejemplares_donados: number;
  bibliotecario_receptor?: string;
}

/** Fila agregada de GET /donations/statistics */
export interface DonationStatisticsRow {
  institucion_donante: string;
  total_ejemplares: number;
  numero_donaciones: number;
}

/** Alias legacy usado en institutionService */
export type Donation = DonationRecord;
