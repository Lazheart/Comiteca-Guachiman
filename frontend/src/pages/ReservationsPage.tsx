import { useState, useCallback } from 'react';
import { useApi } from '@/hooks/useApi';
import { usePagination } from '@/hooks/usePagination';
import { reservationService } from '@/services/reservationService';
import type { Reservation } from '@/interfaces';
import { Loader } from '@/components/Loader';
import { ErrorMessage } from '@/components/ErrorMessage';
import { EmptyState } from '@/components/EmptyState';
import { SectionTitle } from '@/components/SectionTitle';
import { Badge } from '@/components/Badge';
import { Pagination } from '@/components/Pagination';
import { SearchBar } from '@/components/SearchBar';
import { StatCard } from '@/components/StatCard';
import { ClipboardList, Clock, BookOpen, User } from 'lucide-react';
import { formatDate } from '@/utils/formatDate';
import { DEFAULT_PAGE_SIZE } from '@/constants';

type ReservationTab = 'all' | 'pending';

/**
 * Página de reservas con tabs (todas/pendientes) y búsqueda por DNI.
 */
export function ReservationsPage() {
  const [activeTab, setActiveTab] = useState<ReservationTab>('all');
  const [dniResults, setDniResults] = useState<Reservation[] | null>(null);
  const [searching, setSearching] = useState(false);

  const { data: allReservations, loading: lAll, error: eAll, refetch: rAll } = useApi(
    () => reservationService.getAll(),
    [],
  );
  const { data: pending, loading: lPending, error: ePending, refetch: rPending } = useApi(
    () => reservationService.getPending(),
    [],
  );

  const base = activeTab === 'pending' ? pending : allReservations;
  const displayList = dniResults ?? base ?? [];
  const loading = activeTab === 'pending' ? lPending : lAll;
  const error = activeTab === 'pending' ? ePending : eAll;
  const refetch = activeTab === 'pending' ? rPending : rAll;

  const { currentPage, totalPages, offset, limit, setPage } = usePagination({
    totalItems: displayList.length,
    itemsPerPage: DEFAULT_PAGE_SIZE,
  });
  const paginated = displayList.slice(offset, offset + limit);

  const handleSearchDni = useCallback(async (query: string) => {
    const dni = parseInt(query);
    if (isNaN(dni)) return;
    setSearching(true);
    try {
      const results = await reservationService.getByMember(dni);
      setDniResults(results);
    } finally {
      setSearching(false);
    }
  }, []);

  const clearSearch = () => {
    setDniResults(null);
  };

  return (
    <div className="section-container py-10">
      <SectionTitle
        title="Reservas"
        subtitle="Gestión de reservas de materiales"
      />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <StatCard
          label="Total reservas"
          value={allReservations?.length ?? '—'}
          icon={<ClipboardList size={20} />}
          color="primary"
        />
        <StatCard
          label="Pendientes"
          value={pending?.length ?? '—'}
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
      {!dniResults && (
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
      {loading || searching ? (
        <Loader />
      ) : error ? (
        <ErrorMessage message={error} onRetry={refetch} />
      ) : paginated.length === 0 ? (
        <EmptyState title="Sin reservas" description="No hay reservas para mostrar." />
      ) : (
        <>
          <div className="card overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Miembro DNI</th>
                  <th>Material</th>
                  <th>Fecha reserva</th>
                  <th>Expiración</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((res) => (
                  <tr key={res.id} id={`reservation-row-${res.id}`}>
                    <td className="font-mono text-[#e66414]">#{res.id}</td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <User size={12} className="text-[#6b6b6b]" />
                        {res.miembro_dni}
                        {res.miembro_nombre && (
                          <span className="text-[#6b6b6b] text-xs">({res.miembro_nombre})</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <BookOpen size={12} className="text-[#6b6b6b]" />
                        {res.material_titulo ?? `ID ${res.material_id}`}
                      </div>
                    </td>
                    <td className="text-[#a0a0a0]">{formatDate(res.fecha_reserva)}</td>
                    <td className="text-[#a0a0a0]">
                      {res.fecha_expiracion ? formatDate(res.fecha_expiracion) : '—'}
                    </td>
                    <td>
                      <ReservationStatusBadge estado={res.estado} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}

function ReservationStatusBadge({ estado }: { estado?: string }) {
  if (!estado) return <Badge variant="neutral">—</Badge>;
  const statusMap: Record<string, 'warning' | 'success' | 'neutral' | 'danger'> = {
    pendiente: 'warning',
    completada: 'success',
    cancelada: 'danger',
  };
  return (
    <Badge variant={statusMap[estado.toLowerCase()] ?? 'neutral'} dot>
      {estado}
    </Badge>
  );
}
