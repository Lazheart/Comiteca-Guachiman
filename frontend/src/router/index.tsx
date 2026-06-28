import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { ROUTES } from '@/constants';

// Pages (lazy imports for code splitting)
import { lazy, Suspense } from 'react';
import { Loader } from '@/components/Loader';

const HomePage = lazy(() => import('@/pages/HomePage').then((m) => ({ default: m.HomePage })));
const MaterialsPage = lazy(() => import('@/pages/MaterialsPage').then((m) => ({ default: m.MaterialsPage })));
const MaterialDetailPage = lazy(() => import('@/pages/MaterialDetailPage').then((m) => ({ default: m.MaterialDetailPage })));
const EventsPage = lazy(() => import('@/pages/EventsPage').then((m) => ({ default: m.EventsPage })));
const EventDetailPage = lazy(() => import('@/pages/EventDetailPage').then((m) => ({ default: m.EventDetailPage })));
const InstitutionsPage = lazy(() => import('@/pages/InstitutionsPage').then((m) => ({ default: m.InstitutionsPage })));
const InstitutionDetailPage = lazy(() => import('@/pages/InstitutionDetailPage').then((m) => ({ default: m.InstitutionDetailPage })));
const DonationsPage = lazy(() => import('@/pages/DonationsPage').then((m) => ({ default: m.DonationsPage })));
const LoansPage = lazy(() => import('@/pages/LoansPage').then((m) => ({ default: m.LoansPage })));
const ReservationsPage = lazy(() => import('@/pages/ReservationsPage').then((m) => ({ default: m.ReservationsPage })));
const StatisticsPage = lazy(() => import('@/pages/StatisticsPage').then((m) => ({ default: m.StatisticsPage })));

/**
 * Configuración central de rutas de la aplicación.
 */
export function AppRouter() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Suspense fallback={<Loader fullScreen text="Cargando página..." />}>
          <Routes>
            <Route path={ROUTES.HOME} element={<HomePage />} />
            <Route path={ROUTES.MATERIALS} element={<MaterialsPage />} />
            <Route path={ROUTES.MATERIAL_DETAIL} element={<MaterialDetailPage />} />
            <Route path={ROUTES.EVENTS} element={<EventsPage />} />
            <Route path={ROUTES.EVENT_DETAIL} element={<EventDetailPage />} />
            <Route path={ROUTES.INSTITUTIONS} element={<InstitutionsPage />} />
            <Route path={ROUTES.INSTITUTION_DETAIL} element={<InstitutionDetailPage />} />
            <Route path={ROUTES.DONATIONS} element={<DonationsPage />} />
            <Route path={ROUTES.LOANS} element={<LoansPage />} />
            <Route path={ROUTES.RESERVATIONS} element={<ReservationsPage />} />
            <Route path={ROUTES.STATISTICS} element={<StatisticsPage />} />
            {/* Redirigir rutas desconocidas al inicio */}
            <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
          </Routes>
        </Suspense>
      </MainLayout>
    </BrowserRouter>
  );
}
