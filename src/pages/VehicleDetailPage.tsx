import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Car, FileText, Calendar, MapPin, User, Shield } from 'lucide-react';
import { useVehicleStore } from '../store/vehicleStore';
import { useFineStore } from '../store/fineStore';
import Card from '../components/ui/Card';
import FineList from '../components/fines/FineList';

const VehicleDetailPage: React.FC = () => {
  const { plate } = useParams<{ plate: string }>();
  const { getVehicleByPlate, selectedVehicle, isLoading } = useVehicleStore();
  const { getFines, fines } = useFineStore();
  
  useEffect(() => {
    if (plate) {
      getVehicleByPlate(plate);
      getFines();
    }
  }, [plate, getVehicleByPlate, getFines]);

  if (isLoading || !selectedVehicle) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  const vehicleFines = fines.filter(fine => fine.plate === plate);

  const getStatusClass = (status: 'valid' | 'expired' | 'pending') => {
    switch (status) {
      case 'valid':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Link to="/vehicles" className="text-gray-600 hover:text-gray-900">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">
          Detalles del vehículo {selectedVehicle.plate}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Información básica
                </h3>
                <dl className="grid grid-cols-1 gap-3">
                  <div className="flex items-start">
                    <Car className="mt-1 h-5 w-5 text-gray-400" />
                    <div className="ml-2">
                      <dt className="text-sm font-medium text-gray-500">Tipo</dt>
                      <dd className="mt-1 text-sm text-gray-900">{selectedVehicle.type}</dd>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Calendar className="mt-1 h-5 w-5 text-gray-400" />
                    <div className="ml-2">
                      <dt className="text-sm font-medium text-gray-500">Año</dt>
                      <dd className="mt-1 text-sm text-gray-900">{selectedVehicle.year}</dd>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="mt-1 h-5 w-5 text-gray-400" />
                    <div className="ml-2">
                      <dt className="text-sm font-medium text-gray-500">Ciudad</dt>
                      <dd className="mt-1 text-sm text-gray-900">{selectedVehicle.city}</dd>
                    </div>
                  </div>
                </dl>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Propietario
                </h3>
                <dl className="grid grid-cols-1 gap-3">
                  <div className="flex items-start">
                    <User className="mt-1 h-5 w-5 text-gray-400" />
                    <div className="ml-2">
                      <dt className="text-sm font-medium text-gray-500">Nombre</dt>
                      <dd className="mt-1 text-sm text-gray-900">{selectedVehicle.ownerName}</dd>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Shield className="mt-1 h-5 w-5 text-gray-400" />
                    <div className="ml-2">
                      <dt className="text-sm font-medium text-gray-500">ID</dt>
                      <dd className="mt-1 text-sm text-gray-900">{selectedVehicle.ownerId}</dd>
                    </div>
                  </div>
                </dl>
              </div>
            </div>
          </Card>

          <Card title="Estado documentos">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 mb-2">SOAT</h4>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(selectedVehicle.soatStatus)}`}>
                  {selectedVehicle.soatStatus === 'valid' ? 'Válido' : 
                   selectedVehicle.soatStatus === 'expired' ? 'Vencido' : 'Pendiente'}
                </span>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Revisión técnico-mecánica</h4>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(selectedVehicle.inspectionStatus)}`}>
                  {selectedVehicle.inspectionStatus === 'valid' ? 'Válida' : 
                   selectedVehicle.inspectionStatus === 'expired' ? 'Vencida' : 'Pendiente'}
                </span>
              </div>
            </div>
          </Card>

          <Card 
            title="Historial de multas" 
            description={`${vehicleFines.length} multas registradas para este vehículo`}
          >
            <FineList fines={vehicleFines} />
          </Card>
        </div>

        <div>
          <Card>
            <div className="text-center">
              <Car className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">Acciones</h3>
              <p className="mt-1 text-sm text-gray-500">
                Opciones disponibles para este vehículo
              </p>
              <div className="mt-6 space-y-3">
                <Link
                  to={`/fines/new?plate=${selectedVehicle.plate}`}
                  className="inline-flex items-center justify-center w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Registrar nueva multa
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetailPage;