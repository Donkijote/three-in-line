import { expect } from "vitest";

import { fireEvent, render, screen } from "@testing-library/react";

import { WelcomeModal } from "./WelcomeModal";

describe("Welcome Modal", () => {
  test("should not trigger new game if name's empty", () => {
    const startGame = vi.fn();
    render(<WelcomeModal isOpen={true} startGame={startGame} />);

    expect(screen.getByTestId("welcome-modal")).toBeInTheDocument();

    const saveButton = screen.getByTestId("welcome-modal-save-button");
    expect(saveButton).toBeInTheDocument();

    fireEvent.click(saveButton);

    expect(startGame).not.toHaveBeenCalled();
  });
  test("toggle bot difficulty buttons", () => {
    render(<WelcomeModal isOpen={true} startGame={vi.fn()} />);

    expect(screen.getByTestId("welcome-modal")).toBeInTheDocument();

    const hardDifficultyButton = screen.getByTestId(
      "welcome-modal-bot-difficulty-hard-button",
    );
    expect(hardDifficultyButton).toBeInTheDocument();

    fireEvent.click(hardDifficultyButton);

    expect(
      screen.getByTestId("welcome-modal-bot-difficulty-hard-button"),
    ).toHaveClass("bg-secondary text-white");
  });
  test("trigger save", () => {
    const startGame = vi.fn();
    render(<WelcomeModal isOpen={true} startGame={startGame} />);

    expect(screen.getByTestId("welcome-modal")).toBeInTheDocument();

    const nameInput = screen.getByTestId("welcome-modal-name-input");
    expect(nameInput).toBeInTheDocument();

    fireEvent.change(nameInput, { target: { value: "test" } });

    expect(nameInput).toHaveValue("test");

    const saveButton = screen.getByTestId("welcome-modal-save-button");
    expect(saveButton).toBeInTheDocument();

    fireEvent.click(saveButton);

    expect(startGame).toHaveBeenCalled();
  });
});
