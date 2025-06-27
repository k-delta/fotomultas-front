import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../../App';
import { MemoryRouter } from 'react-router-dom';

jest.mock('react-simple-captcha', () => ({
  __esModule: true,
  default: ({ onChange }) => (
    <button onClick={() => onChange('1234')}>Resolver Captcha</button>
  ),
}));

test('consult fine with captcha', async () => {
  render(
    <MemoryRouter initialEntries={['/consult']}>
      <App />
    </MemoryRouter>
  );

  fireEvent.change(screen.getByLabelText(/número de placa/i), { target: { value: 'ABC123' } });
  fireEvent.click(screen.getByText(/resolver captcha/i));
  fireEvent.change(screen.getByLabelText(/captcha/i), { target: { value: '1234' } });
  fireEvent.click(screen.getByRole('button', { name: /consultar/i }));

  await waitFor(() => {
    expect(screen.getByText(/resultados/i)).toBeInTheDocument();
  });
});
