import { useNavigate } from 'react-router-dom';
import { useApi } from '@/hooks/useApi';
import { institutionService } from '@/services/institutionService';
import { Loader } from '@/components/Loader';
import { ErrorMessage } from '@/components/ErrorMessage';
import { EmptyState } from '@/components/EmptyState';
import { SectionTitle } from '@/components/SectionTitle';
import { Badge } from '@/components/Badge';
import { Building2, Phone, Mail, Globe, ChevronRight } from 'lucide-react';
import { truncate } from '@/utils/formatText';

/**
 * Página de listado de instituciones.
 */
export function InstitutionsPage() {
  const navigate = useNavigate();
  const { data: institutions, loading, error, refetch } = useApi(
    () => institutionService.getAll(),
    [],
  );

  return (
    <div className="section-container py-10">
      <SectionTitle
        title="Instituciones"
        subtitle={`${institutions?.length ?? 0} instituciones participantes`}
      />

      {loading ? (
        <Loader />
      ) : error ? (
        <ErrorMessage message={error} onRetry={refetch} />
      ) : !institutions || institutions.length === 0 ? (
        <EmptyState title="Sin instituciones" description="No hay instituciones registradas." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {institutions.map((inst) => (
            <article
              key={inst.id}
              className="card p-6 cursor-pointer group flex flex-col gap-4"
              onClick={() => navigate(`/instituciones/${inst.id}`)}
              id={`institution-${inst.id}`}
            >
              {/* Header */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#e66414]/10 flex items-center justify-center shrink-0 group-hover:bg-[#e66414]/20 transition-colors">
                  <Building2 size={22} className="text-[#e66414]" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-[#f5f5f5] text-base leading-tight group-hover:text-[#e66414] transition-colors">
                    {truncate(inst.nombre, 40)}
                  </h3>
                  {inst.tipo && (
                    <Badge variant="primary" className="mt-1.5">
                      {inst.tipo}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Contacto */}
              <div className="flex flex-col gap-2 text-xs text-[#6b6b6b]">
                {inst.email && (
                  <span className="flex items-center gap-1.5">
                    <Mail size={11} />
                    {truncate(inst.email, 35)}
                  </span>
                )}
                {inst.telefono && (
                  <span className="flex items-center gap-1.5">
                    <Phone size={11} />
                    {inst.telefono}
                  </span>
                )}
                {inst.sitio_web && (
                  <span className="flex items-center gap-1.5">
                    <Globe size={11} />
                    {truncate(inst.sitio_web, 35)}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#2e2e2e] mt-auto">
                <div className="flex gap-3">
                  {inst.total_donaciones !== undefined && (
                    <div className="text-center">
                      <p className="font-bold text-[#f5f5f5] text-sm">{inst.total_donaciones}</p>
                      <p className="text-[#6b6b6b] text-xs">donaciones</p>
                    </div>
                  )}
                  {inst.total_eventos_patrocinados !== undefined && (
                    <div className="text-center">
                      <p className="font-bold text-[#f5f5f5] text-sm">{inst.total_eventos_patrocinados}</p>
                      <p className="text-[#6b6b6b] text-xs">eventos</p>
                    </div>
                  )}
                </div>
                <ChevronRight size={16} className="text-[#6b6b6b] group-hover:text-[#e66414] transition-colors" />
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
