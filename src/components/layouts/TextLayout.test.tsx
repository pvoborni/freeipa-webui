import React from "react";
import "@testing-library/react";
// import { render } from "@testing-library/react";
// import { screen } from "@testing-library/dom";
// import { expect } from "@testing-library/jest-dom";
import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
import TextLayout from "./TextLayout";
import { render, screen } from "@testing-library/react";

test("should display the TextLayout page", () => {
  render(<TextLayout>My input</TextLayout>);

  // DEBUG UTILITY
  // debug document
  // screen.debug();
  // // debug single element
  // screen.debug(screen.getByText("Active users"));
  // // debug multiple elements
  // // screen.debug(screen.getAllByText("multi-test"));

  // ASSERT
  // const input = screen.getByLabelText("Username");
  expect(screen.getByText("My input")).toBeInTheDocument();
  // expect(screen.getByRole("h1")).toHaveTextContent("Active Users");
});
