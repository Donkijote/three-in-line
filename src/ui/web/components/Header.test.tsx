import { render, screen } from "@testing-library/react";

import { Header } from "./Header";

describe("Header", () => {
  it("renders the title", () => {
    render(<Header title="Select Mode" />);

    expect(screen.getByText("Select Mode")).toBeInTheDocument();
  });

  it("renders the eyebrow when provided", () => {
    render(<Header title="Select Mode" eyebrow="New Game" />);

    expect(screen.getByText("New Game")).toBeInTheDocument();
  });

  it("renders the left slot when provided", () => {
    render(
      <Header title="Match" leftSlot={<button type="button">Back</button>} />,
    );

    expect(screen.getByRole("button", { name: "Back" })).toBeInTheDocument();
  });
});
