import "@testing-library/jest-dom";

jest.mock("brain.js", () => ({
  NeuralNetwork: jest.fn().mockImplementation(() => ({
    train: jest.fn(),
    run: jest.fn(),
    toFunction: jest.fn().mockReturnValue({
      toString: jest.fn().mockReturnValue("mocked neural network"),
    }),
  })),
}));
