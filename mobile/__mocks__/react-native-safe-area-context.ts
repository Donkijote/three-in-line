import { createElement, type ReactNode } from "react";
import { View, type ViewProps } from "react-native";

export const SafeAreaProvider = ({ children }: { children?: ReactNode }) =>
  children ?? null;

export const SafeAreaView = ({
  children,
  ...props
}: ViewProps & { children?: ReactNode }) =>
  createElement(View, props, children);

export const useSafeAreaInsets = jest.fn(() => ({
  top: 12,
  right: 0,
  bottom: 8,
  left: 0,
}));
