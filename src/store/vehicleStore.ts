import { create } from 'zustand';
import { Vehicle } from '../types';

// Sample data for demonstration
const generateMockVehicles = (): Vehicle[] => {
  const types = ['Sedan', 'SUV', 'Camioneta', 'Motocicleta', 'Camión', 'Bus'];
  const cities = ['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena'];
  const statuses = ['valid', 'expired', 'pending'] as const;
  
  return Array.from({ length: 30 }, (_, i) => {
    return {
      plate: `${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(Math.random() * 1000)}`,
      type: types[Math.floor(Math.random() * types.length)],
      year: Math.floor(Math.random() * 20) + 2000,
      city: cities[Math.floor(Math.random() * cities.length)],
      ownerId: `U${Math.floor(Math.random() * 100) + 1}`,
      ownerName: `Propietario ${Math.floor(Math.random() * 100) + 1}`,
      soatStatus: statuses[Math.floor(Math.random() * statuses.length)],
      inspectionStatus: statuses[Math.floor(Math.random() * statuses.length)]
    };
  });
};

const mockVehicles = generateMockVehicles();

type VehicleState = {
  vehicles: Vehicle[];
  selectedVehicle: Vehicle | null;
  isLoading: boolean;
  error: string | null;
  
  getVehicles: () => Promise<Vehicle[]>;
  getVehicleByPlate: (plate: string) => Promise<Vehicle | null>;
  searchVehicles: (query: string) => Promise<Vehicle[]>;
};

export const useVehicleStore = create<VehicleState>((set, get) => ({
  vehicles: mockVehicles,
  selectedVehicle: null,
  isLoading: false,
  error: null,
  
  getVehicles: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 800));
      return get().vehicles;
    } catch (error) {
      set({ error: 'Error al cargar vehículos' });
      return [];
    } finally {
      set({ isLoading: false });
    }
  },
  
  getVehicleByPlate: async (plate: string) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const vehicle = get().vehicles.find(v => v.plate === plate) || null;
      set({ selectedVehicle: vehicle });
      return vehicle;
    } catch (error) {
      set({ error: 'Error al cargar detalles de vehículo' });
      return null;
    } finally {
      set({ isLoading: false });
    }
  },
  
  searchVehicles: async (query: string) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const normalizedQuery = query.toLowerCase();
      const results = get().vehicles.filter(v => 
        v.plate.toLowerCase().includes(normalizedQuery) ||
        v.ownerName.toLowerCase().includes(normalizedQuery)
      );
      
      return results;
    } catch (error) {
      set({ error: 'Error al buscar vehículos' });
      return [];
    } finally {
      set({ isLoading: false });
    }
  }
}));