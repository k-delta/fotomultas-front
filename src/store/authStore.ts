import { create } from 'zustand';
import { User } from '../types';

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

// Mock user data for demonstration
const mockAdminUser: User = {
  id: '1',
  name: 'Admin Usuario',
  email: 'admin@example.com',
  role: 'admin',
  createdAt: new Date().toISOString()
};

// Mock user data for demonstration
const mockUser: User = {
  id: '1',
  name: 'Usuario1',
  email: 'user@example.com',
  role: 'viewer',
  createdAt: new Date().toISOString()
};


export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  
  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demonstration, accept any credentials with email containing "admin"
      if (email.includes('admin')) {
        set({ 
          user: mockAdminUser,
          isAuthenticated: true,
          isLoading: false 
        });
      } else if(email.includes('user')) {
                set({ 
          user: mockUser,
          isAuthenticated: true,
          isLoading: false 
        });
      } else{
        throw new Error('Credenciales inválidas');
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error de autenticación',
        isLoading: false 
      });
    }
  },
  
  register: async (name: string, email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, just "succeed" and return to login
      set({ isLoading: false });
      return Promise.resolve();
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error de registro',
        isLoading: false 
      });
    }
  },
  
  logout: () => {
    set({ 
      user: null,
      isAuthenticated: false 
    });
  },
}));