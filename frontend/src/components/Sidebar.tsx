import { NavLink } from 'react-router-dom';
import {
  Home,
  BookOpen,
  CalendarDays,
  Building2,
  Gift,
  BookMarked,
  ClipboardList,
  BarChart3,
} from 'lucide-react';
import { ROUTES } from '@/constants';

interface SidebarProps {
  /** Callback al hacer clic en un link (útil en móviles para cerrar) */
  onItemClick?: () => void;
  /** Clases CSS adicionales */
  className?: string;
}

const sidebarItems = [
  { to: ROUTES.HOME, label: 'Inicio', icon: <Home size={18} /> },
  { to: ROUTES.MATERIALS, label: 'Materiales', icon: <BookOpen size={18} /> },
  { to: ROUTES.EVENTS, label: 'Eventos', icon: <CalendarDays size={18} /> },
  { to: ROUTES.INSTITUTIONS, label: 'Instituciones', icon: <Building2 size={18} /> },
  { to: ROUTES.DONATIONS, label: 'Donaciones', icon: <Gift size={18} /> },
  { to: ROUTES.LOANS, label: 'Préstamos', icon: <BookMarked size={18} /> },
  { to: ROUTES.RESERVATIONS, label: 'Reservas', icon: <ClipboardList size={18} /> },
  { to: ROUTES.STATISTICS, label: 'Estadísticas', icon: <BarChart3 size={18} /> },
];

/**
 * Componente Sidebar para navegación lateral.
 */
export function Sidebar({ onItemClick, className = '' }: SidebarProps) {
  return (
    <aside className={`w-64 bg-[#1a1a1a] border-r border-[#2e2e2e] flex flex-col h-full ${className}`}>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto" aria-label="Navegación lateral">
        {sidebarItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onItemClick}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-[#e66414]/10 text-[#e66414] border-l-4 border-[#e66414]'
                  : 'text-[#a0a0a0] hover:text-[#f5f5f5] hover:bg-white/5'
              }`
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
