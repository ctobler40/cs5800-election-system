export default {
    preset: 'react',
    // testEnvironment: 'jsdom',
    transform: {
        '^.+\\.jsx?$': 'babel-jest',
      },
      testEnvironment: 'jest-environment-jsdom',
      setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
      moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
      moduleNameMapper: {
        '\\.(css|less)$': 'identity-obj-proxy',
      },
      transformIgnorePatterns: [
        '/node_modules/(?!some-esm-package|another-esm-package).+\\.js$',
      ],
  };  