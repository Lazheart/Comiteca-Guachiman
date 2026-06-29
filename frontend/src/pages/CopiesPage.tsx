import { useState, useCallback } from 'react';
import { useServerPagination } from '@/hooks/useServerPagination';
import { copyService } from '@/services/copyService';
import type { Copy, PaginationParams } from '@/interfaces';
import { Loader } from '@/components/Loader';
import { ErrorMessage } from '@/components/ErrorMessage';
import { EmptyState } from '@/components/EmptyState';
import { SectionTitle } from '@/components/SectionTitle';
import { Badge } from '@/components/Badge';
import { Pagination } from '@/components/Pagination';
import { SearchBar } from '@/components/SearchBar';
import { StatCard } from '@/components/StatCard';
import {
  Layers,
  CheckCircle,
  Hash,
  Search,
  XCircle,
} from 'lucide-react';
import { apiField } from '@/utils/apiField';
import { useApi } from '@/hooks/useApi';

type CopyTab = 'all' | 'available';

/**
 * Página de copias (tabla Ejemplar) con paginación server-side.
 */
export function CopiesPage() {
  const [activeTab, setActiveTab] = useState<CopyTab>('all');
  const [materialMode, setMaterialMode] = useState(false);
  const [materialValue, setMaterialValue] = useState<number | null>(null);
  const [searchMaterialId, setSearchMaterialId] = useState('');

  // Stats counts
  const { data: allStats } = useApi(() => copyService.getAll({ page: 1, page_size: 1 }), []);
  const { data: availableStats } = useApi(() => copyService.getAvailable({ page: 1, page_size: 1 }), []);

  const fetcher = useCallback(
    (pagination: PaginationParams, signal: AbortSignal) => {
      if (materialMode && materialValue !== null) return copyService.getByMaterialId(materialValue, pagination, signal);
      if (activeTab === 'available') return copyService.getAvailable(pagination, signal);
      return copyService.getAll(pagination, signal);
    },
    [activeTab, materialMode, materialValue],
  );

  const { items, loading, error, currentPage, totalPages, totalItems, setPage, refetch } =
    useServerPagination<Copy>({ fetcher, initialPageSize: 20, deps: [fetcher] });

  const handleSearchMaterial = (query: string) => {
    const id = parseInt(query);
    if (isNaN(id)) return;
    setSearchMaterialId(query);
    setMaterialValue(id);
    setMaterialMode(true);
    setPage(1);
  };

  const clearSearch = () => {
    setMaterialMode(false);
    setMaterialValue(null);
    setSearchMaterialId('');
    setPage(1);
  };

  return (
    <div className="section-container py-10">
      <SectionTitle
        title="Copias de Materiales"
        subtitle="Gestión del inventario físico de la comicteca"
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Copias" value={allStats?.total_items ?? '—'} icon={<Layers size={20} />} color="primary" />
        <StatCard label="Disponibles" value={availableStats?.total_items ?? '—'} icon={<CheckCircle size={20} />} color="success" />
      </div>

      <div className="card p-5 mb-6">
        <h3 className="text-[#a0a0a0] text-xs font-semibold uppercase tracking-wider mb-4 flex items-center gap-2">
          <Search size={13} />
          Búsqueda
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-[#a0a0a0] mb-1.5 flex items-center gap-1.5">
              <Hash size={11} />
              Buscar por ID de material
            </label>
            <SearchBar
              placeholder="Ingresa el ID del material..."
              defaultValue={searchMaterialId}
              onSearch={handleSearchMaterial}
              onClear={clearSearch}
            />
          </div>
        </div>
      </div>

      {!materialMode && (
        <div className="flex gap-1 p-1 bg-[#1a1a1a] border border-[#2e2e2e] rounded-xl w-fit mb-6">
          {([
            { key: 'all', label: 'Todas' },
            { key: 'available', label: 'Disponibles' },
          ] as { key: CopyTab; label: string }[]).map((tab) => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setPage(1); }}
              id={`copy-tab-${tab.key}`}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-[#e66414] text-white'
                  : 'text-[#a0a0a0] hover:text-[#f5f5f5]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <Loader />
      ) : error ? (
        <ErrorMessage message={error} onRetry={refetch} />
      ) : items.length === 0 ? (
        <EmptyState title="Sin copias" description="No se encontraron copias registradas." />
      ) : (
        <>
          <p className="text-xs text-[#6b6b6b] mb-3">{totalItems.toLocaleString()} copias en total</p>
          <div className="card overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Material ID</th>
                  <th># Copia</th>
                  <th>Estado conservación</th>
                  <th>Disponibilidad</th>
                </tr>
              </thead>
              <tbody>
                {items.map((copy) => {
                  const materialId = apiField<number>(copy, 'material_id') ?? 0;
                  const numeroCopia = apiField<number>(copy, 'numeroCopia', 'numerocopia') ?? 0;
                  const estado = apiField<string>(copy, 'estadoConservacion', 'estadoconservacion');
                  const disponibilidad = apiField<string>(copy, 'disponibilidad');

                  return (
                    <tr key={`${materialId}-${numeroCopia}`} id={`copy-row-${materialId}-${numeroCopia}`}>
                      <td className="font-mono text-[#a0a0a0]">#{materialId}</td>
                      <td className="font-mono text-[#e66414]">#{numeroCopia}</td>
                      <td>
                        {estado ? (
                          <Badge variant="neutral">{estado}</Badge>
                        ) : (
                          <span className="text-[#6b6b6b]">—</span>
                        )}
                      </td>
                      <td>
                        {disponibilidad === 'Disponible' ? (
                          <span className="flex items-center gap-1.5 text-green-400 text-sm">
                            <CheckCircle size={14} />
                            Disponible
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-red-400 text-sm">
                            <XCircle size={14} />
                            {disponibilidad ?? 'No disponible'}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
