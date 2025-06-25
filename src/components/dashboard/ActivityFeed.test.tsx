import { render, screen } from '@testing-library/react';
import ActivityFeed from './ActivityFeed';
import { BrowserRouter } from 'react-router-dom';
import { Activity } from '../../types';

describe('ActivityFeed', () => {
  const activities: Activity[] = [
    {
      fineId: 'F001',
      plateNumber: 'ABC123',
      reason: 'Multa registrada',
      status: 0,
      timestamp: '2024-07-01T10:00:00Z',
    },
    {
      fineId: 'F002',
      plateNumber: 'XYZ789',
      reason: 'Pago realizado',
      status: 1,
      timestamp: '2024-07-02T12:00:00Z',
    },
  ];

  it('renderiza la lista de actividades', () => {
    render(
      <BrowserRouter>
        <ActivityFeed activities={activities} />
      </BrowserRouter>
    );
    expect(screen.getByText(/multa registrada/i)).toBeInTheDocument();
    expect(screen.getByText(/pago realizado/i)).toBeInTheDocument();
  });

  it('muestra mensaje si no hay actividades', () => {
    render(<ActivityFeed activities={[]} />);
    expect(screen.getByText(/no hay actividades recientes/i)).toBeInTheDocument();
  });

  it('los enlaces de actividad apuntan a la ruta correcta', () => {
    render(
      <BrowserRouter>
        <ActivityFeed activities={activities} />
      </BrowserRouter>
    );
    const links = screen.getAllByRole('link');
    expect(links[0]).toHaveAttribute('href', '/fines/F001');
    expect(links[1]).toHaveAttribute('href', '/fines/F002');
  });
}); 