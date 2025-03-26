module.exports = {
  preset: "jest-preset-angular",
  transform: {
    "^.+\\.(ts|html|scss)$": "jest-preset-angular",
  },
  testEnvironment: "jest-environment-jsdom",
};
