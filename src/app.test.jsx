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
  beforeEach(() => render(<App />));

  test("Predict Price button is rendered", () => {
    const buttonElement = screen.getByText("Predict Price");

    expect(buttonElement).toBeInTheDocument();
  });

  test("Training Mode checkbox is rendered", () => {
    const checkboxElement = screen.getByText("Training Mode:");

    expect(checkboxElement).toBeInTheDocument();
  });

  test("Predict Price button functions as expected in Performance Mode", () => {
    const buttonElement = screen.getByText("Predict Price");
    const h3Element = screen.getByText("Price: $0");

    fireEvent.click(buttonElement);

    waitFor(() => {
      expect(h3Element).toHaveTextContent("Price: $45.94");
    });
  });

  test("Predict Price button functions as expected in Training Mode", async () => {
    const checkboxElement = screen.getByText("Training Mode:");
    const buttonElement = screen.getByText("Predict Price");
    const h3Element = screen.getByText("Price: $0");

    fireEvent.click(checkboxElement);
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
      expect(h3Element).toHaveTextContent("Price: $90.00");
    });
  });
});
