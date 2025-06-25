import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  setupFilesAfterEnv: ['<rootDir>/src/test/setupTests.ts'],
  transformIgnorePatterns: [
    '/node_modules/(?!react-simple-captcha)'
  ],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.app.json'
    }
  }
};

export default config;