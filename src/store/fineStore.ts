import { create } from 'zustand';
import { Fine, FineWithHistory, FineType, FineStatus, Activity } from '../types/index';
import { generateTransactionId, generateIpfsCid, addStatusChange } from '../utils/fineUtils';

const cityCoordinates = {
  'Bogotá': { lat: 4.6097, lng: -74.0817 },
  'Medellín': { lat: 6.2442, lng: -75.5812 },
  'Cali': { lat: 3.4516, lng: -76.5320 },
  'Barranquilla': { lat: 10.9639, lng: -74.7964 },
  'Cartagena': { lat: 10.3910, lng: -75.4794 }
};

const generateRandomCoordinate = (base: number, variance: number = 0.02): number => {
  return base + (Math.random() - 0.5) * variance;
};

// Sample data for demonstration
const generateMockFines = (): FineWithHistory[] => {
  const fineTypes: FineType[] = ['speeding', 'red_light', 'illegal_parking', 'no_documents', 'driving_under_influence', 'other'];
  const statuses: FineStatus[] = ['pending', 'paid', 'appealed', 'rejected', 'verified'];
  const cities = Object.keys(cityCoordinates);
  
  return Array.from({ length: 50 }, (_, i) => {
    const createdDate = new Date();
    createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 30));
    
    const transactionId = generateTransactionId();
    const initialStatus: FineStatus = Math.random() > 0.5 ? 'pending' : statuses[Math.floor(Math.random() * statuses.length)];
    const city = cities[Math.floor(Math.random() * cities.length)];
    const cityCoords = cityCoordinates[city];
    
    const fine: FineWithHistory = {
      id: `F${1000 + i}`,
      transactionId,
      ipfsCid: generateIpfsCid(),
      plate: `${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(Math.random() * 1000)}`,
      timestamp: createdDate.toISOString(),
      location: {
        latitude: generateRandomCoordinate(cityCoords.lat),
        longitude: generateRandomCoordinate(cityCoords.lng),
        address: `${['Calle', 'Carrera', 'Avenida'][Math.floor(Math.random() * 3)]} ${Math.floor(Math.random() * 100) + 1} #${Math.floor(Math.random() * 100) + 1}-${Math.floor(Math.random() * 100) + 1}`
      },
      city,
      fineType: fineTypes[Math.floor(Math.random() * fineTypes.length)],
      status: initialStatus,
      cost: Math.floor(Math.random() * 500000) + 100000,
      ownerId: `U${Math.floor(Math.random() * 100) + 1}`,
      ownerName: `Propietario ${Math.floor(Math.random() * 100) + 1}`,
      idIoT: Math.random() > 0.5 ? `IoT-${Math.floor(Math.random() * 1000) + 1}` : undefined,
      statusHistory: [
        {
          timestamp: createdDate.toISOString(),
          status: 'pending',
          transactionId
        }
      ]
    };
    
    // Add some status history for non-pending fines
    if (initialStatus !== 'pending') {
      const secondDate = new Date(createdDate);
      secondDate.setDate(secondDate.getDate() + Math.floor(Math.random() * 10) + 1);
      
      fine.statusHistory.push({
        timestamp: secondDate.toISOString(),
        status: initialStatus,
        transactionId: generateTransactionId(),
        reason: initialStatus === 'appealed' ? 'El ciudadano presenta pruebas de inocencia' : undefined
      });
    }
    
    return fine;
  });
};

// Generate some recent activities
const generateRecentActivities = (fines: FineWithHistory[]): Activity[] => {
  return fines
    .slice(0, 15)
    .flatMap(fine => {
      const activities: Activity[] = [];
      
      activities.push({
        id: `A${Math.random().toString().substring(2, 10)}`,
        type: 'fine_registered',
        fineId: fine.id,
        plate: fine.plate,
        timestamp: fine.timestamp,
        description: `Multa ${fine.id} registrada para placa ${fine.plate}`
      });
      
      if (fine.status !== 'pending') {
        const latestChange = fine.statusHistory[fine.statusHistory.length - 1];
        
        activities.push({
          id: `A${Math.random().toString().substring(2, 10)}`,
          type: fine.status === 'paid' 
            ? 'fine_paid' 
            : (fine.status === 'appealed' ? 'fine_appealed' : 'status_change'),
          fineId: fine.id,
          plate: fine.plate,
          timestamp: latestChange.timestamp,
          description: `Multa ${fine.id} marcada como ${fine.status === 'paid' 
            ? 'pagada' 
            : (fine.status === 'appealed' 
              ? 'apelada' 
              : fine.status === 'verified' 
                ? 'verificada' 
                : 'rechazada')}`
        });
      }
      
      return activities;
    })
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10);
};

const mockFines = generateMockFines();
const mockActivities = generateRecentActivities(mockFines);

