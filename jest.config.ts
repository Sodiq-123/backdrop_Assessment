export default {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["<rootDir>/dist/**/*.test.js"],
  forceExit: true,
  setupFilesAfterEnv: ["<rootDir>/dist/tests/jest.setup.js"],
  globals: {
    "ts-jest": {
      diagnostics: false,
    },
  },
};
