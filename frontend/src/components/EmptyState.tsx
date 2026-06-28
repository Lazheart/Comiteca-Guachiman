import type { ReactNode } from 'react';
import { PackageOpen } from 'lucide-react';

interface EmptyStateProps {
  /** Título del estado vacío */
  title?: string;
  /** Descripción adicional */
  description?: string;
  /** Ícono personalizado */
  icon?: ReactNode;
  /** Acción opcional (botón, link, etc.) */
  action?: ReactNode;
}

/**
 * Componente para estados vacíos: sin resultados, sin datos, etc.
 */
export function EmptyState({
  title = 'Sin resultados',
  description = 'No se encontraron datos para mostrar.',
  icon,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <div className="w-16 h-16 rounded-full bg-[#2e2e2e] flex items-center justify-center">
        {icon ?? <PackageOpen size={32} className="text-[#6b6b6b]" />}
      </div>
      <div>
        <p className="text-[#f5f5f5] font-semibold text-lg mb-1">{title}</p>
        <p className="text-[#a0a0a0] text-sm max-w-xs">{description}</p>
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
