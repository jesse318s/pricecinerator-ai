import React from "react";
import { render, fireEvent } from "@testing-library/react";
import GameInput from "./GameInput";

describe("GameInput", () => {
  const defaultYear = "1977";
  let setGameInput;
  let result;

  beforeEach(() => {
    setGameInput = jest.fn();
    result = render(
      <GameInput
        gameInput={{
          year: defaultYear,
          genre_Action: false,
        }}
        setGameInput={setGameInput}
        predictionOptions={{}}
        setPredictionOptions={() => {}}
      />
    );
  });

  test("Year field calls setGameInput correctly when a year is input", () => {
    const yearInput = result.getByLabelText("Year:");
    const testYear = "2000";

    expect(yearInput.value).toBe(defaultYear);
    fireEvent.change(yearInput, { target: { value: testYear } });
    expect(setGameInput).toHaveBeenCalledWith({
      year: testYear,
      genre_Action: false,
    });
    result.rerender(
      <GameInput
        gameInput={{
          year: testYear,
          genre_Action: false,
        }}
        setGameInput={setGameInput}
        predictionOptions={{}}
        setPredictionOptions={() => {}}
      />
    );
    expect(yearInput.value).toBe(testYear);
  });

  test("genre checkbox calls setGameInput as expected when clicked", () => {
    const genreInput = result.getByLabelText("Action:");

    expect(genreInput.checked).toBe(false);
    fireEvent.click(genreInput);
    expect(setGameInput).toHaveBeenCalledWith({
      year: defaultYear,
      genre_Action: true,
    });
    expect(genreInput.checked).toBe(true);
  });
});
