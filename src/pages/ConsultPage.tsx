import React, { useState, useRef } from 'react';
import { Search } from 'lucide-react';
import ReCAPTCHA from 'react-google-recaptcha';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { IFineDetails, FineType } from '../types';
import PublicFineList from '../components/fines/PublicFineList';
import { FineStateInternal } from '../utils/fineUtils';

const ConsultPage: React.FC = () => {
  const [plateNumber, setPlateNumber] = useState('');
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fines, setFines] = useState<IFineDetails[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  // Claves de reCAPTCHA para desarrollo (puedes cambiarlas por las tuyas)
  const RECAPTCHA_SITE_KEY = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'; // Clave de prueba de Google

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    setHasSearched(false);
    
    if (!captchaValue) {
      setError('Por favor, completa el CAPTCHA');
      setIsLoading(false);
      return;
    }

    if (!plateNumber.trim()) {
      setError('Por favor, ingresa el número de placa');
      setIsLoading(false);
      return;
    }

    try {
      // URL del backend - ajusta según tu configuración
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
      const response = await fetch(`${backendUrl}/api/fines/by-plate/${encodeURIComponent(plateNumber.trim())}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Aquí podrías agregar headers de autenticación si es necesario
        },
      });

      if (!response.ok) {
        if (response.status === 400) {
          throw new Error('Datos inválidos. Verifica el número de placa.');
        } else if (response.status === 404) {
          setFines([]);
          setHasSearched(true);
          setIsLoading(false);
          return;
        } else if (response.status === 500) {
          throw new Error('Error del servidor. Inténtalo más tarde.');
        } else {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
      }

      const data = await response.json();
      setFines(data);
      setHasSearched(true);
      
      // Resetear el CAPTCHA después de una consulta exitosa
      recaptchaRef.current?.reset();
      setCaptchaValue(null);
      
    } catch (error) {
      console.error('Error al consultar multas:', error);
      setError(error instanceof Error ? error.message : 'Error al procesar la consulta. Inténtalo de nuevo.');
      setFines([]);
      setHasSearched(false);
      
      // Resetear el CAPTCHA en caso de error
      recaptchaRef.current?.reset();
      setCaptchaValue(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCaptchaChange = (value: string | null) => {
    setCaptchaValue(value);
    setError(''); // Limpiar errores cuando el usuario interactúa con el CAPTCHA
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
                Placa del vehículo
              </label>
              <input
                type="text"
                value={plateNumber}
                onChange={(e) => setPlateNumber(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="ABC123"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Verificación de seguridad
              </label>
              <div className="flex justify-center">
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={RECAPTCHA_SITE_KEY}
                  onChange={handleCaptchaChange}
                  theme="light"
                  size="normal"
                />
              </div>
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
              isLoading={isLoading}
            >
              {isLoading ? 'Consultando...' : 'Consultar'}
            </Button>
          </form>
        </Card>

        {/* Sección de resultados */}
        {hasSearched && (
          <Card className="mt-6">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Resultados de la consulta
              </h3>
              <p className="text-sm text-gray-600">
                Placa: <span className="font-medium">{plateNumber}</span>
              </p>
            </div>

            {fines.length === 0 ? (
              <div className="text-center py-8">
                <div className="mx-auto h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  ¡Excelente noticia!
                </h4>
                <p className="text-gray-600">
                  No se encontraron multas pendientes para esta placa.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">
                        Se encontraron {fines.length} multa{fines.length !== 1 ? 's' : ''} pendiente{fines.length !== 1 ? 's' : ''}
                      </h3>
                    </div>
                  </div>
                </div>

                <PublicFineList fines={fines.map(fine => ({
                  id: fine.id,
                  plateNumber: plateNumber,
                  timestamp: fine.timestamp,
                  infractionType: fine.infractionType as FineType,
                  cost: fine.cost,
                  location: fine.location,
                  ownerIdentifier: fine.ownerIdentifier,
                  evidenceCID: fine.evidenceCID,
                  currentState: Number(fine.currentState) as FineStateInternal,
                  statusHistory: [],
                  transactionId: fine.externalSystemId,
                  registeredBy: fine.registeredBy
                }))} />

                {/* Información adicional */}
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <h4 className="text-sm font-medium text-blue-800 mb-2">Información adicional:</h4>
                  <div className="text-sm text-blue-700 space-y-1">
                    <p><strong>Identificador del propietario:</strong> {fines[0]?.ownerIdentifier}</p>
                    <p><strong>Registrado por:</strong> {fines[0]?.registeredBy}</p>
                    <p><strong>ID del sistema externo:</strong> {fines[0]?.externalSystemId}</p>
                  </div>
                </div>
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
};

export default ConsultPage;