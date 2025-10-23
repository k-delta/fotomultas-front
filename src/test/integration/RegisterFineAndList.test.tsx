/**
 * @fileoverview Test de integración para el flujo de Registro y Lista de Multas
 * @description Verifica el flujo completo de registro de multa y visualización en la lista
 * @see src/App.tsx
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../../App';
import { MemoryRouter } from 'react-router-dom';

/**
 * @mock Mock del store de multas
 * @description Simula un store con funcionalidad de agregar multas y mantener estado
 */
jest.mock('../../store/fineStore', () => {
  let fines = [];
  return {
    useFineStore: () => ({
      fines,
      addFine: jest.fn((fine) => fines.push(fine)),
      fetchFines: jest.fn(),
    }),
  };
});

/**
 * @test Flujo de registro y lista
 * @description Verifica que se puede registrar una multa y aparece en la lista
 * @expected La multa registrada debe aparecer en la lista de multas
 */
test('register fine and see it in the list', async () => {
  render(
    <MemoryRouter initialEntries={['/fines/new']}>
      <App />
    </MemoryRouter>
  );

  fireEvent.change(screen.getByLabelText(/placa/i), { target: { value: 'XYZ789' } });
  fireEvent.change(screen.getByLabelText(/valor/i), { target: { value: '200' } });
  fireEvent.click(screen.getByRole('button', { name: /registrar/i }));

  // Simula redirección a la lista
  await waitFor(() => {
    expect(screen.getByText(/xyz789/i)).toBeInTheDocument();
  });
});
