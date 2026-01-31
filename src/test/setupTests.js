import "@testing-library/jest-dom";

jest.mock("brain.js", () => ({
  NeuralNetwork: jest.fn().mockImplementation(() => ({
    train: jest.fn(),
    run: jest.fn(() => ({ output: 0.5 })),
    toJSON: jest.fn(() => ({})),
    fromJSON: jest.fn(),
  })),
  recurrent: {
    LSTM: jest.fn().mockImplementation(() => ({
      train: jest.fn(),
      run: jest.fn(() => ({ output: 0.5 })),
      toJSON: jest.fn(() => ({})),
      fromJSON: jest.fn(),
    })),
  },
}));
