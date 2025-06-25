import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from './LoginPage';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../store/authStore', () => {
  return {
    useAuthStore: () => ({
      login: jest.fn(() => Promise.resolve()),
      isAuthenticated: false,
      isLoading: false,
      error: null
    })
  };
});

describe('LoginPage', () => {
  it('renderiza el formulario de login', () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
  });

  it('llama a login al enviar el formulario', async () => {
    const loginMock = jest.fn(() => Promise.resolve());
    jest.spyOn(require('../store/authStore'), 'useAuthStore').mockReturnValue({
      login: loginMock,
      isAuthenticated: false,
      isLoading: false,
      error: null
    });
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'admin@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/contraseña/i), { target: { value: '1234' } });
    fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));
    await waitFor(() => {
      expect(loginMock).toHaveBeenCalledWith('admin@example.com', '1234');
    });
  });

  it('muestra mensaje de error si error está presente', () => {
    jest.spyOn(require('../store/authStore'), 'useAuthStore').mockReturnValue({
      login: jest.fn(),
      isAuthenticated: false,
      isLoading: false,
      error: 'Credenciales inválidas'
    });
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );
    expect(screen.getByText(/credenciales inválidas/i)).toBeInTheDocument();
  });

  it('redirige si isAuthenticated es true y el email contiene admin', () => {
    jest.spyOn(require('../store/authStore'), 'useAuthStore').mockReturnValue({
      login: jest.fn(),
      isAuthenticated: true,
      isLoading: false,
      error: null
    });
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'admin@example.com' } });
    // El componente debe renderizar Navigate (no hay texto visible)
    expect(screen.queryByRole('form')).not.toBeInTheDocument();
  });
}); 