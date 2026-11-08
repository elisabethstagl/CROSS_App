
module.exports = {
    preset: "jest-expo",

    testMatch: [
        "<rootDir>/tests/**/*.test.ts",
        "<rootDir>/tests/**/*.test.tsx",
    ],

    moduleNameMapper: {
        "\\.css$": "<rootDir>/tests/mocks/styleMock.js",
    },

    collectCoverageFrom: [
        "src/utils/**/*.{ts,tsx}",
        "src/store/**/*.{ts,tsx}",
        "src/services/**/*.{ts,tsx}",
        "!**/*.d.ts",
    ],

    passWithNoTests: false,
};
