/** Rutas de navegación */
export const ROUTES = {
  HOME: '/',
  MATERIALS: '/materiales',
  MATERIAL_DETAIL: '/materiales/:id',
  EVENTS: '/eventos',
  EVENT_DETAIL: '/eventos/:id',
  INSTITUTIONS: '/instituciones',
  INSTITUTION_DETAIL: '/instituciones/:id',
  DONATIONS: '/donaciones',
  LOANS: '/prestamos',
  RESERVATIONS: '/reservas',
  COPIES: '/copias',
  STATISTICS: '/estadisticas',
} as const;

/** Nombre visible de la aplicación */
export const APP_NAME = 'Comicteca Guachimán';

/** Número de items por página por defecto */
export const DEFAULT_PAGE_SIZE = 12;

/** Estados de préstamos */
export const LOAN_STATUS = {
  ACTIVE: 'activo',
  RETURNED: 'devuelto',
  EXPIRED: 'vencido',
} as const;

/** Estados de reservas */
export const RESERVATION_STATUS = {
  PENDING: 'pendiente',
  COMPLETED: 'completada',
  CANCELLED: 'cancelada',
} as const;

/** Colores del tema */
export const COLORS = {
  primary: '#e66414',
  primaryLight: '#ff914d',
  primaryDark: '#c4500d',
  success: '#4ade80',
  danger: '#f87171',
  warning: '#facc15',
  info: '#60a5fa',
} as const;

/** Colores para gráficas Recharts */
export const CHART_COLORS = [
  '#e66414',
  '#ff914d',
  '#f97316',
  '#fb923c',
  '#fdba74',
  '#fed7aa',
];
