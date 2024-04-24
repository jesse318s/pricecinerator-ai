import React from "react";
import { gameObjectGenerationOptions } from "../constants/neuralNetworkSettings";
import { render, fireEvent } from "@testing-library/react";
import PredictionInput from "./PredictionInput";

describe("PredictionInput", () => {
  const defaultNeuralNetworkType = "game";
  const defaultYear = new Date().getFullYear().toString();
  const testInputProp = "genre_Action";
  let setPredictionObjectInput;
  let setPredictionOptions;
  let result;

  beforeEach(() => {
    setPredictionObjectInput = jest.fn();
    setPredictionOptions = jest.fn();

    result = render(
      <PredictionInput
        neuralNetworkType={defaultNeuralNetworkType}
        predictionObjectInput={{
          year: defaultYear,
          [testInputProp]: false,
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
      [testInputProp]: false,
    });

    result.rerender(
      <PredictionInput
        neuralNetworkType={defaultNeuralNetworkType}
        predictionObjectInput={{
          year: testYear,
          [testInputProp]: false,
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

  test("checkbox calls setPredictionObjectInput as expected when clicked", () => {
    const checkboxInput = result.getByLabelText(
      testInputProp.charAt(0).toUpperCase() +
        testInputProp.slice(1).replace(/_/g, " ") +
        ":"
    );

    expect(checkboxInput.checked).toBe(false);
    fireEvent.click(checkboxInput);
    expect(setPredictionObjectInput).toHaveBeenCalledWith({
      year: defaultYear,
      [testInputProp]: true,
    });
    expect(checkboxInput.checked).toBe(true);
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
