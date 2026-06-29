import type { ReactNode } from 'react';

interface StatCardProps {
  /** Título de la estadística */
  label: string;
  /** Valor principal */
  value: string | number;
  /** Ícono */
  icon: ReactNode;
  /** Texto de tendencia o info extra */
  trend?: string;
  /** Color del ícono: primary | success | info | warning | danger */
  color?: 'primary' | 'success' | 'info' | 'warning' | 'danger';
}

const colorMap = {
  primary: 'bg-[#e66414]/10 text-[#e66414]',
  success: 'bg-green-500/10 text-green-400',
  info: 'bg-blue-500/10 text-blue-400',
  warning: 'bg-yellow-500/10 text-yellow-400',
  danger: 'bg-red-500/10 text-red-400',
};

/**
 * Tarjeta para mostrar una estadística rápida.
 */
export function StatCard({ label, value, icon, trend, color = 'primary' }: StatCardProps) {
  return (
    <div className="card p-6 flex items-center gap-5">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${colorMap[color]}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[#a0a0a0] text-xs font-medium uppercase tracking-wider mb-1">
          {label}
        </p>
        <p className="font-display text-2xl font-bold text-[#f5f5f5] truncate">
          {value}
        </p>
        {trend && (
          <p className="text-[#6b6b6b] text-xs mt-0.5">{trend}</p>
        )}
      </div>
    </div>
  );
}
