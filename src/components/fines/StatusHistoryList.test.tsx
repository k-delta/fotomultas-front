/**
 * @fileoverview Tests unitarios para el componente StatusHistoryList
 * @description Verifica renderizado de historial de cambios de estado, ordenamiento y estados vacíos
 * @see src/components/fines/StatusHistoryList.tsx
 */

import { render, screen } from '@testing-library/react';
import StatusHistoryList from './StatusHistoryList';
import { StatusChange } from '../../types';

/**
 * @suite StatusHistoryList Component Tests
 * @description Suite de pruebas para verificar todas las funcionalidades del componente StatusHistoryList
 * @covers StatusHistoryList renderizado, historial, ordenamiento y estados vacíos
 */
describe('StatusHistoryList', () => {
  const history: StatusChange[] = [
    {
      timestamp: '2024-07-02T12:00:00Z',
      currentState: 1,
      transactionId: 'tx2',
      reason: 'Pago realizado'
    },
    {
      timestamp: '2024-07-01T10:00:00Z',
      currentState: 0,
      transactionId: 'tx1',
    }
  ];

  it('renderiza el historial de cambios', () => {
    render(<StatusHistoryList history={history} />);
    expect(screen.getByText(/marcada como pagada/i)).toBeInTheDocument();
    expect(screen.getByText(/registrada como pendiente/i)).toBeInTheDocument();
    expect(screen.getByText(/pago realizado/i)).toBeInTheDocument();
    expect(screen.getAllByText(/transaction id/i).length).toBeGreaterThan(0);
  });

  it('muestra mensaje si no hay historial', () => {
    render(<StatusHistoryList history={[]} />);
    expect(screen.getByText(/no hay historial de cambios disponible/i)).toBeInTheDocument();
  });

  it('muestra el historial ordenado por fecha descendente', () => {
    render(<StatusHistoryList history={history} />);
    const items = screen.getAllByText(/transaction id/i);
    // El primer item debe corresponder al estado más reciente (pagada)
    expect(items[0].parentElement?.textContent).toMatch(/pagada/i);
  });
}); 