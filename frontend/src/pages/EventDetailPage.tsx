import { useParams, useNavigate } from 'react-router-dom';
import { useApi } from '@/hooks/useApi';
import { eventService } from '@/services/eventService';
import { Loader } from '@/components/Loader';
import { ErrorMessage } from '@/components/ErrorMessage';
import { Badge } from '@/components/Badge';
import {
  CalendarDays,
  ArrowLeft,
  MapPin,
  Clock,
  Users,
  Layers,
} from 'lucide-react';
import { formatDate, relativeDateLabel, isPast } from '@/utils/formatDate';
import { apiField } from '@/utils/apiField';

/**
 * Página de detalle de un evento.
 * Usa los campos reales de la tabla Evento: tema, fecha, horaInicio, horaFin, numeroDePiso, idZona.
 */
export function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const eventId = Number(id);

  const { data: event, loading, error, refetch } = useApi(
    () => eventService.getById(eventId),
    [eventId]
  );

  if (loading) return <Loader />;
  if (error || !event)
    return (
      <div className="section-container py-10">
        <ErrorMessage
          message={error ?? 'Evento no encontrado.'}
          onRetry={refetch}
        />
      </div>
    );

  const past = isPast(event.fecha);
  const piso = apiField<number>(event, 'numeroDePiso', 'numerodepiso');
  const zona = apiField<string>(event, 'idZona', 'idzona');
  const horaInicio = apiField<string>(event, 'horaInicio', 'horainicio');
  const horaFin = apiField<string>(event, 'horaFin', 'horafin');
  const asistentes = apiField<number>(event, 'total_asistentes');
  const institucionNombre = apiField<string>(event, 'institucion_nombre');

  return (
    <div className="section-container py-10">
      {/* Breadcrumb */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-[#a0a0a0] hover:text-[#e66414] text-sm transition-colors mb-8"
        id="back-btn"
      >
        <ArrowLeft size={15} />
        Volver a eventos
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna izquierda - tarjeta de fecha */}
        <div className="lg:col-span-1">
          <div className="card p-6 flex flex-col items-center text-center gap-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${past ? 'bg-[#2e2e2e]' : 'bg-[#60a5fa]/10'}`}>
              <CalendarDays size={32} className={past ? 'text-[#6b6b6b]' : 'text-[#60a5fa]'} />
            </div>

            <div>
              <p className="text-[#a0a0a0] text-xs font-semibold uppercase tracking-wider mb-1">Fecha del evento</p>
              <p className="text-xl font-bold text-[#f5f5f5]">{formatDate(event.fecha)}</p>
              <div className="mt-2">
                <Badge variant={past ? 'neutral' : 'info'}>
                  {relativeDateLabel(event.fecha)}
                </Badge>
              </div>
            </div>

            {/* Asistentes derivados */}
            {asistentes !== undefined && (
              <div className="w-full border-t border-[#2e2e2e] pt-4 mt-2">
                <p className="text-[#6b6b6b] text-xs font-semibold uppercase tracking-wider mb-2">Asistencia</p>
                <div className="flex items-center justify-center gap-2">
                  <Users size={14} className="text-[#e66414]" />
                  <span className="text-lg font-bold text-[#f5f5f5]">{asistentes}</span>
                  <span className="text-[#6b6b6b] text-xs">asistentes</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Columna derecha - información del evento */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            {/* "tema" es el campo real en la tabla Evento */}
            <h1 className="font-display text-3xl font-black text-[#f5f5f5] leading-tight mb-3">
              {event.tema}
            </h1>
            {institucionNombre && (
              <p className="text-xs text-[#ff914d]">
                Organizado por {institucionNombre}
              </p>
            )}
          </div>

          {/* Detalles de ubicación y horario */}
          <div className="card p-5">
            <h2 className="text-[#a0a0a0] text-xs font-semibold uppercase tracking-wider mb-4">
              Detalles del evento
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {piso !== null && piso !== undefined && (
                <div className="flex items-start gap-2.5">
                  <Layers size={16} className="text-[#6b6b6b] mt-0.5" />
                  <div>
                    <p className="text-[#6b6b6b] text-xs">Piso / Zona</p>
                    <p className="text-[#f5f5f5] text-sm font-medium">
                      Piso {piso}
                      {zona ? ` · Zona ${zona}` : ''}
                    </p>
                  </div>
                </div>
              )}
              {zona && piso === undefined && (
                <div className="flex items-start gap-2.5">
                  <MapPin size={16} className="text-[#6b6b6b] mt-0.5" />
                  <div>
                    <p className="text-[#6b6b6b] text-xs">Zona</p>
                    <p className="text-[#f5f5f5] text-sm font-medium">{zona}</p>
                  </div>
                </div>
              )}
              {horaInicio && (
                <div className="flex items-start gap-2.5">
                  <Clock size={16} className="text-[#6b6b6b] mt-0.5" />
                  <div>
                    <p className="text-[#6b6b6b] text-xs">Horario</p>
                    <p className="text-[#f5f5f5] text-sm font-medium">
                      {horaInicio} {horaFin ? `a ${horaFin}` : ''}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
