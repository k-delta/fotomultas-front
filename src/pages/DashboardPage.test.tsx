import { render, screen, fireEvent } from '@testing-library/react';
import DashboardPage from './DashboardPage';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../store/fineStore', () => ({
  useFineStore: () => ({
    getFines: jest.fn(),
    getActivities: jest.fn(),
    fines: [
      { id: 'F1', plateNumber: 'A', evidenceCID: '', location: '', timestamp: new Date().toISOString(), infractionType: 'EXCESO_VELOCIDAD', cost: 1000, ownerIdentifier: '', currentState: 0, statusHistory: [] },
      { id: 'F2', plateNumber: 'B', evidenceCID: '', location: '', timestamp: new Date().toISOString(), infractionType: 'SEMAFORO_ROJO', cost: 2000, ownerIdentifier: '', currentState: 1, statusHistory: [] }
    ],
    activities: [
      { fineId: 'F1', plateNumber: 'A', reason: 'Multa registrada', status: 0, timestamp: new Date().toISOString() }
    ],
    isLoading: false
  })
}));

describe('DashboardPage', () => {
  it('renderiza el dashboard y métricas', () => {
    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>
    );
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/total multas/i)).toBeInTheDocument();
    expect(screen.getByText(/distribución por estado/i)).toBeInTheDocument();
    expect(screen.getByText(/distribución por tipo/i)).toBeInTheDocument();
    expect(screen.getByText(/multas recientes/i)).toBeInTheDocument();
  });

  it('tiene botón para actualizar y crear nueva multa', () => {
    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>
    );
    expect(screen.getByRole('button', { name: /actualizar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /nueva multa/i })).toBeInTheDocument();
  });
}); 