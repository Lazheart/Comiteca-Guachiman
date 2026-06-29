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

/** Géneros disponibles: { value: valor exacto en DB, label: texto visible } */
export const GENRES: { value: string; label: string }[] = [
  { value: 'Accion',     label: 'Acción' },
  { value: 'Aventura',   label: 'Aventura' },
  { value: 'Ciencia Fi', label: 'Ciencia Ficción' },
  { value: 'Comedia',    label: 'Comedia' },
  { value: 'Drama',      label: 'Drama' },
  { value: 'Fantasia',   label: 'Fantasía' },
  { value: 'Historico',  label: 'Histórico' },
  { value: 'Misterio',   label: 'Misterio' },
  { value: 'Romance',    label: 'Romance' },
  { value: 'Terror',     label: 'Terror' },
];

/** Países disponibles: { value: valor exacto en DB, label: texto visible } */
export const COUNTRIES: { value: string; label: string }[] = [
  { value: 'Argentina', label: 'Argentina' },
  { value: 'Corea',     label: 'Corea' },
  { value: 'EEUU',      label: 'EEUU' },
  { value: 'Espana',    label: 'España' },
  { value: 'Francia',   label: 'Francia' },
  { value: 'Japon',     label: 'Japón' },
  { value: 'Mexico',    label: 'México' },
  { value: 'Peru',      label: 'Perú' },
];
