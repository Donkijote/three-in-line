// @ts-nocheck
const Reanimated = require("react-native-reanimated/mock");

Reanimated.default.call = () => undefined;

module.exports = Reanimated;
