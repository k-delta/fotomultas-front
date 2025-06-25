import { render, screen, fireEvent } from '@testing-library/react';
import SearchInput from './SearchInput';

describe('SearchInput', () => {
  it('renderiza el input con placeholder', () => {
    render(<SearchInput placeholder="Buscar por nombre" onSearch={() => {}} />);
    expect(screen.getByPlaceholderText(/buscar por nombre/i)).toBeInTheDocument();
  });

  it('llama a onSearch al enviar el formulario', () => {
    const onSearch = jest.fn();
    render(<SearchInput onSearch={onSearch} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.submit(input.closest('form')!);
    expect(onSearch).toHaveBeenCalledWith('test');
  });

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