import Reanimated from "react-native-reanimated/mock";

const mockedReanimated = Reanimated as typeof Reanimated & {
  default: {
    call: () => undefined;
  };
};

mockedReanimated.default.call = () => undefined;

export default mockedReanimated;
