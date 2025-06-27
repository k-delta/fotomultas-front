import { render, screen, waitFor } from '@testing-library/react';
import App from '../../App';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../store/dashboardStore', () => ({
  useDashboardStore: () => ({
    metrics: { totalFines: 10, paidFines: 5, pendingFines: 5 },
    fetchMetrics: jest.fn(),
  }),
}));

test('dashboard shows main metrics', async () => {
  render(
    <MemoryRouter initialEntries={['/dashboard']}>
      <App />
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(screen.getByText(/total de multas/i)).toBeInTheDocument();
    expect(screen.getByText(/10/)).toBeInTheDocument();
    expect(screen.getByText(/pagadas/i)).toBeInTheDocument();
    expect(screen.getByText(/5/)).toBeInTheDocument();
    expect(screen.getByText(/pendientes/i)).toBeInTheDocument();
  });
});
