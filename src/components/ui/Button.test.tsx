import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';
import { ReactNode } from 'react';

describe('Button', () => {
  it('renderiza el texto correctamente', () => {
    render(<Button>Click aquí</Button>);
    expect(screen.getByText(/click aquí/i)).toBeInTheDocument();
  });

  it('llama a onClick cuando se hace click', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByText(/click/i));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('muestra el spinner cuando isLoading es true', () => {
    render(<Button isLoading>Loading</Button>);
    expect(screen.getByRole('button')).toContainHTML('svg');
  });

  it('muestra el icono si se pasa como prop', () => {
    const Icon = () => <span data-testid="icon">icon</span>;
    render(<Button icon={<Icon />}>Con icono</Button>);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('aplica la clase de variante correctamente', () => {
    render(<Button variant="danger">Peligro</Button>);
    const btn = screen.getByRole('button');
    expect(btn.className).toMatch(/bg-red-600/);
  });

  it('está deshabilitado si disabled es true', () => {
    render(<Button disabled>Deshabilitado</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('está deshabilitado si isLoading es true', () => {
    render(<Button isLoading>Loading</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
}); 