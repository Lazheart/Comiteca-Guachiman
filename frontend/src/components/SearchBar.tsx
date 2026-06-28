import { Search, X } from 'lucide-react';
import { useState } from 'react';

interface SearchBarProps {
  /** Placeholder del input */
  placeholder?: string;
  /** Valor inicial */
  defaultValue?: string;
  /** Callback al hacer submit (Enter o clic en buscar) */
  onSearch: (query: string) => void;
  /** Callback al limpiar */
  onClear?: () => void;
  /** Clase CSS adicional */
  className?: string;
  /** Tamaño: sm | md | lg */
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Barra de búsqueda reutilizable.
 */
export function SearchBar({
  placeholder = 'Buscar...',
  defaultValue = '',
  onSearch,
  onClear,
  className = '',
  size = 'md',
}: SearchBarProps) {
  const [value, setValue] = useState(defaultValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(value);
  };

  const handleClear = () => {
    setValue('');
    onClear?.();
  };

  const sizeClasses = {
    sm: 'py-2 text-sm',
    md: 'py-3 text-base',
    lg: 'py-4 text-lg',
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <Search
        size={size === 'lg' ? 20 : 16}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b6b6b] pointer-events-none"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className={`input pl-11 pr-10 ${sizeClasses[size]}`}
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6b6b6b] hover:text-[#f5f5f5] transition-colors"
          aria-label="Limpiar búsqueda"
        >
          <X size={14} />
        </button>
      )}
    </form>
  );
}
