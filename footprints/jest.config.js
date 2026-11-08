module.exports = {
    preset: "jest-expo",

    testMatch: [
        "<rootDir>/tests/**/*.test.ts",
        "<rootDir>/tests/**/*.test.tsx",
    ],

    collectCoverageFrom: [
        "src/utils/**/*.{ts,tsx}",
        "src/store/**/*.{ts,tsx}",
        "src/services/**/*.{ts,tsx}",
        "!**/*.d.ts",
    ],
};