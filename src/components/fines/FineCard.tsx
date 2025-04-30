import React from 'react';
import { Link } from 'react-router-dom';
import { Info, CreditCard, FileCheck } from 'lucide-react';
import { Fine } from '../../types';
import { formatCurrency, formatDate } from '../../utils/fineUtils';
import StatusBadge from '../ui/StatusBadge';
import Button from '../ui/Button';

interface FineCardProps {
  fine: Fine;
}

const FineCard: React.FC<FineCardProps> = ({ fine }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className="rounded-full bg-blue-100 p-2 mr-3">
            <FileCheck className="h-6 w-6 text-blue-700" />
          </div>
          <div>
            <Link to={`/fines/${fine.id}`} className="text-lg font-semibold text-blue-700 hover:underline">
              Multa {fine.id}
            </Link>
            <p className="text-sm text-gray-500">Placa: {fine.plate}</p>
          </div>
        </div>
        <StatusBadge status={fine.status} />
      </div>

      <div className="p-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-500">Fecha</p>
            <p className="text-sm font-medium">{formatDate(fine.timestamp)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Monto</p>
            <p className="text-sm font-medium">{formatCurrency(fine.cost)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Ubicación</p>
            <p className="text-sm font-medium">{fine.city}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Propietario</p>
            <p className="text-sm font-medium">{fine.ownerName}</p>
          </div>
        </div>

        <div className="flex space-x-2 pt-2 border-t border-gray-200">
          <Link
            to={`/fines/${fine.id}`}
          >
            <Button
              variant="outline"
              size="sm"
              icon={<Info size={16} />}
              className="flex-1"
            >
              Detalles
            </Button>
          </Link>
          {fine.status === 'pending' && (
            <Link
              to={`/fines/${fine.id}/pay`}
            >
              <Button
                variant="primary"
                size="sm"
                icon={<CreditCard size={16} />}
                className="flex-1"
              >
                Marcar pagada
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default FineCard;