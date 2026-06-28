import { useState, useCallback } from 'react';
import { useApi } from '@/hooks/useApi';
import { usePagination } from '@/hooks/usePagination';
import { copyService } from '@/services/copyService';
import type { Copy } from '@/interfaces';
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
import { DEFAULT_PAGE_SIZE } from '@/constants';
import { apiField } from '@/utils/apiField';

type CopyTab = 'all' | 'available';

/**
 * Página de copias (tabla Ejemplar):
 *   material_id, numeroCopia, estadoConservacion, disponibilidad
 */
export function CopiesPage() {
  const [activeTab, setActiveTab] = useState<CopyTab>('all');
  const [searchMaterialId, setSearchMaterialId] = useState('');
  const [materialResults, setMaterialResults] = useState<Copy[] | null>(null);
  const [searching, setSearching] = useState(false);

  const { data: allCopies, loading: lAll, error: eAll, refetch: rAll } = useApi(() => copyService.getAll(), []);
  const { data: availableCopies, loading: lAvailable, error: eAvailable, refetch: rAvailable } = useApi(() => copyService.getAvailable(), []);

  const tabData: Record<CopyTab, { data: Copy[] | null; loading: boolean; error: string | null; refetch: () => void }> = {
    all: { data: materialResults ?? allCopies, loading: lAll, error: eAll, refetch: rAll },
    available: { data: availableCopies, loading: lAvailable, error: eAvailable, refetch: rAvailable },
  };

  const { data, loading, error, refetch } = tabData[activeTab];
  const displayList = data ?? [];

  const { currentPage, totalPages, offset, limit, setPage } = usePagination({
    totalItems: displayList.length,
    itemsPerPage: DEFAULT_PAGE_SIZE,
  });
  const paginated = displayList.slice(offset, offset + limit);

  const handleSearchMaterial = useCallback(async (query: string) => {
    const id = parseInt(query);
    if (isNaN(id)) return;
    setSearching(true);
    try {
      const results = await copyService.getByMaterial(id);
      setMaterialResults(results);
    } finally {
      setSearching(false);
    }
  }, []);

  const clearSearch = () => {
    setMaterialResults(null);
    setSearchMaterialId('');
  };

  return (
    <div className="section-container py-10">
      <SectionTitle
        title="Copias de Materiales"
        subtitle="Gestión del inventario físico de la comicteca"
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Copias" value={allCopies?.length ?? '—'} icon={<Layers size={20} />} color="primary" />
        <StatCard label="Disponibles" value={availableCopies?.length ?? '—'} icon={<CheckCircle size={20} />} color="success" />
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
              onSearch={(q) => { setSearchMaterialId(q); handleSearchMaterial(q); }}
              onClear={clearSearch}
            />
          </div>
        </div>
      </div>

      {!materialResults && (
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

      {loading || searching ? (
        <Loader />
      ) : error ? (
        <ErrorMessage message={error} onRetry={refetch} />
      ) : paginated.length === 0 ? (
        <EmptyState title="Sin copias" description="No se encontraron copias registradas." />
      ) : (
        <>
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
                {paginated.map((copy) => {
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
