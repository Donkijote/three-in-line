const path = require("path");

const originalCwd = process.cwd();
process.chdir(path.resolve(__dirname, ".."));
const expoPreset = require(path.resolve(
  __dirname,
  "node_modules/jest-expo/jest-preset",
));
process.chdir(originalCwd);
const babelJest = require.resolve("babel-jest", { paths: [__dirname] });
const expoAssetTransformer = require.resolve(
  "jest-expo/src/preset/assetFileTransformer",
  { paths: [__dirname] },
);
const reactNativeAssetTransformer = require.resolve(
  "react-native/jest/assetFileTransformer",
  { paths: [__dirname] },
);

module.exports = {
  ...expoPreset,
  rootDir: path.resolve(__dirname, ".."),
  roots: ["<rootDir>/mobile", "<rootDir>/src"],
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/mobile/setupTests.js"],
  moduleDirectories: ["node_modules", "<rootDir>/mobile/node_modules"],
  modulePaths: ["<rootDir>/mobile/node_modules"],
  moduleNameMapper: {
    ...expoPreset.moduleNameMapper,
    "^react$": "<rootDir>/mobile/node_modules/react",
    "^react/jsx-runtime$": "<rootDir>/mobile/node_modules/react/jsx-runtime.js",
    "^react/jsx-dev-runtime$":
      "<rootDir>/mobile/node_modules/react/jsx-dev-runtime.js",
    "^@convex-dev/auth/react$":
      "<rootDir>/mobile/node_modules/@convex-dev/auth/dist/react/index.js",
    "^@convex-dev/auth/server$":
      "<rootDir>/mobile/node_modules/@convex-dev/auth/dist/server/index.js",
    "^@convex-dev/auth/providers/(.*)$":
      "<rootDir>/mobile/node_modules/@convex-dev/auth/dist/providers/$1.js",
    "^@/convex/(.*)$": "<rootDir>/convex/$1",
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testMatch: [
    "<rootDir>/src/ui/mobile/**/*.test.ts",
    "<rootDir>/src/ui/mobile/**/*.test.tsx",
    "<rootDir>/src/infrastructure/mobile/**/*.test.ts",
    "<rootDir>/src/infrastructure/mobile/**/*.test.tsx",
  ],
  collectCoverageFrom: [
    "<rootDir>/src/ui/mobile/**/*.{ts,tsx}",
    "<rootDir>/src/infrastructure/mobile/**/*.{ts,tsx}",
    "!<rootDir>/src/ui/mobile/routes/**/*.{ts,tsx}",
    "!<rootDir>/src/ui/mobile/components/ui/drawer.tsx",
    "!<rootDir>/src/ui/mobile/**/*.test.{ts,tsx}",
    "!<rootDir>/src/infrastructure/mobile/**/*.test.{ts,tsx}",
  ],
  coverageProvider: "v8",
  coverageDirectory: "<rootDir>/mobile/coverage",
  coverageThreshold: {
    global: {
      branches: 92,
      functions: 97,
      lines: 99,
      statements: 99,
    },
  },
  testPathIgnorePatterns: ["/node_modules/", "<rootDir>/mobile/dist/"],
  transform: {
    ...expoPreset.transform,
    "^.+\\.(bmp|gif|jpg|jpeg|mp4|png|psd|svg|webp)$":
      reactNativeAssetTransformer,
    "\\.[jt]sx?$": [
      babelJest,
      {
        babelrc: false,
        configFile: path.resolve(__dirname, "babel.config.js"),
        caller: {
          bundler: "metro",
          name: "metro",
          platform: "ios",
        },
      },
    ],
    "^.+\\.(bmp|gif|jpg|jpeg|png|psd|svg|webp|xml|m4v|mov|mp4|mpeg|mpg|webm|aac|aiff|caf|m4a|mp3|wav|html|pdf|yaml|yml|otf|ttf|zip|heic|avif|db)$":
      expoAssetTransformer,
  },
  transformIgnorePatterns: [
    "/node_modules/(?!(.pnpm|react-native|@react-native|@react-native-community|expo|@expo|@expo-google-fonts|react-navigation|@react-navigation|@sentry/react-native|native-base|@rn-primitives))",
    "/node_modules/react-native-reanimated/plugin/",
  ],
};
