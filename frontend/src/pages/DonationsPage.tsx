import { useApi } from '@/hooks/useApi';
import { donationService } from '@/services/donationService';
import { Loader } from '@/components/Loader';
import { ErrorMessage } from '@/components/ErrorMessage';
import { EmptyState } from '@/components/EmptyState';
import { SectionTitle } from '@/components/SectionTitle';
import { StatCard } from '@/components/StatCard';
import { Gift, Building2, BookOpen, TrendingUp, User } from 'lucide-react';
import { formatDate } from '@/utils/formatDate';
import { apiField } from '@/utils/apiField';

/**
 * Página de donaciones con listado y estadísticas.
 * GET /donations devuelve vista_auditoria_donaciones:
 *   institucion_donante, material_recibido, fechaDonacion,
 *   ejemplares_donados, bibliotecario_receptor
 */
export function DonationsPage() {
  const { data: donations, loading, error, refetch } = useApi(
    () => donationService.getAll(),
    [],
  );
  const { data: statsRows } = useApi(
    () => donationService.getStatistics(),
    [],
  );

  const totalDonaciones = statsRows?.reduce((sum, row) => sum + Number(row.numero_donaciones), 0);
  const totalEjemplares = statsRows?.reduce((sum, row) => sum + Number(row.total_ejemplares), 0);
  const topDonante = statsRows?.[0]?.institucion_donante;

  return (
    <div className="section-container py-10">
      <SectionTitle
        title="Donaciones"
        subtitle="Registro de donaciones recibidas por la comicteca"
      />

      {statsRows && statsRows.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Total donaciones"
            value={totalDonaciones ?? '—'}
            icon={<Gift size={22} />}
            color="primary"
          />
          <StatCard
            label="Ejemplares donados"
            value={totalEjemplares ?? '—'}
            icon={<BookOpen size={22} />}
            color="success"
          />
          {topDonante && (
            <StatCard
              label="Top donante"
              value={String(topDonante).slice(0, 20)}
              icon={<TrendingUp size={22} />}
              color="warning"
            />
          )}
          <StatCard
            label="Instituciones"
            value={statsRows.length}
            icon={<Building2 size={22} />}
            color="info"
          />
        </div>
      )}

      <div>
        <h2 className="font-display text-xl font-bold text-[#f5f5f5] mb-4">
          Listado de donaciones
        </h2>

        {loading ? (
          <Loader />
        ) : error ? (
          <ErrorMessage message={error} onRetry={refetch} />
        ) : !donations || donations.length === 0 ? (
          <EmptyState title="Sin donaciones" description="No hay donaciones registradas." />
        ) : (
          <div className="card overflow-hidden">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Institución donante</th>
                  <th>Material recibido</th>
                  <th>Ejemplares</th>
                  <th>Fecha donación</th>
                  <th>Bibliotecario receptor</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((donation, idx) => {
                  const institucion = apiField<string>(donation, 'institucion_donante');
                  const material = apiField<string>(donation, 'material_recibido');
                  const ejemplares = apiField<number>(donation, 'ejemplares_donados') ?? 0;
                  const fecha = apiField<string>(donation, 'fechaDonacion', 'fechadonacion');
                  const bibliotecario = apiField<string>(donation, 'bibliotecario_receptor');

                  return (
                    <tr
                      key={`${institucion}-${material}-${fecha}-${idx}`}
                      id={`donation-row-${idx}`}
                    >
                      <td>
                        <div className="flex items-center gap-2">
                          <Building2 size={13} className="text-[#6b6b6b]" />
                          <span>{institucion ?? '—'}</span>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <BookOpen size={13} className="text-[#6b6b6b]" />
                          <span>{material ?? '—'}</span>
                        </div>
                      </td>
                      <td>
                        <span className="font-semibold text-[#4ade80]">
                          {ejemplares} ejemplar{ejemplares !== 1 ? 'es' : ''}
                        </span>
                      </td>
                      <td className="text-[#a0a0a0]">
                        {fecha ? formatDate(fecha) : '—'}
                      </td>
                      <td>
                        <div className="flex items-center gap-2 text-[#a0a0a0]">
                          <User size={13} className="text-[#6b6b6b]" />
                          <span>{bibliotecario ?? '—'}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
