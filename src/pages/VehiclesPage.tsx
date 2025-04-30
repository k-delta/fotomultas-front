import React, { useEffect, useState } from 'react';
import { Car, Search } from 'lucide-react';
import { useVehicleStore } from '../store/vehicleStore';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import SearchInput from '../components/ui/SearchInput';
import { useNavigate } from 'react-router-dom';

const VehiclesPage: React.FC = () => {
  const { getVehicles, searchVehicles, vehicles, isLoading } = useVehicleStore();
  const [filteredVehicles, setFilteredVehicles] = useState(vehicles);
  const navigate = useNavigate()
  
  useEffect(() => {
    getVehicles();
  }, [getVehicles]);

  useEffect(() => {
    setFilteredVehicles(vehicles);
  }, [vehicles]);

  const handleSearch = async (query: string) => {
    if (query.trim() === '') {
      setFilteredVehicles(vehicles);
    } else {
      const results = await searchVehicles(query);
      setFilteredVehicles(results);
    }
  };

  const getStatusBadge = (status: 'valid' | 'expired' | 'pending') => {
    if (status === 'valid') {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Válido</span>;
    } else if (status === 'expired') {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Expirado</span>;
    } else {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pendiente</span>;
    }
  };

  if (isLoading && vehicles.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Vehículos registrados</h1>
        <p className="text-gray-600">
          Administra y consulta información de vehículos en el sistema
        </p>
      </div>

      <Card>
        <div className="mb-6">
          <SearchInput
            placeholder="Buscar por placa o propietario..."
            onSearch={handleSearch}
            className="w-full sm:w-96"
          />
        </div>

        {filteredVehicles.length === 0 ? (
          <div className="text-center py-8">
            <Car className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay vehículos</h3>
            <p className="mt-1 text-sm text-gray-500">
              No se encontraron vehículos que coincidan con los criterios de búsqueda.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Placa
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo / Año
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Propietario
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SOAT
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Inspección
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredVehicles.map((vehicle) => (
                  <tr key={vehicle.plate} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{vehicle.plate}</div>
                      <div className="text-sm text-gray-500">{vehicle.city}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{vehicle.type}</div>
                      <div className="text-sm text-gray-500">{vehicle.year}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{vehicle.ownerName}</div>
                      <div className="text-sm text-gray-500">ID: {vehicle.ownerId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(vehicle.soatStatus)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(vehicle.inspectionStatus)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        onClick={() => navigate(`/vehicles/${vehicle.plate}`)}
                        variant="outline"
                        size="xs"
                        icon={<Search size={14} />}
                      >
                        Ver detalles
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default VehiclesPage;