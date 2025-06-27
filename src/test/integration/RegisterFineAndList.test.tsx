import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../../App';
import { MemoryRouter } from 'react-router-dom';

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
