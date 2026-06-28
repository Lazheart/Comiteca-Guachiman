/** Re-exportación centralizada de todas las interfaces */
export type { Material, Copy, MaterialFilters } from './material.interface';
export type { Event, EventFilters } from './event.interface';
export type { Institution } from './institution.interface';
export type { Donation, DonationStatistics } from './donation.interface';
export type { Loan } from './loan.interface';
export type { Reservation } from './reservation.interface';
export type {
  MostLoanedMaterial,
  EventAttendance,
  MaterialAvailability,
  TopDonor,
  Sanction,
  OverdueLoan,
} from './statistics.interface';
