import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../../App';
import { MemoryRouter } from 'react-router-dom';

const mockUpdateStatus = jest.fn();

jest.mock('../../store/fineStore', () => ({
  useFineStore: () => ({
    fines: [{ id: 1, plate: 'ABC123', amount: 100, status: 'Pendiente' }],
    fetchFines: jest.fn(),
    updateFineStatus: mockUpdateStatus,
    getFineById: (id) => ({ id, plate: 'ABC123', amount: 100, status: 'Pendiente' }),
  }),
}));

test('change fine status from detail', async () => {
  render(
    <MemoryRouter initialEntries={['/fines/1']}>
      <App />
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(screen.getByText(/pendiente/i)).toBeInTheDocument();
  });

  fireEvent.click(screen.getByRole('button', { name: /marcar como pagada/i }));

  await waitFor(() => {
    expect(mockUpdateStatus).toHaveBeenCalled();
  });
});
