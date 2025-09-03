module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)',
  ],
  transform: {
    '^.+\.(ts|tsx|js|jsx)$': ['babel-jest', { configFile: './babel.config.test.js' }],
  },
  transformIgnorePatterns: [
    '/node_modules/',
    '^.+\.module\.(css|sass|scss)$',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  projects: [
    {
      displayName: 'unit',
      testMatch: ['<rootDir>/__tests__/unit/**/*.test.ts'],
      testEnvironment: 'node',
      setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
      transform: {
        '^.+\.(ts|tsx|js|jsx)$': ['babel-jest', { configFile: './babel.config.test.js' }],
      },
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
      },
    },
    {
      displayName: 'integration',
      testMatch: ['<rootDir>/__tests__/integration/**/*.test.ts'],
      testEnvironment: 'jsdom',
      setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
      transform: {
        '^.+\.(ts|tsx|js|jsx)$': ['babel-jest', { configFile: './babel.config.test.js' }],
      },
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
      },
    },
  ],
};