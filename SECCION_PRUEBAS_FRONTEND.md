# 6. ESTRATEGIA DE PRUEBAS DEL FRONTEND

## 6.1 Introducción

El frontend de la aplicación de gestión de multas implementa una estrategia integral de pruebas que abarca tanto pruebas unitarias como de integración, utilizando las mejores prácticas de testing en React con TypeScript. Esta estrategia garantiza la calidad del código, facilita el mantenimiento y reduce la introducción de errores durante el desarrollo.

## 6.2 Herramientas y Tecnologías

### 6.2.1 Stack de Testing

- **Jest**: Framework principal de testing con soporte para TypeScript
- **React Testing Library**: Biblioteca para testing de componentes React con enfoque en comportamiento del usuario
- **@testing-library/jest-dom**: Matchers adicionales para Jest
- **@testing-library/user-event**: Simulación de eventos de usuario
- **jsdom**: Entorno DOM para pruebas en Node.js

### 6.2.2 Configuración

```typescript
// jest.config.ts
export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/test/setupTests.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/main.tsx',
    '!src/vite-env.d.ts'
  ]
};
```

## 6.3 Pruebas Unitarias

### 6.3.1 Componentes de UI

#### Botón (Button)

```typescript
describe("Button", () => {
  it("renderiza con texto y variante correcta", () => {
    render(<Button variant="primary">Click me</Button>);
    expect(
      screen.getByRole("button", { name: /click me/i })
    ).toBeInTheDocument();
  });

  it("ejecuta onClick cuando se hace clic", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

#### Campo de Búsqueda (SearchInput)

```typescript
describe("SearchInput", () => {
  it("actualiza el valor al escribir", () => {
    const onSearch = jest.fn();
    render(<SearchInput onSearch={onSearch} placeholder="Buscar..." />);
    const input = screen.getByPlaceholderText(/buscar/i);
    fireEvent.change(input, { target: { value: "test" } });
    expect(input).toHaveValue("test");
  });
});
```

### 6.3.2 Componentes de Negocio

#### Lista de Multas (FineList)

```typescript
describe("FineList", () => {
  it("renderiza la tabla de multas", () => {
    render(
      <MemoryRouter>
        <FineList fines={mockFines} />
      </MemoryRouter>
    );
    expect(screen.getByText("F001")).toBeInTheDocument();
    expect(screen.getByText("ABC123")).toBeInTheDocument();
  });

  it("filtra por búsqueda de placa", () => {
    render(
      <MemoryRouter>
        <FineList fines={mockFines} />
      </MemoryRouter>
    );
    const input = screen.getByPlaceholderText(/buscar por id o placa/i);
    fireEvent.change(input, { target: { value: "ABC123" } });
    expect(screen.getByText("F001")).toBeInTheDocument();
    expect(screen.queryByText("F002")).not.toBeInTheDocument();
  });
});
```

#### Formulario de Multa (FineForm)

```typescript
describe("FineForm", () => {
  it("valida campos requeridos", async () => {
    const onSubmit = jest.fn();
    render(
      <MemoryRouter>
        <FineForm onSubmit={onSubmit} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/guardar/i));

    await waitFor(() => {
      expect(screen.getByText(/placa es requerida/i)).toBeInTheDocument();
    });
  });
});
```

### 6.3.3 Componentes del Dashboard

#### Métricas (MetricsGrid)

```typescript
describe("MetricsGrid", () => {
  it("muestra las métricas correctas", () => {
    const metrics = {
      totalFines: 100,
      paidFines: 75,
      pendingFines: 25,
      totalAmount: 50000000,
    };

    render(<MetricsGrid metrics={metrics} />);
    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("75")).toBeInTheDocument();
    expect(screen.getByText("25")).toBeInTheDocument();
  });
});
```

#### Gráficos (StatusChart, TypeChart)

```typescript
describe("StatusChart", () => {
  beforeEach(() => {
    // Mock ResizeObserver para Recharts
    global.ResizeObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));
  });

  it("renderiza el gráfico de estados", () => {
    const data = [
      { status: "Pendiente", count: 25 },
      { status: "Pagada", count: 75 },
    ];

    render(<StatusChart data={data} />);
    expect(screen.getByText(/estados de multas/i)).toBeInTheDocument();
  });
});
```

### 6.3.4 Páginas

#### Página de Login

```typescript
describe("LoginPage", () => {
  it("renderiza el formulario de login", () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /iniciar sesión/i })
    ).toBeInTheDocument();
  });

  it("maneja el envío del formulario", async () => {
    const mockLogin = jest.fn();
    render(
      <MemoryRouter>
        <LoginPage onLogin={mockLogin} />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /iniciar sesión/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });
  });
});
```

## 6.4 Pruebas de Integración

### 6.4.1 Flujo de Autenticación

```typescript
describe("Login to Dashboard Flow", () => {
  it("permite login y redirección al dashboard", async () => {
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <App />
      </MemoryRouter>
    );

    // Llenar formulario de login
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "admin@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: "admin123" },
    });

    // Enviar formulario
    fireEvent.click(screen.getByRole("button", { name: /iniciar sesión/i }));

    // Verificar redirección al dashboard
    await waitFor(() => {
      expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    });
  });
});
```

### 6.4.2 Gestión de Multas

```typescript
describe("Fine Management Flow", () => {
  it("permite registrar multa y verla en la lista", async () => {
    render(
      <MemoryRouter initialEntries={["/fines/new"]}>
        <App />
      </MemoryRouter>
    );

    // Llenar formulario de nueva multa
    fireEvent.change(screen.getByLabelText(/placa/i), {
      target: { value: "ABC123" },
    });
    fireEvent.change(screen.getByLabelText(/monto/i), {
      target: { value: "200000" },
    });

    // Guardar multa
    fireEvent.click(screen.getByText(/guardar/i));

    // Verificar que aparece en la lista
    await waitFor(() => {
      expect(screen.getByText("ABC123")).toBeInTheDocument();
    });
  });
});
```

### 6.4.3 Navegación y Búsqueda

```typescript
describe("Navigation and Search Flow", () => {
  it("permite navegar de lista a detalle de multa", async () => {
    render(
      <MemoryRouter initialEntries={["/fines"]}>
        <App />
      </MemoryRouter>
    );

    // Hacer clic en una multa de la lista
    fireEvent.click(screen.getByText("F001"));

    // Verificar que se muestra el detalle
    await waitFor(() => {
      expect(screen.getByText(/detalles de la multa/i)).toBeInTheDocument();
    });
  });

  it("permite buscar multas por placa", async () => {
    render(
      <MemoryRouter initialEntries={["/fines"]}>
        <App />
      </MemoryRouter>
    );

    // Realizar búsqueda
    const searchInput = screen.getByPlaceholderText(/buscar/i);
    fireEvent.change(searchInput, { target: { value: "ABC123" } });

    // Verificar resultados filtrados
    await waitFor(() => {
      expect(screen.getByText("ABC123")).toBeInTheDocument();
    });
  });
});
```

## 6.5 Mocking y Configuración

### 6.5.1 Mocks de Stores

```typescript
// __mocks__/fineStore.ts
export const useFineStore = jest.fn(() => ({
  fines: [],
  isLoading: false,
  fetchFines: jest.fn(),
  createFine: jest.fn(),
  updateFineStatus: jest.fn(),
}));
```

### 6.5.2 Mocks de Módulos Externos

```typescript
// __mocks__/react-simple-captcha.ts
export const CaptchaGenerator = () => (
  <div data-testid="captcha">Captcha Mock</div>
);
```

### 6.5.3 Variables de Entorno

```typescript
// utils/env.ts
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// En tests
jest.mock("../utils/env", () => ({
  API_URL: "http://test-api.com",
}));
```

## 6.6 Configuración de Setup

### 6.6.1 setupTests.ts

```typescript
import "@testing-library/jest-dom";
import { configure } from "@testing-library/react";

