import { create } from 'zustand';
import { FineWithHistory, FineType, Activity } from '../types/index';
import { generateTransactionId, generateIpfsCid, FineStateInternal } from '../utils/fineUtils';
import { API_URL } from '../utils/env';

// Sample data for demonstration
const generateMockFines = (): FineWithHistory[] => {
  const fineTypes: FineType[] = ['EXCESO_VELOCIDAD', 'SEMAFORO_ROJO', 'ESTACIONAMIENTO_PROHIBIDO', 'CONDUCIR_EMBRIAGADO', 'NO_RESPETAR_PASO_PEATONAL', 'USO_CELULAR', 'NO_USAR_CINTURON', 'CONDUCIR_SIN_LICENCIA', 'OTRO'];
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

interface PaginationInfo {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

interface FineStore {
  fines: FineWithHistory[];
  selectedFine: FineWithHistory | null;
  activities: Activity[];
  isLoading: boolean;
  error: string | null;
  pagination: PaginationInfo;

  getFines: (page?: number, pageSize?: number) => Promise<FineWithHistory[]>;
  getFineById: (id: string) => Promise<void>;
  createFine: (formData: FormData) => Promise<FineWithHistory>;
  updateFineStatus: (id: string, newState: FineStateInternal, reason?: string) => Promise<void>;
  getActivities: () => Promise<Activity[]>;
  verifyFineIntegrity: (id: string) => Promise<{ blockchain: boolean }>;
  getStatusHistory: (id: string) => Promise<any[]>;
}

export const useFineStore = create<FineStore>((set, get) => ({
  fines: [],
  selectedFine: null,
  activities: [],
  isLoading: false,
  error: null,
  pagination: { currentPage: 1, pageSize: 10, totalItems: 0, totalPages: 0 },

  getFines: async (page = 1, pageSize = 10) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/api/fines?page=${page}&pageSize=${pageSize}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al cargar multas');
      }

      const result = await response.json();
      const apiFines = result.data;

      const mappedFines: FineWithHistory[] = apiFines.map((apiFine: any) => ({
        id: apiFine.id,
        transactionId: apiFine.transactionId || generateTransactionId(),
        evidenceCID: apiFine.evidenceCID || apiFine.hashImageIPFS || generateIpfsCid(),
        plateNumber: apiFine.plateNumber,
        timestamp: apiFine.timestamp,
        location: apiFine.location,
        infractionType: apiFine.infractionType,
        currentState: apiFine.currentState in FineStateInternal
          ? apiFine.currentState as FineStateInternal
          : FineStateInternal.PENDING,
        cost: parseInt(apiFine.cost, 10),
        ownerIdentifier: apiFine.ownerIdentifier,
        registeredBy: apiFine.registeredBy,
        statusHistory: []
      }));

      set({
        fines: mappedFines,
        pagination: result.pagination || { currentPage: page, pageSize, totalItems: mappedFines.length, totalPages: 1 }
      });
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
      const response = await fetch(`${API_URL}/api/fines/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al cargar la multa');
      }

      const result = await response.json();
      const fine = result.data || result;
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
        currentState: fine.currentState in FineStateInternal
          ? fine.currentState as FineStateInternal
          : FineStateInternal.PENDING,
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
        fineId: newFine.id,
        plateNumber: newFine.plateNumber,
        timestamp: new Date().toISOString(),
        reason: `Multa ${newFine.id} registrada para placa ${newFine.plateNumber}`,
        status: FineStateInternal.PENDING,
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
  
  updateFineStatus: async (id: string, newState: FineStateInternal, reason?: string) => {
    set({ isLoading: true, error: null });
    try {
      // Determinar el estado final basado en la resolución de la apelación
      let finalState = newState;

      const response = await fetch(`${API_URL}/api/fines/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newState: finalState, reason, updatedBy: 'Admin Usuario' }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el estado de la multa');
      }

      const updatedFine = await response.json();
      
      // Actualizar selectedFine si existe
      set(state => {
        if (state.selectedFine?.id === id) {
          return {
            selectedFine: {
              ...state.selectedFine,
              currentState: finalState,
              statusHistory: [
                ...state.selectedFine.statusHistory,
                {
                  timestamp: new Date().toISOString(),
                  currentState: finalState,
                  transactionId: generateTransactionId(),
                  reason
                }
              ]
            }
          };
        }
        return {};
      });

      // Actualizar el array de fines
      set(state => ({
        fines: state.fines.map(fine => 
          fine.id === id 
            ? {
                ...fine,
                currentState: finalState,
                statusHistory: [
                  ...fine.statusHistory,
                  {
                    timestamp: new Date().toISOString(),
                    currentState: finalState,
                    transactionId: generateTransactionId(),
                    reason
                  }
                ]
              }
            : fine
        )
      }));
      await get().getFines();
      await get().getFineById(id);
    } catch (error) {
      console.error('Error updating fine status:', error);
      set({ error: 'Error al actualizar el estado de la multa' });
    } finally {
      set({ isLoading: false });
    }
  },
  
  getActivities: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/api/fines/recent-history`, {
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
      const fetchedActivities: Activity[] = result.data; 

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
      const response = await fetch(`${API_URL}/api/fines/${id}/integrity`, {
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
        blockchain: data.success
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
  },
  
  getStatusHistory: async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/api/fines/${id}/status-history`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al cargar el historial de estados');
      }

      const data = await response.json();
      const raw = Array.isArray(data) ? data : Array.isArray(data.data) ? data.data : [];
      // Mapear campos del backend (status) al tipo del frontend (currentState)
      return raw.map((entry: any) => ({
        currentState: entry.currentState ?? entry.status ?? entry.newState ?? 0,
        timestamp: entry.timestamp,
        reason: entry.reason,
        transactionId: entry.transactionId || entry.transactionHash || '',
      }));
    } catch (error) {
      console.error('Error fetching status history:', error);
      return []; // En caso de error, devolver un array vacío
    }
  }
}));