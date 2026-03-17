import { createElement } from "react";
import { View } from "react-native";

export const router = {
  back: jest.fn(),
  push: jest.fn(),
  replace: jest.fn(),
};

export const usePathname = jest.fn(() => "/");
export const useLocalSearchParams = jest.fn(() => ({}));

export const Redirect = ({ href }: { href: string }) =>
  createElement(View, {
    testID: "redirect",
    accessibilityLabel: href,
  });

export const Slot = () => null;
