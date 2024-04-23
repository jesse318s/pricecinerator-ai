import React from "react";
import { gameObjectGenerationOptions } from "../constants/neuralNetworkSettings";
import { render, fireEvent } from "@testing-library/react";
import GameInput from "./GameInput";

describe("GameInput", () => {
  const defaultYear = new Date().getFullYear().toString();
  let setPredictionObjectInput;
  let setPredictionOptions;
  let result;

  beforeEach(() => {
    setPredictionObjectInput = jest.fn();
    setPredictionOptions = jest.fn();

    result = render(
      <GameInput
        predictionObjectInput={{
          year: defaultYear,
          genre_Action: false,
        }}
        setPredictionObjectInput={setPredictionObjectInput}
        predictionOptions={{}}
        setPredictionOptions={setPredictionOptions}
      />
    );
  });

  test("Year field calls setPredictionObjectInput correctly when a year is input", () => {
    const yearInput = result.getByLabelText("Year:");
    const testYear = gameObjectGenerationOptions.lowBaseYear.toString();

    expect(yearInput.value).toBe(defaultYear);
    fireEvent.change(yearInput, { target: { value: testYear } });
    expect(setPredictionObjectInput).toHaveBeenCalledWith({
      year: testYear,
      genre_Action: false,
    });

    result.rerender(
      <GameInput
        predictionObjectInput={{
          year: testYear,
          genre_Action: false,
        }}
        setPredictionObjectInput={setPredictionObjectInput}
        predictionOptions={{
          performanceMode: true,
          trainingMode: false,
        }}
        setPredictionOptions={() => {}}
      />
    );

    expect(yearInput.value).toBe(testYear);
  });

  test("genre checkbox calls setPredictionObjectInput as expected when clicked", () => {
    const genreInput = result.getByLabelText("Action:");

    expect(genreInput.checked).toBe(false);
    fireEvent.click(genreInput);
    expect(setPredictionObjectInput).toHaveBeenCalledWith({
      year: defaultYear,
      genre_Action: true,
    });
    expect(genreInput.checked).toBe(true);
  });

  test("predicition option radio button calls setPredictionOptions as expected when clicked", () => {
    const predictionOptionsInput = result.getByLabelText("Training Mode:");

    expect(predictionOptionsInput.checked).toBe(false);
    fireEvent.click(predictionOptionsInput);
    expect(setPredictionOptions).toHaveBeenCalledWith({
      performanceMode: false,
      trainingMode: true,
    });
    expect(predictionOptionsInput.checked).toBe(true);
  });
});
