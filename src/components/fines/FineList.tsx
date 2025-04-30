import React, { useState } from 'react';
import { FileText, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { FineWithHistory, FineStatus } from '../../types';
import { formatCurrency, formatDate, getFineTypeLabel } from '../../utils/fineUtils';
import StatusBadge from '../ui/StatusBadge';
import SearchInput from '../ui/SearchInput';
import Button from '../ui/Button';
import { Link } from 'react-router-dom';

interface FineListProps {
  fines: FineWithHistory[];
  isLoading?: boolean;
}

type SortField = 'timestamp' | 'cost' | 'plate';
type SortDirection = 'asc' | 'desc';

const FineList: React.FC<FineListProps> = ({ 
  fines,
  isLoading = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FineStatus | 'all'>('all');
  const [sortField, setSortField] = useState<SortField>('timestamp');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [showFilters, setShowFilters] = useState(false);
  
  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  const filterFines = () => {
    return fines.filter(fine => {
      // Apply status filter
      if (statusFilter !== 'all' && fine.status !== statusFilter) {
        return false;
      }
      
      // Apply search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          fine.id.toLowerCase().includes(query) ||
          fine.plate.toLowerCase().includes(query) ||
          fine.ownerName.toLowerCase().includes(query) ||
          fine.city.toLowerCase().includes(query)
        );
      }
      
      return true;
    });
  };
  
  const sortFines = (filtered: FineWithHistory[]) => {
    return [...filtered].sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'timestamp':
          comparison = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
          break;
        case 'cost':
          comparison = a.cost - b.cost;
          break;
        case 'plate':
          comparison = a.plate.localeCompare(b.plate);
          break;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  };
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  const filteredFines = filterFines();
  const sortedFines = sortFines(filteredFines);
  
  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    
    return sortDirection === 'asc' 
      ? <ChevronUp className="h-4 w-4" /> 
      : <ChevronDown className="h-4 w-4" />;
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-700"></div>
      </div>
    );
  }
  
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200 space-y-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <SearchInput
            placeholder="Buscar por ID, placa o propietario..."
            onSearch={handleSearch}
            className="w-full sm:w-80"
          />
          <Button 
            onClick={toggleFilters}
            variant="outline"
            size="sm"
            icon={<Filter size={16} />}
          >
            Filtros {showFilters ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />}
          </Button>
        </div>
        
        {showFilters && (
          <div className="flex flex-wrap gap-2 pt-2">
            <Button 
              variant={statusFilter === 'all' ? 'primary' : 'outline'} 
              size="xs"
              onClick={() => setStatusFilter('all')}
            >
              Todos
            </Button>
            <Button 
              variant={statusFilter === 'pending' ? 'primary' : 'outline'} 
              size="xs"
              onClick={() => setStatusFilter('pending')}
            >
              Pendientes
            </Button>
            <Button 
              variant={statusFilter === 'paid' ? 'primary' : 'outline'} 
              size="xs"
              onClick={() => setStatusFilter('paid')}
            >
              Pagadas
            </Button>
            <Button 
              variant={statusFilter === 'appealed' ? 'primary' : 'outline'} 
              size="xs"
              onClick={() => setStatusFilter('appealed')}
            >
              Apeladas
            </Button>
            <Button 
              variant={statusFilter === 'verified' ? 'primary' : 'outline'} 
              size="xs"
              onClick={() => setStatusFilter('verified')}
            >
              Verificadas
            </Button>
            <Button 
              variant={statusFilter === 'rejected' ? 'primary' : 'outline'} 
              size="xs"
              onClick={() => setStatusFilter('rejected')}
            >
              Rechazadas
            </Button>
          </div>
        )}
      </div>
      
      {sortedFines.length === 0 ? (
        <div className="text-center py-8">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay multas</h3>
          <p className="mt-1 text-sm text-gray-500">
            No se encontraron multas que coincidan con los filtros aplicados.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID / Placa
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => toggleSort('timestamp')}
                >
                  <div className="flex items-center">
                    Fecha {renderSortIcon('timestamp')}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => toggleSort('plate')}
                >
                  <div className="flex items-center">
                    Propietario {renderSortIcon('plate')}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => toggleSort('cost')}
                >
                  <div className="flex items-center">
                    Monto {renderSortIcon('cost')}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedFines.map((fine) => (
                <tr key={fine.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{fine.id}</div>
                    <div className="text-sm text-gray-500">{fine.plate}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatDate(fine.timestamp)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{getFineTypeLabel(fine.fineType)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{fine.ownerName}</div>
                    <div className="text-sm text-gray-500">{fine.city}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{formatCurrency(fine.cost)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={fine.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link to={`/fines/${fine.id}`} className="text-blue-600 hover:text-blue-900 mr-3">
                      Ver
                    </Link>
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

export default FineList;