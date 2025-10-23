/**
 * @fileoverview Tests unitarios para el componente FineList
 * @description Verifica renderizado de lista, filtrado, estados y funcionalidad de loading
 * @see src/components/fines/FineList.tsx
 */

import { render, screen, fireEvent } from '@testing-library/react';
import FineList from './FineList';
import { FineWithHistory } from '../../types';
import { FineStateInternal } from '../../utils/fineUtils';

/**
 * @mock Mock data para pruebas
 * @description Datos de prueba que incluyen multas con diferentes estados
 */
const mockFines: FineWithHistory[] = [
  {
    id: 'F001',
    plateNumber: 'ABC123',
    evidenceCID: 'Qm123',
    location: 'Calle 1',
    timestamp: '2024-07-01T10:00:00Z',
    infractionType: 'EXCESO_VELOCIDAD',
    cost: 200000,
    ownerIdentifier: 'U1',
    currentState: FineStateInternal.PENDING,
    statusHistory: [],
  },
  {
    id: 'F002',
    plateNumber: 'XYZ789',
    evidenceCID: 'Qm456',
    location: 'Calle 2',
    timestamp: '2024-07-02T12:00:00Z',
    infractionType: 'SEMAFORO_ROJO',
    cost: 350000,
    ownerIdentifier: 'U2',
    currentState: FineStateInternal.PAID,
    statusHistory: [],
  },
];

/**
 * @suite FineList Component Tests
 * @description Suite de pruebas para verificar todas las funcionalidades del componente FineList
 * @covers FineList renderizado, filtrado, estados vacíos, loading y navegación
 */
describe('FineList', () => {
  /**
   * @test Renderizado de tabla
   * @description Verifica que la tabla de multas se renderiza correctamente con los datos proporcionados
   * @expected Todos los elementos de la tabla deben estar presentes (IDs, placas, etc.)
   */
  it('renderiza la tabla de multas', () => {
    render(<FineList fines={mockFines} />);
    expect(screen.getByText('F001')).toBeInTheDocument();
    expect(screen.getByText('F002')).toBeInTheDocument();
    expect(screen.getByText('ABC123')).toBeInTheDocument();
    expect(screen.getByText('XYZ789')).toBeInTheDocument();
  });

  /**
   * @test Estado vacío
   * @description Verifica que se muestra un mensaje apropiado cuando no hay multas
   * @expected Debe mostrar mensaje de "no hay multas" cuando la lista está vacía
   */
  it('muestra mensaje si no hay multas', () => {
    render(<FineList fines={[]} />);
    expect(screen.getByText(/no hay multas/i)).toBeInTheDocument();
  });

  /**
   * @test Filtrado por búsqueda
   * @description Verifica que el filtrado por búsqueda funciona correctamente
   * @expected Solo debe mostrar las multas que coincidan con el término de búsqueda
   */
  it('filtra por búsqueda de placa', () => {
    render(<FineList fines={mockFines} />);
    const input = screen.getByPlaceholderText(/buscar por id o placa/i);
    fireEvent.change(input, { target: { value: 'ABC123' } });
    expect(screen.getByText('F001')).toBeInTheDocument();
    expect(screen.queryByText('F002')).not.toBeInTheDocument();
  });

  /**
   * @test Filtrado por estado
   * @description Verifica que el filtrado por estado funciona correctamente
   * @expected Solo debe mostrar las multas con el estado seleccionado
   */
  it('filtra por estado', () => {
    render(<FineList fines={mockFines} />);
    fireEvent.click(screen.getByText(/filtros/i));
    fireEvent.click(screen.getByText(/pagadas/i));
    expect(screen.getByText('F002')).toBeInTheDocument();
    expect(screen.queryByText('F001')).not.toBeInTheDocument();
  });

  /**
   * @test Estado de loading
   * @description Verifica que se muestra el loader cuando isLoading es true
   * @expected Debe mostrar un elemento con role="status" (loader/spinner)
   */
  it('muestra el loader si isLoading es true', () => {
    render(<FineList fines={mockFines} isLoading />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
}); 