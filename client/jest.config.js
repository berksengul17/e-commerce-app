module.exports = {
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],
  moduleNameMapper: {
    "^.+\\.(scss|sass|css|less)$": "identity-obj-proxy",
  },
  collectCoverageFrom: ["./src/**"],
  coveragePathIgnorePatterns: [
    "<rootDir>/src/index.js",
    "<rootDir>/src/reportWebVitals.js",
  ],
};
