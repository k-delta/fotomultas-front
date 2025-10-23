import React, { useEffect } from 'react';
import { useFineStore } from '../store/fineStore';
import PublicFineList from '../components/fines/PublicFineList';

const PublicConsultPage: React.FC = () => {
  const { getFines, fines, isLoading } = useFineStore();

  useEffect(() => {
    getFines();
  }, [getFines]);

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Consulta de Multas</h1>
            <p className="mt-1 text-sm text-gray-600">
              Consulta las infracciones de tránsito registradas en el sistema. Ingresa la placa del vehículo o el número de multa para buscar.
            </p>
          </div>

          <PublicFineList fines={fines} isLoading={isLoading} />

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h2 className="text-sm font-medium text-gray-900">Información importante</h2>
            <ul className="mt-2 text-sm text-gray-600 space-y-1">
              <li>• Los montos mostrados son en pesos colombianos (COP)</li>
              <li>• Las multas en estado "Pendiente" deben ser pagadas antes de su fecha límite</li>
              <li>• Para mayor información sobre el proceso de pago, comuníquese con la autoridad de tránsito</li>
              <li>• La información se actualiza en tiempo real</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicConsultPage;