/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  // Sets the base directory for Jest to the parent folder
  rootDir: '..',

  // Specifies the pattern to locate end-to-end test files
  testMatch: ['**/e2e/**/*.test.js'],

  // Individual test timeout set to 120 seconds to allow for slow UI transitions/boot times
  testTimeout: 120000,

  // Forces tests to run serially to prevent resource conflicts on the mobile emulator/simulator
  maxWorkers: 1,

  // Detox-specific lifecycle hooks for global setup and teardown
  globalSetup: 'detox/runners/jest/globalSetup',
  globalTeardown: 'detox/runners/jest/globalTeardown',

  // Configures the reporter to provide detailed Detox-specific execution logs
  reporters: ['detox/runners/jest/reporter'],

  // Sets the testing environment tailored for Detox synchronization
  testEnvironment: 'detox/runners/jest/testEnvironment',

  // Enables detailed output for each individual test during the run
  verbose: true,
};
