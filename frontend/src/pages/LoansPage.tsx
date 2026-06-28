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
  Copy,
} from 'lucide-react';
import { formatDate } from '@/utils/formatDate';
import { DEFAULT_PAGE_SIZE } from '@/constants';
import { apiField } from '@/utils/apiField';

type LoanTab = 'all' | 'active' | 'expired';

/**
 * Página de préstamos con tabs: todos, activos, vencidos y búsqueda por DNI/material.
 * Usa los campos reales de la tabla Prestamo:
 *   id, miembro_DNI, bibliotecario_DNI, material_id, numeroCopia,
 *   fechaPrestamo, fechaLimite, fechaDevolucion, estado
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
        <StatCard label="En Curso" value={activeLoans?.length ?? '—'} icon={<CheckCircle size={20} />} color="success" />
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
            { key: 'active', label: 'En Curso' },
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
                  <th>Bibliotecario DNI</th>
                  <th>Material ID</th>
                  <th>Copia</th>
                  <th>F. Préstamo</th>
                  <th>F. Límite</th>
                  <th>F. Devolución</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((loan) => {
                  const miembroDni = apiField<number>(loan, 'miembro_DNI', 'miembro_dni');
                  const bibliotecarioDni = apiField<number>(loan, 'bibliotecario_DNI', 'bibliotecario_dni');
                  const materialId = apiField<number>(loan, 'material_id');
                  const numeroCopia = apiField<number>(loan, 'numeroCopia', 'numerocopia');
                  const fechaPrestamo = apiField<string>(loan, 'fechaPrestamo', 'fechaprestamo');
                  const fechaLimite = apiField<string>(loan, 'fechaLimite', 'fechalimite');
                  const fechaDevolucion = apiField<string | null>(loan, 'fechaDevolucion', 'fechadevolucion');
                  const estado = apiField<string>(loan, 'estado');

                  return (
                  <tr key={loan.id} id={`loan-row-${loan.id}`}>
                    <td className="font-mono text-[#e66414]">#{loan.id}</td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <User size={12} className="text-[#6b6b6b]" />
                        {miembroDni}
                      </div>
                    </td>
                    <td className="font-mono text-xs">{bibliotecarioDni ?? '—'}</td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <BookOpen size={12} className="text-[#6b6b6b]" />
                        {materialId ?? '—'}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <Copy size={12} className="text-[#6b6b6b]" />
                        #{numeroCopia}
                      </div>
                    </td>
                    <td className="text-[#a0a0a0]">{fechaPrestamo ? formatDate(fechaPrestamo) : '—'}</td>
                    <td className="text-[#a0a0a0]">
                      {fechaLimite ? formatDate(fechaLimite) : '—'}
                    </td>
                    <td className="text-[#a0a0a0]">
                      {fechaDevolucion ? formatDate(fechaDevolucion) : (
                        <span className="text-[#6b6b6b] text-xs italic">Pendiente</span>
                      )}
                    </td>
                    <td>
                      <LoanStatusBadge
                        estado={estado}
                        fechaDevolucion={fechaDevolucion}
                      />
                    </td>
                  </tr>
                  );
                })}
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
  fechaDevolucion,
}: {
  estado?: string;
  fechaDevolucion?: string | null;
}) {
  // Si tiene fechaDevolucion real, está devuelto
  if (fechaDevolucion) {
    return <Badge variant="success" dot>Devuelto</Badge>;
  }
  // Estado "En Curso" es el valor real en la DB
  if (estado === 'En Curso') {
    return <Badge variant="info" dot>En Curso</Badge>;
  }
  // Sin estado ni devolución → vencido
  return <Badge variant="danger" dot>Vencido</Badge>;
}
