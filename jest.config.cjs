const { TextEncoder, TextDecoder } = require('util');

module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  globals: {
    TextEncoder,
    TextDecoder,
  },
};
