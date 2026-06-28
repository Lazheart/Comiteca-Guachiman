import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
  /** Mensaje de error a mostrar */
  message?: string;
  /** Callback opcional para reintentar */
  onRetry?: () => void;
}

/**
 * Componente para mostrar errores de API con opción de reintento.
 */
export function ErrorMessage({
  message = 'Ocurrió un error al cargar los datos.',
  onRetry,
}: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center">
        <AlertTriangle size={28} className="text-red-400" />
      </div>
      <div>
        <p className="text-[#f5f5f5] font-semibold mb-1">Algo salió mal</p>
        <p className="text-[#a0a0a0] text-sm max-w-sm">{message}</p>
      </div>
      {onRetry && (
        <button onClick={onRetry} className="btn-secondary text-sm">
          <RefreshCw size={14} />
          Reintentar
        </button>
      )}
    </div>
  );
}
