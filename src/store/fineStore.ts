import { create } from 'zustand';
import { FineWithHistory, FineType, Activity } from '../types/index';
import { generateTransactionId, generateIpfsCid, addStatusChange, FineStateInternal } from '../utils/fineUtils';

// Sample data for demonstration
const generateMockFines = (): FineWithHistory[] => {
  const fineTypes: FineType[] = ['speeding', 'red_light', 'illegal_parking', 'no_documents', 'driving_under_influence', 'other'];
  const statuses: FineStateInternal[] = [FineStateInternal.PENDING, FineStateInternal.PAID, FineStateInternal.APPEALED, FineStateInternal.RESOLVED_APPEAL, FineStateInternal.CANCELLED];
  
  return Array.from({ length: 50 }, (_, i) => {
    const createdDate = new Date();
    createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 30));
    
    const transactionId = generateTransactionId();
    const initialStatus: FineStateInternal = Math.random() > 0.5 ? FineStateInternal.PENDING : statuses[Math.floor(Math.random() * statuses.length)];
    
    //GENERATE FINE
    const fine: FineWithHistory = {
      id: `F${1000 + i}`,
      transactionId,
      evidenceCID: generateIpfsCid(),
      plateNumber: `${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(Math.random() * 1000)}`,
      timestamp: createdDate.toISOString(),
      location: `${['Calle', 'Carrera', 'Avenida'][Math.floor(Math.random() * 3)]} ${Math.floor(Math.random() * 100) + 1} #${Math.floor(Math.random() * 100) + 1}-${Math.floor(Math.random() * 100) + 1}`,
      

      infractionType: fineTypes[Math.floor(Math.random() * fineTypes.length)],
      currentState: initialStatus,
      cost: Math.floor(Math.random() * 500000) + 100000,
      ownerIdentifier: `U${Math.floor(Math.random() * 100) + 1}`,
      registeredBy: generateTransactionId(),
      statusHistory: [
        {
          timestamp: createdDate.toISOString(),
          currentState: FineStateInternal.PENDING,
          transactionId
        }
      ]
    };
    
    // Add some status history for non-pending fines
    if (initialStatus !== FineStateInternal.PENDING) {
      const secondDate = new Date(createdDate);
      secondDate.setDate(secondDate.getDate() + Math.floor(Math.random() * 10) + 1);
      
      fine.statusHistory.push({
        timestamp: secondDate.toISOString(),
        currentState: initialStatus,
        transactionId: generateTransactionId(),
        reason: initialStatus === FineStateInternal.APPEALED ? 'El ciudadano presenta pruebas de inocencia' : undefined
      });
    }
    
    return fine;
  });
};

const mockFines = generateMockFines();

interface FineStore {
  fines: FineWithHistory[];
  selectedFine: FineWithHistory | null;
  activities: Activity[];
  isLoading: boolean;
  error: string | null;
  
  getFines: () => Promise<FineWithHistory[]>;
  getFineById: (id: string) => Promise<void>;
  createFine: (formData: FormData) => Promise<FineWithHistory>;
  updateFineStatus: (id: string, status: FineStateInternal, reason?: string) => Promise<void>;
  getActivities: () => Promise<Activity[]>;
  verifyFineIntegrity: (id: string) => Promise<{ blockchain: boolean }>;
}

