// @ts-nocheck
const React = require("react");
const { View } = require("react-native");

module.exports = {
  SafeAreaProvider: ({ children }) => children,
  SafeAreaView: ({ children, ...props }) =>
    React.createElement(View, props, children),
  useSafeAreaInsets: jest.fn(() => ({
    top: 12,
    right: 0,
    bottom: 8,
    left: 0,
  })),
};
