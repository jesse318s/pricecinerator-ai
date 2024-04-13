import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { serializedNeuralNetwork } from "./constants/serializedNeuralNetwork";
import App, { neuralNetwork } from "./App";

jest.mock("./constants/serializedNeuralNetwork", () => ({
  serializedNeuralNetwork: {
    run: jest.fn().mockReturnValue({ price: 0.04594 }),
  },
}));

jest.mock("brain.js", () => {
  return {
    NeuralNetwork: jest.fn().mockImplementation(() => {
      return {
        train: jest.fn(),
        run: jest.fn().mockReturnValue({ price: 0.05088 }),
      };
    }),
  };
});

describe("App", () => {
  let predictPriceButton;
  let trainingModeCheckbox;

  beforeEach(() => {
    jest.clearAllMocks();
    render(<App />);
    predictPriceButton = screen.getByText("Predict Price");
    trainingModeCheckbox = screen.getByText("Training Mode:");
  });

  test("Predict Price button is rendered", () => {
    expect(predictPriceButton).toBeInTheDocument();
  });

  test("Predict Price button functions as expected in Performance Mode", async () => {
    fireEvent.click(predictPriceButton);

    await waitFor(() => {
      expect(serializedNeuralNetwork.run).toHaveBeenCalled();
    });

    await waitFor(() => {
      const updatedPriceHeading = screen.getByText("Price: $45.94");
      expect(updatedPriceHeading).toBeInTheDocument();
    });
  });

  test("Training Mode checkbox is rendered", () => {
    expect(trainingModeCheckbox).toBeInTheDocument();
  });

  test("Predict Price button functions as expected in Training Mode", async () => {
    fireEvent.click(trainingModeCheckbox);
    fireEvent.click(predictPriceButton);

    await waitFor(() => {
      expect(neuralNetwork.train).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(neuralNetwork.run).toHaveBeenCalledWith({
        year: 0.1977,
        genre_Action: 0,
        genre_Adventure: 0,
        genre_RPG: 0,
        genre_Simulation: 0,
        genre_Strategy: 0,
        genre_Sports: 0,
        genre_Puzzle: 0,
        platform_Console: 0,
        platform_PC: 0,
      });
    });

    await waitFor(() => {
      const updatedPriceHeading = screen.getByText("Price: $50.88");
      expect(updatedPriceHeading).toBeInTheDocument();
    });
  });
});
