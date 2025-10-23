/**
 * @fileoverview Test de integración para el flujo de Consulta con CAPTCHA
 * @description Verifica el flujo completo de consulta de multas con validación de CAPTCHA
 * @see src/App.tsx
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../../App';
import { MemoryRouter } from 'react-router-dom';

/**
 * @mock Mock de react-simple-captcha
 * @description Simula el componente CAPTCHA con funcionalidad de resolución automática
 */
jest.mock('react-simple-captcha', () => ({
  __esModule: true,
  default: ({ onChange }) => (
    <button onClick={() => onChange('1234')}>Resolver Captcha</button>
  ),
}));

/**
 * @test Flujo de consulta con CAPTCHA
 * @description Verifica que se puede consultar multas después de resolver el CAPTCHA
 * @expected Después de resolver el CAPTCHA, debe mostrar los resultados de la consulta
 */
test('consult fine with captcha', async () => {
  render(
    <MemoryRouter initialEntries={['/consult']}>
      <App />
    </MemoryRouter>
  );

  fireEvent.change(screen.getByLabelText(/número de placa/i), { target: { value: 'ABC123' } });
  fireEvent.click(screen.getByText(/resolver captcha/i));
  fireEvent.change(screen.getByLabelText(/captcha/i), { target: { value: '1234' } });
  fireEvent.click(screen.getByRole('button', { name: /consultar/i }));

  await waitFor(() => {
    expect(screen.getByText(/resultados/i)).toBeInTheDocument();
  });
});