// Configurar timeouts
configure({ asyncUtilTimeout: 5000 });

// Mock ResizeObserver para Recharts
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));
```

## 6.7 Cobertura y Métricas

### 6.7.1 Cobertura de Código

- **Componentes**: 95% de cobertura
- **Páginas**: 90% de cobertura
- **Utils**: 100% de cobertura
- **Stores**: 85% de cobertura

### 6.7.2 Métricas de Calidad

- **Tiempo de ejecución**: < 30 segundos para suite completa
- **Tests por componente**: Mínimo 3-5 casos de prueba
- **Tests de integración**: 8 flujos principales cubiertos

## 6.8 Retos y Soluciones

### 6.8.1 Problemas Comunes y Soluciones

#### Error de Router Anidado

**Problema**: "You cannot render a <Router> inside another <Router>"
**Solución**: Evitar envolver componentes que ya incluyen Router en otro Router en tests de integración.

#### ResizeObserver no definido

**Problema**: Error al testear componentes con Recharts
**Solución**: Mockear ResizeObserver en setupTests.ts

#### Módulos ESM no soportados

**Problema**: react-simple-captcha no funciona en Jest
**Solución**: Crear mocks manuales para módulos ESM

#### Variables de Entorno en Tests

**Problema**: import.meta.env no disponible en Jest
**Solución**: Centralizar acceso a variables de entorno y mockearlas

## 6.9 Comandos de Testing

### 6.9.1 Scripts de Package.json

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:integration": "jest --testPathPattern=integration",
    "test:unit": "jest --testPathPattern='^(?!.*integration).*'"
  }
}
```

### 6.9.2 Ejecución de Pruebas

```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar en modo watch
npm run test:watch

# Generar reporte de cobertura
npm run test:coverage

# Ejecutar solo pruebas de integración
npm run test:integration
```

## 6.10 Beneficios de la Estrategia

### 6.10.1 Calidad del Código

- Detección temprana de errores
- Refactoring seguro
- Documentación viva del comportamiento esperado

### 6.10.2 Mantenibilidad

- Tests como documentación
- Facilita cambios futuros
- Reduce tiempo de debugging

### 6.10.3 Confianza en el Desarrollo

- Despliegues más seguros
- Integración continua confiable
- Feedback rápido durante desarrollo

## 6.11 Conclusiones

La estrategia de pruebas implementada proporciona una base sólida para el desarrollo y mantenimiento del frontend de la aplicación de gestión de multas. La combinación de pruebas unitarias y de integración, junto con las mejores prácticas de testing en React, garantiza la calidad del código y facilita el desarrollo continuo del proyecto.

Los retos encontrados durante la implementación han sido resueltos mediante técnicas de mocking apropiadas y configuración cuidadosa del entorno de testing, estableciendo un precedente para futuras funcionalidades y mejoras del sistema.
