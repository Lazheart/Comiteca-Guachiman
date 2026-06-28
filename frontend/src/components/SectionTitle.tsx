import type { ReactNode } from 'react';

interface SectionTitleProps {
  /** Título principal */
  title: string;
  /** Subtítulo o descripción */
  subtitle?: string;
  /** Acción opcional a la derecha (botón, link) */
  action?: ReactNode;
  /** Clases adicionales */
  className?: string;
}

/**
 * Encabezado de sección con título, subtítulo y acción opcional.
 */
export function SectionTitle({ title, subtitle, action, className = '' }: SectionTitleProps) {
  return (
    <div className={`flex items-start justify-between gap-4 mb-6 ${className}`}>
      <div>
        <h2 className="font-display text-2xl font-bold text-[#f5f5f5] leading-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-[#a0a0a0] text-sm mt-1">{subtitle}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
