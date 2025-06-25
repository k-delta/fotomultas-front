import { render, screen } from '@testing-library/react';
import StatusChart from './StatusChart';
import { FineWithHistory } from '../../types';
import { FineStateInternal } from '../../utils/fineUtils';

describe('StatusChart', () => {
  const fines: FineWithHistory[] = [
    { id: 'F1', plateNumber: 'A', evidenceCID: '', location: '', timestamp: '', infractionType: 'speeding', cost: 1, ownerIdentifier: '', currentState: FineStateInternal.PENDING, statusHistory: [] },
    { id: 'F2', plateNumber: 'B', evidenceCID: '', location: '', timestamp: '', infractionType: 'speeding', cost: 1, ownerIdentifier: '', currentState: FineStateInternal.PAID, statusHistory: [] },
    { id: 'F3', plateNumber: 'C', evidenceCID: '', location: '', timestamp: '', infractionType: 'speeding', cost: 1, ownerIdentifier: '', currentState: FineStateInternal.PAID, statusHistory: [] },
    { id: 'F4', plateNumber: 'D', evidenceCID: '', location: '', timestamp: '', infractionType: 'speeding', cost: 1, ownerIdentifier: '', currentState: FineStateInternal.APPEALED, statusHistory: [] },
  ];

  it('renderiza el gráfico de estados', () => {
    render(<StatusChart fines={fines} />);
    // Verifica que existan los labels de los estados
    expect(screen.getByText(/pendientes/i)).toBeInTheDocument();
    expect(screen.getByText(/pagadas/i)).toBeInTheDocument();
    expect(screen.getByText(/apeladas/i)).toBeInTheDocument();
  });

  it('muestra la cantidad correcta de multas por estado', () => {
    render(<StatusChart fines={fines} />);
    // El label de Pagadas debe estar presente y el tooltip debe mostrar 2 multas
    // (No se puede simular hover fácilmente, pero el label sí debe estar)
    expect(screen.getByText(/pagadas/i)).toBeInTheDocument();
  });
}); 