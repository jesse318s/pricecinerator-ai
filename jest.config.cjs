module.exports = {
  setupFilesAfterEnv: ["<rootDir>/src/test/setupTests.js"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "\\.(gif|ttf|eot|svg|png)$": "<rootDir>/src/test/fileMock.js",
    "\\.(css|scss)$": "identity-obj-proxy",
  },
};
