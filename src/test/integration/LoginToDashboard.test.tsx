/**
 * @fileoverview Test de integración para el flujo de Login a Dashboard
 * @description Verifica el flujo completo de autenticación desde login hasta redirección al dashboard
 * @see src/App.tsx
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../../App';
import { MemoryRouter } from 'react-router-dom';

/**
 * @mock Mock del store de usuario
 * @description Simula un usuario no autenticado que puede hacer login exitosamente
 */
jest.mock('../../store/userStore', () => ({
  useUserStore: () => ({
    isLoggedIn: false,
    login: jest.fn(async () => true),
    user: { name: 'Test User' },
  }),
}));

/**
 * @test Flujo de login a dashboard
 * @description Verifica que el usuario puede hacer login y es redirigido al dashboard
 * @expected Después del login exitoso, debe aparecer el dashboard
 */
test('login flow redirects to dashboard', async () => {
  render(
    <MemoryRouter initialEntries={['/login']}>
      <App />
    </MemoryRouter>
  );

  fireEvent.change(screen.getByLabelText(/usuario/i), { target: { value: 'test' } });
  fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: '1234' } });
  fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));

  await waitFor(() => {
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
  });
});
