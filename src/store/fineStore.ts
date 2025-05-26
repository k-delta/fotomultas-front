import { create } from 'zustand';
import { Fine, FineWithHistory, FineType, FineStatus, Activity, Location } from '../types/index';
import { generateTransactionId, generateIpfsCid, addStatusChange, FineStateInternal, getFineStatusLabel, verifyBlockchainIntegrity, verifyIpfsIntegrity } from '../utils/fineUtils';

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
  const statuses: FineStateInternal[] = [FineStateInternal.PENDING, FineStateInternal.PAID, FineStateInternal.APPEALED, FineStateInternal.RESOLVED_APPEAL, FineStateInternal.CANCELLED];
  const cities = Object.keys(cityCoordinates);
  
  return Array.from({ length: 50 }, (_, i) => {
    const createdDate = new Date();
    createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 30));
    
    const transactionId = generateTransactionId();
    const initialStatus: FineStateInternal = Math.random() > 0.5 ? FineStateInternal.PENDING : statuses[Math.floor(Math.random() * statuses.length)];
    const city = cities[Math.floor(Math.random() * cities.length)];
    const cityCoords = cityCoordinates[city];
    
    //GENERATE FINE
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
      registeredBy: generateTransactionId(),
      statusHistory: [
        {
          timestamp: createdDate.toISOString(),
          status: FineStateInternal.PENDING,
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
        status: initialStatus,
        transactionId: generateTransactionId(),
        reason: initialStatus === FineStateInternal.APPEALED ? 'El ciudadano presenta pruebas de inocencia' : undefined
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
      
      if (fine.status !== FineStateInternal.PENDING) {
        const latestChange = fine.statusHistory[fine.statusHistory.length - 1];
        
        activities.push({
          id: `A${Math.random().toString().substring(2, 10)}`,
          type: fine.status === FineStateInternal.PAID 
            ? 'fine_paid' 
            : (fine.status === FineStateInternal.APPEALED ? 'fine_appealed' : 'status_change'),
          fineId: fine.id,
          plate: fine.plate,
          timestamp: latestChange.timestamp,
          description: `Multa ${fine.id} marcada como ${getFineStatusLabel(fine.status)}`
        });
      }
      
      return activities;
    })
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10);
};

const mockFines = generateMockFines();
const mockActivities = generateRecentActivities(mockFines);

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
  verifyFineIntegrity: (id: string) => Promise<{ blockchain: boolean; ipfs: boolean }>;
}

export const useFineStore = create<FineStore>((set, get) => ({
  fines: mockFines,
  selectedFine: null,
  activities: mockActivities,
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
        // transactionId from API if available, otherwise generate (API list response doesn't have it)
        transactionId: apiFine.transactionId || generateTransactionId(), 
        // Mapping evidenceCID and hashImageIPFS to ipfsCid
        ipfsCid: apiFine.evidenceCID || apiFine.hashImageIPFS || generateIpfsCid(), // Use API value if available
        plate: apiFine.plateNumber, // Mapping plateNumber to plate
        timestamp: apiFine.timestamp,
        // Mapping string location to Location object - needs proper lat/lng if available
        location: { address: apiFine.location, latitude: 0, longitude: 0 }, // Using address from API
        city: apiFine.city, // Mapping city from API
        fineType: apiFine.infractionType, // Mapping infractionType to fineType
        // Mapping currentState to status (FineStateInternal enum)
        status: ((): FineStateInternal => {
          switch (apiFine.currentState) {
            case '0': return FineStateInternal.PENDING;
            case '1': return FineStateInternal.PAID;
            case '2': return FineStateInternal.APPEALED;
            // Add more mappings for other states from API if known
            default: return FineStateInternal.PENDING; // Default to PENDING if unknown
          }
        })(),
        cost: parseInt(apiFine.cost, 10), // Convert cost to number
        ownerId: apiFine.ownerIdentifier, // Mapping ownerIdentifier to ownerId
        ownerName: apiFine.ownerName, // Mapping ownerName from API (if available)
        idIoT: apiFine.externalSystemId, // Mapping externalSystemId to idIoT (if available)
        registeredBy: apiFine.registeredBy, // Mapping registeredBy from API (if available)
        statusHistory: [], // statusHistory is not in API list response, initialize as empty
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
      // TODO: Implement real API call to get a single fine with history
      // For now, find in mock data
      const fine = get().fines.find(f => f.id === id);
      set({ selectedFine: fine || null });
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      set({ isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      console.error('Error fetching fine:', error);
    }
  },
  
  createFine: async (formData) => {
    set({ isLoading: true, error: null });
    try {
      // Here you would make an actual API call to your backend
      // The backend would handle:
      // 1. Upload the image to IPFS
      // 2. Register the fine in the blockchain
      // 3. Store the fine data in your database
      
      // For now, we'll simulate the API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Convert FormData to object for mock data
      const fineData = { // Assuming form data provides these fields
        plate: formData.get('plate') as string,
        // Assuming location is submitted as separate address, lat, lng fields or similar
        location: { 
            address: formData.get('location-address') as string,
            latitude: parseFloat(formData.get('location-lat') as string || '0'),
            longitude: parseFloat(formData.get('location-lng') as string || '0')
        } as Location,
        city: formData.get('city') as string,
        fineType: formData.get('fineType') as FineType,
        cost: parseInt(formData.get('cost') as string || '0'),
        ownerId: formData.get('ownerId') as string,
        ownerName: formData.get('ownerName') as string,
        timestamp: new Date().toISOString()
      };
      
      const transactionId = generateTransactionId();
      const ipfsCid = generateIpfsCid();
      
      const newFine: FineWithHistory = {
        id: `F${1000 + get().fines.length + 1}`,
        transactionId,
        ipfsCid,
        status: FineStateInternal.PENDING, // New fines start as PENDING
        ...fineData,
        statusHistory: [
          {
            timestamp: new Date().toISOString(),
            status: FineStateInternal.PENDING, // Use FineStateInternal enum
            transactionId
          }
        ]
      };
      
      const newActivity: Activity = {
        id: `A${Math.random().toString().substring(2, 10)}`,
        type: 'fine_registered',
        fineId: newFine.id,
        plate: newFine.plate,
        timestamp: new Date().toISOString(),
        description: `Multa ${newFine.id} registrada para placa ${newFine.plate}`
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
      // TODO: Implement real API call to update fine status
      // For now, update in mock data
      set(state => ({
        fines: state.fines.map(fine => {
          if (fine.id === id) {
            const updatedFine = addStatusChange(fine, status, reason);
            return updatedFine;
          }
          return fine;
        })
      }));
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
    } catch (error) {
      console.error('Error updating fine status:', error);
      set({ error: 'Error al actualizar estado de multa' });
    } finally {
      set({ isLoading: false });
    }
  },
  
  getActivities: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 500));
      // TODO: Implement real API call to get recent activities
      return get().activities; // Returning mock activities for now
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
      // TODO: Implement real verification
      const fine = get().fines.find(f => f.id === id);
      if (!fine) {
        throw new Error('Multa no encontrada');
      }
      // Simulate verification
      const blockchainValid = await verifyBlockchainIntegrity(fine);
      const ipfsValid = await verifyIpfsIntegrity(fine);
      
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
      return {
        blockchain: blockchainValid,
        ipfs: ipfsValid
      };
    } catch (error) {
      console.error('Error verifying fine integrity:', error);
      set({ error: 'Error al verificar integridad de multa' });
      return {
        blockchain: false,
        ipfs: false
      };
    } finally {
      set({ isLoading: false });
    }
  }
}));