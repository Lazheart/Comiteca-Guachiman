import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useServerPagination } from '@/hooks/useServerPagination';
import { useDebounce } from '@/hooks/useDebounce';
import { materialService } from '@/services/materialService';
import type { Material, MaterialFilters, PaginationParams } from '@/interfaces';
import { Loader } from '@/components/Loader';
import { ErrorMessage } from '@/components/ErrorMessage';
import { EmptyState } from '@/components/EmptyState';
import { SearchBar } from '@/components/SearchBar';
import { Badge } from '@/components/Badge';
import { Pagination } from '@/components/Pagination';
import { SectionTitle } from '@/components/SectionTitle';
import { BookOpen, Filter, X, ChevronRight } from 'lucide-react';
import { truncate } from '@/utils/formatText';
import { GENRES, COUNTRIES } from '@/constants';

/**
 * Página de catálogo de materiales con búsqueda, filtros y paginación server-side.
 * Toda búsqueda, filtrado y paginación ocurre en el servidor.
 */
export function MaterialsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState<MaterialFilters>({
    genre: searchParams.get('genre') ?? undefined,
    author: searchParams.get('author') ?? undefined,
    country: searchParams.get('country') ?? undefined,
  });
  const [rawSearch, setRawSearch] = useState(searchParams.get('q') ?? '');
  const [showFilters, setShowFilters] = useState(false);

  // Debounce: espera 400ms antes de lanzar la petición
  const debouncedSearch = useDebounce(rawSearch, 400);

  const {
    items,
    loading,
    error,
    currentPage,
    totalPages,
    totalItems,
    setPage,
    refetch,
  } = useServerPagination<Material>({
    fetcher: (pagination: PaginationParams, signal) =>
      materialService.getAll(filters, { ...pagination, search: debouncedSearch || undefined }, signal),
    initialPageSize: 20,
    deps: [filters, debouncedSearch],
  });

  const handleSearch = (q: string) => {
    setRawSearch(q);
    if (q) setSearchParams({ q });
    else setSearchParams({});
    setPage(1);
  };

  const handleFilterChange = (key: keyof MaterialFilters, value: string | undefined) => {
    setFilters((prev) => ({ ...prev, [key]: value || undefined }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({});
    setRawSearch('');
    setSearchParams({});
    setPage(1);
  };

  const hasActiveFilters = !!filters.genre || !!filters.author || !!filters.country;

  return (
    <div className="section-container py-10">
      <SectionTitle
        title="Materiales"
        subtitle={loading ? 'Cargando...' : `${totalItems.toLocaleString()} materiales en la colección`}
      />

      {/* Barra de búsqueda y filtros */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <SearchBar
          placeholder="Buscar por título, autor..."
          defaultValue={rawSearch}
          onSearch={handleSearch}
          onClear={() => handleSearch('')}
          className="flex-1"
        />
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`btn-ghost whitespace-nowrap ${hasActiveFilters ? 'border-[#e66414] text-[#e66414]' : ''}`}
          id="toggle-filters-btn"
        >
          <Filter size={15} />
          Filtros
          {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-[#e66414]" />}
        </button>
        {(hasActiveFilters || rawSearch) && (
          <button onClick={clearFilters} className="btn-ghost text-sm" id="clear-filters-btn">
            <X size={14} />
            Limpiar
          </button>
        )}
      </div>

      {/* Panel de filtros */}
      {showFilters && (
        <div className="card p-5 mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-[#a0a0a0] font-medium mb-1.5" htmlFor="filter-genre">
              Género
            </label>
            <select
              id="filter-genre"
              className="input text-sm"
              value={filters.genre ?? ''}
              onChange={(e) => handleFilterChange('genre', e.target.value)}
            >
              <option value="">Todos los géneros</option>
              {GENRES.map((g) => (
                <option key={g.value} value={g.value}>{g.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-[#a0a0a0] font-medium mb-1.5" htmlFor="filter-author">
              Autor
            </label>
            <input
              id="filter-author"
              type="text"
              className="input text-sm"
              placeholder="Nombre del autor..."
              value={filters.author ?? ''}
              onChange={(e) => handleFilterChange('author', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs text-[#a0a0a0] font-medium mb-1.5" htmlFor="filter-country">
              País
            </label>
            <select
              id="filter-country"
              className="input text-sm"
              value={filters.country ?? ''}
              onChange={(e) => handleFilterChange('country', e.target.value)}
            >
              <option value="">Todos los países</option>
              {COUNTRIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Resultados */}
      {loading ? (
        <Loader />
      ) : error ? (
        <ErrorMessage message={error} onRetry={refetch} />
      ) : items.length === 0 ? (
        <EmptyState
          title="Sin resultados"
          description="No se encontraron materiales con los filtros aplicados."
          action={
            <button onClick={clearFilters} className="btn-secondary text-sm">
              Limpiar filtros
            </button>
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {items.map((material) => (
              <MaterialCard
                key={material.id}
                material={material}
                onClick={() => navigate(`/materiales/${material.id}`)}
              />
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}

/** Tarjeta de material */
function MaterialCard({
  material,
  onClick,
}: {
  material: Material;
  onClick: () => void;
}) {
  return (
    <article
      className="card p-5 cursor-pointer group flex flex-col gap-3"
      onClick={onClick}
      id={`material-${material.id}`}
    >
      <div className="w-full h-24 rounded-lg bg-gradient-to-br from-[#e66414]/15 to-[#ff914d]/5 flex items-center justify-center group-hover:from-[#e66414]/25 transition-colors">
        <BookOpen size={32} className="text-[#e66414] opacity-60" />
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-[#f5f5f5] text-sm leading-tight mb-1 group-hover:text-[#e66414] transition-colors line-clamp-2">
          {material.titulo}
        </h3>
        <p className="text-[#a0a0a0] text-xs mb-2 truncate">{material.autor}</p>
        <div className="flex items-center gap-1.5 flex-wrap">
          {material.genero && (
            <Badge variant="primary">{truncate(material.genero, 15)}</Badge>
          )}
          {material.paisOrigen && (
            <Badge variant="neutral">{material.paisOrigen}</Badge>
          )}
        </div>
      </div>
      <div className="flex items-center justify-end pt-2 border-t border-[#2e2e2e]">
        <ChevronRight
          size={14}
          className="text-[#6b6b6b] group-hover:text-[#e66414] transition-colors"
        />
      </div>
    </article>
  );
}
