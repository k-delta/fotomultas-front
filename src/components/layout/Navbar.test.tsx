import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from './Navbar';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../../store/authStore', () => ({
  useAuthStore: () => ({
    user: { name: 'Admin', email: 'admin@example.com' },
    logout: jest.fn()
  })
}));

describe('Navbar', () => {
  it('renderiza el nombre del usuario', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  it('renderiza los enlaces principales', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/multas/i)).toBeInTheDocument();
    expect(screen.getByText(/usuarios/i)).toBeInTheDocument();
  });

  it('muestra el menú móvil al hacer click en el botón', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    const menuButton = screen.getByRole('button');
    fireEvent.click(menuButton);
    expect(screen.getByText(/cerrar sesión/i)).toBeInTheDocument();
  });

  it('llama a logout al hacer click en el botón de salir', () => {
    const logoutMock = jest.fn();
    jest.spyOn(require('../../store/authStore'), 'useAuthStore').mockReturnValue({
      user: { name: 'Admin', email: 'admin@example.com' },
      logout: logoutMock
    });
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    fireEvent.click(screen.getAllByText(/salir|cerrar sesión/i)[0]);
    expect(logoutMock).toHaveBeenCalled();
  });
}); 