import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ErrorPanel from "./ErrorPanel";

describe("ErrorPanel", () => {
  const errMsgTxt = "Something went wrong";

  delete window.location;
  window.location = { reload: jest.fn() };

  beforeEach(() => {
    render(<ErrorPanel errMsgTxt={errMsgTxt} />);

    window.location.reload.mockClear();
  });

  test("error message is rendered", () => {
    const errorMessage = screen.getByText(errMsgTxt);

    expect(errorMessage).toBeInTheDocument();
  });

  test("refresh button is rendered and calls reload correctly when clicked", () => {
    const refreshButton = screen.getByRole("button", { name: "Refresh" });

    expect(refreshButton).toBeInTheDocument();
    fireEvent.click(refreshButton);
    expect(window.location.reload).toHaveBeenCalled();
  });
});
