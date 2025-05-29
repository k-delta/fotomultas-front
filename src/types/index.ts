import { FineStateInternal } from '../utils/fineUtils';

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'viewer';
  createdAt: string;
};

export type Vehicle = {
  plateNumber: string;
  type: string;
  year: number;
  city: string;
  ownerIdentifier: string;
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

export type Fine = {
  id: string;
  plateNumber: string;
  evidenceCID: string;
  location: string;
  timestamp: string;
  infractionType: FineType;
  cost: number;
  ownerIdentifier: string;
  currentState: FineStateInternal;
  transactionId?: string;
  registeredBy?: string;
};

export type StatusChange = {
  timestamp: string;
  currentState: FineStateInternal;
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
  id?: string;
  fineId: string;
  plateNumber: string;
  reason: string;
  status: number;
  timestamp: string;
};