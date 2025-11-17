/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "jest-environment-jsdom",

  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  setupFiles: ["<rootDir>/jest.setup.ts"],

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },

  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.test.json",
    },
  },

  // >>> ADICIONADO <<<
  collectCoverage: true,
  coverageDirectory: "coverage",

  collectCoverageFrom: [
    "src/**/*.{ts,tsx,js,jsx}",
    "!src/main.tsx",
    "!src/vite-env.d.ts",
    "!src/**/__tests__/**",
    "!src/**/mocks/**",
    "!src/**/types/**",
  ],
};
