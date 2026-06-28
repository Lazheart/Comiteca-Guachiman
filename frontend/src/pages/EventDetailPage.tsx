import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApi } from '@/hooks/useApi';
import { eventService } from '@/services/eventService';
import { Loader } from '@/components/Loader';
import { ErrorMessage } from '@/components/ErrorMessage';
import { Badge } from '@/components/Badge';
import { SectionTitle } from '@/components/SectionTitle';
import {
  CalendarDays,
  ArrowLeft,
  MapPin,
  Clock,
  Users,
  Building2,
  FileText,
  Layers,
} from 'lucide-react';
import { formatDate, relativeDateLabel, isPast } from '@/utils/formatDate';

/**
 * Página de detalle de un evento.
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
        {/* Columna izquierda - tarjeta de fecha y asistencia */}
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

            {event.capacidad !== undefined && (
              <div className="w-full border-t border-[#2e2e2e] pt-4 mt-2">
                <p className="text-[#6b6b6b] text-xs font-semibold uppercase tracking-wider mb-1">Capacidad y Asistencia</p>
                <div className="flex justify-around items-center mt-2">
                  <div>
                    <p className="text-lg font-bold text-[#f5f5f5]">{event.asistentes ?? 0}</p>
                    <p className="text-[#6b6b6b] text-2xs">Asistentes</p>
                  </div>
                  <div className="w-px h-8 bg-[#2e2e2e]" />
                  <div>
                    <p className="text-lg font-bold text-[#f5f5f5]">{event.capacidad}</p>
                    <p className="text-[#6b6b6b] text-2xs">Capacidad</p>
                  </div>
                </div>
                {event.asistentes !== undefined && event.capacidad > 0 && (
                  <div className="w-full bg-[#2e2e2e] rounded-full h-1.5 mt-3 overflow-hidden">
                    <div 
                      className="bg-[#e66414] h-1.5 rounded-full" 
                      style={{ width: `${Math.min(100, (event.asistentes / event.capacidad) * 100)}%` }}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Columna derecha - información del evento */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h1 className="font-display text-3xl font-black text-[#f5f5f5] leading-tight mb-3">
              {event.nombre}
            </h1>
            {event.institucion_id && (
              <Link 
                to={`/instituciones/${event.institucion_id}`}
                className="inline-flex items-center gap-1.5 text-xs text-[#ff914d] hover:underline"
              >
                <Building2 size={13} />
                Patrocinado por {event.institucion_nombre ?? `Institución #${event.institucion_id}`}
              </Link>
            )}
          </div>

          {/* Detalles */}
          <div className="card p-5">
            <h2 className="text-[#a0a0a0] text-xs font-semibold uppercase tracking-wider mb-4">
              Detalles del evento
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {event.lugar && (
                <div className="flex items-start gap-2.5">
                  <MapPin size={16} className="text-[#6b6b6b] mt-0.5" />
                  <div>
                    <p className="text-[#6b6b6b] text-xs">Ubicación</p>
                    <p className="text-[#f5f5f5] text-sm font-medium">{event.lugar}</p>
                  </div>
                </div>
              )}
              {event.numero_de_piso !== null && event.numero_de_piso !== undefined && (
                <div className="flex items-start gap-2.5">
                  <Layers size={16} className="text-[#6b6b6b] mt-0.5" />
                  <div>
                    <p className="text-[#6b6b6b] text-xs">Piso / Sala</p>
                    <p className="text-[#f5f5f5] text-sm font-medium">Piso {event.numero_de_piso}</p>
                  </div>
                </div>
              )}
              {event.hora_inicio && (
                <div className="flex items-start gap-2.5">
                  <Clock size={16} className="text-[#6b6b6b] mt-0.5" />
                  <div>
                    <p className="text-[#6b6b6b] text-xs">Horario</p>
                    <p className="text-[#f5f5f5] text-sm font-medium">
                      {event.hora_inicio} {event.hora_fin ? `a ${event.hora_fin}` : ''}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Descripción */}
          {event.descripcion && (
            <div className="card p-5">
              <div className="flex items-center gap-2 text-[#a0a0a0] text-xs font-semibold uppercase tracking-wider mb-3">
                <FileText size={13} />
                Descripción del evento
              </div>
              <p className="text-[#d0d0d0] text-sm leading-relaxed whitespace-pre-line">
                {event.descripcion}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
