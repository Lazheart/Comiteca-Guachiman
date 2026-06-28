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
  MapPin,
  Gift,
  CalendarDays,
  User,
  Hash,
} from 'lucide-react';
import { formatDate } from '@/utils/formatDate';
import { truncate } from '@/utils/formatText';
import { apiField } from '@/utils/apiField';

/**
 * Detalle de institución con donaciones (tabla Donacion) y eventos patrocinados (Patrocinado).
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

  const tipo = apiField<string>(institution, 'tipoInstitucion', 'tipoinstitucion');
  const correo = apiField<string>(institution, 'correo');
  const telefono = apiField<string>(institution, 'telefono');
  const direccion = apiField<string>(institution, 'direccion');
  const representante = apiField<string>(institution, 'representante');
  const estado = apiField<string>(institution, 'estado');

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
              {tipo && <Badge variant="primary">{tipo}</Badge>}
              {estado && (
                <Badge variant={estado.toLowerCase() === 'activo' ? 'success' : 'neutral'}>
                  {estado}
                </Badge>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
              {representante && (
                <p className="text-[#a0a0a0] text-sm flex items-center gap-2">
                  <User size={13} className="text-[#6b6b6b]" />
                  {representante}
                </p>
              )}
              {correo && (
                <p className="text-[#a0a0a0] text-sm flex items-center gap-2">
                  <Mail size={13} className="text-[#6b6b6b]" />
                  {correo}
                </p>
              )}
              {telefono && (
                <p className="text-[#a0a0a0] text-sm flex items-center gap-2">
                  <Phone size={13} className="text-[#6b6b6b]" />
                  {telefono}
                </p>
              )}
              {direccion && (
                <p className="text-[#a0a0a0] text-sm flex items-center gap-2">
                  <MapPin size={13} className="text-[#6b6b6b]" />
                  {direccion}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
            <div className="card overflow-hidden">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Material ID</th>
                    <th>Cantidad</th>
                    <th>Fecha</th>
                    <th>Bibliotecario DNI</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.map((donation, idx) => {
                    const materialId = apiField<number>(donation, 'material_id');
                    const cantidad = apiField<number>(donation, 'cantidad') ?? 0;
                    const fecha = apiField<string>(donation, 'fechaDonacion', 'fechadonacion');
                    const bibliotecario = apiField<number>(donation, 'bibliotecario_DNI', 'bibliotecario_dni');

                    return (
                      <tr key={`${materialId}-${fecha}-${idx}`} id={`donation-${idx}`}>
                        <td className="font-mono text-[#e66414]">#{materialId}</td>
                        <td>{cantidad} ejemplar{cantidad !== 1 ? 'es' : ''}</td>
                        <td className="text-[#a0a0a0]">{fecha ? formatDate(fecha) : '—'}</td>
                        <td className="font-mono text-xs">{bibliotecario ?? '—'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

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
              {events.map((event) => {
                const tema = apiField<string>(event, 'tema');
                const fecha = apiField<string>(event, 'fecha');
                const piso = apiField<number>(event, 'numeroDePiso', 'numerodepiso');
                const zona = apiField<string>(event, 'idZona', 'idzona');
                const monto = apiField<number>(event, 'montoPatrocinio', 'montopatrocinio');

                return (
                  <div
                    key={event.id}
                    className="card p-4 cursor-pointer group flex items-start gap-4"
                    onClick={() => navigate(`/eventos/${event.id}`)}
                    id={`sponsored-event-${event.id}`}
                  >
                    <div className="w-9 h-9 rounded-lg bg-[#60a5fa]/10 flex items-center justify-center shrink-0">
                      <CalendarDays size={16} className="text-[#60a5fa]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[#f5f5f5] text-sm font-medium group-hover:text-[#e66414] transition-colors">
                        {truncate(tema ?? 'Evento', 50)}
                      </p>
                      <p className="text-[#6b6b6b] text-xs mt-0.5">
                        {fecha ? formatDate(fecha) : '—'}
                      </p>
                      {(piso !== undefined || zona) && (
                        <p className="text-[#6b6b6b] text-xs flex items-center gap-1 mt-0.5">
                          <MapPin size={10} />
                          {piso !== undefined ? `Piso ${piso}` : ''}
                          {zona ? `${piso !== undefined ? ' · ' : ''}Zona ${zona}` : ''}
                        </p>
                      )}
                      {monto !== undefined && (
                        <p className="text-[#4ade80] text-sm font-bold mt-1 flex items-center gap-1">
                          <Hash size={11} />
                          S/ {Number(monto).toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
