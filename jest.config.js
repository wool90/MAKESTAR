module.exports = {
    roots: ['<rootDir>/src'],
    testMatch: ['**/*.spec.ts'],
    coveragePathIgnorePatterns: ['/src/orm/migration'],
    preset: 'ts-jest',
    modulePaths: ['src'],
    transform: {
      '^.+\\.tsx?$': ['ts-jest', {
        isolatedModules: true,
      }],
    },
  };
