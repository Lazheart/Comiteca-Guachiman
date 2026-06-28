import { useState, useCallback } from 'react';
import { useApi } from '@/hooks/useApi';
import { usePagination } from '@/hooks/usePagination';
import { loanService } from '@/services/loanService';
import type { Loan } from '@/interfaces';
import { Loader } from '@/components/Loader';
import { ErrorMessage } from '@/components/ErrorMessage';
import { EmptyState } from '@/components/EmptyState';
import { SectionTitle } from '@/components/SectionTitle';
import { Badge } from '@/components/Badge';
import { Pagination } from '@/components/Pagination';
import { SearchBar } from '@/components/SearchBar';
import { StatCard } from '@/components/StatCard';
import {
  BookMarked,
  CheckCircle,
  AlertTriangle,
  Search,
  Hash,
  BookOpen,
  User,
} from 'lucide-react';
import { formatDate } from '@/utils/formatDate';
import { DEFAULT_PAGE_SIZE } from '@/constants';

type LoanTab = 'all' | 'active' | 'expired';

/**
 * Página de préstamos con tabs: todos, activos, vencidos y búsqueda por DNI/material.
 */
export function LoansPage() {
  const [activeTab, setActiveTab] = useState<LoanTab>('all');
  const [searchDni, setSearchDni] = useState('');
  const [searchMaterialId, setSearchMaterialId] = useState('');
  const [dniResults, setDniResults] = useState<Loan[] | null>(null);
  const [materialResults, setMaterialResults] = useState<Loan[] | null>(null);
  const [searching, setSearching] = useState(false);

  const { data: allLoans, loading: lAll, error: eAll, refetch: rAll } = useApi(() => loanService.getAll(), []);
  const { data: activeLoans, loading: lActive, error: eActive, refetch: rActive } = useApi(() => loanService.getActive(), []);
  const { data: expiredLoans, loading: lExpired, error: eExpired, refetch: rExpired } = useApi(() => loanService.getExpired(), []);

  const tabData: Record<LoanTab, { data: Loan[] | null; loading: boolean; error: string | null; refetch: () => void }> = {
    all: { data: dniResults ?? materialResults ?? allLoans, loading: lAll, error: eAll, refetch: rAll },
    active: { data: activeLoans, loading: lActive, error: eActive, refetch: rActive },
    expired: { data: expiredLoans, loading: lExpired, error: eExpired, refetch: rExpired },
  };

  const { data, loading, error, refetch } = tabData[activeTab];
  const displayList = data ?? [];

  const { currentPage, totalPages, offset, limit, setPage } = usePagination({
    totalItems: displayList.length,
    itemsPerPage: DEFAULT_PAGE_SIZE,
  });
  const paginated = displayList.slice(offset, offset + limit);

  const handleSearchDni = useCallback(async (query: string) => {
    const dni = parseInt(query);
    if (isNaN(dni)) return;
    setSearching(true);
    setMaterialResults(null);
    try {
      const results = await loanService.getByMember(dni);
      setDniResults(results);
    } finally {
      setSearching(false);
    }
  }, []);

  const handleSearchMaterial = useCallback(async (query: string) => {
    const id = parseInt(query);
    if (isNaN(id)) return;
    setSearching(true);
    setDniResults(null);
    try {
      const results = await loanService.getByMaterial(id);
      setMaterialResults(results);
    } finally {
      setSearching(false);
    }
  }, []);

  const clearSearch = () => {
    setDniResults(null);
    setMaterialResults(null);
    setSearchDni('');
    setSearchMaterialId('');
  };

  return (
    <div className="section-container py-10">
      <SectionTitle
        title="Préstamos"
        subtitle="Gestión de préstamos de materiales"
      />

      {/* Stats rápidas */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard label="Total" value={allLoans?.length ?? '—'} icon={<BookMarked size={20} />} color="primary" />
        <StatCard label="Activos" value={activeLoans?.length ?? '—'} icon={<CheckCircle size={20} />} color="success" />
        <StatCard label="Vencidos" value={expiredLoans?.length ?? '—'} icon={<AlertTriangle size={20} />} color="danger" />
      </div>

      {/* Búsquedas */}
      <div className="card p-5 mb-6">
        <h3 className="text-[#a0a0a0] text-xs font-semibold uppercase tracking-wider mb-4 flex items-center gap-2">
          <Search size={13} />
          Búsqueda avanzada
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-[#a0a0a0] mb-1.5 flex items-center gap-1.5">
              <User size={11} />
              Buscar por DNI del miembro
            </label>
            <SearchBar
              placeholder="Ingresa el DNI..."
              defaultValue={searchDni}
              onSearch={(q) => { setSearchDni(q); handleSearchDni(q); }}
              onClear={clearSearch}
            />
          </div>
          <div>
            <label className="block text-xs text-[#a0a0a0] mb-1.5 flex items-center gap-1.5">
              <Hash size={11} />
              Buscar por ID de material
            </label>
            <SearchBar
              placeholder="Ingresa el ID del material..."
              defaultValue={searchMaterialId}
              onSearch={(q) => { setSearchMaterialId(q); handleSearchMaterial(q); }}
              onClear={clearSearch}
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      {!dniResults && !materialResults && (
        <div className="flex gap-1 p-1 bg-[#1a1a1a] border border-[#2e2e2e] rounded-xl w-fit mb-6">
          {([
            { key: 'all', label: 'Todos' },
            { key: 'active', label: 'Activos' },
            { key: 'expired', label: 'Vencidos' },
          ] as { key: LoanTab; label: string }[]).map((tab) => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setPage(1); }}
              id={`loan-tab-${tab.key}`}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-[#e66414] text-white'
                  : 'text-[#a0a0a0] hover:text-[#f5f5f5]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Tabla */}
      {loading || searching ? (
        <Loader />
      ) : error ? (
        <ErrorMessage message={error} onRetry={refetch} />
      ) : paginated.length === 0 ? (
        <EmptyState title="Sin préstamos" description="No hay préstamos para mostrar." />
      ) : (
        <>
          <div className="card overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Miembro DNI</th>
                  <th>Material</th>
                  <th>Fecha préstamo</th>
                  <th>Fecha devolución</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((loan) => (
                  <tr key={loan.id} id={`loan-row-${loan.id}`}>
                    <td className="font-mono text-[#e66414]">#{loan.id}</td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <User size={12} className="text-[#6b6b6b]" />
                        {loan.miembro_dni}
                        {loan.miembro_nombre && (
                          <span className="text-[#6b6b6b] text-xs">({loan.miembro_nombre})</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <BookOpen size={12} className="text-[#6b6b6b]" />
                        {loan.material_titulo ?? `ID ${loan.material_id}`}
                      </div>
                    </td>
                    <td className="text-[#a0a0a0]">{formatDate(loan.fecha_prestamo)}</td>
                    <td className="text-[#a0a0a0]">{formatDate(loan.fecha_devolucion)}</td>
                    <td>
                      <LoanStatusBadge
                        estado={loan.estado}
                        fechaDevolucionReal={loan.fecha_devolucion_real}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}

function LoanStatusBadge({
  estado,
  fechaDevolucionReal,
}: {
  estado?: string;
  fechaDevolucionReal?: string | null;
}) {
  if (estado === 'devuelto' || fechaDevolucionReal) {
    return <Badge variant="success" dot>Devuelto</Badge>;
  }
  if (estado === 'vencido') {
    return <Badge variant="danger" dot>Vencido</Badge>;
  }
  return <Badge variant="info" dot>Activo</Badge>;
}
