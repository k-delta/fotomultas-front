import { render, screen } from '@testing-library/react';
jest.mock('react-simple-captcha');
import App from './App';

test('renderiza el título principal', () => {
  render(<App />);
  expect(screen.getByText(/sistema de gestión de fotocomparendos/i)).toBeInTheDocument();
});