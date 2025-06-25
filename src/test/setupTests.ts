import '@testing-library/jest-dom';

jest.mock('../utils/env', () => ({
  API_URL: 'http://localhost:3000'
}));
