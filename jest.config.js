module.exports = {
  collectCoverage: false,
  moduleDirectories: [
    'node_modules'
  ],
  moduleFileExtensions: [
    'ts',
    'js'
  ],
  moduleNameMapper: {
    '^@src/(.*)$': '<rootDir>/src/$1',
    '^@module/(.*)$': '<rootDir>/src/module/$1',
  },
  preset: 'ts-jest',
  testEnvironment: 'node',
  testRegex: '.test.ts$',
  rootDir: './'
};
