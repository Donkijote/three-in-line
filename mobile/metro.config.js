const path = require("node:path");
const { getDefaultConfig } = require("expo/metro-config");
const { withNativewind } = require("nativewind/metro");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "..");

const config = getDefaultConfig(projectRoot);
const mobileNodeModules = path.resolve(projectRoot, "node_modules");

config.watchFolders = [workspaceRoot];
config.resolver.disableHierarchicalLookup = true;
config.resolver.nodeModulesPaths = [
  mobileNodeModules,
  path.resolve(workspaceRoot, "node_modules")
];
config.resolver.extraNodeModules = {
  "@": path.resolve(workspaceRoot, "src"),
  react: path.resolve(mobileNodeModules, "react"),
  "react/jsx-runtime": path.resolve(mobileNodeModules, "react/jsx-runtime"),
  "react/jsx-dev-runtime": path.resolve(mobileNodeModules, "react/jsx-dev-runtime"),
  "react-native": path.resolve(mobileNodeModules, "react-native")
};

module.exports = withNativewind(config);