type FinesState = {
  fines: FineWithHistory[];
  selectedFine: FineWithHistory | null;
  activities: Activity[];
  isLoading: boolean;
  error: string | null;
  
  getFines: () => Promise<FineWithHistory[]>;
  getFineById: (id: string) => Promise<FineWithHistory | null>;
  createFine: (fineData: Omit<Fine, 'id' | 'transactionId' | 'ipfsCid' | 'status'>) => Promise<FineWithHistory>;
  updateFineStatus: (id: string, status: FineStatus, reason?: string) => Promise<FineWithHistory | null>;
  getActivities: () => Promise<Activity[]>;
  verifyFineIntegrity: (id: string) => Promise<{ blockchain: boolean; ipfs: boolean }>;
};

export const useFineStore = create<FinesState>((set, get) => ({
  fines: mockFines,
  selectedFine: null,
  activities: mockActivities,
  isLoading: false,
  error: null,
  
  getFines: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 800));
      return get().fines;
    } catch (error) {
      set({ error: 'Error al cargar multas' });
      return [];
    } finally {
      set({ isLoading: false });
    }
  },
  
  getFineById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const fine = get().fines.find(f => f.id === id) || null;
      set({ selectedFine: fine });
      return fine;
    } catch (error) {
      set({ error: 'Error al cargar detalles de multa' });
      return null;
    } finally {
      set({ isLoading: false });
    }
  },
  
  createFine: async (fineData) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API request delay (blockchain registration)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const transactionId = generateTransactionId();
      const ipfsCid = generateIpfsCid();
      
      const newFine: FineWithHistory = {
        id: `F${1000 + get().fines.length + 1}`,
        transactionId,
        ipfsCid,
        status: 'pending',
        ...fineData,
        statusHistory: [
          {
            timestamp: new Date().toISOString(),
            status: 'pending',
            transactionId
          }
        ]
      };
      
      const newActivity: Activity = {
        id: `A${Math.random().toString().substring(2, 10)}`,
        type: 'fine_registered',
        fineId: newFine.id,
        plate: newFine.plate,
        timestamp: newFine.timestamp,
        description: `Multa ${newFine.id} registrada para placa ${newFine.plate}`
      };
      
      set(state => ({ 
        fines: [newFine, ...state.fines],
        activities: [newActivity, ...state.activities].slice(0, 10)
      }));
      
      return newFine;
    } catch (error) {
      set({ error: 'Error al crear multa' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  
  updateFineStatus: async (id: string, status: FineStatus, reason?: string) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API request delay (blockchain transaction)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const fines = get().fines;
      const fineIndex = fines.findIndex(f => f.id === id);
      
      if (fineIndex === -1) {
        throw new Error('Multa no encontrada');
      }
      
      const updatedFine = addStatusChange(fines[fineIndex], status, reason);
      
      const newActivity: Activity = {
        id: `A${Math.random().toString().substring(2, 10)}`,
        type: status === 'paid' 
          ? 'fine_paid' 
          : (status === 'appealed' ? 'fine_appealed' : 'status_change'),
        fineId: updatedFine.id,
        plate: updatedFine.plate,
        timestamp: new Date().toISOString(),
        description: `Multa ${updatedFine.id} marcada como ${status === 'paid' 
          ? 'pagada' 
          : (status === 'appealed' 
            ? 'apelada' 
            : status === 'verified' 
              ? 'verificada' 
              : 'rechazada')}`
      };
      
      const updatedFines = [...fines];
      updatedFines[fineIndex] = updatedFine;
      
      set(state => ({ 
        fines: updatedFines,
        selectedFine: updatedFine,
        activities: [newActivity, ...state.activities].slice(0, 10)
      }));
      
      return updatedFine;
    } catch (error) {
      set({ error: 'Error al actualizar estado de multa' });
      return null;
    } finally {
      set({ isLoading: false });
    }
  },
  
  getActivities: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return get().activities;
    } catch (error) {
      set({ error: 'Error al cargar actividades recientes' });
      return [];
    } finally {
      set({ isLoading: false });
    }
  },
  
  verifyFineIntegrity: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API verification delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const fine = get().fines.find(f => f.id === id);
      if (!fine) {
        throw new Error('Multa no encontrada');
      }
      
      // Simulation: 95% chance blockchain is valid, 90% chance IPFS is valid
      const blockchainValid = Math.random() > 0.05;
      const ipfsValid = Math.random() > 0.1;
      
      // If verification is successful, update the fine status
      if (blockchainValid && ipfsValid && fine.status === 'pending') {
        await get().updateFineStatus(id, 'verified');
      }
      
      return { blockchain: blockchainValid, ipfs: ipfsValid };
    } catch (error) {
      set({ error: 'Error al verificar integridad' });
      return { blockchain: false, ipfs: false };
    } finally {
      set({ isLoading: false });
    }
  }
}));