/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testRegex: '__tests__/.*.test.ts$',
  moduleNameMapper: {
    '\\.pcss$': 'identity-obj-proxy',
  },
}