/**
 * @fileoverview Tests unitarios para el componente SearchInput
 * @description Verifica funcionalidad de búsqueda, formularios y limpieza de input
 * @see src/components/ui/SearchInput.tsx
 */

import { render, screen, fireEvent } from '@testing-library/react';
import SearchInput from './SearchInput';

/**
 * @suite SearchInput Component Tests
 * @description Suite de pruebas para verificar todas las funcionalidades del componente SearchInput
 * @covers SearchInput renderizado, eventos de búsqueda, formularios y funcionalidad de limpieza
 */
describe('SearchInput', () => {
  /**
   * @test Renderizado con placeholder
   * @description Verifica que el input se renderiza correctamente con el placeholder proporcionado
   * @expected El input debe estar presente con el placeholder correcto
   */
  it('renderiza el input con placeholder', () => {
    render(<SearchInput placeholder="Buscar por nombre" onSearch={() => {}} />);
    expect(screen.getByPlaceholderText(/buscar por nombre/i)).toBeInTheDocument();
  });

  /**
   * @test Envío de formulario
   * @description Verifica que la función onSearch se llama con el valor correcto al enviar el formulario
   * @expected La función onSearch debe ser llamada con el valor ingresado en el input
   */
  it('llama a onSearch al enviar el formulario', () => {
    const onSearch = jest.fn();
    render(<SearchInput onSearch={onSearch} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.submit(input.closest('form')!);
    expect(onSearch).toHaveBeenCalledWith('test');
  });

  /**
   * @test Funcionalidad de limpieza
   * @description Verifica que el botón de limpiar aparece cuando hay texto y limpia el input al hacer click
   * @expected El botón debe aparecer con texto, limpiar el input y llamar a onSearch con string vacío
   */
  it('muestra el botón de limpiar cuando hay texto y lo limpia al hacer click', () => {
    const onSearch = jest.fn();
    render(<SearchInput onSearch={onSearch} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'algo' } });
    expect(screen.getByRole('button')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button'));
    expect(input).toHaveValue('');
    expect(onSearch).toHaveBeenCalledWith('');
  });
}); 