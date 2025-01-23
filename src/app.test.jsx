import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { gameSerializedNeuralNetwork } from "./constants/serializedNeuralNetworks";
import App from "./App";

jest.mock("./constants/serializedNeuralNetworks", () => {
  const testPrice = 0.04594;
  const testPriceModifier = 1000;
  const testTrainingTimeout = 60000;
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
  describe("unit tests", () => {
    let predictPriceButton;

    beforeEach(() => {
      jest.clearAllMocks();

      render(<App />);

      const continueButton = screen.getByText("Continue");

      fireEvent.click(continueButton);
    });

    test("Predict Price button is rendered after clicking the continue button", () => {
      predictPriceButton = screen.getByText("Predict Price");
      expect(predictPriceButton).toBeInTheDocument();
    });

    test("Predict Price button functions correctly in Performance Mode", async () => {
      predictPriceButton = screen.getByText("Predict Price");
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
  });

  describe("integration test", () => {
    test(
      "Predict Price button updates Price heading correctly in Training Mode",
      async () => {
        jest.clearAllMocks();

        render(<App />);

        fireEvent.click(screen.getByText("Continue"));
        fireEvent.click(screen.getByText("Training Mode:"));
        fireEvent.click(screen.getByText("Predict Price"));

        await waitFor(
          () => {
            const priceHeading = screen.getByText(
              gameSerializedNeuralNetwork.expectedTestTrainingPrice
            );

            expect(priceHeading).toBeInTheDocument();
          },
          { timeout: gameSerializedNeuralNetwork.expectedTestTrainingTimeout }
        );
      },
      gameSerializedNeuralNetwork.expectedTestTrainingTimeout
    );
  });
});
