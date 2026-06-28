import { useNavigate } from 'react-router-dom';
import { useApi } from '@/hooks/useApi';
import { institutionService } from '@/services/institutionService';
import { Loader } from '@/components/Loader';
import { ErrorMessage } from '@/components/ErrorMessage';
import { EmptyState } from '@/components/EmptyState';
import { SectionTitle } from '@/components/SectionTitle';
import { Badge } from '@/components/Badge';
import { Building2, Phone, Mail, MapPin, ChevronRight, User } from 'lucide-react';
import { truncate } from '@/utils/formatText';
import { apiField } from '@/utils/apiField';

/**
 * Página de listado de instituciones.
 * Campos de tabla Institucion: id, nombre, tipoInstitucion, direccion,
 * telefono, correo, representante, estado
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
          {institutions.map((inst) => {
            const tipo = apiField<string>(inst, 'tipoInstitucion', 'tipoinstitucion');
            const correo = apiField<string>(inst, 'correo');
            const telefono = apiField<string>(inst, 'telefono');
            const direccion = apiField<string>(inst, 'direccion');
            const representante = apiField<string>(inst, 'representante');
            const estado = apiField<string>(inst, 'estado');

            return (
              <article
                key={inst.id}
                className="card p-6 cursor-pointer group flex flex-col gap-4"
                onClick={() => navigate(`/instituciones/${inst.id}`)}
                id={`institution-${inst.id}`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#e66414]/10 flex items-center justify-center shrink-0 group-hover:bg-[#e66414]/20 transition-colors">
                    <Building2 size={22} className="text-[#e66414]" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-[#f5f5f5] text-base leading-tight group-hover:text-[#e66414] transition-colors">
                      {truncate(inst.nombre, 40)}
                    </h3>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {tipo && <Badge variant="primary">{tipo}</Badge>}
                      {estado && (
                        <Badge variant={estado.toLowerCase() === 'activo' ? 'success' : 'neutral'}>
                          {estado}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 text-xs text-[#6b6b6b]">
                  {representante && (
                    <span className="flex items-center gap-1.5">
                      <User size={11} />
                      {truncate(representante, 35)}
                    </span>
                  )}
                  {correo && (
                    <span className="flex items-center gap-1.5">
                      <Mail size={11} />
                      {truncate(correo, 35)}
                    </span>
                  )}
                  {telefono && (
                    <span className="flex items-center gap-1.5">
                      <Phone size={11} />
                      {telefono}
                    </span>
                  )}
                  {direccion && (
                    <span className="flex items-center gap-1.5">
                      <MapPin size={11} />
                      {truncate(direccion, 45)}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-end pt-3 border-t border-[#2e2e2e] mt-auto">
                  <ChevronRight size={16} className="text-[#6b6b6b] group-hover:text-[#e66414] transition-colors" />
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
