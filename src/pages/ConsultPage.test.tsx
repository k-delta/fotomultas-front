import { render, screen, fireEvent } from '@testing-library/react';
import ConsultPage from './ConsultPage';

jest.mock('react-simple-captcha', () => ({
  loadCaptchaEnginge: jest.fn(),
  LoadCanvasTemplate: () => <div data-testid="captcha-canvas">CAPTCHA</div>,
  validateCaptcha: jest.fn(() => true)
}));

describe('ConsultPage', () => {
  it('renderiza el formulario de consulta', () => {
    render(<ConsultPage />);
    expect(screen.getByText(/consulta de multas/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tipo de documento/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/número de documento/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/placa del vehículo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/verificación captcha/i)).toBeInTheDocument();
    expect(screen.getByTestId('captcha-canvas')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /consultar/i })).toBeInTheDocument();
  });

  it('muestra error si el captcha es inválido', () => {
    const { rerender } = render(<ConsultPage />);
    const validateCaptcha = require('react-simple-captcha').validateCaptcha;
    validateCaptcha.mockReturnValueOnce(false);
    fireEvent.change(screen.getByPlaceholderText(/ingrese el código/i), { target: { value: '1234' } });
    fireEvent.click(screen.getByRole('button', { name: /consultar/i }));
    expect(screen.getByText(/el código captcha no es válido/i)).toBeInTheDocument();
  });

  it('no muestra error si el captcha es válido', () => {
    render(<ConsultPage />);
    const validateCaptcha = require('react-simple-captcha').validateCaptcha;
    validateCaptcha.mockReturnValueOnce(true);
    fireEvent.change(screen.getByPlaceholderText(/ingrese el código/i), { target: { value: '1234' } });
    fireEvent.click(screen.getByRole('button', { name: /consultar/i }));
    expect(screen.queryByText(/el código captcha no es válido/i)).not.toBeInTheDocument();
  });
}); 