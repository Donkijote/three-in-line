const React = require("react");
const { View } = require("react-native");

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
