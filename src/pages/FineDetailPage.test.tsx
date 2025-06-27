import { render, screen } from '@testing-library/react';
import FineDetailPage from './FineDetailPage';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../store/fineStore', () => ({
  useFineStore: () => ({
    getFineById: jest.fn(),
    updateFineStatus: jest.fn(),
    verifyFineIntegrity: jest.fn(),
    getStatusHistory: jest.fn(),
    selectedFine: {
      id: 'F1',
      plateNumber: 'ABC123',
      evidenceCID: 'Qm123',
      location: 'Calle 1',
      timestamp: '2024-07-01T10:00:00Z',
      infractionType: 'EXCESO_VELOCIDAD',
      cost: 200000,
      ownerIdentifier: 'U1',
      currentState: 0,
      statusHistory: []
    },
    isLoading: false
  })
}));

describe('FineDetailPage', () => {
  it('renderiza los detalles de la multa', () => {
    render(
      <BrowserRouter>
        <FineDetailPage />
      </BrowserRouter>
    );
    expect(screen.getByText(/detalles de multa/i)).toBeInTheDocument();
    expect(screen.getByText(/abc123/i)).toBeInTheDocument();
    expect(screen.getByText(/calle 1/i)).toBeInTheDocument();
    expect(screen.getByText(/ver en ipfs/i)).toBeInTheDocument();
  });

  it('muestra los botones de acción si el estado es pendiente', () => {
    render(
      <BrowserRouter>
        <FineDetailPage />
      </BrowserRouter>
    );
    expect(screen.getByText(/marcar como pagada/i)).toBeInTheDocument();
    expect(screen.getByText(/registrar apelación/i)).toBeInTheDocument();
  });
}); 