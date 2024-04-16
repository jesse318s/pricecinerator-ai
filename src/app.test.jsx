import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { serializedNeuralNetwork } from "./constants/serializedNeuralNetwork";
import App from "./App";

jest.mock("./constants/serializedNeuralNetwork", () => {
  const testPrice = 0.04594;

  return {
    serializedNeuralNetwork: {
      run: jest.fn().mockReturnValue({ price: testPrice }),
      expectedTestPrice: testPrice,
    },
  };
});

describe("App", () => {
  let predictPriceButton;

  beforeEach(() => {
    jest.clearAllMocks();
    render(<App />);
    predictPriceButton = screen.getByText("Predict Price");
  });

  test("Predict Price button is rendered", () =>
    expect(predictPriceButton).toBeInTheDocument());

  test("Predict Price button functions as expected in Performance Mode", async () => {
    const testYear = 0.1977;

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
      const priceHeading = screen.getByText(
        "Price: $" +
          (1000 * serializedNeuralNetwork.expectedTestPrice).toFixed(2)
      );

      expect(priceHeading).toBeInTheDocument();
    });
  });

  test("Predict Price button updates Price heading as expected in Training Mode", async () => {
    const trainingModeCheckbox = screen.getByText("Training Mode:");
    const priceRegex = /Price: \$([1-9]\d{0,2}\.\d{2}|0\.\d*[1-9]\d*)/;
    let priceHeading;

    fireEvent.click(trainingModeCheckbox);
    fireEvent.click(predictPriceButton);

    await waitFor(
      () => {
        priceHeading = screen.getByText(priceRegex);
        expect(priceHeading).toBeInTheDocument();
      },
      { timeout: 40000 }
    );
  }, 40000);
});
