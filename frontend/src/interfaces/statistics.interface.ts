/**
 * Interfaces para Estadísticas
 * PROVISIONAL - algunas interfaces pueden requerir ajuste
 * según las respuestas reales del backend.
 */

export interface MostLoanedMaterial {
  material_id: number;
  titulo: string;
  total_prestamos: number;
  autor?: string;
  genero?: string;
}

export interface EventAttendance {
  evento_id: number;
  nombre: string;
  fecha: string;
  capacidad?: number;
  asistentes: number;
  porcentaje_ocupacion?: number;
}

export interface MaterialAvailability {
  /** PROVISIONAL - ajustar según schema real */
  total_materiales?: number;
  disponibles?: number;
  prestados?: number;
  reservados?: number;
  porcentaje_disponible?: number;
  /** Datos por género */
  por_genero?: Array<{
    genero: string;
    total: number;
    disponibles: number;
  }>;
  [key: string]: unknown;
}

export interface TopDonor {
  institucion_id: number;
  institucion_nombre: string;
  total_donaciones: number;
  monto_total?: number;
}

export interface Sanction {
  /** PROVISIONAL - ajustar según schema real */
  miembro_dni?: number;
  miembro_nombre?: string;
  tipo_sancion?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  monto?: number;
  motivo?: string;
  [key: string]: unknown;
}

export interface OverdueLoan {
  /** PROVISIONAL - ajustar según schema real */
  prestamo_id?: number;
  miembro_dni?: number;
  miembro_nombre?: string;
  material_titulo?: string;
  fecha_devolucion?: string;
  dias_vencido?: number;
  [key: string]: unknown;
}
