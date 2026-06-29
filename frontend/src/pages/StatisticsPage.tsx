import { useApi } from '@/hooks/useApi';
import { statisticsService } from '@/services/statisticsService';
import { Loader } from '@/components/Loader';
import { ErrorMessage } from '@/components/ErrorMessage';
import { EmptyState } from '@/components/EmptyState';
import { SectionTitle } from '@/components/SectionTitle';
import { Badge } from '@/components/Badge';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from 'recharts';
import {
  TrendingUp,
  Award,
  AlertTriangle,
  Clock,
  Users,
  BarChart3,
} from 'lucide-react';
import { truncate } from '@/utils/formatText';
import { formatDate } from '@/utils/formatDate';
import { CHART_COLORS } from '@/constants';

/**
 * Dashboard de estadísticas con gráficos de Recharts.
 * Todas las consultas usan SQL agregado en el servidor, nunca se descarga la tabla completa.
 */
export function StatisticsPage() {
  // page_size pequeño = sólo top N; el servidor hace el ORDER BY y LIMIT
  const { data: mostLoanedResp, loading: lLoaned, error: eLoaned } = useApi(
    () => statisticsService.getMostLoanedMaterials({ page: 1, page_size: 10 }),
    [],
  );
  const { data: attendanceResp, loading: lAttend, error: eAttend } = useApi(
    () => statisticsService.getEventsAttendance({ page: 1, page_size: 10 }),
    [],
  );
  const { data: availabilityResp, loading: lAvail, error: eAvail } = useApi(
    () => statisticsService.getMaterialAvailability({ page: 1, page_size: 50 }),
    [],
  );
  const { data: topDonorsResp, loading: lDonors, error: eDonors } = useApi(
    () => statisticsService.getTopDonors({ page: 1, page_size: 6 }),
    [],
  );
  const { data: sanctionsResp, loading: lSanctions, error: eSanctions } = useApi(
    () => statisticsService.getSanctions({ page: 1, page_size: 10 }),
    [],
  );
  const { data: overdueResp, loading: lOverdue, error: eOverdue } = useApi(
    () => statisticsService.getOverdueLoans({ page: 1, page_size: 10 }),
    [],
  );

  // Extraer items de las respuestas paginadas
  const mostLoaned = mostLoanedResp?.items ?? [];
  const attendance = attendanceResp?.items ?? [];
  const availabilityItems = availabilityResp?.items ?? [];
  const topDonors = topDonorsResp?.items ?? [];
  const sanctions = sanctionsResp?.items ?? [];
  const overdueLoans = overdueResp?.items ?? [];

  // Disponibilidad: agrupar por disponibilidad
  const disponibles = availabilityItems.filter((r) => r.disponibilidad === 'Disponible').reduce((s, r) => s + Number(r.cantidad), 0);
  const noDisponibles = availabilityItems.filter((r) => r.disponibilidad !== 'Disponible').reduce((s, r) => s + Number(r.cantidad), 0);
  const totalEjemplares = disponibles + noDisponibles;

  return (
    <div className="section-container py-10">
      <SectionTitle
        title="Estadísticas"
        subtitle="Dashboard de métricas de la comicteca"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Materiales más prestados */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp size={18} className="text-[#e66414]" />
            <h2 className="font-display font-bold text-[#f5f5f5]">
              Materiales más prestados
            </h2>
          </div>
          {lLoaned ? (
            <Loader />
          ) : eLoaned ? (
            <ErrorMessage message={eLoaned} />
          ) : mostLoaned.length === 0 ? (
            <EmptyState title="Sin datos" description="No hay datos disponibles." />
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={mostLoaned.map((m) => ({
                  name: truncate(m.titulo, 18),
                  prestamos: m.total_prestamos,
                }))}
                margin={{ top: 5, right: 10, left: -20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#2e2e2e" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#6b6b6b', fontSize: 11 }}
                  angle={-35}
                  textAnchor="end"
                />
                <YAxis tick={{ fill: '#6b6b6b', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    background: '#1a1a1a',
                    border: '1px solid #2e2e2e',
                    borderRadius: 8,
                    color: '#f5f5f5',
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="prestamos" fill="#e66414" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* 2. Disponibilidad de materiales */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-5">
            <BarChart3 size={18} className="text-[#e66414]" />
            <h2 className="font-display font-bold text-[#f5f5f5]">
              Disponibilidad de ejemplares
            </h2>
          </div>
          {lAvail ? (
            <Loader />
          ) : eAvail ? (
            <ErrorMessage message={eAvail} />
          ) : availabilityItems.length === 0 ? (
            <EmptyState title="Sin datos" description="No hay datos disponibles." />
          ) : (
            <div className="grid grid-cols-3 gap-4 py-8">
              {[
                { label: 'Total ejemplares', value: totalEjemplares, color: 'text-[#f5f5f5]' },
                { label: 'Disponibles', value: disponibles, color: 'text-[#4ade80]' },
                { label: 'No disponibles', value: noDisponibles, color: 'text-[#e66414]' },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <p className={`font-display text-3xl font-black ${item.color}`}>
                    {item.value ?? '—'}
                  </p>
                  <p className="text-[#6b6b6b] text-xs mt-1">{item.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 3. Asistencia a eventos */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-5">
            <Users size={18} className="text-[#e66414]" />
            <h2 className="font-display font-bold text-[#f5f5f5]">
              Asistencia a eventos
            </h2>
          </div>
          {lAttend ? (
            <Loader />
          ) : eAttend ? (
            <ErrorMessage message={eAttend} />
          ) : attendance.length === 0 ? (
            <EmptyState title="Sin datos" description="No hay datos de asistencia." />
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart
                data={attendance.map((e) => ({
                  name: truncate(e.tema, 15),
                  asistentes: e.total_asistentes,
                }))}
                margin={{ top: 5, right: 10, left: -20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#2e2e2e" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#6b6b6b', fontSize: 10 }}
                  angle={-35}
                  textAnchor="end"
                />
                <YAxis tick={{ fill: '#6b6b6b', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    background: '#1a1a1a',
                    border: '1px solid #2e2e2e',
                    borderRadius: 8,
                    color: '#f5f5f5',
                    fontSize: 12,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12, color: '#a0a0a0' }} />
                <Line
                  type="monotone"
                  dataKey="asistentes"
                  stroke="#e66414"
                  strokeWidth={2}
                  dot={{ fill: '#e66414', r: 4 }}
                  name="Asistentes"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* 4. Top donantes */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-5">
            <Award size={18} className="text-[#e66414]" />
            <h2 className="font-display font-bold text-[#f5f5f5]">
              Top donantes
            </h2>
          </div>
          {lDonors ? (
            <Loader />
          ) : eDonors ? (
            <ErrorMessage message={eDonors} />
          ) : topDonors.length === 0 ? (
            <EmptyState title="Sin datos" description="No hay datos de donantes." />
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={topDonors.map((d) => ({
                    name: truncate(d.institucion_donante, 20),
                    value: d.total_ejemplares,
                  }))}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {topDonors.map((_, idx) => (
                    <Cell
                      key={`cell-${idx}`}
                      fill={CHART_COLORS[idx % CHART_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: '#1a1a1a',
                    border: '1px solid #2e2e2e',
                    borderRadius: 8,
                    color: '#f5f5f5',
                    fontSize: 12,
                  }}
                  itemStyle={{ color: '#f5f5f5' }}
                  labelStyle={{ color: '#a0a0a0', marginBottom: 4 }}
                />
                <Legend
                  wrapperStyle={{ fontSize: 11, color: '#a0a0a0' }}
                  formatter={(value) => truncate(value, 22)}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* 5. Préstamos vencidos */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-5">
            <Clock size={18} className="text-[#f87171]" />
            <h2 className="font-display font-bold text-[#f5f5f5]">
              Préstamos vencidos
            </h2>
          </div>
          {lOverdue ? (
            <Loader />
          ) : eOverdue ? (
            <ErrorMessage message={eOverdue} />
          ) : overdueLoans.length === 0 ? (
            <EmptyState
              title="Sin vencidos"
              description="No hay préstamos vencidos."
              icon={<Clock size={28} className="text-green-400" />}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Material</th>
                    <th>Miembro</th>
                    <th>F. Límite</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {overdueLoans.map((loan, idx) => (
                    <tr key={loan.id_prestamo ?? idx} id={`overdue-${loan.id_prestamo ?? idx}`}>
                      <td className="font-mono text-[#e66414] text-xs">
                        #{loan.id_prestamo}
                      </td>
                      <td className="text-xs">{loan.titulo_material ?? '—'}</td>
                      <td className="text-xs">{loan.miembro_nombre ?? '—'}</td>
                      <td className="text-xs text-[#a0a0a0]">
                        {loan.fechaLimite ? formatDate(String(loan.fechaLimite)) : '—'}
                      </td>
                      <td>
                        <Badge variant="danger">{loan.estado_tiempo_real}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* 6. Sanciones */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-5">
            <AlertTriangle size={18} className="text-[#facc15]" />
            <h2 className="font-display font-bold text-[#f5f5f5]">
              Sanciones
            </h2>
          </div>
          {lSanctions ? (
            <Loader />
          ) : eSanctions ? (
            <ErrorMessage message={eSanctions} />
          ) : sanctions.length === 0 ? (
            <EmptyState
              title="Sin sanciones"
              description="No hay sanciones registradas."
              icon={<AlertTriangle size={28} className="text-green-400" />}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Motivo</th>
                    <th>Cantidad</th>
                  </tr>
                </thead>
                <tbody>
                  {sanctions.map((sanction, idx) => (
                    <tr key={`${sanction.motivo}-${idx}`}>
                      <td>
                        <Badge variant="warning">
                          {truncate(String(sanction.motivo), 40)}
                        </Badge>
                      </td>
                      <td className="font-mono text-[#facc15] text-xs">
                        {sanction.cantidad}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
