import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '@/hooks/useApi';
import { usePagination } from '@/hooks/usePagination';
import { eventService } from '@/services/eventService';
import type { EventFilters } from '@/interfaces';
import { Loader } from '@/components/Loader';
import { ErrorMessage } from '@/components/ErrorMessage';
import { EmptyState } from '@/components/EmptyState';
import { Pagination } from '@/components/Pagination';
import { SectionTitle } from '@/components/SectionTitle';
import { Badge } from '@/components/Badge';
import { CalendarDays, MapPin, Clock, ChevronRight } from 'lucide-react';
import { formatDate, isPast, relativeDateLabel } from '@/utils/formatDate';
import { truncate } from '@/utils/formatText';
import { DEFAULT_PAGE_SIZE } from '@/constants';
import { apiField } from '@/utils/apiField';

/**
 * Página de eventos con filtros de fecha y vista de próximos eventos.
 */
export function EventsPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<EventFilters>({});
  const [activeTab, setActiveTab] = useState<'all' | 'upcoming'>('upcoming');

  const { data: allEvents, loading: loadingAll, error: errorAll, refetch: refetchAll } = useApi(
    () => eventService.getAll(filters),
    [filters],
  );
  const { data: upcoming, loading: loadingUpcoming, error: errorUpcoming, refetch: refetchUpcoming } = useApi(
    () => eventService.getUpcoming(),
    [],
  );

  const displayList = activeTab === 'upcoming' ? (upcoming ?? []) : (allEvents ?? []);
  const loading = activeTab === 'upcoming' ? loadingUpcoming : loadingAll;
  const error = activeTab === 'upcoming' ? errorUpcoming : errorAll;
  const refetch = activeTab === 'upcoming' ? refetchUpcoming : refetchAll;

  const { currentPage, totalPages, offset, limit, setPage } = usePagination({
    totalItems: displayList.length,
    itemsPerPage: DEFAULT_PAGE_SIZE,
  });
  const paginated = displayList.slice(offset, offset + limit);

  return (
    <div className="section-container py-10">
      <SectionTitle
        title="Eventos"
        subtitle="Actividades culturales y de la comicteca"
      />

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-[#1a1a1a] border border-[#2e2e2e] rounded-xl w-fit mb-6">
        {[
          { key: 'upcoming', label: 'Próximos' },
          { key: 'all', label: 'Todos los eventos' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => { setActiveTab(tab.key as 'all' | 'upcoming'); setPage(1); }}
            id={`tab-${tab.key}`}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-[#e66414] text-white shadow'
                : 'text-[#a0a0a0] hover:text-[#f5f5f5]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filtros de fecha (solo en "Todos") */}
      {activeTab === 'all' && (
        <div className="card p-4 mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-[#a0a0a0] font-medium mb-1.5" htmlFor="filter-date">
              Fecha exacta
            </label>
            <input
              id="filter-date"
              type="date"
              className="input text-sm"
              value={filters.date ?? ''}
              onChange={(e) => setFilters((p) => ({ ...p, date: e.target.value || undefined }))}
            />
          </div>
          <div>
            <label className="block text-xs text-[#a0a0a0] font-medium mb-1.5" htmlFor="filter-from">
              Desde
            </label>
            <input
              id="filter-from"
              type="date"
              className="input text-sm"
              value={filters.from ?? ''}
              onChange={(e) => setFilters((p) => ({ ...p, from: e.target.value || undefined }))}
            />
          </div>
          <div>
            <label className="block text-xs text-[#a0a0a0] font-medium mb-1.5" htmlFor="filter-to">
              Hasta
            </label>
            <input
              id="filter-to"
              type="date"
              className="input text-sm"
              value={filters.to ?? ''}
              onChange={(e) => setFilters((p) => ({ ...p, to: e.target.value || undefined }))}
            />
          </div>
        </div>
      )}

      {/* Contenido */}
      {loading ? (
        <Loader />
      ) : error ? (
        <ErrorMessage message={error} onRetry={refetch} />
      ) : paginated.length === 0 ? (
        <EmptyState
          title="Sin eventos"
          description="No hay eventos que mostrar para los filtros seleccionados."
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginated.map((event) => {
              const past = isPast(event.fecha);
              const piso = apiField<number>(event, 'numeroDePiso', 'numerodepiso');
              const zona = apiField<string>(event, 'idZona', 'idzona');
              const horaInicio = apiField<string>(event, 'horaInicio', 'horainicio');
              const horaFin = apiField<string>(event, 'horaFin', 'horafin');
              const asistentes = apiField<number>(event, 'total_asistentes');

              return (
                <article
                  key={event.id}
                  className="card p-5 cursor-pointer group flex flex-col gap-3"
                  onClick={() => navigate(`/eventos/${event.id}`)}
                  id={`event-${event.id}`}
                >
                  {/* Fecha header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${past ? 'bg-[#2e2e2e]' : 'bg-[#60a5fa]/10'}`}>
                        <CalendarDays size={15} className={past ? 'text-[#6b6b6b]' : 'text-[#60a5fa]'} />
                      </div>
                      <span className={`text-xs font-semibold ${past ? 'text-[#6b6b6b]' : 'text-[#60a5fa]'}`}>
                        {formatDate(event.fecha)}
                      </span>
                    </div>
                    <Badge variant={past ? 'neutral' : 'info'}>
                      {relativeDateLabel(event.fecha)}
                    </Badge>
                  </div>

                  {/* Tema (nombre real del campo en DB) */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-[#f5f5f5] text-sm leading-tight group-hover:text-[#e66414] transition-colors mb-1">
                      {truncate(event.tema, 70)}
                    </h3>
                  </div>

                  {/* Metadatos */}
                  <div className="flex flex-col gap-1.5 pt-3 border-t border-[#2e2e2e]">
                    {piso !== null && piso !== undefined && (
                      <p className="text-[#a0a0a0] text-xs flex items-center gap-1.5">
                        <MapPin size={11} />
                        Piso {piso}
                        {zona ? ` · Zona ${zona}` : ''}
                      </p>
                    )}
                    {horaInicio && (
                      <p className="text-[#a0a0a0] text-xs flex items-center gap-1.5">
                        <Clock size={11} />
                        {horaInicio}
                        {horaFin ? ` – ${horaFin}` : ''}
                      </p>
                    )}
                    {asistentes !== undefined && (
                      <p className="text-[#a0a0a0] text-xs">
                        {asistentes} asistentes
                      </p>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <ChevronRight size={14} className="text-[#6b6b6b] group-hover:text-[#e66414] transition-colors" />
                  </div>
                </article>
              );
            })}
          </div>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
