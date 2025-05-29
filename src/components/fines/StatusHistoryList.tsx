import React from 'react';
import { CheckCircle, Clock } from 'lucide-react';
import { StatusChange, FineStatus } from '../../types';
import { formatDate } from '../../utils/fineUtils';

interface StatusHistoryListProps {
  history: StatusChange[];
}

const statusLabels: Record<FineStatus, string> = {
  pending: 'Registrada como pendiente',
  paid: 'Marcada como pagada',
  appealed: 'Apelación registrada',
  rejected: 'Rechazada',
  verified: 'Verificada en blockchain'
};

const StatusHistoryList: React.FC<StatusHistoryListProps> = ({ history }) => {
  // Sort history by timestamp, newest first
  const sortedHistory = [...history].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  if (sortedHistory.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-sm text-gray-500">No hay historial de cambios disponible</p>
      </div>
    );
  }
  
  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {sortedHistory.map((statusChange, idx) => (
          <li key={statusChange.timestamp}>
            <div className="relative pb-8">
              {idx !== sortedHistory.length - 1 ? (
                <span
                  className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                />
              ) : null}
              <div className="relative flex space-x-3">
                <div>
                  <span className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center ring-4 ring-white">
                    {statusChange.status === 'pending' ? (
                      <Clock className="h-4 w-4 text-blue-700" />
                    ) : (
                      <CheckCircle className="h-4 w-4 text-blue-700" />
                    )}
                  </span>
                </div>
                <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                  <div>
                    <p className="text-sm text-gray-900 font-medium">
                      {statusLabels[statusChange.status]}
                    </p>
                    {statusChange.reason && (
                      <p className="text-sm text-gray-500 mt-1">
                        Razón: {statusChange.reason}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Transaction ID: <span className="font-mono">{statusChange.transactionId.substring(0, 12)}...</span>
                    </p>
                  </div>
                  <div className="text-right text-sm whitespace-nowrap text-gray-500">
                    <time dateTime={statusChange.timestamp}>{formatDate(statusChange.timestamp)}</time>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StatusHistoryList;