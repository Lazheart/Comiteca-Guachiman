import { useApi } from '@/hooks/useApi';
import { donationService } from '@/services/donationService';
import { Loader } from '@/components/Loader';
import { ErrorMessage } from '@/components/ErrorMessage';
import { EmptyState } from '@/components/EmptyState';
import { SectionTitle } from '@/components/SectionTitle';
import { StatCard } from '@/components/StatCard';
import { Badge } from '@/components/Badge';
import { Gift, Building2, DollarSign, TrendingUp } from 'lucide-react';
import { formatDate } from '@/utils/formatDate';
import { truncate } from '@/utils/formatText';

/**
 * Página de donaciones con listado y estadísticas.
 */
export function DonationsPage() {
  const { data: donations, loading, error, refetch } = useApi(
    () => donationService.getAll(),
    [],
  );
  const { data: stats } = useApi(
    () => donationService.getStatistics(),
    [],
  );

  return (
    <div className="section-container py-10">
      <SectionTitle
        title="Donaciones"
        subtitle="Registro de donaciones recibidas por la comicteca"
      />

      {/* Estadísticas */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.total_donaciones !== undefined && (
            <StatCard
              label="Total donaciones"
              value={stats.total_donaciones}
              icon={<Gift size={22} />}
              color="primary"
            />
          )}
          {stats.monto_total !== undefined && (
            <StatCard
              label="Monto total"
              value={`S/ ${Number(stats.monto_total).toFixed(0)}`}
              icon={<DollarSign size={22} />}
              color="success"
            />
          )}
          {stats.top_institucion && (
            <StatCard
              label="Top donante"
              value={truncate(stats.top_institucion, 20)}
              icon={<TrendingUp size={22} />}
              color="warning"
            />
          )}
          <StatCard
            label="Instituciones"
            value={new Set(donations?.map((d) => d.institucion_id)).size ?? '—'}
            icon={<Building2 size={22} />}
            color="info"
          />
        </div>
      )}

      {/* Tabla de donaciones */}
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
                  <th>#</th>
                  <th>Institución</th>
                  <th>Fecha</th>
                  <th>Tipo</th>
                  <th>Monto</th>
                  <th>Descripción</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((donation) => (
                  <tr key={donation.id} id={`donation-row-${donation.id}`}>
                    <td className="font-mono text-[#e66414]">#{donation.id}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Building2 size={13} className="text-[#6b6b6b]" />
                        <span>{donation.institucion_nombre ?? `ID ${donation.institucion_id}`}</span>
                      </div>
                    </td>
                    <td className="text-[#a0a0a0]">{formatDate(donation.fecha)}</td>
                    <td>
                      {donation.tipo ? (
                        <Badge variant="primary">{donation.tipo}</Badge>
                      ) : (
                        <span className="text-[#6b6b6b]">—</span>
                      )}
                    </td>
                    <td>
                      {donation.monto !== undefined ? (
                        <span className="text-[#4ade80] font-semibold">
                          S/ {donation.monto.toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-[#6b6b6b]">—</span>
                      )}
                    </td>
                    <td className="text-[#6b6b6b] text-xs">
                      {donation.descripcion ? truncate(donation.descripcion, 50) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
