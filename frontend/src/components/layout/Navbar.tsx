import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  CalendarDays,
  Building2,
  Gift,
  BookMarked,
  ClipboardList,
  BarChart3,
  Menu,
  X,
  Search,
  Home,
} from 'lucide-react';
import { ROUTES, APP_NAME } from '@/constants';

const navItems = [
  { to: ROUTES.HOME, label: 'Inicio', icon: <Home size={16} /> },
  { to: ROUTES.MATERIALS, label: 'Materiales', icon: <BookOpen size={16} /> },
  { to: ROUTES.EVENTS, label: 'Eventos', icon: <CalendarDays size={16} /> },
  { to: ROUTES.INSTITUTIONS, label: 'Instituciones', icon: <Building2 size={16} /> },
  { to: ROUTES.DONATIONS, label: 'Donaciones', icon: <Gift size={16} /> },
  { to: ROUTES.LOANS, label: 'Préstamos', icon: <BookMarked size={16} /> },
  { to: ROUTES.RESERVATIONS, label: 'Reservas', icon: <ClipboardList size={16} /> },
  { to: ROUTES.STATISTICS, label: 'Estadísticas', icon: <BarChart3 size={16} /> },
];

/**
 * Navbar principal con logo, navegación y buscador global.
 */
export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`${ROUTES.MATERIALS}?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 glass border-b border-[#2e2e2e]">
      <div className="section-container">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <NavLink to={ROUTES.HOME} className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#e66414] to-[#ff914d] flex items-center justify-center">
              <BookOpen size={16} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="font-display font-bold text-base text-[#f5f5f5] hidden sm:block">
              {APP_NAME}
            </span>
          </NavLink>

          {/* Nav desktop */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Navegación principal">
            {navItems.slice(1).map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-[#e66414]/10 text-[#e66414]'
                      : 'text-[#a0a0a0] hover:text-[#f5f5f5] hover:bg-white/5'
                  }`
                }
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Buscador */}
          <form onSubmit={handleSearch} className="relative hidden md:flex items-center">
            <Search
              size={14}
              className="absolute left-3 text-[#6b6b6b] pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar material..."
              className="bg-[#242424] border border-[#2e2e2e] rounded-lg text-sm text-[#f5f5f5] placeholder-[#6b6b6b] pl-9 pr-4 py-2 w-48 focus:outline-none focus:border-[#e66414] focus:w-64 transition-all duration-200"
              aria-label="Buscar material"
            />
          </form>

          {/* Hamburger mobile */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg text-[#a0a0a0] hover:text-[#f5f5f5] hover:bg-white/5 transition-colors"
            aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-[#2e2e2e] bg-[#0f0f0f]">
          <div className="section-container py-4 flex flex-col gap-1">
            {/* Buscador mobile */}
            <form onSubmit={handleSearch} className="relative mb-3">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b6b6b] pointer-events-none"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar material..."
                className="input pl-9 text-sm"
                aria-label="Buscar material mobile"
              />
            </form>

            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#e66414]/10 text-[#e66414]'
                      : 'text-[#a0a0a0] hover:text-[#f5f5f5] hover:bg-white/5'
                  }`
                }
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
