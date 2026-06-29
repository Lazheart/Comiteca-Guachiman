/** Re-exportación centralizada de todas las interfaces */
export type { PaginatedResponse, PaginationParams } from './pagination.interface';
export type { Material, Copy, MaterialFilters } from './material.interface';
export type { Event, SponsoredEvent, EventFilters } from './event.interface';
export type { Institution } from './institution.interface';
export type {
  Donation,
  DonationRecord,
  DonationAudit,
  DonationStatisticsRow,
} from './donation.interface';
export type { Loan } from './loan.interface';
export type { Reservation } from './reservation.interface';
export type {
  MostLoanedMaterial,
  EventAttendance,
  MaterialAvailabilityRow,
  MaterialAvailabilitySummary,
  TopDonor,
  SanctionStat,
  OverdueLoan,
} from './statistics.interface';
