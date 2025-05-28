import React from 'react';
import { Check, X, Shield } from 'lucide-react';

interface VerificationResultsProps {
  blockchain: boolean;
}

const VerificationResults: React.FC<VerificationResultsProps> = ({ blockchain }) => {
  return (
    <div className={`rounded-lg p-5 ${blockchain ? 'bg-green-50' : 'bg-red-50'}`}>
      <div className="flex items-center justify-center mb-4">
        <div className={`rounded-full p-2 ${blockchain ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          <Shield size={24} />
        </div>
      </div>
      
      <h3 className={`text-lg font-medium text-center mb-4 ${blockchain ? 'text-green-800' : 'text-red-800'}`}>
        {blockchain ? 'Verificación exitosa' : 'Verificación fallida'}
      </h3>
      
      <div className="space-y-3">
        <div className="flex items-center p-3 rounded-md bg-white">
          <div className={`rounded-full p-1 mr-3 ${blockchain ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {blockchain ? <Check size={18} /> : <X size={18} />}
          </div>
          <div>
            <p className="text-sm font-medium">Registro en Blockchain</p>
            <p className="text-xs text-gray-500">
              {blockchain 
                ? 'El registro en blockchain es válido y no ha sido alterado.' 
                : 'No se pudo verificar la integridad del registro en blockchain.'}
            </p>
          </div>
        </div>
      </div>
      
      <p className="text-xs text-gray-500 mt-4 text-center">
        {blockchain 
          ? 'La multa ha pasado la verificación de integridad.' 
          : 'Se recomienda revisar manualmente la multa debido a fallos en la verificación de integridad.'}
      </p>
    </div>
  );
};

export default VerificationResults;