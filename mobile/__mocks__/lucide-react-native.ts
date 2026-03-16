// @ts-nocheck
const React = require("react");
const { View } = require("react-native");

// Keep this proxy-based CommonJS mock because the app imports many arbitrary icon
// names, and Jest manual mocks need dynamic named exports here.
const createIcon = (name) =>
  Object.assign(
    React.forwardRef((props, ref) =>
      React.createElement(View, {
        ...props,
        accessibilityLabel: props.accessibilityLabel ?? name,
        ref,
      }),
    ),
    { displayName: name },
  );

module.exports = new Proxy(
  {
    __esModule: true,
  },
  {
    get(target, prop) {
      if (prop in target) {
        return target[prop];
      }

      return createIcon(String(prop));
    },
  },
);
