import React, { useState } from 'react';
import { Search, RefreshCcw } from 'lucide-react';
import { loadCaptchaEnginge, LoadCanvasTemplate, validateCaptcha } from 'react-simple-captcha';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const ConsultPage: React.FC = () => {
  const [documentType, setDocumentType] = useState('cc');
  const [documentNumber, setDocumentNumber] = useState('');
  const [plate, setPlate] = useState('');
  const [captchaValue, setCaptchaValue] = useState('');
  const [error, setError] = useState('');

  React.useEffect(() => {
    loadCaptchaEnginge(6);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateCaptcha(captchaValue)) {
      setError('El código CAPTCHA no es válido');
      return;
    }

    // Handle consultation logic here
    console.log('Consulting:', { documentType, documentNumber, plate });
  };

  const refreshCaptcha = () => {
    loadCaptchaEnginge(6);
    setCaptchaValue('');
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <Card>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Consulta de Multas
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Ingrese sus datos para consultar multas pendientes
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tipo de documento
              </label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="cc">Cédula de Ciudadanía</option>
                <option value="ce">Cédula de Extranjería</option>
                <option value="pp">Pasaporte</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Número de documento
              </label>
              <input
                type="text"
                value={documentNumber}
                onChange={(e) => setDocumentNumber(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Ingrese su número de documento"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Placa del vehículo (opcional)
              </label>
              <input
                type="text"
                value={plate}
                onChange={(e) => setPlate(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="ABC123"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Verificación CAPTCHA
              </label>
              <div className="mt-1 flex items-center space-x-2">
                <div className="flex-grow">
                  <LoadCanvasTemplate />
                </div>
                <button
                  type="button"
                  onClick={refreshCaptcha}
                  className="p-2 text-gray-400 hover:text-gray-500"
                >
                  <RefreshCcw size={20} />
                </button>
              </div>
              <input
                type="text"
                value={captchaValue}
                onChange={(e) => setCaptchaValue(e.target.value)}
                className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Ingrese el código"
              />
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              icon={<Search size={16} />}
            >
              Consultar
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ConsultPage;