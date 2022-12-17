/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testEnvironmentOptions: { resources: 'usable' },
  testRegex: '__tests__/.*.test.ts$',
  moduleNameMapper: {
    '\\.pcss$': 'identity-obj-proxy',
  },
  setupFiles: ['./testSetup.ts'],
}
