import { fireEvent, render, screen } from "@testing-library/react";

import { MatchBoard } from "./MatchBoard";

describe("MatchBoard", () => {
  it("renders a 3x3 board", () => {
    const board = [
      "P1",
      "P2",
      null,
      null,
      "P1",
      null,
      "P2",
      null,
      null,
    ] as const;

    render(
      <MatchBoard
        board={[...board]}
        gridSize={3}
        status="playing"
        currentTurn="P1"
        currentUserId="user-1"
        p1UserId="user-1"
        isTimeUp={false}
      />,
    );

    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(9);
    expect(screen.getAllByText("X")).toHaveLength(2);
    expect(screen.getAllByText("O")).toHaveLength(2);
  });

  it("calls onCellClick when selecting an empty cell", () => {
    const onCellClick = vi.fn();
    const board = Array.from({ length: 9 }, () => null) as Array<
      "P1" | "P2" | null
    >;

    render(
      <MatchBoard
        board={board}
        gridSize={3}
        status="playing"
        currentTurn="P1"
        currentUserId="user-1"
        p1UserId="user-1"
        isTimeUp={false}
        onCellClick={onCellClick}
      />,
    );

    const [firstCell] = screen.getAllByRole("button");
    fireEvent.click(firstCell);

    expect(onCellClick).toHaveBeenCalledWith(0);
  });

  it("disables the board when the current user is unknown", () => {
    const board = Array.from({ length: 9 }, () => null) as Array<
      "P1" | "P2" | null
    >;

    render(
      <MatchBoard
        board={board}
        gridSize={3}
        status="playing"
        currentTurn="P1"
        p1UserId="user-1"
        isTimeUp={false}
      />,
    );

    const [firstCell] = screen.getAllByRole("button");
    expect(firstCell).toBeDisabled();
  });

  it("notifies invalid attempt when selecting a taken cell", () => {
    const onCellClick = vi.fn();
    const onInvalidMoveAttempt = vi.fn();
    const board = [
      "P1",
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ] as Array<"P1" | "P2" | null>;

    render(
      <MatchBoard
        board={board}
        gridSize={3}
        status="playing"
        currentTurn="P1"
        currentUserId="user-1"
        p1UserId="user-1"
        isTimeUp={false}
        onCellClick={onCellClick}
        onInvalidMoveAttempt={onInvalidMoveAttempt}
      />,
    );

    const [firstCell] = screen.getAllByRole("button");
    fireEvent.click(firstCell);

    expect(onInvalidMoveAttempt).toHaveBeenCalledTimes(1);
    expect(onCellClick).not.toHaveBeenCalled();
  });

  it("notifies invalid attempt when trying to play out of turn", () => {
    const onCellClick = vi.fn();
    const onInvalidMoveAttempt = vi.fn();
    const board = Array.from({ length: 9 }, () => null) as Array<
      "P1" | "P2" | null
    >;

    render(
      <MatchBoard
        board={board}
        gridSize={3}
        status="playing"
        currentTurn="P2"
        currentUserId="user-1"
        p1UserId="user-1"
        isTimeUp={false}
        onCellClick={onCellClick}
        onInvalidMoveAttempt={onInvalidMoveAttempt}
      />,
    );

    const [firstCell] = screen.getAllByRole("button");
    fireEvent.click(firstCell);

    expect(onInvalidMoveAttempt).toHaveBeenCalledTimes(1);
    expect(onCellClick).not.toHaveBeenCalled();
  });
});
