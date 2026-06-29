import { useState, useCallback } from 'react';
import { useServerPagination } from '@/hooks/useServerPagination';
import { loanService } from '@/services/loanService';
import type { Loan, PaginationParams } from '@/interfaces';
import { Loader } from '@/components/Loader';
import { ErrorMessage } from '@/components/ErrorMessage';
import { EmptyState } from '@/components/EmptyState';
import { SectionTitle } from '@/components/SectionTitle';
import { Badge } from '@/components/Badge';
import { Pagination } from '@/components/Pagination';
import { SearchBar } from '@/components/SearchBar';
import { StatCard } from '@/components/StatCard';
import {
  BookMarked,
  CheckCircle,
  AlertTriangle,
  Search,
  Hash,
  BookOpen,
  User,
  Copy,
} from 'lucide-react';
import { formatDate } from '@/utils/formatDate';
import { apiField } from '@/utils/apiField';
import { useApi } from '@/hooks/useApi';

type LoanTab = 'all' | 'active' | 'expired';

/**
 * Página de préstamos con tabs y búsqueda por DNI/material.
 * Toda la paginación ocurre en el servidor.
 */
export function LoansPage() {
  const [activeTab, setActiveTab] = useState<LoanTab>('all');
  const [searchDni, setSearchDni] = useState('');
  const [searchMaterialId, setSearchMaterialId] = useState('');
  const [dniMode, setDniMode] = useState(false);
  const [materialMode, setMaterialMode] = useState(false);
  const [dniValue, setDniValue] = useState<number | null>(null);
  const [materialValue, setMaterialValue] = useState<number | null>(null);

  // Stats: sólo counts — peticiones pequeñas
  const { data: allStats } = useApi(() => loanService.getAll({ page: 1, page_size: 1 }), []);
  const { data: activeStats } = useApi(() => loanService.getActive({ page: 1, page_size: 1 }), []);
  const { data: expiredStats } = useApi(() => loanService.getExpired({ page: 1, page_size: 1 }), []);

  const fetcher = useCallback(
    (pagination: PaginationParams, signal: AbortSignal) => {
      if (dniMode && dniValue !== null) return loanService.getByMember(dniValue, pagination, signal);
      if (materialMode && materialValue !== null) return loanService.getByMaterial(materialValue, pagination, signal);
      if (activeTab === 'active') return loanService.getActive(pagination, signal);
      if (activeTab === 'expired') return loanService.getExpired(pagination, signal);
      return loanService.getAll(pagination, signal);
    },
    [activeTab, dniMode, dniValue, materialMode, materialValue],
  );

  const { items, loading, error, currentPage, totalPages, totalItems, setPage, refetch } =
    useServerPagination<Loan>({ fetcher, initialPageSize: 20, deps: [fetcher] });

  const handleSearchDni = (query: string) => {
    const dni = parseInt(query);
    if (isNaN(dni)) return;
    setSearchDni(query);
    setDniValue(dni);
    setDniMode(true);
    setMaterialMode(false);
    setPage(1);
  };

  const handleSearchMaterial = (query: string) => {
    const id = parseInt(query);
    if (isNaN(id)) return;
    setSearchMaterialId(query);
    setMaterialValue(id);
    setMaterialMode(true);
    setDniMode(false);
    setPage(1);
  };

  const clearSearch = () => {
    setDniMode(false);
    setMaterialMode(false);
    setDniValue(null);
    setMaterialValue(null);
    setSearchDni('');
    setSearchMaterialId('');
    setPage(1);
  };

  return (
    <div className="section-container py-10">
      <SectionTitle title="Préstamos" subtitle="Gestión de préstamos de materiales" />

      {/* Stats rápidas */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard label="Total" value={allStats?.total_items ?? '—'} icon={<BookMarked size={20} />} color="primary" />
        <StatCard label="En Curso" value={activeStats?.total_items ?? '—'} icon={<CheckCircle size={20} />} color="success" />
        <StatCard label="Vencidos" value={expiredStats?.total_items ?? '—'} icon={<AlertTriangle size={20} />} color="danger" />
      </div>

      {/* Búsquedas */}
      <div className="card p-5 mb-6">
        <h3 className="text-[#a0a0a0] text-xs font-semibold uppercase tracking-wider mb-4 flex items-center gap-2">
          <Search size={13} />
          Búsqueda avanzada
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-[#a0a0a0] mb-1.5 flex items-center gap-1.5">
              <User size={11} />
              Buscar por DNI del miembro
            </label>
            <SearchBar
              placeholder="Ingresa el DNI..."
              defaultValue={searchDni}
              onSearch={handleSearchDni}
              onClear={clearSearch}
            />
          </div>
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

      {/* Tabs */}
      {!dniMode && !materialMode && (
        <div className="flex gap-1 p-1 bg-[#1a1a1a] border border-[#2e2e2e] rounded-xl w-fit mb-6">
          {([
            { key: 'all', label: 'Todos' },
            { key: 'active', label: 'En Curso' },
            { key: 'expired', label: 'Vencidos' },
          ] as { key: LoanTab; label: string }[]).map((tab) => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setPage(1); }}
              id={`loan-tab-${tab.key}`}
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

      {/* Tabla */}
      {loading ? (
        <Loader />
      ) : error ? (
        <ErrorMessage message={error} onRetry={refetch} />
      ) : items.length === 0 ? (
        <EmptyState title="Sin préstamos" description="No hay préstamos para mostrar." />
      ) : (
        <>
          <p className="text-xs text-[#6b6b6b] mb-3">{totalItems.toLocaleString()} préstamos en total</p>
          <div className="card overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Miembro DNI</th>
                  <th>Bibliotecario DNI</th>
                  <th>Material ID</th>
                  <th>Copia</th>
                  <th>F. Préstamo</th>
                  <th>F. Límite</th>
                  <th>F. Devolución</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {items.map((loan) => {
                  const miembroDni = apiField<number>(loan, 'miembro_DNI', 'miembro_dni');
                  const bibliotecarioDni = apiField<number>(loan, 'bibliotecario_DNI', 'bibliotecario_dni');
                  const materialId = apiField<number>(loan, 'material_id');
                  const numeroCopia = apiField<number>(loan, 'numeroCopia', 'numerocopia');
                  const fechaPrestamo = apiField<string>(loan, 'fechaPrestamo', 'fechaprestamo');
                  const fechaLimite = apiField<string>(loan, 'fechaLimite', 'fechalimite');
                  const fechaDevolucion = apiField<string | null>(loan, 'fechaDevolucion', 'fechadevolucion');
                  const estado = apiField<string>(loan, 'estado');

                  return (
                    <tr key={loan.id} id={`loan-row-${loan.id}`}>
                      <td className="font-mono text-[#e66414]">#{loan.id}</td>
                      <td>
                        <div className="flex items-center gap-1.5">
                          <User size={12} className="text-[#6b6b6b]" />
                          {miembroDni}
                        </div>
                      </td>
                      <td className="font-mono text-xs">{bibliotecarioDni ?? '—'}</td>
                      <td>
                        <div className="flex items-center gap-1.5">
                          <BookOpen size={12} className="text-[#6b6b6b]" />
                          {materialId ?? '—'}
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-1.5">
                          <Copy size={12} className="text-[#6b6b6b]" />
                          #{numeroCopia}
                        </div>
                      </td>
                      <td className="text-[#a0a0a0]">{fechaPrestamo ? formatDate(fechaPrestamo) : '—'}</td>
                      <td className="text-[#a0a0a0]">
                        {fechaLimite ? formatDate(fechaLimite) : '—'}
                      </td>
                      <td className="text-[#a0a0a0]">
                        {fechaDevolucion ? formatDate(fechaDevolucion) : (
                          <span className="text-[#6b6b6b] text-xs italic">Pendiente</span>
                        )}
                      </td>
                      <td>
                        <LoanStatusBadge estado={estado} fechaDevolucion={fechaDevolucion} />
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

function LoanStatusBadge({
  estado,
  fechaDevolucion,
}: {
  estado?: string;
  fechaDevolucion?: string | null;
}) {
  if (fechaDevolucion) return <Badge variant="success" dot>Devuelto</Badge>;
  if (estado === 'En Curso') return <Badge variant="info" dot>En Curso</Badge>;
  return <Badge variant="danger" dot>Vencido</Badge>;
}
