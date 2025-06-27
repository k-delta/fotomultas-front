import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../../App';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../store/fineStore', () => ({
  useFineStore: () => ({
    fines: [{ id: 1, plate: 'ABC123', amount: 100 }],
    fetchFines: jest.fn(),
  }),
}));

test('navigate from fine list to fine detail', async () => {
  render(
    <MemoryRouter initialEntries={['/fines']}>
      <App />
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(screen.getByText(/abc123/i)).toBeInTheDocument();
  });

  fireEvent.click(screen.getByText(/abc123/i));

  await waitFor(() => {
    expect(screen.getByText(/detalle de multa/i)).toBeInTheDocument();
  });
});
