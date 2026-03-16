type MockColorScheme = {
  colorScheme: "light";
  setColorScheme: jest.Mock;
  toggleColorScheme: jest.Mock;
};

export const useColorScheme = jest.fn<MockColorScheme, []>(() => ({
  colorScheme: "light",
  setColorScheme: jest.fn(),
  toggleColorScheme: jest.fn(),
}));

export const cssInterop = <T>(component: T) => component;

export const styled = <T>(component: T) => component;
