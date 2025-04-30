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
  | 'pending'
  | 'paid'
  | 'appealed'
  | 'rejected'
  | 'verified';

export type Fine = {
  id: string;
  transactionId: string; // Blockchain transaction ID
  ipfsCid: string; // IPFS Content ID for evidence
  plate: string;
  timestamp: string;
  location: string;
  city: string;
  fineType: FineType;
  status: FineStatus;
  cost: number;
  ownerId: string;
  ownerName: string;
  idIoT?: string; // Optional IoT device ID
};

export type StatusChange = {
  timestamp: string;
  status: FineStatus;
  transactionId: string;
  reason?: string;
};

export type FineWithHistory = Fine & {
  statusHistory: StatusChange[];
};

export type Metric = {
  label: string;
  value: number;
  change: number; // percentage change from previous period
};

export type Activity = {
  id: string;
  type: 'fine_registered' | 'fine_paid' | 'fine_appealed' | 'status_change';
  fineId: string;
  plate: string;
  timestamp: string;
  description: string;
};