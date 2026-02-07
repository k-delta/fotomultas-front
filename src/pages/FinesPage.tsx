import React, { useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import { useFineStore } from '../store/fineStore';
import FineList from '../components/fines/FineList';
import Button from '../components/ui/Button';

const FinesPage: React.FC = () => {
  const { getFines, fines, isLoading, pagination } = useFineStore();

  useEffect(() => {
    getFines(1, 10);
  }, [getFines]);

  const handlePageChange = useCallback((page: number) => {
    getFines(page, pagination.pageSize);
  }, [getFines, pagination.pageSize]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de multas</h1>
          <p className="text-gray-600">
            Administra todas las infracciones registradas en el sistema
          </p>
        </div>
        <Link
          to={`/fines/new`}
        >
          <Button
            variant="primary"
            icon={<PlusCircle size={16} />}
          >
            Registrar nueva multa
          </Button>
        </Link>
      </div>

      <FineList
        fines={fines}
        isLoading={isLoading}
        pagination={pagination}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default FinesPage;
