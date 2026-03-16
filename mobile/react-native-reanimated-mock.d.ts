declare module "react-native-reanimated/mock" {
  const reanimatedMock: Record<string, unknown> & {
    default: {
      call: () => undefined;
    };
  };

  export default reanimatedMock;
}
