import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../../App';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../store/fineStore', () => ({
  useFineStore: () => ({
    fines: [
      { id: 1, plate: 'ABC123', amount: 100 },
      { id: 2, plate: 'XYZ789', amount: 200 },
    ],
    fetchFines: jest.fn(),
  }),
}));

test('search fines by plate', async () => {
  render(
    <MemoryRouter initialEntries={['/fines']}>
      <App />
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(screen.getByText(/abc123/i)).toBeInTheDocument();
    expect(screen.getByText(/xyz789/i)).toBeInTheDocument();
  });

  fireEvent.change(screen.getByPlaceholderText(/buscar por placa/i), { target: { value: 'xyz' } });

  await waitFor(() => {
    expect(screen.queryByText(/abc123/i)).not.toBeInTheDocument();
    expect(screen.getByText(/xyz789/i)).toBeInTheDocument();
  });
});
