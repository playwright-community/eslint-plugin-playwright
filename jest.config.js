/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
  preset: 'ts-jest',
  testEnvironment: 'node',
};
