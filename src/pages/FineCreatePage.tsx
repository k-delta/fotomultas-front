import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useFineStore } from '../store/fineStore';
import Card from '../components/ui/Card';
import FineForm from '../components/fines/FineForm';

const FineCreatePage: React.FC = () => {
  const { createFine, isLoading } = useFineStore();
  const navigate = useNavigate();
  
  const handleSubmit = async (formData: any) => {
    try {
      const newFine = await createFine({
        ...formData,
        timestamp: new Date(formData.timestamp).toISOString(),
      });
      
      // Redirect to the new fine details page
      navigate(`/fines/${newFine.id}`);
    } catch (error) {
      console.error('Error creating fine:', error);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Link to="/fines" className="text-gray-600 hover:text-gray-900">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">
          Registrar nueva multa
        </h1>
      </div>
      
      <Card>
        <p className="text-gray-600 mb-6">
          Complete el formulario a continuación para registrar una nueva multa en el sistema.
          La información será registrada en la blockchain y la evidencia en IPFS para garantizar su integridad.
        </p>
        
        <FineForm onSubmit={handleSubmit} isLoading={isLoading} />
      </Card>
    </div>
  );
};

export default FineCreatePage;