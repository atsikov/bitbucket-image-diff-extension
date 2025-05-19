/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  transform: {
    '^.+.[jt]sx?$': ['ts-jest', { isolatedModules: true }],
  },
  testEnvironment: 'jsdom',
  testEnvironmentOptions: { resources: 'usable', customExportConditions: [''] },
  testRegex: '__tests__/.*.test.tsx?$',
  moduleNameMapper: {
    '\\.pcss$': 'identity-obj-proxy',
    '^react$': 'preact/compat',
    '^react-dom$': 'preact/compat',
    '^react-dom/client$': 'preact/compat/client',
    '^react-dom/test-utils$': 'preact/test-utils',
    '^react/jsx-runtime$': 'preact/jsx-runtime',
  },
  setupFilesAfterEnv: ['./testSetup.ts'],
}
