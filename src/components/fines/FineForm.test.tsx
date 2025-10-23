/**
 * @fileoverview Tests unitarios para el componente FineForm
 * @description Verifica formulario de multas, validación, envío y manejo de archivos
 * @see src/components/fines/FineForm.tsx
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FineForm from './FineForm';

/**
 * @suite FineForm Component Tests
 * @description Suite de pruebas para verificar todas las funcionalidades del componente FineForm
 * @covers FineForm renderizado, validación, envío de formularios y manejo de archivos
 */
describe('FineForm', () => {
  /**
   * @mock Mock function para onSubmit
   * @description Función mock que simula el envío exitoso del formulario
   */
  const onSubmit = jest.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    onSubmit.mockClear();
  });

  /**
   * @test Renderizado de campos
   * @description Verifica que todos los campos obligatorios del formulario se renderizan correctamente
   * @expected Todos los campos deben estar presentes: placa, ubicación, tipo, monto, propietario y evidencia
   */
  it('renderiza todos los campos obligatorios', () => {
    render(<FineForm onSubmit={onSubmit} isLoading={false} />);
    expect(screen.getByLabelText(/placa/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/ubicación/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tipo de infracción/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/monto/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/id del propietario/i)).toBeInTheDocument();
    expect(screen.getByText(/cargar imagen/i)).toBeInTheDocument();
  });

  /**
   * @test Interacción con campos
   * @description Verifica que se puede escribir en los campos y cambiar valores
   * @expected Los valores ingresados deben aparecer en los campos correspondientes
   */
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

  /**
   * @test Envío de formulario
   * @description Verifica que onSubmit se llama con los datos correctos incluyendo archivos
   * @expected onSubmit debe ser llamado con todos los datos del formulario incluyendo el archivo de evidencia
   */
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

  /**
   * @test Estado de loading
   * @description Verifica que el botón se deshabilita cuando isLoading es true
   * @expected El botón de registrar multa debe estar deshabilitado cuando está en estado de loading
   */
  it('deshabilita el botón si isLoading es true', () => {
    render(<FineForm onSubmit={onSubmit} isLoading={true} />);
    expect(screen.getByRole('button', { name: /registrar multa/i })).toBeDisabled();
  });
}); 