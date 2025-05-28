import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Shield, 
  ExternalLink, 
  CreditCard, 
  FolderX,
  FileCheck,
  Image 
} from 'lucide-react';
import { useFineStore } from '../store/fineStore';
import { formatCurrency, formatDate, getFineTypeLabel, getFineStatusLabel, getFineStatusColor, FineStateInternal } from '../utils/fineUtils';
import Button from '../components/ui/Button';
import StatusBadge from '../components/ui/StatusBadge';
import Card from '../components/ui/Card';
import StatusHistoryList from '../components/fines/StatusHistoryList';
import VerificationResults from '../components/fines/VerificationResults';

const FineDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { 
    getFineById, 
    updateFineStatus, 
    verifyFineIntegrity, 
    selectedFine, 
    isLoading 
  } = useFineStore();
  
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResults, setVerificationResults] = useState<{ blockchain: boolean } | null>(null);
  
  useEffect(() => {
    if (id) {
      getFineById(id);
    }
  }, [id, getFineById]);
  
  const handleVerify = async () => {
    if (!id) return;
    
    setIsVerifying(true);
    setVerificationResults(null);
    
    try {
      const results = await verifyFineIntegrity(id);
      setVerificationResults(results);
    } finally {
      setIsVerifying(false);
    }
  };
  
  const handleUpdateStatus = async (newStatus: FineStateInternal) => {
    if (!id) return;
    
    let reason: string | undefined;

    if (newStatus === FineStateInternal.APPEALED) {
      const promptReason = prompt('Por favor, ingrese el motivo de la apelación:');
      if (promptReason === null || promptReason.trim() === '') {
        return; // User cancelled or entered empty reason
      }
      reason = promptReason.trim();
    } else if (newStatus === FineStateInternal.CANCELLED) {
       const promptReason = prompt('Por favor, ingrese el motivo de la cancelación:');
      if (promptReason === null || promptReason.trim() === '') {
        return; // User cancelled or entered empty reason
    }
      reason = promptReason.trim();
    } else if (newStatus === FineStateInternal.RESOLVED_APPEAL) {
      reason = 'Apelacion valida';
    } else if (newStatus === FineStateInternal.PAID) {
       reason = 'Usuario pago';
    }
    // For other statuses, reason remains undefined
    
    await updateFineStatus(id, newStatus, reason);
  };
  
  if (isLoading || !selectedFine) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-700"></div>
      </div>
    );
  }
  
  const showActionButtons = selectedFine.currentState === FineStateInternal.PENDING ||
    selectedFine.currentState === FineStateInternal.APPEALED;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link to="/fines" className="text-gray-600 hover:text-gray-900">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            Detalles de multa {selectedFine.id}
          </h1>

          <StatusBadge 
            status={getFineStatusLabel(selectedFine.currentState as FineStateInternal)} 
            color={getFineStatusColor(selectedFine.currentState as FineStateInternal) as 'success' | 'warning' | 'error' | 'info' | 'default'} 
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Información básica</h3>
                <dl className="grid grid-cols-1 gap-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">ID de multa</dt>
                    <dd className="mt-1 text-sm text-gray-900">{selectedFine?.id || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Placa</dt>
                    <dd className="mt-1 text-sm text-gray-900">{selectedFine?.plateNumber || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Fecha y hora</dt>
                    <dd className="mt-1 text-sm text-gray-900">{selectedFine?.timestamp ? formatDate(selectedFine.timestamp) : 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Tipo de infracción</dt>
                    <dd className="mt-1 text-sm text-gray-900">{selectedFine?.infractionType ? getFineTypeLabel(selectedFine.infractionType) : 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Monto</dt>
                    <dd className="mt-1 text-sm text-gray-900 font-semibold">{selectedFine?.cost ? formatCurrency(selectedFine.cost) : 'N/A'}</dd>
                  </div>
                </dl>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Ubicación y propietario</h3>
                <dl className="grid grid-cols-1 gap-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Ubicación</dt>
                    <dd className="mt-1 text-sm text-gray-900">{selectedFine?.location || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">ID del propietario</dt>
                    <dd className="mt-1 text-sm text-gray-900">{selectedFine?.ownerIdentifier || 'N/A'}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </Card>
          
          <Card title="Evidencia" className="overflow-hidden">
            <div className="flex items-center justify-center border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50">
              <div className="text-center">
                <div className="mx-auto h-12 w-12 text-gray-400">
                  <Image size={48} />
                </div>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Evidencia en IPFS</h3>
                <p className="mt-1 text-sm text-gray-500">
                  CID: {selectedFine.evidenceCID.substring(0, 20)}...
                </p>
                <div className="mt-4">
                  <a 
                    href={`https://ipfs.io/ipfs/${selectedFine.evidenceCID}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <ExternalLink size={16} className="mr-2" />
                    Ver en IPFS
                  </a>
                </div>
              </div>
            </div>
          </Card>
          
          <Card title="Información blockchain" className="overflow-hidden">
            <div className="mb-4">
              <div className="flex flex-col space-y-3">
                <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                  <span className="text-sm font-medium text-gray-500">ID de transacción</span>
                  <span className="text-sm font-mono text-gray-900">{selectedFine.transactionId?.substring(0, 20) || 'N/A'}...</span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                  <span className="text-sm font-medium text-gray-500">Hash IPFS</span>
                  <span className="text-sm font-mono text-gray-900">{selectedFine.evidenceCID.substring(0, 20)}...</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Estado actual</span>
                  <StatusBadge 
                    status={getFineStatusLabel(selectedFine.currentState as FineStateInternal)} 
                    color={getFineStatusColor(selectedFine.currentState as FineStateInternal) as 'success' | 'warning' | 'error' | 'info' | 'default'} 
                  />
                </div>
              </div>
            </div>
            
            <Button
              onClick={handleVerify}
              variant="outline"
              isLoading={isVerifying}
              icon={<Shield size={16} />}
              className="w-full"
            >
              Verificar integridad
            </Button>
            
            {verificationResults && (
              <div className="mt-4">
                <VerificationResults 
                  blockchain={verificationResults.blockchain}
                />
              </div>
            )}
          </Card>
        </div>
        
        <div className="space-y-6">
          {showActionButtons && (
            <Card title="Acciones">
              <div className="space-y-3">
                {selectedFine.currentState === FineStateInternal.PENDING && (
                  <>
                    <Button
                      onClick={() => handleUpdateStatus(FineStateInternal.PAID)}
                      variant="success"
                      className="w-full"
                      icon={<CreditCard size={16} />}
                    >
                      Marcar como pagada
                    </Button>
                    <Button
                      onClick={() => handleUpdateStatus(FineStateInternal.APPEALED)}
                      variant="outline"
                      className="w-full"
                      icon={<FolderX size={16} />}
                    >
                      Registrar apelación
                    </Button>
                  </>
                )}
                
                {selectedFine.currentState === FineStateInternal.APPEALED && (
                  <>
                    <Button
                      onClick={() => handleUpdateStatus(FineStateInternal.CANCELLED)}
                      variant="danger"
                      className="w-full"
                      icon={<FolderX size={16} />}
                    >
                      Rechazar apelación
                    </Button>
                    <Button
                      onClick={() => handleUpdateStatus(FineStateInternal.RESOLVED_APPEAL)}
                      variant="success"
                      className="w-full"
                      icon={<FileCheck size={16} />}
                    >
                      Aprobar apelación
                    </Button>
                  </>
                )}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  Todas las acciones generarán una nueva transacción en la blockchain para mantener una auditoría inmutable de los cambios.
                </p>
              </div>
            </Card>
          )}
          
          <Card title="Historial de cambios">
            <StatusHistoryList history={selectedFine.statusHistory} />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FineDetailPage;