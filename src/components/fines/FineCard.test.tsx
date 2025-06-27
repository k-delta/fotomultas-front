import { render, screen } from '@testing-library/react';
import FineCard from './FineCard';
import { BrowserRouter } from 'react-router-dom';
import { Fine } from '../../types';

describe('FineCard', () => {
  const baseFine: Fine = {
    id: 'F001',
    plateNumber: 'ABC123',
    timestamp: '2024-07-01T10:00:00Z',
    cost: 200000,
    location: 'Calle 1',
    ownerIdentifier: 'U1',
    evidenceCID: 'Qm123',
    infractionType: 'EXCESO_VELOCIDAD',
    currentState: 0,
    transactionId: 'tx1',
    registeredBy: 'admin',
  };

  it('renderiza los datos principales de la multa', () => {
    render(
      <BrowserRouter>
        <FineCard fine={baseFine} />
      </BrowserRouter>
    );
    expect(screen.getByText(/multa f001/i)).toBeInTheDocument();
    expect(screen.getByText(/placa: abc123/i)).toBeInTheDocument();
    expect(screen.getByText(/calle 1/i)).toBeInTheDocument();
    expect(screen.getByText(/u1/i)).toBeInTheDocument();
  });

  it('muestra el botón "Marcar pagada" si el estado es pending', () => {
    render(
      <BrowserRouter>
        <FineCard fine={{ ...baseFine, currentState: 0 }} />
      </BrowserRouter>
    );
    expect(screen.getByText(/marcar pagada/i)).toBeInTheDocument();
  });

  it('no muestra el botón "Marcar pagada" si el estado no es pending', () => {
    render(
      <BrowserRouter>
        <FineCard fine={{ ...baseFine, currentState: 1 }} />
      </BrowserRouter>
    );
    expect(screen.queryByText(/marcar pagada/i)).not.toBeInTheDocument();
  });

  it('el enlace de detalles apunta a la ruta correcta', () => {
    render(
      <BrowserRouter>
        <FineCard fine={baseFine} />
      </BrowserRouter>
    );
    const link = screen.getAllByRole('link').find(l => l.textContent?.toLowerCase().includes('detalles'));
    expect(link).toHaveAttribute('href', '/fines/F001');
  });
}); 