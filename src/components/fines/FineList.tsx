import React, { useState } from 'react';
import { FileText, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { FineWithHistory } from '../../types';
import { formatCurrency, formatDate, getFineTypeLabel, getFineStatusLabel, getFineStatusColor, FineStateInternal } from '../../utils/fineUtils';
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
  const [statusFilter, setStatusFilter] = useState<FineStateInternal | 'all'>('all');
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
          fine.plate.toLowerCase().includes(query)
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
            placeholder="Buscar por ID o placa..."
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
              variant={statusFilter === FineStateInternal.PENDING ? 'primary' : 'outline'} 
              size="xs"
              onClick={() => setStatusFilter(FineStateInternal.PENDING)}
            >
              Pendientes
            </Button>
            <Button 
              variant={statusFilter === FineStateInternal.PAID ? 'primary' : 'outline'} 
              size="xs"
              onClick={() => setStatusFilter(FineStateInternal.PAID)}
            >
              Pagadas
            </Button>
            <Button 
              variant={statusFilter === FineStateInternal.APPEALED ? 'primary' : 'outline'} 
              size="xs"
              onClick={() => setStatusFilter(FineStateInternal.APPEALED)}
            >
              Apeladas
            </Button>
            <Button 
              variant={statusFilter === FineStateInternal.RESOLVED_APPEAL ? 'primary' : 'outline'} 
              size="xs"
              onClick={() => setStatusFilter(FineStateInternal.RESOLVED_APPEAL)}
            >
              Resueltas
            </Button>
            <Button 
              variant={statusFilter === FineStateInternal.CANCELLED ? 'primary' : 'outline'} 
              size="xs"
              onClick={() => setStatusFilter(FineStateInternal.CANCELLED)}
            >
              Canceladas
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
                  ID
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
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedFines.map((fine) => (
                <tr key={fine.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {fine.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {fine.plate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(fine.timestamp)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getFineTypeLabel(fine.fineType)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(fine.cost)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge 
                      status={getFineStatusLabel(fine.status)} 
                      color={getFineStatusColor(fine.status) as 'success' | 'warning' | 'error' | 'info' | 'default'} 
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      to={`/fines/${fine.id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Ver detalles
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