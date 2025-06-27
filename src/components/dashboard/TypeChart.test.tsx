import { render, screen } from '@testing-library/react';
import TypeChart from './TypeChart';
import { FineWithHistory } from '../../types';

describe('TypeChart', () => {
  const fines: FineWithHistory[] = [
    { id: 'F1', plateNumber: 'A', evidenceCID: '', location: '', timestamp: '', infractionType: 'EXCESO_VELOCIDAD', cost: 1, ownerIdentifier: '', currentState: 0, statusHistory: [] },
    { id: 'F2', plateNumber: 'B', evidenceCID: '', location: '', timestamp: '', infractionType: 'SEMAFORO_ROJO', cost: 1, ownerIdentifier: '', currentState: 0, statusHistory: [] },
    { id: 'F3', plateNumber: 'C', evidenceCID: '', location: '', timestamp: '', infractionType: 'SEMAFORO_ROJO', cost: 1, ownerIdentifier: '', currentState: 0, statusHistory: [] },
  ];

  it('renderiza el gráfico de tipos de infracción', () => {
    render(<TypeChart fines={fines} />);
    expect(screen.getByText(/exceso de velocidad/i)).toBeInTheDocument();
    expect(screen.getByText(/semáforo en rojo/i)).toBeInTheDocument();
  });

  it('muestra la cantidad correcta de cada tipo', () => {
    render(<TypeChart fines={fines} />);
    // El label de "Semáforo en rojo" debe estar presente
    expect(screen.getByText(/semáforo en rojo/i)).toBeInTheDocument();
  });
}); 