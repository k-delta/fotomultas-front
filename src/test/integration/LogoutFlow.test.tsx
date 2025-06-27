import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../../App';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../store/userStore', () => ({
  useUserStore: () => ({
    isLoggedIn: true,
    logout: jest.fn(),
    user: { name: 'Test User' },
  }),
}));

test('logout redirects to login', async () => {
  render(
    <MemoryRouter initialEntries={['/dashboard']}>
      <App />
    </MemoryRouter>
  );

  fireEvent.click(screen.getByRole('button', { name: /cerrar sesión/i }));

  await waitFor(() => {
    expect(screen.getByText(/iniciar sesión/i)).toBeInTheDocument();
  });
});
