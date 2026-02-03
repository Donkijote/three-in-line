import { render, screen } from "@testing-library/react";

import { FullPageLoader } from "./FullPageLoader";

describe("FullPageLoader", () => {
  it("renders the default label", () => {
    render(<FullPageLoader />);

    expect(screen.getByText("Loading")).toBeInTheDocument();
  });

  it("renders message and submessage when provided", () => {
    render(<FullPageLoader message="Please wait" subMessage="Almost there" />);

    expect(screen.getByText("Please wait")).toBeInTheDocument();
    expect(screen.getByText("Almost there")).toBeInTheDocument();
  });

  it("applies custom className to the container", () => {
    const { container } = render(<FullPageLoader className="custom-loader" />);

    expect(container.firstChild).toHaveClass("custom-loader");
  });
});
