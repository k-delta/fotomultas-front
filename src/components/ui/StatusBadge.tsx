import React from 'react';
import { FineStatus } from '../../types';
import { getStatusColor } from '../../utils/fineUtils';

interface StatusBadgeProps {
  status: FineStatus;
}

const statusLabels: Record<FineStatus, string> = {
  pending: 'Pendiente',
  paid: 'Pagado',
  appealed: 'Apelado',
  rejected: 'Rechazado',
  verified: 'Verificado'
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const colorClass = getStatusColor(status);
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
      {statusLabels[status]}
    </span>
  );
};

export default StatusBadge;