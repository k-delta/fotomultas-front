import { Fine, FineStatus, FineType, FineWithHistory, StatusChange } from '../types';

export enum FineStateInternal {
    PENDING = 0,
    PAID = 1,
    APPEALED = 2,
    RESOLVED_APPEAL = 3,
    CANCELLED = 4,
}

// Generate a fake blockchain transaction ID
export const generateTransactionId = (): string => {
  return '0x' + Array.from({ length: 64 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
};

// Generate a fake IPFS CID (Content Identifier)
export const generateIpfsCid = (): string => {
  return 'Qm' + Array.from({ length: 44 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
};

// Format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(amount);
};

// Format date
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Get color based on fine status
export const getStatusColor = (status: FineStatus): string => {
  switch (status) {
    case 'pending': return 'bg-amber-100 text-amber-800';
    case 'paid': return 'bg-green-100 text-green-800';
    case 'appealed': return 'bg-purple-100 text-purple-800';
    case 'rejected': return 'bg-red-100 text-red-800';
    case 'verified': return 'bg-blue-100 text-blue-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

// Get label for fine type
export const getFineTypeLabel = (type: FineType): string => {
  switch (type) {
    case 'speeding': return 'Exceso de velocidad';
    case 'red_light': return 'Semáforo en rojo';
    case 'illegal_parking': return 'Estacionamiento ilegal';
    case 'no_documents': return 'Sin documentos';
    case 'driving_under_influence': return 'Conducción bajo influencia';
    case 'other': return 'Otra infracción';
    default: return 'Desconocido';
  }
};

// Verify blockchain integrity (simulated)
export const verifyBlockchainIntegrity = async (fine: Fine): Promise<boolean> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // For demo purposes, we'll return true 95% of the time
  return Math.random() > 0.05;
};

// Verify IPFS evidence integrity (simulated)
export const verifyIpfsIntegrity = async (fine: Fine): Promise<boolean> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // For demo purposes, we'll return true 90% of the time
  return Math.random() > 0.1;
};

// Add status change to fine history
export const addStatusChange = (
  fine: FineWithHistory, 
  newStatus: FineStatus, 
  reason?: string
): FineWithHistory => {
  const newTransactionId = generateTransactionId();
  
  const statusChange: StatusChange = {
    timestamp: new Date().toISOString(),
    status: newStatus,
    transactionId: newTransactionId,
    reason
  };
  
  return {
    ...fine,
    status: newStatus,
    statusHistory: [...fine.statusHistory, statusChange]
  };
};

export const getFineStatusLabel = (status: FineStateInternal): string => {
    switch (status) {
        case FineStateInternal.PENDING:
            return 'Pendiente';
        case FineStateInternal.PAID:
            return 'Pagada';
        case FineStateInternal.APPEALED:
            return 'Apelada';
        case FineStateInternal.RESOLVED_APPEAL:
            return 'Apelación Resuelta';
        case FineStateInternal.CANCELLED:
            return 'Cancelada';
        default:
            return 'Desconocido';
    }
};

export const getFineStatusColor = (status: FineStateInternal): string => {
    switch (status) {
        case FineStateInternal.PENDING:
            return 'warning';
        case FineStateInternal.PAID:
            return 'success';
        case FineStateInternal.APPEALED:
            return 'info';
        case FineStateInternal.RESOLVED_APPEAL:
            return 'success';
        case FineStateInternal.CANCELLED:
            return 'error';
        default:
            return 'default';
    }
};