import type { ReactNode } from 'react';

type BadgeVariant = 'success' | 'danger' | 'warning' | 'info' | 'primary' | 'neutral';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  dot?: boolean;
}

/**
 * Badge para mostrar estados, etiquetas y categorías.
 */
export function Badge({ children, variant = 'neutral', dot = false }: BadgeProps) {
  return (
    <span className={`badge badge-${variant}`}>
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            variant === 'success'
              ? 'bg-green-400'
              : variant === 'danger'
              ? 'bg-red-400'
              : variant === 'warning'
              ? 'bg-yellow-400'
              : variant === 'info'
              ? 'bg-blue-400'
              : variant === 'primary'
              ? 'bg-orange-400'
              : 'bg-gray-400'
          }`}
        />
      )}
      {children}
    </span>
  );
}
