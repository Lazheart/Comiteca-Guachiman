import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApi } from '@/hooks/useApi';
import { usePagination } from '@/hooks/usePagination';
import { materialService } from '@/services/materialService';
import type { Material, MaterialFilters } from '@/interfaces';
import { Loader } from '@/components/Loader';
import { ErrorMessage } from '@/components/ErrorMessage';
import { EmptyState } from '@/components/EmptyState';
import { SearchBar } from '@/components/SearchBar';
import { Badge } from '@/components/Badge';
import { Pagination } from '@/components/Pagination';
import { SectionTitle } from '@/components/SectionTitle';
import { BookOpen, Filter, X, ChevronRight } from 'lucide-react';
import { truncate } from '@/utils/formatText';
import { DEFAULT_PAGE_SIZE } from '@/constants';

/**
 * Página de catálogo de materiales con búsqueda, filtros y paginación.
 */
export function MaterialsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState<MaterialFilters>({
    genre: searchParams.get('genre') ?? undefined,
    author: searchParams.get('author') ?? undefined,
    country: searchParams.get('country') ?? undefined,
    available: searchParams.get('available') === 'true' ? true : undefined,
  });
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') ?? '');
  const [searchResults, setSearchResults] = useState<Material[] | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const { data: allMaterials, loading, error, refetch } = useApi(
    () => materialService.getAll(filters),
    [filters],
  );

  const displayedList = searchResults ?? allMaterials ?? [];
  const { currentPage, totalPages, offset, limit, setPage } = usePagination({
    totalItems: displayedList.length,
    itemsPerPage: DEFAULT_PAGE_SIZE,
  });
  const paginated = displayedList.slice(offset, offset + limit);

  // Búsqueda por query string en la URL
  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setSearchQuery(q);
      performSearch(q);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const performSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setSearchResults(null);
      return;
    }
    setSearchLoading(true);
    try {
      const results = await materialService.search(q);
      setSearchResults(results);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    if (q) {
      setSearchParams({ q });
      performSearch(q);
    } else {
      setSearchResults(null);
      setSearchParams({});
    }
    setPage(1);
  };

  const handleFilterChange = (key: keyof MaterialFilters, value: string | boolean | undefined) => {
    setFilters((prev) => ({ ...prev, [key]: value || undefined }));
    setSearchResults(null);
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({});
    setSearchResults(null);
    setSearchQuery('');
    setSearchParams({});
    setPage(1);
  };

  const hasActiveFilters =
    !!filters.genre || !!filters.author || !!filters.country || !!filters.available;

  return (
    <div className="section-container py-10">
      <SectionTitle
        title="Materiales"
        subtitle={`${displayedList.length} materiales en la colección`}
      />

      {/* Barra de búsqueda y filtros */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <SearchBar
          placeholder="Buscar por título, autor, género..."
          defaultValue={searchQuery}
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
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-[#e66414]" />
          )}
        </button>
        {(hasActiveFilters || searchQuery) && (
          <button onClick={clearFilters} className="btn-ghost text-sm" id="clear-filters-btn">
            <X size={14} />
            Limpiar
          </button>
        )}
      </div>

      {/* Panel de filtros */}
      {showFilters && (
        <div className="card p-5 mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs text-[#a0a0a0] font-medium mb-1.5" htmlFor="filter-genre">
              Género
            </label>
            <input
              id="filter-genre"
              type="text"
              className="input text-sm"
              placeholder="Acción, Drama..."
              value={filters.genre ?? ''}
              onChange={(e) => handleFilterChange('genre', e.target.value)}
            />
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
            <input
              id="filter-country"
              type="text"
              className="input text-sm"
              placeholder="Japón, USA, España..."
              value={filters.country ?? ''}
              onChange={(e) => handleFilterChange('country', e.target.value)}
            />
          </div>
          <div className="flex flex-col justify-center">
            <label className="flex items-center gap-3 cursor-pointer" htmlFor="filter-available">
              <div
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  filters.available ? 'bg-[#e66414]' : 'bg-[#2e2e2e]'
                }`}
                onClick={() => handleFilterChange('available', !filters.available)}
              >
                <div
                  className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                    filters.available ? 'translate-x-5' : ''
                  }`}
                />
              </div>
              <input
                id="filter-available"
                type="checkbox"
                className="sr-only"
                checked={!!filters.available}
                onChange={(e) => handleFilterChange('available', e.target.checked || undefined)}
              />
              <span className="text-sm text-[#a0a0a0]">Solo disponibles</span>
            </label>
          </div>
        </div>
      )}

      {/* Resultados */}
      {loading || searchLoading ? (
        <Loader />
      ) : error ? (
        <ErrorMessage message={error} onRetry={refetch} />
      ) : paginated.length === 0 ? (
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
            {paginated.map((material) => (
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
          {material.pais && (
            <Badge variant="neutral">{material.pais}</Badge>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-[#2e2e2e]">
        <Badge
          variant={material.disponible !== false ? 'success' : 'danger'}
          dot
        >
          {material.disponible !== false ? 'Disponible' : 'No disponible'}
        </Badge>
        <ChevronRight
          size={14}
          className="text-[#6b6b6b] group-hover:text-[#e66414] transition-colors"
        />
      </div>
    </article>
  );
}
