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
    data: copies,
    loading: loadingCopies,
  } = useApi(() => materialService.getCopies(materialId), [materialId]);

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

  const availableCopies = copies?.filter((c) => c.disponible !== false) ?? [];

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
              variant={material.disponible !== false ? 'success' : 'danger'}
              dot
            >
              {material.disponible !== false ? 'Disponible para préstamo' : 'No disponible'}
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
              <Badge variant="primary" className="mb-3">
                {material.genero}
              </Badge>
            )}
            <h1 className="font-display text-4xl font-black text-[#f5f5f5] leading-tight mb-2">
              {material.titulo}
            </h1>
            <p className="text-[#a0a0a0] text-lg">{material.autor}</p>
          </div>

          {/* Descripción */}
          {material.descripcion && (
            <div className="card p-5">
              <div className="flex items-center gap-2 text-[#a0a0a0] text-xs font-semibold uppercase tracking-wider mb-3">
                <FileText size={13} />
                Sinopsis
              </div>
              <p className="text-[#d0d0d0] text-sm leading-relaxed">
                {material.descripcion}
              </p>
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
                { icon: <Globe size={14} />, label: 'País', value: material.pais },
                { icon: <Building2 size={14} />, label: 'Editorial', value: material.editorial },
                { icon: <Hash size={14} />, label: 'Año', value: material.anio?.toString() },
                { icon: <BookMarked size={14} />, label: 'Páginas', value: material.num_paginas?.toString() },
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
                  <th>ID Copia</th>
                  <th>Estado</th>
                  <th>Disponible</th>
                  <th>Notas</th>
                </tr>
              </thead>
              <tbody>
                {copies.map((copy) => (
                  <tr key={copy.id} id={`copy-row-${copy.id}`}>
                    <td className="font-mono text-[#e66414]">#{copy.id}</td>
                    <td>
                      {copy.estado ? (
                        <Badge variant="neutral">{copy.estado}</Badge>
                      ) : (
                        <span className="text-[#6b6b6b]">—</span>
                      )}
                    </td>
                    <td>
                      {copy.disponible !== false ? (
                        <span className="flex items-center gap-1.5 text-green-400 text-sm">
                          <CheckCircle size={14} />
                          Sí
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-red-400 text-sm">
                          <XCircle size={14} />
                          No
                        </span>
                      )}
                    </td>
                    <td className="text-[#6b6b6b] text-xs">{copy.notas ?? '—'}</td>
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
