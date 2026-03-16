const React = require("react");
const { Pressable, Text, View } = require("react-native");

const createSvgPrimitive = (name) =>
  ({ children, ...props }) =>
    React.createElement(View, { ...props, accessibilityLabel: props.accessibilityLabel ?? name }, children);

const SvgUri = ({ onError, onLoad, uri, ...props }) =>
  React.createElement(
    Pressable,
    {
      ...props,
      onLongPress: onError,
      onPress: onLoad,
    },
    React.createElement(Text, null, uri),
  );

const baseExports = {
  __esModule: true,
  default: createSvgPrimitive("Svg"),
  Svg: createSvgPrimitive("Svg"),
  SvgUri,
};

module.exports = new Proxy(baseExports, {
  get(target, prop) {
    if (prop in target) {
      return target[prop];
    }

    return createSvgPrimitive(String(prop));
  },
});
