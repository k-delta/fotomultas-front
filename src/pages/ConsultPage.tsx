import React, { useState, useRef } from 'react';
import { Search, ArrowLeft, Shield, Link as LinkIcon } from 'lucide-react';
import ReCAPTCHA from 'react-google-recaptcha';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { IFineDetails, FineType } from '../types';
import PublicFineList from '../components/fines/PublicFineList';
import { FineStateInternal, getFineStatusLabel, getFineStatusColor, formatCurrency, getFineTypeLabel } from '../utils/fineUtils';

const ConsultPage: React.FC = () => {
  const [plateNumber, setPlateNumber] = useState('');
  const [searchedPlate, setSearchedPlate] = useState('');
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fines, setFines] = useState<IFineDetails[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const RECAPTCHA_SITE_KEY = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

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
      const response = await fetch(`/api/fines/plate/${encodeURIComponent(plateNumber.trim())}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        if (response.status === 400) {
          throw new Error('Datos inválidos. Verifica el número de placa.');
        } else if (response.status === 404) {
          setFines([]);
          setSearchedPlate(plateNumber.trim());
          setHasSearched(true);
          setIsLoading(false);
          return;
        } else if (response.status === 500) {
          throw new Error('Error del servidor. Inténtalo más tarde.');
        } else {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
      }

      const result = await response.json();
      const finesData = Array.isArray(result) ? result : Array.isArray(result.data) ? result.data : [];
      setFines(finesData);
      setSearchedPlate(plateNumber.trim());
      setHasSearched(true);

    } catch (error) {
      console.error('Error al consultar multas:', error);
      setError(error instanceof Error ? error.message : 'Error al procesar la consulta. Inténtalo de nuevo.');
      setFines([]);
      setHasSearched(false);
    } finally {
      setIsLoading(false);
      recaptchaRef.current?.reset();
      setCaptchaValue(null);
    }
  };

  const handleNewSearch = () => {
    setHasSearched(false);
    setFines([]);
    setPlateNumber('');
    setSearchedPlate('');
    setError('');
  };

  const handleCaptchaChange = (value: string | null) => {
    setCaptchaValue(value);
    setError('');
  };

  const totalAmount = fines.reduce((sum, f) => sum + (f.cost || 0), 0);

  // Vista de resultados
  if (hasSearched) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <button
              onClick={handleNewSearch}
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              <ArrowLeft size={16} className="mr-1" />
              Nueva consulta
            </button>
          </div>

          <Card>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Resultados para placa {searchedPlate}
              </h2>
            </div>

            {fines.length === 0 ? (
              <div className="text-center py-8">
                <div className="mx-auto h-14 w-14 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <svg className="h-7 w-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Sin multas registradas
                </h3>
                <p className="text-gray-500">
                  No se encontraron multas asociadas a esta placa.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Resumen */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-red-700">{fines.length}</p>
                    <p className="text-sm text-red-600">Multa{fines.length !== 1 ? 's' : ''} encontrada{fines.length !== 1 ? 's' : ''}</p>
                  </div>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-orange-700">{formatCurrency(totalAmount)}</p>
                    <p className="text-sm text-orange-600">Total acumulado</p>
                  </div>
                </div>

                {/* Lista de multas */}
                <div className="divide-y divide-gray-200">
                  {fines.map((fine, index) => {
                    const state = Number(fine.currentState) as FineStateInternal;
                    const statusLabel = getFineStatusLabel(state);
                    const statusColor = getFineStatusColor(state);
                    const colorClasses: Record<string, string> = {
                      warning: 'bg-yellow-100 text-yellow-800',
                      success: 'bg-green-100 text-green-800',
                      info: 'bg-blue-100 text-blue-800',
                      error: 'bg-red-100 text-red-800',
                      default: 'bg-gray-100 text-gray-800',
                    };

                    return (
                      <div key={fine.id || index} className="py-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-semibold text-gray-900">
                            Multa #{fine.id}
                          </h4>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses[statusColor] || colorClasses.default}`}>
                            {statusLabel}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                          <div>
                            <span className="text-gray-500">Tipo: </span>
                            <span className="text-gray-900">{getFineTypeLabel(fine.infractionType as FineType)}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Monto: </span>
                            <span className="text-gray-900 font-medium">{formatCurrency(fine.cost)}</span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-gray-500">Ubicación: </span>
                            <span className="text-gray-900">{fine.location}</span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-gray-500">Fecha: </span>
                            <span className="text-gray-900">
                              {fine.timestamp ? new Date(fine.timestamp).toLocaleDateString('es-CO', {
                                year: 'numeric', month: 'long', day: 'numeric',
                                hour: '2-digit', minute: '2-digit'
                              }) : 'N/A'}
                            </span>
                          </div>
                        </div>

                        {/* Información blockchain */}
                        <div className="mt-3 bg-gray-50 border border-gray-200 rounded-lg p-3">
                          <div className="flex items-center gap-1.5 mb-2">
                            <Shield size={14} className="text-blue-600" />
                            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Registro en Blockchain</span>
                          </div>
                          <div className="space-y-1.5 text-xs">
                            <div className="flex items-start justify-between gap-2">
                              <span className="text-gray-500 flex-shrink-0">Evidencia IPFS:</span>
                              <span className="text-gray-700 font-mono truncate">{fine.evidenceCID}</span>
                            </div>
                            <div className="flex items-start justify-between gap-2">
                              <span className="text-gray-500 flex-shrink-0">Registrado por:</span>
                              <span className="text-gray-700 font-mono truncate">{fine.registeredBy}</span>
                            </div>
                            <div className="flex items-start justify-between gap-2">
                              <span className="text-gray-500 flex-shrink-0">Propietario:</span>
                              <span className="text-gray-700">{fine.ownerIdentifier}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </Card>

          <div className="mt-4 text-center">
            <Button onClick={handleNewSearch} variant="primary" icon={<Search size={16} />}>
              Realizar otra consulta
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Vista de búsqueda
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <Card>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Consulta de Multas
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Ingrese la placa del vehículo para consultar multas
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
                onChange={(e) => setPlateNumber(e.target.value.toUpperCase())}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg tracking-wider font-medium"
                placeholder="ABC123"
                maxLength={6}
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
      </div>
    </div>
  );
};

export default ConsultPage;
