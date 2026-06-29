import { useState, useCallback } from 'react';
import { useServerPagination } from '@/hooks/useServerPagination';
import { reservationService } from '@/services/reservationService';
import type { Reservation, PaginationParams } from '@/interfaces';
import { Loader } from '@/components/Loader';
import { ErrorMessage } from '@/components/ErrorMessage';
import { EmptyState } from '@/components/EmptyState';
import { SectionTitle } from '@/components/SectionTitle';
import { Badge } from '@/components/Badge';
import { Pagination } from '@/components/Pagination';
import { SearchBar } from '@/components/SearchBar';
import { StatCard } from '@/components/StatCard';
import { ClipboardList, Clock, BookOpen, User, Copy } from 'lucide-react';
import { formatDate } from '@/utils/formatDate';
import { apiField } from '@/utils/apiField';
import { useApi } from '@/hooks/useApi';

type ReservationTab = 'all' | 'pending';

/**
 * Página de reservas con tabs y búsqueda por DNI. Paginación server-side.
 */
export function ReservationsPage() {
  const [activeTab, setActiveTab] = useState<ReservationTab>('all');
  const [dniMode, setDniMode] = useState(false);
  const [dniValue, setDniValue] = useState<number | null>(null);

  // Stats counts
  const { data: allStats } = useApi(() => reservationService.getAll({ page: 1, page_size: 1 }), []);
  const { data: pendingStats } = useApi(() => reservationService.getPending({ page: 1, page_size: 1 }), []);

  const fetcher = useCallback(
    (pagination: PaginationParams, signal: AbortSignal) => {
      if (dniMode && dniValue !== null) return reservationService.getByMember(dniValue, pagination, signal);
      if (activeTab === 'pending') return reservationService.getPending(pagination, signal);
      return reservationService.getAll(pagination, signal);
    },
    [activeTab, dniMode, dniValue],
  );

  const { items, loading, error, currentPage, totalPages, totalItems, setPage, refetch } =
    useServerPagination<Reservation>({ fetcher, initialPageSize: 20, deps: [fetcher] });

  const handleSearchDni = (query: string) => {
    const dni = parseInt(query);
    if (isNaN(dni)) return;
    setDniValue(dni);
    setDniMode(true);
    setPage(1);
  };

  const clearSearch = () => {
    setDniMode(false);
    setDniValue(null);
    setPage(1);
  };

  return (
    <div className="section-container py-10">
      <SectionTitle title="Reservas" subtitle="Gestión de reservas de materiales" />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <StatCard
          label="Total reservas"
          value={allStats?.total_items ?? '—'}
          icon={<ClipboardList size={20} />}
          color="primary"
        />
        <StatCard
          label="Pendientes"
          value={pendingStats?.total_items ?? '—'}
          icon={<Clock size={20} />}
          color="warning"
        />
      </div>

      {/* Búsqueda por DNI */}
      <div className="card p-5 mb-6">
        <label className="block text-xs text-[#a0a0a0] font-medium mb-2 flex items-center gap-1.5">
          <User size={11} />
          Buscar por DNI del miembro
        </label>
        <SearchBar
          placeholder="Ingresa el DNI..."
          onSearch={handleSearchDni}
          onClear={clearSearch}
          className="max-w-sm"
        />
      </div>

      {/* Tabs */}
      {!dniMode && (
        <div className="flex gap-1 p-1 bg-[#1a1a1a] border border-[#2e2e2e] rounded-xl w-fit mb-6">
          {([
            { key: 'all', label: 'Todas' },
            { key: 'pending', label: 'Pendientes' },
          ] as { key: ReservationTab; label: string }[]).map((tab) => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setPage(1); }}
              id={`reservation-tab-${tab.key}`}
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

      {/* Contenido */}
      {loading ? (
        <Loader />
      ) : error ? (
        <ErrorMessage message={error} onRetry={refetch} />
      ) : items.length === 0 ? (
        <EmptyState title="Sin reservas" description="No hay reservas para mostrar." />
      ) : (
        <>
          <p className="text-xs text-[#6b6b6b] mb-3">{totalItems.toLocaleString()} reservas en total</p>
          <div className="card overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Miembro DNI</th>
                  <th>Bibliotecario DNI</th>
                  <th>Material ID</th>
                  <th>Copia</th>
                  <th>Fecha reserva</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {items.map((res, idx) => {
                  const miembroDni = apiField<number>(res, 'miembro_DNI', 'miembro_dni');
                  const bibliotecarioDni = apiField<number>(res, 'bibliotecario_DNI', 'bibliotecario_dni');
                  const materialId = apiField<number>(res, 'material_id');
                  const numeroCopia = apiField<number>(res, 'numeroCopia', 'numerocopia');
                  const fechaReserva = apiField<string>(res, 'fechaReserva', 'fechareserva');
                  const estadoReserva = apiField<string>(res, 'estadoReserva', 'estadoreserva');

                  return (
                    <tr
                      key={`${miembroDni}-${materialId}-${numeroCopia}-${idx}`}
                      id={`reservation-row-${miembroDni}-${materialId}-${numeroCopia}`}
                    >
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
                      <td className="text-[#a0a0a0]">{fechaReserva ? formatDate(fechaReserva) : '—'}</td>
                      <td>
                        <ReservationStatusBadge estadoReserva={estadoReserva} />
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

function ReservationStatusBadge({ estadoReserva }: { estadoReserva?: string }) {
  if (!estadoReserva) return <Badge variant="neutral">—</Badge>;
  const statusMap: Record<string, 'warning' | 'success' | 'neutral' | 'danger'> = {
    pendiente: 'warning',
    completada: 'success',
    cancelada: 'danger',
  };
  return (
    <Badge variant={statusMap[estadoReserva.toLowerCase()] ?? 'neutral'} dot>
      {estadoReserva}
    </Badge>
  );
}
