import { FineStateInternal } from '../utils/fineUtils';

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'viewer';
  createdAt: string;
};

export type Vehicle = {
  plate: string;
  type: string;
  year: number;
  city: string;
  ownerId: string;
  ownerName: string;
  soatStatus: 'valid' | 'expired' | 'pending';
  inspectionStatus: 'valid' | 'expired' | 'pending';
};

export type FineType = 
  | 'speeding'
  | 'red_light'
  | 'illegal_parking'
  | 'no_documents'
  | 'driving_under_influence'
  | 'other';

export type FineStatus = 
  | 'PENDING'
  | 'PAID'
  | 'APPEALED'
  | 'RESOLVED_APPEAL'
  | 'CANCELLED';

export type Location = {
  latitude: number;
  longitude: number;
  address?: string;
};

export type Fine = {
  id: string;
  transactionId: string;
  ipfsCid: string;
  plate: string;
  timestamp: string;
  location: string;
  fineType: FineType;
  status: FineStateInternal;
  cost: number;
  ownerId: string;
};

export type StatusChange = {
  timestamp: string;
  status: FineStateInternal;
  transactionId: string;
  reason?: string;
};

export type FineWithHistory = Fine & {
  statusHistory: StatusChange[];
};

export type Metric = {
  label: string;
  value: number;
  change: number;
};

export type Activity = {
  id: string;
  type: 'fine_registered' | 'fine_paid' | 'fine_appealed' | 'status_change';
  fineId: string;
  plate: string;
  timestamp: string;
  description: string;
};