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
 */
export function StatisticsPage() {
  const { data: mostLoaned, loading: lLoaned, error: eLoaned } = useApi(
    () => statisticsService.getMostLoanedMaterials(),
    [],
  );
  const { data: attendance, loading: lAttend, error: eAttend } = useApi(
    () => statisticsService.getEventsAttendance(),
    [],
  );
  const { data: availability, loading: lAvail, error: eAvail } = useApi(
    () => statisticsService.getMaterialAvailability(),
    [],
  );
  const { data: topDonors, loading: lDonors, error: eDonors } = useApi(
    () => statisticsService.getTopDonors(),
    [],
  );
  const { data: sanctions, loading: lSanctions, error: eSanctions } = useApi(
    () => statisticsService.getSanctions(),
    [],
  );
  const { data: overdueLoans, loading: lOverdue, error: eOverdue } = useApi(
    () => statisticsService.getOverdueLoans(),
    [],
  );

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
          ) : !mostLoaned || mostLoaned.length === 0 ? (
            <EmptyState title="Sin datos" description="No hay datos disponibles." />
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={mostLoaned.slice(0, 8).map((m) => ({
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
              Disponibilidad de materiales
            </h2>
          </div>
          {lAvail ? (
            <Loader />
          ) : eAvail ? (
            <ErrorMessage message={eAvail} />
          ) : !availability ? (
            <EmptyState title="Sin datos" description="No hay datos disponibles." />
          ) : availability.por_genero && availability.por_genero.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={availability.por_genero.map((g) => ({
                  genero: truncate(g.genero, 12),
                  total: g.total,
                  disponibles: g.disponibles,
                }))}
                margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#2e2e2e" />
                <XAxis dataKey="genero" tick={{ fill: '#6b6b6b', fontSize: 11 }} />
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
                <Bar dataKey="total" fill="#2e2e2e" radius={[4, 4, 0, 0]} name="Total" />
                <Bar dataKey="disponibles" fill="#e66414" radius={[4, 4, 0, 0]} name="Disponibles" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="grid grid-cols-3 gap-4 py-8">
              {[
                { label: 'Total', value: availability.total_materiales, color: 'text-[#f5f5f5]' },
                { label: 'Disponibles', value: availability.disponibles, color: 'text-[#4ade80]' },
                { label: 'Prestados', value: availability.prestados, color: 'text-[#e66414]' },
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
          ) : !attendance || attendance.length === 0 ? (
            <EmptyState title="Sin datos" description="No hay datos de asistencia." />
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart
                data={attendance.slice(0, 10).map((e) => ({
                  name: truncate(e.nombre, 15),
                  asistentes: e.asistentes,
                  capacidad: e.capacidad,
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
                {attendance[0]?.capacidad !== undefined && (
                  <Line
                    type="monotone"
                    dataKey="capacidad"
                    stroke="#2e2e2e"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Capacidad"
                  />
                )}
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
          ) : !topDonors || topDonors.length === 0 ? (
            <EmptyState title="Sin datos" description="No hay datos de donantes." />
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={topDonors.slice(0, 6).map((d) => ({
                    name: truncate(d.institucion_nombre, 20),
                    value: d.total_donaciones,
                  }))}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {topDonors.slice(0, 6).map((_, idx) => (
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
          ) : !overdueLoans || overdueLoans.length === 0 ? (
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
                    <th>Material</th>
                    <th>Miembro</th>
                    <th>Vencimiento</th>
                    <th>Días vencido</th>
                  </tr>
                </thead>
                <tbody>
                  {overdueLoans.slice(0, 8).map((loan, idx) => (
                    <tr key={loan.prestamo_id ?? idx} id={`overdue-${loan.prestamo_id ?? idx}`}>
                      <td className="text-xs">{loan.material_titulo ?? '—'}</td>
                      <td className="text-xs font-mono">{loan.miembro_dni ?? '—'}</td>
                      <td className="text-xs text-[#a0a0a0]">
                        {loan.fecha_devolucion ? formatDate(loan.fecha_devolucion) : '—'}
                      </td>
                      <td>
                        {loan.dias_vencido !== undefined ? (
                          <Badge variant="danger">{loan.dias_vencido}d</Badge>
                        ) : (
                          <span className="text-[#6b6b6b]">—</span>
                        )}
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
          ) : !sanctions || sanctions.length === 0 ? (
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
                    <th>Miembro</th>
                    <th>Tipo</th>
                    <th>Inicio</th>
                    <th>Monto</th>
                  </tr>
                </thead>
                <tbody>
                  {sanctions.slice(0, 8).map((sanction, idx) => (
                    <tr key={idx}>
                      <td className="font-mono text-xs">{sanction.miembro_dni ?? '—'}</td>
                      <td>
                        {sanction.tipo_sancion ? (
                          <Badge variant="warning">{truncate(String(sanction.tipo_sancion), 20)}</Badge>
                        ) : (
                          <span className="text-[#6b6b6b]">—</span>
                        )}
                      </td>
                      <td className="text-xs text-[#a0a0a0]">
                        {sanction.fecha_inicio ? formatDate(String(sanction.fecha_inicio)) : '—'}
                      </td>
                      <td>
                        {sanction.monto !== undefined ? (
                          <span className="text-[#facc15] font-semibold text-sm">
                            S/ {Number(sanction.monto).toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-[#6b6b6b]">—</span>
                        )}
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
