import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FineForm from './FineForm';

describe('FineForm', () => {
  const onSubmit = jest.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    onSubmit.mockClear();
  });

  it('renderiza todos los campos obligatorios', () => {
    render(<FineForm onSubmit={onSubmit} isLoading={false} />);
    expect(screen.getByLabelText(/placa/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/ubicación/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tipo de infracción/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/monto/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/id del propietario/i)).toBeInTheDocument();
    expect(screen.getByText(/cargar imagen/i)).toBeInTheDocument();
  });

  it('permite escribir en los campos y cambiar el tipo de infracción', () => {
    render(<FineForm onSubmit={onSubmit} isLoading={false} />);
    fireEvent.change(screen.getByLabelText(/placa/i), { target: { value: 'ABC123' } });
    fireEvent.change(screen.getByLabelText(/ubicación/i), { target: { value: 'Calle 1' } });
    fireEvent.change(screen.getByLabelText(/tipo de infracción/i), { target: { value: 'SEMAFORO_ROJO' } });
    fireEvent.change(screen.getByLabelText(/monto/i), { target: { value: '50000' } });
    fireEvent.change(screen.getByLabelText(/id del propietario/i), { target: { value: 'U1' } });
    expect(screen.getByDisplayValue('ABC123')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Calle 1')).toBeInTheDocument();
    expect(screen.getByDisplayValue('SEMAFORO_ROJO')).toBeInTheDocument();
    expect(screen.getByDisplayValue('50000')).toBeInTheDocument();
    expect(screen.getByDisplayValue('U1')).toBeInTheDocument();
  });

  it('llama a onSubmit con los datos correctos al enviar el formulario', async () => {
    render(<FineForm onSubmit={onSubmit} isLoading={false} />);
    fireEvent.change(screen.getByLabelText(/placa/i), { target: { value: 'ABC123' } });
    fireEvent.change(screen.getByLabelText(/ubicación/i), { target: { value: 'Calle 1' } });
    fireEvent.change(screen.getByLabelText(/tipo de infracción/i), { target: { value: 'SEMAFORO_ROJO' } });
    fireEvent.change(screen.getByLabelText(/monto/i), { target: { value: '50000' } });
    fireEvent.change(screen.getByLabelText(/id del propietario/i), { target: { value: 'U1' } });
    // Mock file input
    const file = new File(['dummy'], 'evidencia.png', { type: 'image/png' });
    const input = screen.getByLabelText(/evidencia/i).parentElement!.querySelector('input[type="file"]')!;
    fireEvent.change(input, { target: { files: [file] } });
    fireEvent.submit(screen.getByRole('form'));
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({
        plateNumber: 'ABC123',
        location: 'Calle 1',
        infractionType: 'SEMAFORO_ROJO',
        cost: 50000,
        ownerIdentifier: 'U1',
        evidenceFile: file
      }));
    });
  });

  it('deshabilita el botón si isLoading es true', () => {
    render(<FineForm onSubmit={onSubmit} isLoading={true} />);
    expect(screen.getByRole('button', { name: /registrar multa/i })).toBeDisabled();
  });
}); 