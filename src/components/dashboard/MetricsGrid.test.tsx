import { render, screen } from '@testing-library/react';
import MetricsGrid from './MetricsGrid';
import { Metric } from '../../types';

describe('MetricsGrid', () => {
  const metrics: Metric[] = [
    { label: 'Total Multas', value: 10, change: 5.2 },
    { label: 'Monto Total', value: 1000000, change: -2.1 },
    { label: 'Multas Pagadas', value: 7, change: 3.0 },
    { label: 'Multas Apeladas', value: 2, change: 0.0 },
  ];

  it('renderiza todas las métricas', () => {
    render(<MetricsGrid metrics={metrics} />);
    expect(screen.getByText(/total multas/i)).toBeInTheDocument();
    expect(screen.getByText(/monto total/i)).toBeInTheDocument();
    expect(screen.getByText(/multas pagadas/i)).toBeInTheDocument();
    expect(screen.getByText(/multas apeladas/i)).toBeInTheDocument();
  });

  it('muestra el prefijo $ para métricas de monto', () => {
    render(<MetricsGrid metrics={metrics} />);
    expect(screen.getByText(/\$1,000,000/)).toBeInTheDocument();
  });
}); 