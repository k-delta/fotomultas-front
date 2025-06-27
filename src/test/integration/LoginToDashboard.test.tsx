import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../../App';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../store/userStore', () => ({
  useUserStore: () => ({
    isLoggedIn: false,
    login: jest.fn(async () => true),
    user: { name: 'Test User' },
  }),
}));

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
