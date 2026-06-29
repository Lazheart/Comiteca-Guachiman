import { useNavigate } from 'react-router-dom';
import { useApi } from '@/hooks/useApi';
import { materialService } from '@/services/materialService';
import { eventService } from '@/services/eventService';
import { institutionService } from '@/services/institutionService';
import { statisticsService } from '@/services/statisticsService';
import { Loader } from '@/components/Loader';
import { SearchBar } from '@/components/SearchBar';
import { StatCard } from '@/components/StatCard';
import { SectionTitle } from '@/components/SectionTitle';
import { ROUTES } from '@/constants';
import { formatDate } from '@/utils/formatDate';
import { truncate } from '@/utils/formatText';
import {
  BookOpen,
  CalendarDays,
  Building2,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  Clock,
} from 'lucide-react';

/**
 * Página de inicio — todas las peticiones usan page_size pequeño,
 * nunca se descarga la tabla completa.
 */
export function HomePage() {
  const navigate = useNavigate();

  // Solo los primeros 6 materiales para el preview
  const { data: materialsResp, loading: loadingMaterials } = useApi(
    () => materialService.getAll({}, { page: 1, page_size: 6 }),
    [],
  );
  // Solo los primeros 3 próximos eventos
  const { data: eventsResp, loading: loadingEvents } = useApi(
    () => eventService.getUpcoming({ page: 1, page_size: 3 }),
    [],
  );
  // Solo las primeras 4 instituciones
  const { data: institutionsResp, loading: loadingInstitutions } = useApi(
    () => institutionService.getAll({ page: 1, page_size: 4 }),
    [],
  );
  // Top 5 más prestados
  const { data: mostLoanedResp } = useApi(
    () => statisticsService.getMostLoanedMaterials({ page: 1, page_size: 5 }),
    [],
  );
  // Disponibilidad: solo agregado
  const { data: availabilityResp } = useApi(
    () => statisticsService.getMaterialAvailability({ page: 1, page_size: 50 }),
    [],
  );

  const handleSearch = (query: string) => {
    if (query.trim()) {
      navigate(`${ROUTES.MATERIALS}?q=${encodeURIComponent(query)}`);
    }
  };

  const recentMaterials = materialsResp?.items ?? [];
  const previewEvents = eventsResp?.items ?? [];
  const previewInstitutions = institutionsResp?.items ?? [];
  const mostLoaned = mostLoanedResp?.items ?? [];

  // Stats derivadas de total_items (count exacto desde el servidor)
  const totalMaterials = materialsResp?.total_items ?? '—';
  const totalEvents = eventsResp?.total_items ?? '—';
  const totalInstitutions = institutionsResp?.total_items ?? '—';
  const disponibles = availabilityResp?.items
    ?.filter((r) => r.disponibilidad === 'Disponible')
    .reduce((s, r) => s + Number(r.cantidad), 0) ?? '—';

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-5 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, #e66414, transparent)',
            filter: 'blur(80px)',
          }}
        />
        <div className="section-container py-24 relative">
          <div className="max-w-2xl">
            <h1 className="font-display text-5xl md:text-6xl font-black text-[#f5f5f5] leading-[1.1] mb-6">
              Biblioteca Digital Guachimán
            </h1>
            <p className="text-[#a0a0a0] text-lg leading-relaxed mb-10 max-w-lg">
              Explora materiales, consulta préstamos, revisa eventos y conoce las instituciones que hacen posible la cultura del cómic, manga y novelas.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-xl">
              <SearchBar
                placeholder="Busca un cómic, manga, novela gráfica..."
                onSearch={handleSearch}
                className="flex-4"
                size="lg"
              />
              <button
                onClick={() => navigate(ROUTES.MATERIALS)}
                className="btn-primary whitespace-nowrap"
                id="hero-explore-btn"
              >
                Explorar todo
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ESTADÍSTICAS RÁPIDAS */}
      <section className="section-container pb-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total materiales"
            value={totalMaterials}
            icon={<BookOpen size={22} />}
            color="primary"
          />
          <StatCard
            label="Disponibles"
            value={disponibles}
            icon={<CheckCircle size={22} />}
            color="success"
          />
          <StatCard
            label="Próximos eventos"
            value={totalEvents}
            icon={<CalendarDays size={22} />}
            color="info"
          />
          <StatCard
            label="Instituciones"
            value={totalInstitutions}
            icon={<Building2 size={22} />}
            color="warning"
          />
        </div>
      </section>

      {/* MATERIALES RECIENTES */}
      <section className="section-container pb-16">
        <SectionTitle
          title="Materiales recientes"
          subtitle="Los últimos cómics y materiales de la colección"
          action={
            <button
              onClick={() => navigate(ROUTES.MATERIALS)}
              className="btn-ghost text-sm"
              id="materials-see-all-btn"
            >
              Ver todos
              <ArrowRight size={14} />
            </button>
          }
        />

        {loadingMaterials ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentMaterials.map((material) => (
              <article
                key={material.id ?? `material-${material.titulo}-${material.autor}`}
                className="card p-5 cursor-pointer group"
                onClick={() => navigate(`/materiales/${material.id}`)}
                id={`material-card-${material.id}`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-16 rounded-lg bg-gradient-to-br from-[#e66414]/20 to-[#ff914d]/10 flex items-center justify-center shrink-0 group-hover:from-[#e66414]/30 transition-colors">
                    <BookOpen size={20} className="text-[#e66414]" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-[#f5f5f5] text-sm leading-tight mb-1 group-hover:text-[#e66414] transition-colors">
                      {truncate(material.titulo, 45)}
                    </h3>
                    <p className="text-[#a0a0a0] text-xs mb-2">{material.autor}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      {material.genero && (
                        <span className="badge badge-primary">{material.genero}</span>
                      )}
                      {(material.copias_disponibles ?? 0) > 0 && (
                        <span className="badge badge-success" aria-label="Disponible">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                          Disponible
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* PRÓXIMOS EVENTOS */}
      <section className="bg-[#0a0a0a] py-16">
        <div className="section-container">
          <SectionTitle
            title="Próximos eventos"
            subtitle="No te pierdas las actividades de la comicteca"
            action={
              <button
                onClick={() => navigate(ROUTES.EVENTS)}
                className="btn-ghost text-sm"
                id="events-see-all-btn"
              >
                Ver todos
                <ArrowRight size={14} />
              </button>
            }
          />

          {loadingEvents ? (
            <Loader />
          ) : previewEvents.length === 0 ? (
            <p className="text-[#6b6b6b] text-sm">No hay eventos próximos disponibles.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {previewEvents.map((event) => (
                <article
                  key={event.id ?? `event-${event.tema || ''}-${event.fecha}`}
                  className="card p-5 cursor-pointer group"
                  onClick={() => navigate(`/eventos/${event.id}`)}
                  id={`event-card-${event.id}`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-[#60a5fa]/10 flex items-center justify-center">
                      <CalendarDays size={15} className="text-[#60a5fa]" />
                    </div>
                    <span className="text-[#60a5fa] text-xs font-semibold">
                      {formatDate(event.fecha)}
                    </span>
                  </div>
                  <h3 className="font-semibold text-[#f5f5f5] text-sm leading-tight mb-1 group-hover:text-[#e66414] transition-colors">
                    {truncate(event.tema, 60)}
                  </h3>
                  {event.horaInicio && (
                    <p className="text-[#6b6b6b] text-xs mt-2 flex items-center gap-1">
                      <Clock size={11} />
                      {event.horaInicio}{event.horaFin ? ` – ${event.horaFin}` : ''}
                    </p>
                  )}
                  {event.numeroDePiso !== undefined && event.numeroDePiso !== null && (
                    <p className="text-[#6b6b6b] text-xs mt-1">
                      Piso {event.numeroDePiso}{event.idZona ? ` · Zona ${event.idZona}` : ''}
                    </p>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* INSTITUCIONES */}
      <section className="section-container py-16">
        <SectionTitle
          title="Instituciones participantes"
          subtitle="Organizaciones que apoyan la comicteca"
          action={
            <button
              onClick={() => navigate(ROUTES.INSTITUTIONS)}
              className="btn-ghost text-sm"
              id="institutions-see-all-btn"
            >
              Ver todas
              <ArrowRight size={14} />
            </button>
          }
        />

        {loadingInstitutions ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {previewInstitutions.map((inst) => (
              <article
                key={inst.id ?? `inst-${inst.nombre}-${inst.tipoInstitucion || ''}`}
                className="card p-5 cursor-pointer group text-center"
                onClick={() => navigate(`/instituciones/${inst.id}`)}
                id={`institution-card-${inst.id}`}
              >
                <div className="w-12 h-12 rounded-xl bg-[#e66414]/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-[#e66414]/20 transition-colors">
                  <Building2 size={22} className="text-[#e66414]" />
                </div>
                <h3 className="font-semibold text-[#f5f5f5] text-sm leading-tight group-hover:text-[#e66414] transition-colors">
                  {truncate(inst.nombre, 30)}
                </h3>
                {inst.tipoInstitucion && (
                  <p className="text-[#6b6b6b] text-xs mt-1">{inst.tipoInstitucion}</p>
                )}
              </article>
            ))}
          </div>
        )}
      </section>

      {/* MATERIALES MÁS PRESTADOS */}
      {mostLoaned.length > 0 && (
        <section className="bg-[#0a0a0a] py-16">
          <div className="section-container">
            <SectionTitle
              title="Más prestados"
              subtitle="Los favoritos de la comunidad"
              action={
                <button
                  onClick={() => navigate(ROUTES.STATISTICS)}
                  className="btn-ghost text-sm"
                  id="stats-see-all-btn"
                >
                  Ver estadísticas
                  <TrendingUp size={14} />
                </button>
              }
            />
            <div className="flex flex-col gap-3">
              {mostLoaned.map((item, idx) => (
                <div
                  key={`mostloaned-${item.titulo}-${idx}`}
                  className="flex items-center gap-4 p-4 card"
                  id={`trending-card-${idx}`}
                >
                  <span className="font-display text-2xl font-black text-[#2e2e2e] w-8 text-center shrink-0">
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#f5f5f5] text-sm truncate">
                      {item.titulo}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#e66414] shrink-0">
                    <TrendingUp size={13} />
                    <span className="text-sm font-bold">{item.total_prestamos}</span>
                    <span className="text-[#6b6b6b] text-xs">préstamos</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
