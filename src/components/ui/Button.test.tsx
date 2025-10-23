/**
 * @fileoverview Tests unitarios para el componente Button
 * @description Verifica renderizado, eventos, estados y variantes del botón
 * @see src/components/ui/Button.tsx
 */

import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';
import { ReactNode } from 'react';

/**
 * @suite Button Component Tests
 * @description Suite de pruebas para verificar todas las funcionalidades del componente Button
 * @covers Button renderizado, eventos, estados de loading, iconos, variantes y estados disabled
 */
describe('Button', () => {
  /**
   * @test Renderizado básico
   * @description Verifica que el botón renderiza correctamente con el texto proporcionado
   * @expected El botón debe estar presente en el documento con el texto correcto
   */
  it('renderiza el texto correctamente', () => {
    render(<Button>Click aquí</Button>);
    expect(screen.getByText(/click aquí/i)).toBeInTheDocument();
  });

  /**
   * @test Evento onClick
   * @description Verifica que el botón ejecuta la función onClick cuando se hace click
   * @expected La función onClick debe ser llamada exactamente una vez
   */
  it('llama a onClick cuando se hace click', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByText(/click/i));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  /**
   * @test Estado de loading
   * @description Verifica que el botón muestra un spinner cuando isLoading es true
   * @expected El botón debe contener un elemento SVG (spinner) y estar deshabilitado
   */
  it('muestra el spinner cuando isLoading es true', () => {
    render(<Button isLoading>Loading</Button>);
    expect(screen.getByRole('button')).toContainHTML('svg');
  });

  /**
   * @test Renderizado de icono
   * @description Verifica que el botón renderiza correctamente un icono cuando se proporciona
   * @expected El icono debe estar presente en el documento
   */
  it('muestra el icono si se pasa como prop', () => {
    const Icon = () => <span data-testid="icon">icon</span>;
    render(<Button icon={<Icon />}>Con icono</Button>);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  /**
   * @test Aplicación de variantes
   * @description Verifica que el botón aplica las clases CSS correctas según la variante
   * @expected El botón debe tener la clase CSS correspondiente a la variante "danger"
   */
  it('aplica la clase de variante correctamente', () => {
    render(<Button variant="danger">Peligro</Button>);
    const btn = screen.getByRole('button');
    expect(btn.className).toMatch(/bg-red-600/);
  });

  /**
   * @test Estado disabled
   * @description Verifica que el botón se deshabilita cuando la prop disabled es true
   * @expected El botón debe estar deshabilitado
   */
  it('está deshabilitado si disabled es true', () => {
    render(<Button disabled>Deshabilitado</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  /**
   * @test Estado disabled con loading
   * @description Verifica que el botón se deshabilita automáticamente cuando isLoading es true
   * @expected El botón debe estar deshabilitado cuando está en estado de loading
   */
  it('está deshabilitado si isLoading es true', () => {
    render(<Button isLoading>Loading</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
}); 