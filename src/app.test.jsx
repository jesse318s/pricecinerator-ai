import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { gameSerializedNeuralNetwork } from "./constants/serializedNeuralNetworks";
import App from "./App";

jest.mock("./constants/serializedNeuralNetworks", () => {
  const testPrice = 0.04594;

  return {
    gameSerializedNeuralNetwork: {
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

  test("Predict Price button functions correctly in Performance Mode", async () => {
    fireEvent.click(predictPriceButton);

    await waitFor(() =>
      expect(gameSerializedNeuralNetwork.run).toHaveBeenCalled()
    );

    await waitFor(() => {
      const price = 1000 * gameSerializedNeuralNetwork.expectedTestPrice;
      const priceHeading = screen.getByText("Price: $" + price.toFixed(2));

      expect(priceHeading).toBeInTheDocument();
    });
  });

  test("Predict Price button updates Price heading correctly in Training Mode", async () => {
    const trainingModeCheckbox = screen.getByText("Training Mode:");
    const priceRegex = /Price: \$([1-9]\d{0,2}\.\d{2}|0\.\d*[1-9]\d*)/;
    const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});

    fireEvent.click(trainingModeCheckbox);
    fireEvent.click(predictPriceButton);

    await waitFor(
      () => {
        const priceHeading = screen.getByText(priceRegex);

        expect(priceHeading).toBeInTheDocument();
      },
      { timeout: 40000 }
    );

    alertSpy.mockRestore();
  }, 40000);
});
