import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { gameSerializedNeuralNetwork } from "./constants/serializedNeuralNetworks";
import App from "./App";

jest.mock("./constants/serializedNeuralNetworks", () => {
  const testPrice = 0.04594;
  const testPriceModifier = 1000;
  const testTrainingTimeout = 37500;
  const testTrainingPrice = /Price: \$([1-9]\d{0,2}\.\d{2}|0\.\d*[1-9]\d*)/;

  return {
    gameSerializedNeuralNetwork: {
      run: jest.fn().mockReturnValue({ price: testPrice }),
      expectedTestPrice: testPrice,
      expectedTestPriceModifier: testPriceModifier,
      expectedTestTrainingTimeout: testTrainingTimeout,
      expectedTestTrainingPrice: testTrainingPrice,
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

  test("Predict Price button functions correctly in Performance Mode", async () => {
    fireEvent.click(predictPriceButton);

    await waitFor(() =>
      expect(gameSerializedNeuralNetwork.run).toHaveBeenCalled()
    );

    await waitFor(() => {
      const price =
        gameSerializedNeuralNetwork.expectedTestPriceModifier *
        gameSerializedNeuralNetwork.expectedTestPrice;
      const priceHeading = screen.getByText("Price: $" + price.toFixed(2));

      expect(priceHeading).toBeInTheDocument();
    });
  });

  test(
    "Predict Price button updates Price heading correctly in Training Mode",
    async () => {
      const trainingModeCheckbox = screen.getByText("Training Mode:");
      const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});

      fireEvent.click(trainingModeCheckbox);
      fireEvent.click(predictPriceButton);

      await waitFor(
        () => {
          const priceHeading = screen.getByText(
            gameSerializedNeuralNetwork.expectedTestTrainingPrice
          );

          expect(priceHeading).toBeInTheDocument();
        },
        { timeout: gameSerializedNeuralNetwork.expectedTestTrainingTimeout }
      );

      alertSpy.mockRestore();
    },
    gameSerializedNeuralNetwork.expectedTestTrainingTimeout
  );
});
