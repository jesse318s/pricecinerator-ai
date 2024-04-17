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

  test("Predict Price button functions correctly in Performance Mode", async () => {
    fireEvent.click(predictPriceButton);

    await waitFor(() => expect(serializedNeuralNetwork.run).toHaveBeenCalled());

    await waitFor(() => {
      const priceHeading = screen.getByText(
        "Price: $" +
          (1000 * serializedNeuralNetwork.expectedTestPrice).toFixed(2)
      );

      expect(priceHeading).toBeInTheDocument();
    });
  });

  test("Predict Price button updates Price heading correctly in Training Mode", async () => {
    const trainingModeCheckbox = screen.getByText("Training Mode:");
    const priceRegex = /Price: \$([1-9]\d{0,2}\.\d{2}|0\.\d*[1-9]\d*)/;
    const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});
    const confirmSpy = jest
      .spyOn(window, "confirm")
      .mockImplementation(() => {});

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
    confirmSpy.mockRestore();
  }, 40000);
});
