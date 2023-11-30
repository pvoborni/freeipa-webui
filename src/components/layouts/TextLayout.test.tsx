import React from "react";

import TextLayout from "./TextLayout";
import { render, screen } from "@testing-library/react";

test("should display the TextLayout page", () => {
  render(<TextLayout>My input</TextLayout>);
  // ASSERT
  // const input = screen.getByLabelText("Username");
  expect(screen.getByText("My input")).toBeInTheDocument();
  // expect(screen.getByRole("h1")).toHaveTextContent("Active Users");
});
