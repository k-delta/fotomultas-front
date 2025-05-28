import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, FileText, RefreshCw } from 'lucide-react';
import { useFineStore } from '../store/fineStore';
import { Metric } from '../types';
import MetricsGrid from '../components/dashboard/MetricsGrid';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import StatusChart from '../components/dashboard/StatusChart';
import TypeChart from '../components/dashboard/TypeChart';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { getFineStatusLabel, getStatusColorClasses } from '../utils/fineUtils';

const calculateMonthlyChange = (fines: any[], filterFn = (f: any) => true) => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const currentYear = now.getFullYear();
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  const thisMonthFines = fines.filter(fine => {
    const fineDate = new Date(fine.timestamp);
    return fineDate.getMonth() === currentMonth && 
           fineDate.getFullYear() === currentYear && 
           filterFn(fine);
  });

  const lastMonthFines = fines.filter(fine => {
    const fineDate = new Date(fine.timestamp);
    return fineDate.getMonth() === lastMonth && 
           fineDate.getFullYear() === lastMonthYear && 
           filterFn(fine);
  });

  const currentValue = thisMonthFines.length;
  const previousValue = lastMonthFines.length;

  if (previousValue === 0) return 0;
  return ((currentValue - previousValue) / previousValue) * 100;
};

const calculateMonthlyAmountChange = (fines: any[]) => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const currentYear = now.getFullYear();
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  const thisMonthAmount = fines
    .filter(fine => {
      const fineDate = new Date(fine.timestamp);
      return fineDate.getMonth() === currentMonth && 
             fineDate.getFullYear() === currentYear && 
             getFineStatusLabel(fine.currentState) === 'Pagada';
    })
    .reduce((sum, fine) => sum + fine.cost, 0);

  const lastMonthAmount = fines
    .filter(fine => {
      const fineDate = new Date(fine.timestamp);
      return fineDate.getMonth() === lastMonth && 
             fineDate.getFullYear() === lastMonthYear && 
             getFineStatusLabel(fine.currentState) === 'Pagada';
    })
    .reduce((sum, fine) => sum + fine.cost, 0);

  if (lastMonthAmount === 0) return 0;
  return ((thisMonthAmount - lastMonthAmount) / lastMonthAmount) * 100;
};

const DashboardPage: React.FC = () => {
  const { getFines, getActivities, fines, activities, isLoading } = useFineStore();
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([getFines(), getActivities()]);
    };

    loadData();
  }, [getFines, getActivities]);

  useEffect(() => {
    if (fines.length > 0) {
      const totalFines = fines.length;
      const pendingFines = fines.filter(f => getFineStatusLabel(f.currentState) === 'Pendiente').length;
      const paidFines = fines.filter(f => getFineStatusLabel(f.currentState) === 'Pagada').length;
      // const appealedFines = fines.filter(f => f.currentState === 'appealed').length;
      // const totalAmount = fines.reduce((sum, fine) => sum + fine.cost, 0);
      const collectedAmount = fines
        .filter(f => getFineStatusLabel(f.currentState) === 'Pagada')
        .reduce((sum, fine) => sum + fine.cost, 0);

      setMetrics([
        {
          label: 'Total multas',
          value: totalFines,
          change: calculateMonthlyChange(fines),
        },
        {
          label: 'Multas pendientes',
          value: pendingFines,
          change: calculateMonthlyChange(fines, f => getFineStatusLabel(f.currentState) === 'Pendiente'),
        },
        {
          label: 'Multas pagadas',
          value: paidFines,
          change: calculateMonthlyChange(fines, f => getFineStatusLabel(f.currentState) === 'Pagada'),
        },
        {
          label: 'Monto recaudado',
          value: Math.round(collectedAmount / 1000), // In thousands
          change: calculateMonthlyAmountChange(fines),
        },
      ]);
    }
  }, [fines]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([getFines(), getActivities()]);
    setIsRefreshing(false);
  };

  if (isLoading && metrics.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Gestión de fotocomparendos con blockchain</p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            isLoading={isRefreshing}
            icon={<RefreshCw size={16} />}
          >
            Actualizar
          </Button>
          <Link
            to={`/fines/new`}
          >
            <Button
              variant="primary"
              size="sm"
              icon={<PlusCircle size={16} />}
            >
              Nueva multa
            </Button>
          </Link>
        </div>
      </div>

      <MetricsGrid metrics={metrics} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Distribución por estado">
          <StatusChart fines={fines} />
        </Card>

        <Card title="Distribución por tipo">
          <TypeChart fines={fines} />
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card
            title="Multas recientes"
            footer={
              <Link to="/fines" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                Ver todas las multas
              </Link>
            }
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-medium text-gray-900">Últimas multas</h3>
            </div>

            <div className="overflow-hidden">
              {fines.slice(0, 5).map((fine) => (
                <Link
                  key={fine.id}
                  to={`/fines/${fine.id}`}
                  className="block hover:bg-gray-50 -mx-5 px-5 py-3 border-b border-gray-100 last:border-0"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <FileText className="h-5 w-5 text-gray-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          Multa {fine.id} - Placa {fine.plateNumber}
                        </p>
                        {/* <p className="text-xs text-gray-500">
                          {fine.city} • {new Date(fine.timestamp).toLocaleDateString()}
                        </p> */}
                      </div>
                    </div>
                    <div className="ml-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColorClasses(fine.currentState)}`}
                      >
                        {getFineStatusLabel(fine.currentState)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </Card>
        </div>

        <div>
          <Card title="Actividad reciente">
            <ActivityFeed activities={activities} />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;