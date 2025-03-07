import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { gameSerializedNeuralNetwork } from "./constants/serializedNeuralNetworks";
import App from "./App";

jest.mock("./constants/serializedNeuralNetworks", () => {
  const testPrice = 0.04594;
  const testPriceModifier = 1000;

  return {
    gameSerializedNeuralNetwork: {
      run: jest.fn().mockReturnValue({ price: testPrice }),
      expectedTestPrice: testPrice,
      expectedTestPriceModifier: testPriceModifier,
    },
  };
});

describe("App", () => {
  let predictPriceButton;

  beforeEach(() => {
    jest.clearAllMocks();

    render(<App />);

    const continueButton = screen.getByText("Continue");

    fireEvent.click(continueButton);
    predictPriceButton = screen.getByText("Predict Price");
  });

  test("Predict Price button is rendered after clicking the continue button", () => {
    expect(predictPriceButton).toBeInTheDocument();
  });

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
});
