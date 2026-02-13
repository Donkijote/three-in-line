import { render, screen } from "@testing-library/react";

import { HomeScreen } from "./HomeScreen";

describe("HomeScreen", () => {
  it("renders the match history dashboard layout", () => {
    render(<HomeScreen />);

    expect(screen.getByText(/mission logs/i)).toBeInTheDocument();
    expect(screen.getByText(/match history/i)).toBeInTheDocument();
    expect(screen.getByText(/recent matches/i)).toBeInTheDocument();
    expect(screen.getByText(/previous week/i)).toBeInTheDocument();
  });

  it("renders stat cards and match cards", () => {
    render(<HomeScreen />);

    expect(screen.getByText("Wins")).toBeInTheDocument();
    expect(screen.getByText("Win Rate")).toBeInTheDocument();
    expect(screen.getByText("Streak")).toBeInTheDocument();
    expect(screen.getByText(/vs CPU \(Hard\)/i)).toBeInTheDocument();
    expect(screen.getByText(/vs Cyber_Samurai/i)).toBeInTheDocument();
    expect(screen.getByText(/vs Player_Two/i)).toBeInTheDocument();
  });
});
