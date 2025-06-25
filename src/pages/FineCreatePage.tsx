import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Card from '../components/ui/Card';
import FineForm from '../components/fines/FineForm';
import { API_URL } from '../utils/env';

const FineCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (formData: any) => {
    try {
      setIsLoading(true);
      // Send Fine to Backend
      const form = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'evidence') {
          if (formData[key]) {
            form.append('evidence', formData[key]);
          }
        } else {
          form.append(key, formData[key]);
        }
      });

      const response = await fetch(`${API_URL}/api/fines`, {
        method: 'POST',
        body: form
      });

      if (!response.ok) {
        throw new Error('Error al crear la multa');
      }

      const newFine = await response.json();
      console.log(newFine)
      
      // Redirect to the new fine details page
      navigate(`/fines/${newFine.fineId}`);
    } catch (error) {
      console.error('Error creating fine:', error);
    } finally {
      setIsLoading(false);
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