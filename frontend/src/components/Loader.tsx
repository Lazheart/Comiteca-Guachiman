import { Loader2 } from 'lucide-react';

interface LoaderProps {
  /** Texto opcional a mostrar bajo el spinner */
  text?: string;
  /** Tamaño del spinner en px */
  size?: number;
  /** Si es true, ocupa toda la pantalla */
  fullScreen?: boolean;
}

/**
 * Componente de carga con spinner animado.
 */
export function Loader({ text = 'Cargando...', size = 40, fullScreen = false }: LoaderProps) {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#0f0f0f] z-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2
            size={size}
            className="text-[#e66414] animate-spin"
            strokeWidth={2}
          />
          <p className="text-[#a0a0a0] text-sm font-medium">{text}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16">
      <Loader2
        size={size}
        className="text-[#e66414] animate-spin"
        strokeWidth={2}
      />
      <p className="text-[#a0a0a0] text-sm font-medium">{text}</p>
    </div>
  );
}
