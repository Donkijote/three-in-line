import type { ReactNode } from "react";

type TextStubRenderer<Props> = string | ((props: Props) => string);

export const createTextStub = <Props extends object>(
  renderer: TextStubRenderer<Props>,
  onRender?: (props: Props) => void,
) => {
  const React = require("react") as typeof import("react");
  const { Text } = require("react-native") as typeof import("react-native");

  const TextStub = (props: Props) => {
    onRender?.(props);

    const content =
      typeof renderer === "function" ? renderer(props) : renderer;

    return React.createElement(Text, null, content);
  };

  return TextStub;
};

export const createViewStub = <
  Props extends { children?: ReactNode } = { children?: ReactNode },
>() => {
  const React = require("react") as typeof import("react");
  const { View } = require("react-native") as typeof import("react-native");

  const ViewStub = ({ children }: Props) =>
    React.createElement(View, null, children);

  return ViewStub;
};

export const createVisibilityStub = () => {
  const React = require("react") as typeof import("react");
  const { View } = require("react-native") as typeof import("react-native");

  const VisibilityStub = ({
    children,
    visible,
  }: {
    children?: ReactNode;
    visible: boolean;
  }) => (visible ? React.createElement(View, null, children) : null);

  return VisibilityStub;
};

export const createSwitchStub = () => {
  const React = require("react") as typeof import("react");
  const { Pressable, Text } = require("react-native") as typeof import("react-native");

  const SwitchStub = ({
    checked,
    onCheckedChange,
  }: {
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
  }) =>
    React.createElement(
      Pressable,
      { onPress: () => onCheckedChange(!checked) },
      React.createElement(Text, null, checked ? "on" : "off"),
    );

  return SwitchStub;
};
