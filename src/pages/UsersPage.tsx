import React from 'react';
import { User, ShieldAlert } from 'lucide-react';
import Card from '../components/ui/Card';

const UsersPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Gestión de usuarios</h1>
        <p className="text-gray-600">
          Administra los usuarios del sistema
        </p>
      </div>
      
      <Card className="flex items-center justify-center p-12 text-center">
        <div>
          <ShieldAlert className="mx-auto h-12 w-12 text-yellow-500" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">Acceso restringido</h3>
          <p className="mt-1 text-sm text-gray-500 max-w-md mx-auto">
            La gestión de usuarios no está disponible en la versión de demostración del prototipo.
            En una implementación completa, aquí se gestionarían los usuarios administrativos y operativos del sistema.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default UsersPage;