export const useFineStore = create<FineStore>((set, get) => ({
  fines: mockFines,
  selectedFine: null,
  activities: [],
  isLoading: false,
  error: null,
  
  getFines: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/fines', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al cargar multas');
      }

      const result = await response.json();
      const apiFines = result.data; // Extract the data array

      // Map API response to frontend FineWithHistory type
      const mappedFines: FineWithHistory[] = apiFines.map((apiFine: any) => ({
        id: apiFine.id,
        transactionId: apiFine.transactionId || generateTransactionId(),
        evidenceCID: apiFine.evidenceCID || apiFine.hashImageIPFS || generateIpfsCid(),
        plateNumber: apiFine.plateNumber,
        timestamp: apiFine.timestamp,
        location: apiFine.location,
        city: apiFine.city,
        infractionType: apiFine.infractionType,
        currentState: ((): FineStateInternal => {
          switch (apiFine.currentState) {
            case 'pending': return FineStateInternal.PENDING;
            case 'paid': return FineStateInternal.PAID;
            case 'appealed': return FineStateInternal.APPEALED;
            case 'resolved_appeal': return FineStateInternal.RESOLVED_APPEAL;
            case 'cancelled': return FineStateInternal.CANCELLED;
            default: return FineStateInternal.PENDING;
          }
        })(),
        cost: parseInt(apiFine.cost, 10),
        ownerIdentifier: apiFine.ownerIdentifier,
        ownerName: apiFine.ownerName,
        registeredBy: apiFine.registeredBy,
        statusHistory: []
      }));
      
      set({ fines: mappedFines });
      return mappedFines;
    } catch (error) {
      console.error('Error fetching fines:', error);
      set({ error: 'Error al cargar multas' });
      return [];
    } finally {
      set({ isLoading: false });
    }
  },
  
  getFineById: async (id: string) => {
    set({ isLoading: true });
    try {
      const response = await fetch(`/api/fines/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al cargar la multa');
      }

      const fine = await response.json();
      // Map API response to frontend FineWithHistory type
      const mappedFine: FineWithHistory = {
        id: fine.id,
        plateNumber: fine.plateNumber,
        evidenceCID: fine.evidenceCID || fine.hashImageIPFS || generateIpfsCid(),
        location: fine.location,
        timestamp: fine.timestamp,
        infractionType: fine.infractionType,
        cost: parseInt(fine.cost, 10),
        ownerIdentifier: fine.ownerIdentifier,
        currentState: ((): FineStateInternal => {
          switch (fine.currentState) {
            case 'pending': return FineStateInternal.PENDING;
            case 'paid': return FineStateInternal.PAID;
            case 'appealed': return FineStateInternal.APPEALED;
            case 'resolved_appeal': return FineStateInternal.RESOLVED_APPEAL;
            case 'cancelled': return FineStateInternal.CANCELLED;
            default: return FineStateInternal.PENDING;
          }
        })(),
        registeredBy: fine.registeredBy,
        transactionId: fine.transactionId || generateTransactionId(),
        statusHistory: fine.statusHistory || []
      };

      set({ selectedFine: mappedFine });
    } catch (error) {
      console.error('Error fetching fine:', error);
      set({ error: 'Error al cargar la multa' });
    } finally {
      set({ isLoading: false });
    }
  },
  
  createFine: async (formData) => {
    set({ isLoading: true, error: null });
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Convert FormData to object for mock data
      const fineData = {
        plateNumber: formData.get('plateNumber') as string,
        location: formData.get('location-address') as string,
        infractionType: formData.get('infractionType') as FineType,
        cost: parseInt(formData.get('cost') as string || '0'),
        ownerIdentifier: formData.get('ownerIdentifier') as string,
        timestamp: new Date().toISOString()
      };
      
      const transactionId = generateTransactionId();
      const evidenceCID = generateIpfsCid();
      
      const newFine: FineWithHistory = {
        id: `F${1000 + get().fines.length + 1}`,
        transactionId,
        evidenceCID,
        ...fineData,
        currentState: FineStateInternal.PENDING,
        statusHistory: [
          {
            timestamp: new Date().toISOString(),
            currentState: FineStateInternal.PENDING,
            transactionId
          }
        ]
      };
      
      const newActivity: Activity = {
        id: `A${Math.random().toString().substring(2, 10)}`,
        type: 'fine_registered',
        fineId: newFine.id,
        plateNumber: newFine.plateNumber,
        timestamp: new Date().toISOString(),
        description: `Multa ${newFine.id} registrada para placa ${newFine.plateNumber}`
      };
      
      set(state => ({
        fines: [newFine, ...state.fines],
        activities: [newActivity, ...state.activities].slice(0, 10)
      }));
      
      return newFine;
    } catch (error) {
      console.error('Error creating fine:', error);
      set({ error: 'Error al crear multa' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  
  updateFineStatus: async (id: string, status: FineStateInternal, reason?: string) => {
    set({ isLoading: true, error: null });
    try {
      let finalReason = reason;
      if (status === FineStateInternal.PAID && (reason === null || reason === undefined)) {
        finalReason = 'Usuario pago';
      }

      const response = await fetch(`/api/fines/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          newState: status, // Use the numerical enum value
          reason: finalReason
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar estado de multa');
      }

      // Update local state with the new status
      set(state => ({
        fines: state.fines.map(fine => {
          if (fine.id === id) {
            // Reuse addStatusChange to immutably update the fine object
            return addStatusChange(fine, status, reason);
          }
          return fine;
        }),
        selectedFine: state.selectedFine && state.selectedFine.id === id 
          ? addStatusChange(state.selectedFine, status, reason) 
          : state.selectedFine,
      }));
      
    } catch (error) {
      console.error('Error updating fine status:', error);
      set({ error: `Error al actualizar estado de multa: ${error instanceof Error ? error.message : 'Unknown error'}` });
    } finally {
      set({ isLoading: false });
    }
  },
  
  getActivities: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/fines/status-history', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al cargar actividades recientes');
      }

      const result = await response.json();
      // Assuming the API returns an array of activities directly in the response body
      const fetchedActivities: Activity[] = result; 

      set({ activities: fetchedActivities });
      return fetchedActivities;
    } catch (error) {
      console.error('Error al cargar actividades recientes:', error);
      set({ error: 'Error al cargar actividades recientes' });
      return [];
    } finally {
      set({ isLoading: false });
    }
  },
  
  verifyFineIntegrity: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/fines/${id}/integrity`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al verificar la integridad de la multa');
      }

      const data = await response.json();
      return {
        blockchain: data.isIntegrityValid
      };
    } catch (error) {
      console.error('Error verifying fine integrity:', error);
      set({ error: 'Error al verificar integridad de multa' });
      return {
        blockchain: false
      };
    } finally {
      set({ isLoading: false });
    }
  }
}));