import { render, screen, fireEvent } from '@testing-library/react';
import FineList from './FineList';
import { FineWithHistory } from '../../types';
import { FineStateInternal } from '../../utils/fineUtils';

const mockFines: FineWithHistory[] = [
  {
    id: 'F001',
    plateNumber: 'ABC123',
    evidenceCID: 'Qm123',
    location: 'Calle 1',
    timestamp: '2024-07-01T10:00:00Z',
    infractionType: 'speeding',
    cost: 200000,
    ownerIdentifier: 'U1',
    currentState: FineStateInternal.PENDING,
    statusHistory: [],
  },
  {
    id: 'F002',
    plateNumber: 'XYZ789',
    evidenceCID: 'Qm456',
    location: 'Calle 2',
    timestamp: '2024-07-02T12:00:00Z',
    infractionType: 'red_light',
    cost: 350000,
    ownerIdentifier: 'U2',
    currentState: FineStateInternal.PAID,
    statusHistory: [],
  },
];

describe('FineList', () => {
  it('renderiza la tabla de multas', () => {
    render(<FineList fines={mockFines} />);
    expect(screen.getByText('F001')).toBeInTheDocument();
    expect(screen.getByText('F002')).toBeInTheDocument();
    expect(screen.getByText('ABC123')).toBeInTheDocument();
    expect(screen.getByText('XYZ789')).toBeInTheDocument();
  });

  it('muestra mensaje si no hay multas', () => {
    render(<FineList fines={[]} />);
    expect(screen.getByText(/no hay multas/i)).toBeInTheDocument();
  });

  it('filtra por búsqueda de placa', () => {
    render(<FineList fines={mockFines} />);
    const input = screen.getByPlaceholderText(/buscar por id o placa/i);
    fireEvent.change(input, { target: { value: 'ABC123' } });
    expect(screen.getByText('F001')).toBeInTheDocument();
    expect(screen.queryByText('F002')).not.toBeInTheDocument();
  });

  it('filtra por estado', () => {
    render(<FineList fines={mockFines} />);
    fireEvent.click(screen.getByText(/filtros/i));
    fireEvent.click(screen.getByText(/pagadas/i));
    expect(screen.getByText('F002')).toBeInTheDocument();
    expect(screen.queryByText('F001')).not.toBeInTheDocument();
  });

  it('muestra el loader si isLoading es true', () => {
    render(<FineList fines={mockFines} isLoading />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
}); 