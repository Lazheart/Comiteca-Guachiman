import { NavLink } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { ROUTES, APP_NAME } from '@/constants';

export function Footer() {
  return (
    <footer className="border-t border-[#2e2e2e] bg-[#0a0a0a]">
      <div className="section-container py-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[2fr_1fr_1fr]">
          {/* Branding */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#e66414] to-[#ff914d]">
                <BookOpen
                  size={16}
                  className="text-white"
                  strokeWidth={2.5}
                />
              </div>
              <span className="font-display text-base font-bold text-[#f5f5f5]">
                {APP_NAME}
              </span>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-[#8b8b8b]">
              Plataforma digital para la gestión, administración y
              visualización de la comicteca.
            </p>
          </div>

          {/* Navegación */}
          <div>
            <h3 className="mb-5 text-xs font-semibold uppercase tracking-widest text-[#a0a0a0]">
              Explorar
            </h3>
            <ul className="space-y-3">
              {[
                { to: ROUTES.MATERIALS, label: 'Materiales' },
                { to: ROUTES.EVENTS, label: 'Eventos' },
                { to: ROUTES.INSTITUTIONS, label: 'Instituciones' },
                { to: ROUTES.STATISTICS, label: 'Estadísticas' },
              ].map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className="text-sm text-[#6b6b6b] transition-colors hover:text-[#e66414]"
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Gestión */}
          <div>
            <h3 className="mb-5 text-xs font-semibold uppercase tracking-widest text-[#a0a0a0]">
              Gestión
            </h3>
            <ul className="space-y-3">
              {[
                { to: ROUTES.LOANS, label: 'Préstamos' },
                { to: ROUTES.RESERVATIONS, label: 'Reservas' },
                { to: ROUTES.DONATIONS, label: 'Donaciones' },
              ].map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className="text-sm text-[#6b6b6b] transition-colors hover:text-[#e66414]"
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}