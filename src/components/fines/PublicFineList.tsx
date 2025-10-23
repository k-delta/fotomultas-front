import React from 'react';
import { FineWithHistory } from '../../types';
import { formatCurrency, formatDate, getFineTypeLabel, getFineStatusLabel, getFineStatusColor } from '../../utils/fineUtils';
import StatusBadge from '../ui/StatusBadge';

interface PublicFineListProps {
  fines: FineWithHistory[];
  isLoading?: boolean;
}

const PublicFineList: React.FC<PublicFineListProps> = ({ 
  fines,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      {fines.length === 0 ? (
        <div className="text-center py-12">
          <div className="rounded-full bg-gray-100 p-3 mx-auto w-12 h-12 flex items-center justify-center">
            <svg
              className="h-6 w-6 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron multas</h3>
          <p className="mt-1 text-sm text-gray-500">
            No hay multas registradas que coincidan con tu búsqueda.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Número de Multa
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Placa
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Monto
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {fines.map((fine: FineWithHistory) => (
                <tr key={fine.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {fine.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {fine.plateNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(fine.timestamp)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getFineTypeLabel(fine.infractionType)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(fine.cost)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge 
                      status={getFineStatusLabel(fine.currentState)} 
                      color={getFineStatusColor(fine.currentState) as 'success' | 'warning' | 'error' | 'info' | 'default'} 
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PublicFineList;