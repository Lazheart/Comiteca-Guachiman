import { useParams, useNavigate } from 'react-router-dom';
import { useApi } from '@/hooks/useApi';
import { materialService } from '@/services/materialService';
import { Loader } from '@/components/Loader';
import { ErrorMessage } from '@/components/ErrorMessage';
import { Badge } from '@/components/Badge';
import {
  BookOpen,
  ArrowLeft,
  User,
  Globe,
  Building2,
  Hash,
  BookMarked,
  CheckCircle,
  XCircle,
  FileText,
} from 'lucide-react';
import { apiField } from '@/utils/apiField';

/**
 * Página de detalle de un material con info completa y listado de copias.
 */
export function MaterialDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const materialId = Number(id);

  const {
    data: material,
    loading,
    error,
    refetch,
  } = useApi(() => materialService.getById(materialId), [materialId]);

  const {
    data: copiesResp,
    loading: loadingCopies,
  } = useApi(() => materialService.getCopies(materialId, { page: 1, page_size: 100 }), [materialId]);
  const copies = copiesResp?.items ?? null;

  if (loading) return <Loader />;
  if (error || !material)
    return (
      <div className="section-container py-10">
        <ErrorMessage
          message={error ?? 'Material no encontrado.'}
          onRetry={refetch}
        />
      </div>
    );

  const availableCopies = copies?.filter((c) => {
    const disp = apiField<string>(c, 'disponibilidad');
    return disp === 'Disponible';
  }) ?? [];

  const paisOrigen = apiField<string>(material, 'paisOrigen', 'paisorigen');
  const fechaPublicacion = apiField<string>(material, 'fechaPublicacion', 'fechapublicacion');
  const ilustracion = apiField<string>(material, 'ilustracion');
  const editorial = apiField<string>(material, 'editorial');
  const narracion = apiField<string>(material, 'narracion');
  const tipoComic = apiField<string>(material, 'tipoComic', 'tipocomic');
  const serializacion = apiField<string>(material, 'serializacion');

  return (
    <div className="section-container py-10">
      {/* Breadcrumb */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-[#a0a0a0] hover:text-[#e66414] text-sm transition-colors mb-8"
        id="back-btn"
      >
        <ArrowLeft size={15} />
        Volver a materiales
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna izquierda - portada y estado */}
        <div className="lg:col-span-1">
          <div className="card p-8 flex flex-col items-center gap-4 mb-4">
            <div className="w-40 h-52 rounded-xl bg-gradient-to-br from-[#e66414]/20 to-[#ff914d]/10 flex items-center justify-center">
              <BookOpen size={56} className="text-[#e66414] opacity-70" />
            </div>
            <Badge
              variant={(material.copias_disponibles ?? availableCopies.length) > 0 ? 'success' : 'danger'}
              dot
            >
              {(material.copias_disponibles ?? availableCopies.length) > 0
                ? 'Disponible para préstamo'
                : 'No disponible'}
            </Badge>
            {material.total_copias !== undefined && (
              <div className="text-center">
                <p className="text-2xl font-bold text-[#f5f5f5]">
                  {material.copias_disponibles ?? availableCopies.length}
                  <span className="text-[#a0a0a0] text-base font-normal">
                    /{material.total_copias}
                  </span>
                </p>
                <p className="text-[#6b6b6b] text-xs">copias disponibles</p>
              </div>
            )}
          </div>
        </div>

        {/* Columna derecha - información detallada */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div>
            {material.genero && (
              <div className="mb-3">
                <Badge variant="primary">
                  {material.genero}
                </Badge>
              </div>
            )}
            <h1 className="font-display text-4xl font-black text-[#f5f5f5] leading-tight mb-2">
              {material.titulo}
            </h1>
            <p className="text-[#a0a0a0] text-lg">{material.autor}</p>
          </div>

          {/* Descripción / Sinopsis — no existe en tabla Material; solo se muestra si el backend la incluye */}
          {narracion && (
            <div className="card p-5">
              <div className="flex items-center gap-2 text-[#a0a0a0] text-xs font-semibold uppercase tracking-wider mb-3">
                <FileText size={13} />
                Narración (Novela)
              </div>
              <p className="text-[#d0d0d0] text-sm leading-relaxed">{narracion}</p>
            </div>
          )}

          {(tipoComic || serializacion) && (
            <div className="card p-5">
              <div className="flex items-center gap-2 text-[#a0a0a0] text-xs font-semibold uppercase tracking-wider mb-3">
                <BookMarked size={13} />
                Detalle de cómic
              </div>
              <dl className="grid grid-cols-2 gap-4">
                {tipoComic && (
                  <div>
                    <dt className="text-[#6b6b6b] text-xs mb-1">Tipo</dt>
                    <dd className="text-[#f5f5f5] text-sm">{tipoComic}</dd>
                  </div>
                )}
                {serializacion && (
                  <div>
                    <dt className="text-[#6b6b6b] text-xs mb-1">Serialización</dt>
                    <dd className="text-[#f5f5f5] text-sm">{serializacion}</dd>
                  </div>
                )}
              </dl>
            </div>
          )}

          {/* Detalles */}
          <div className="card p-5">
            <h2 className="text-[#a0a0a0] text-xs font-semibold uppercase tracking-wider mb-4">
              Información
            </h2>
            <dl className="grid grid-cols-2 gap-4">
              {[
                { icon: <User size={14} />, label: 'Autor', value: material.autor },
                { icon: <Globe size={14} />, label: 'País de origen', value: paisOrigen },
                { icon: <Building2 size={14} />, label: 'Editorial', value: editorial },
                { icon: <Hash size={14} />, label: 'Publicación', value: fechaPublicacion },
                { icon: <BookMarked size={14} />, label: 'Ilustración', value: ilustracion },
                { icon: <BookOpen size={14} />, label: 'Género', value: material.genero },
              ]
                .filter((d) => d.value)
                .map((detail) => (
                  <div key={detail.label}>
                    <dt className="flex items-center gap-1.5 text-[#6b6b6b] text-xs mb-1">
                      {detail.icon}
                      {detail.label}
                    </dt>
                    <dd className="text-[#f5f5f5] text-sm font-medium">{detail.value}</dd>
                  </div>
                ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Copias */}
      <div className="mt-10">
        <h2 className="font-display text-2xl font-bold text-[#f5f5f5] mb-5">
          Copias disponibles
        </h2>
        {loadingCopies ? (
          <Loader />
        ) : !copies || copies.length === 0 ? (
          <div className="card p-6 text-center text-[#6b6b6b] text-sm">
            No hay copias registradas para este material.
          </div>
        ) : (
          <div className="card overflow-hidden">
            <table className="data-table">
              <thead>
                <tr>
                  <th># Copia</th>
                  <th>Estado conservación</th>
                  <th>Disponibilidad</th>
                </tr>
              </thead>
              <tbody>
                {copies.map((copy) => {
                  const materialId = apiField<number>(copy, 'material_id') ?? 0;
                  const numeroCopia = apiField<number>(copy, 'numeroCopia', 'numerocopia') ?? 0;
                  const estadoConservacion = apiField<string>(copy, 'estadoConservacion', 'estadoconservacion');
                  const disponibilidad = apiField<string>(copy, 'disponibilidad');

                  return (
                  <tr key={`${materialId}-${numeroCopia}`} id={`copy-row-${materialId}-${numeroCopia}`}>
                    <td className="font-mono text-[#e66414]">#{numeroCopia}</td>
                    <td>
                      {estadoConservacion ? (
                        <Badge variant="neutral">{estadoConservacion}</Badge>
                      ) : (
                        <span className="text-[#6b6b6b]">—</span>
                      )}
                    </td>
                    <td>
                      {disponibilidad === 'Disponible' ? (
                        <span className="flex items-center gap-1.5 text-green-400 text-sm">
                          <CheckCircle size={14} />
                          Disponible
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-red-400 text-sm">
                          <XCircle size={14} />
                          {disponibilidad ?? 'No disponible'}
                        </span>
                      )}
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
