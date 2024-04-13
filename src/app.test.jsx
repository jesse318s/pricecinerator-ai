import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { serializedNeuralNetwork } from "./constants/serializedNeuralNetwork";
import App from "./App";

const testYear = 0.1977;

jest.mock("./constants/serializedNeuralNetwork", () => ({
  serializedNeuralNetwork: {
    run: jest.fn().mockReturnValue({ price: 0.04594 }),
  },
}));

describe("App", () => {
  const priceRegex = /Price: \$([1-9]\d{0,2}\.\d{2}|0\.\d*[1-9]\d*)/;
  let predictPriceButton;
  let priceHeading;
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
      expect(serializedNeuralNetwork.run).toHaveBeenCalledWith({
        year: testYear,
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
      priceHeading = screen.getByText("Price: $45.94");
      expect(priceHeading).toBeInTheDocument();
    });
  });

  test("Training Mode checkbox is rendered", () => {
    expect(trainingModeCheckbox).toBeInTheDocument();
  });

  test("Predict Price button updates Price heading as expected in Training Mode", async () => {
    fireEvent.click(trainingModeCheckbox);
    fireEvent.click(predictPriceButton);

    await waitFor(
      () => {
        priceHeading = screen.getByText(priceRegex);
        expect(priceHeading).toBeInTheDocument();
      },
      { timeout: 30000 }
    );
  }, 30000);
});
