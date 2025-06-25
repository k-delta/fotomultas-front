import { render, screen } from '@testing-library/react';
import FinesPage from './FinesPage';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../store/fineStore', () => ({
  useFineStore: () => ({
    getFines: jest.fn(),
    fines: [
      { id: 'F1', plateNumber: 'ABC123', evidenceCID: '', location: '', timestamp: '', infractionType: 'speeding', cost: 1000, ownerIdentifier: '', currentState: 0, statusHistory: [] }
    ],
    isLoading: false
  })
}));

describe('FinesPage', () => {
  it('renderiza el título y el botón de registrar multa', () => {
    render(
      <BrowserRouter>
        <FinesPage />
      </BrowserRouter>
    );
    expect(screen.getByText(/gestión de multas/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /registrar nueva multa/i })).toBeInTheDocument();
  });

  it('renderiza la lista de multas', () => {
    render(
      <BrowserRouter>
        <FinesPage />
      </BrowserRouter>
    );
    expect(screen.getByText('F1')).toBeInTheDocument();
    expect(screen.getByText('ABC123')).toBeInTheDocument();
  });
}); 