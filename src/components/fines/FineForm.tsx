import React, { useState } from 'react';
import { Camera, Upload } from 'lucide-react';
import { FineType } from '../../types';
import { getFineTypeLabel } from '../../utils/fineUtils';
import Button from '../ui/Button';

interface FineFormData {
  plate: string;
  timestamp: string;
  location: string;
  city: string;
  fineType: FineType;
  cost: number;
  ownerId: string;
  ownerName: string;
  evidence: File | null;
}

interface FineFormProps {
  onSubmit: (data: Omit<FineFormData, 'evidence'>) => Promise<void>;
  isLoading: boolean;
}

const initialFormData: FineFormData = {
  plate: '',
  timestamp: new Date().toISOString().split('.')[0],
  location: '',
  city: '',
  fineType: 'speeding',
  cost: 0,
  ownerId: '',
  ownerName: '',
  evidence: null
};

const FineForm: React.FC<FineFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<FineFormData>(initialFormData);
  const [evidencePreview, setEvidencePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'cost' ? parseInt(value) || 0 : value
    }));
  };
  
  const handleEvidenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({ ...prev, evidence: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setEvidencePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate uploading evidence to IPFS
    setUploading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setUploading(false);
    
    // Submit the form data without the evidence file
    const { evidence, ...submissionData } = formData;
    await onSubmit(submissionData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="plate" className="block text-sm font-medium text-gray-700">
            Placa *
          </label>
          <input
            type="text"
            name="plate"
            id="plate"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
            value={formData.plate}
            onChange={handleChange}
          />
        </div>
        
        <div>
          <label htmlFor="timestamp" className="block text-sm font-medium text-gray-700">
            Fecha y hora *
          </label>
          <input
            type="datetime-local"
            name="timestamp"
            id="timestamp"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
            value={formData.timestamp}
            onChange={handleChange}
          />
        </div>
        
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Ubicación *
          </label>
          <input
            type="text"
            name="location"
            id="location"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
            value={formData.location}
            onChange={handleChange}
            placeholder="Calle 123 #45-67"
          />
        </div>
        
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700">
            Ciudad *
          </label>
          <input
            type="text"
            name="city"
            id="city"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
            value={formData.city}
            onChange={handleChange}
          />
        </div>
        
        <div>
          <label htmlFor="fineType" className="block text-sm font-medium text-gray-700">
            Tipo de infracción *
          </label>
          <select
            name="fineType"
            id="fineType"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
            value={formData.fineType}
            onChange={handleChange}
          >
            {['speeding', 'red_light', 'illegal_parking', 'no_documents', 'driving_under_influence', 'other'].map(type => (
              <option key={type} value={type}>
                {getFineTypeLabel(type as FineType)}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="cost" className="block text-sm font-medium text-gray-700">
            Monto (COP) *
          </label>
          <input
            type="number"
            name="cost"
            id="cost"
            min="0"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
            value={formData.cost}
            onChange={handleChange}
          />
        </div>
        
        <div>
          <label htmlFor="ownerId" className="block text-sm font-medium text-gray-700">
            ID del propietario *
          </label>
          <input
            type="text"
            name="ownerId"
            id="ownerId"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
            value={formData.ownerId}
            onChange={handleChange}
          />
        </div>
        
        <div>
          <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700">
            Nombre del propietario *
          </label>
          <input
            type="text"
            name="ownerName"
            id="ownerName"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
            value={formData.ownerName}
            onChange={handleChange}
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Evidencia *
        </label>
        
        <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            {evidencePreview ? (
              <div>
                <img 
                  src={evidencePreview} 
                  alt="Evidencia" 
                  className="mx-auto h-32 w-auto object-cover" 
                />
                <p className="text-xs text-gray-500 mt-2">
                  Haga clic en "Cambiar" para seleccionar otra imagen
                </p>
              </div>
            ) : (
              <div>
                <Camera className="mx-auto h-12 w-12 text-gray-400" />
                <p className="text-xs text-gray-500 mt-2">
                  PNG, JPG hasta 10MB
                </p>
              </div>
            )}
            
            <div className="flex justify-center mt-2">
              <label
                htmlFor="evidence"
                className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
              >
                <span>
                  {evidencePreview ? 'Cambiar' : 'Cargar imagen'}
                </span>
                <input
                  id="evidence"
                  name="evidence"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleEvidenceChange}
                  required
                />
              </label>
            </div>
          </div>
        </div>
      </div>
      
      {uploading && (
        <div className="bg-blue-50 p-4 rounded-md">
          <div className="flex">
            <div className="animate-spin mr-3 h-5 w-5 text-blue-500">
              <Upload size={20} />
            </div>
            <div>
              <p className="text-sm text-blue-700">
                Subiendo evidencia a IPFS...
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex justify-end">
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          disabled={isLoading || uploading}
        >
          Registrar multa
        </Button>
      </div>
    </form>
  );
};

export default FineForm;