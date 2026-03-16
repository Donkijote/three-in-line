module.exports = {
  useColorScheme: jest.fn(() => ({
    colorScheme: "light",
    setColorScheme: jest.fn(),
    toggleColorScheme: jest.fn(),
  })),
  cssInterop: (component) => component,
  styled: (component) => component,
};
