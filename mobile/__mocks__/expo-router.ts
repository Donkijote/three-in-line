// @ts-nocheck
const React = require("react");
const { View } = require("react-native");

module.exports = {
  Redirect: ({ href }) =>
    React.createElement(View, {
      testID: "redirect",
      accessibilityLabel: href,
    }),
  Slot: () => null,
  router: {
    back: jest.fn(),
    replace: jest.fn(),
  },
  usePathname: jest.fn(() => "/"),
};
