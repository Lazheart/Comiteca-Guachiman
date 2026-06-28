import { useParams, useNavigate } from 'react-router-dom';
import { useApi } from '@/hooks/useApi';
import { institutionService } from '@/services/institutionService';
import { Loader } from '@/components/Loader';
import { ErrorMessage } from '@/components/ErrorMessage';
import { EmptyState } from '@/components/EmptyState';
import { Badge } from '@/components/Badge';
import { SectionTitle } from '@/components/SectionTitle';
import {
  Building2,
  ArrowLeft,
  Mail,
  Phone,
  Globe,
  MapPin,
  Gift,
  CalendarDays,
} from 'lucide-react';
import { formatDate } from '@/utils/formatDate';
import { truncate } from '@/utils/formatText';

/**
 * Página de detalle de institución con donaciones y eventos patrocinados.
 */
export function InstitutionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const institutionId = Number(id);

  const { data: institution, loading, error, refetch } = useApi(
    () => institutionService.getById(institutionId),
    [institutionId],
  );
  const { data: donations, loading: loadingDonations } = useApi(
    () => institutionService.getDonations(institutionId),
    [institutionId],
  );
  const { data: events, loading: loadingEvents } = useApi(
    () => institutionService.getSponsoredEvents(institutionId),
    [institutionId],
  );

  if (loading) return <Loader />;
  if (error || !institution)
    return (
      <div className="section-container py-10">
        <ErrorMessage message={error ?? 'Institución no encontrada.'} onRetry={refetch} />
      </div>
    );

  return (
    <div className="section-container py-10">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-[#a0a0a0] hover:text-[#e66414] text-sm transition-colors mb-8"
        id="back-btn"
      >
        <ArrowLeft size={15} />
        Volver a instituciones
      </button>

      {/* Header de institución */}
      <div className="card p-8 mb-8">
        <div className="flex items-start gap-6">
          <div className="w-16 h-16 rounded-2xl bg-[#e66414]/10 flex items-center justify-center shrink-0">
            <Building2 size={32} className="text-[#e66414]" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap mb-2">
              <h1 className="font-display text-3xl font-black text-[#f5f5f5]">
                {institution.nombre}
              </h1>
              {institution.tipo && <Badge variant="primary">{institution.tipo}</Badge>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
              {institution.email && (
                <p className="text-[#a0a0a0] text-sm flex items-center gap-2">
                  <Mail size={13} className="text-[#6b6b6b]" />
                  {institution.email}
                </p>
              )}
              {institution.telefono && (
                <p className="text-[#a0a0a0] text-sm flex items-center gap-2">
                  <Phone size={13} className="text-[#6b6b6b]" />
                  {institution.telefono}
                </p>
              )}
              {institution.sitio_web && (
                <p className="text-[#a0a0a0] text-sm flex items-center gap-2">
                  <Globe size={13} className="text-[#6b6b6b]" />
                  <a
                    href={institution.sitio_web}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#60a5fa] hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {institution.sitio_web}
                  </a>
                </p>
              )}
              {institution.direccion && (
                <p className="text-[#a0a0a0] text-sm flex items-center gap-2">
                  <MapPin size={13} className="text-[#6b6b6b]" />
                  {institution.direccion}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Donaciones */}
        <div>
          <SectionTitle title="Donaciones" subtitle={`${donations?.length ?? 0} registradas`} />
          {loadingDonations ? (
            <Loader />
          ) : !donations || donations.length === 0 ? (
            <EmptyState
              title="Sin donaciones"
              description="Esta institución no tiene donaciones registradas."
              icon={<Gift size={28} className="text-[#6b6b6b]" />}
            />
          ) : (
            <div className="flex flex-col gap-3">
              {donations.map((donation) => (
                <div
                  key={donation.id ?? `donation-${donation.tipo || 'Donación'}-${donation.fecha || (donation as any).fechadonacion || (donation as any).fechaDonacion || ''}-${donation.monto || (donation as any).ejemplares_donados || ''}`}
                  className="card p-4 flex items-start gap-4"
                  id={`donation-${donation.id}`}
                >
                  <div className="w-9 h-9 rounded-lg bg-[#facc15]/10 flex items-center justify-center shrink-0">
                    <Gift size={16} className="text-[#facc15]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[#f5f5f5] text-sm font-medium">
                        {donation.tipo ?? 'Donación'}
                      </span>
                      <span className="text-[#6b6b6b] text-xs">{formatDate(donation.fecha)}</span>
                    </div>
                    {donation.descripcion && (
                      <p className="text-[#a0a0a0] text-xs">{truncate(donation.descripcion, 80)}</p>
                    )}
                    {donation.monto !== undefined && (
                      <p className="text-[#4ade80] text-sm font-bold mt-1">
                        S/ {donation.monto.toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Eventos patrocinados */}
        <div>
          <SectionTitle title="Eventos patrocinados" subtitle={`${events?.length ?? 0} eventos`} />
          {loadingEvents ? (
            <Loader />
          ) : !events || events.length === 0 ? (
            <EmptyState
              title="Sin eventos"
              description="Esta institución no ha patrocinado eventos."
              icon={<CalendarDays size={28} className="text-[#6b6b6b]" />}
            />
          ) : (
            <div className="flex flex-col gap-3">
              {events.map((event) => (
                <div
                  key={event.id ?? `event-${event.nombre || (event as any).tema || ''}-${event.fecha}`}
                  className="card p-4 cursor-pointer group flex items-start gap-4"
                  onClick={() => navigate(`/eventos/${event.id}`)}
                  id={`sponsored-event-${event.id}`}
                >
                  <div className="w-9 h-9 rounded-lg bg-[#60a5fa]/10 flex items-center justify-center shrink-0">
                    <CalendarDays size={16} className="text-[#60a5fa]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[#f5f5f5] text-sm font-medium group-hover:text-[#e66414] transition-colors">
                      {truncate(event.nombre, 50)}
                    </p>
                    <p className="text-[#6b6b6b] text-xs mt-0.5">{formatDate(event.fecha)}</p>
                    {event.lugar && (
                      <p className="text-[#6b6b6b] text-xs flex items-center gap-1 mt-0.5">
                        <MapPin size={10} />
                        {truncate(event.lugar, 40)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
