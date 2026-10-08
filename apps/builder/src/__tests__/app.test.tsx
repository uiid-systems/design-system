import { render, screen } from "@testing-library/react";

import { App } from "../app";

describe("App", () => {
  it("renders the builder heading with the UIID Text component", () => {
    render(<App />);

    const heading = screen.getByText("Builder");
    expect(heading).toHaveAttribute("data-slot", "text");
  });
});
