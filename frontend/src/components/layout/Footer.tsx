import { NavLink } from 'react-router-dom';
import { BookOpen, Github, Heart } from 'lucide-react';
import { ROUTES, APP_NAME } from '@/constants';

/**
 * Footer de la aplicación.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[#2e2e2e] bg-[#0a0a0a] mt-auto">
      <div className="section-container py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Branding */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#e66414] to-[#ff914d] flex items-center justify-center">
                <BookOpen size={14} className="text-white" strokeWidth={2.5} />
              </div>
              <span className="font-display font-bold text-sm text-[#f5f5f5]">
                {APP_NAME}
              </span>
            </div>
            <p className="text-[#6b6b6b] text-sm leading-relaxed">
              Plataforma digital para la gestión y visualización de la comicteca.
            </p>
          </div>

          {/* Navegación */}
          <div>
            <h3 className="text-[#a0a0a0] text-xs font-semibold uppercase tracking-wider mb-4">
              Explorar
            </h3>
            <ul className="flex flex-col gap-2">
              {[
                { to: ROUTES.MATERIALS, label: 'Materiales' },
                { to: ROUTES.EVENTS, label: 'Eventos' },
                { to: ROUTES.INSTITUTIONS, label: 'Instituciones' },
                { to: ROUTES.STATISTICS, label: 'Estadísticas' },
              ].map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className="text-[#6b6b6b] hover:text-[#e66414] text-sm transition-colors"
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Gestión */}
          <div>
            <h3 className="text-[#a0a0a0] text-xs font-semibold uppercase tracking-wider mb-4">
              Gestión
            </h3>
            <ul className="flex flex-col gap-2">
              {[
                { to: ROUTES.LOANS, label: 'Préstamos' },
                { to: ROUTES.RESERVATIONS, label: 'Reservas' },
                { to: ROUTES.DONATIONS, label: 'Donaciones' },
              ].map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className="text-[#6b6b6b] hover:text-[#e66414] text-sm transition-colors"
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-[#1e1e1e] mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[#4a4a4a] text-xs">
            © {year} {APP_NAME}. Todos los derechos reservados.
          </p>
          <p className="text-[#4a4a4a] text-xs flex items-center gap-1">
            Hecho con <Heart size={11} className="text-[#e66414]" /> y mucho cómic
            <Github size={13} className="ml-2 hover:text-[#a0a0a0] cursor-pointer transition-colors" />
          </p>
        </div>
      </div>
    </footer>
  );
}
