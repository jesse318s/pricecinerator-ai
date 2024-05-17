import React from "react";
import { render, fireEvent } from "@testing-library/react";
import LandingPage from "./LandingPage";

describe("LandingPage", () => {
  const continueToAppMock = jest.fn();
  let result;
  let continueButton;

  beforeEach(() => {
    jest.clearAllMocks();

    result = render(<LandingPage continueToApp={continueToAppMock} />);

    continueButton = result.getByText("Continue");
  });

  test("Continue button is rendered", () =>
    expect(continueButton).toBeInTheDocument());

  test("Continue button calls  correctly when click", () => {
    fireEvent.click(continueButton);
    expect(continueToAppMock).toHaveBeenCalled();
  });
});
