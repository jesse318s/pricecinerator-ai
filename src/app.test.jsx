import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import App, { neuralNetwork } from "./App";

jest.mock("brain.js", () => {
  return {
    NeuralNetwork: jest.fn().mockImplementation(() => {
      return {
        train: jest.fn(),
        run: jest.fn().mockReturnValue({ price: 0.09 }),
      };
    }),
  };
});

describe("App", () => {
  let buttonElement;

  beforeEach(() => {
    render(<App />);
    buttonElement = screen.getByText("Predict Price");
  });

  test("Predict Price button is rendered", () => {
    expect(buttonElement).toBeInTheDocument();
  });

  test("Predict Price button functions as expected", async () => {
    const priceElement = screen.getByText("Price: $0");

    fireEvent.click(buttonElement);

    await waitFor(() => {
      expect(neuralNetwork.train).toHaveBeenCalled();
    });

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
    expect(neuralNetwork.run()).toStrictEqual({ price: 0.09 });

    waitFor(() => {
      expect(priceElement).toHaveTextContent("Price: $90.00");
    });
  });
});
