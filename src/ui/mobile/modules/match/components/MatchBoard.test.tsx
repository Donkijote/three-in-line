import { fireEvent } from "@testing-library/react-native";

import { renderMobile } from "@/test/mobile/render";

import { MatchBoard } from "./MatchBoard";

describe("MatchBoard", () => {
  it("renders a 3x3 board with centered marks", () => {
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

    const screen = renderMobile(
      <MatchBoard
        board={[...board]}
        gridSize={3}
        status="playing"
        currentTurn="P1"
        currentUserId="user-1"
        p1UserId="user-1"
      />,
    );

    expect(screen.getAllByRole("button")).toHaveLength(9);
    expect(screen.getAllByLabelText("X")).toHaveLength(2);
    expect(screen.getAllByLabelText("Circle")).toHaveLength(2);
  });

  it("calls onCellPress when selecting an empty cell", () => {
    const onCellPress = jest.fn();
    const board = Array.from({ length: 9 }, () => null) as Array<
      "P1" | "P2" | null
    >;

    const screen = renderMobile(
      <MatchBoard
        board={board}
        gridSize={3}
        status="playing"
        currentTurn="P1"
        currentUserId="user-1"
        p1UserId="user-1"
        onCellPress={onCellPress}
      />,
    );

    fireEvent.press(screen.getByLabelText("Match cell 1"));

    expect(onCellPress).toHaveBeenCalledWith(0);
  });

  it("ignores taken cells and out-of-turn presses", () => {
    const onCellPress = jest.fn();

    const takenCellScreen = renderMobile(
      <MatchBoard
        board={["P1", null, null, null, null, null, null, null, null]}
        gridSize={3}
        status="playing"
        currentTurn="P1"
        currentUserId="user-1"
        p1UserId="user-1"
        onCellPress={onCellPress}
      />,
    );

    fireEvent.press(takenCellScreen.getByLabelText("Match cell 1"));
    expect(onCellPress).not.toHaveBeenCalled();

    const outOfTurnScreen = renderMobile(
      <MatchBoard
        board={Array.from({ length: 9 }, () => null)}
        gridSize={3}
        status="playing"
        currentTurn="P2"
        currentUserId="user-1"
        p1UserId="user-1"
        onCellPress={onCellPress}
      />,
    );

    fireEvent.press(outOfTurnScreen.getByLabelText("Match cell 1"));
    expect(onCellPress).not.toHaveBeenCalled();
  });

  it("renders the time-up overlay", () => {
    const screen = renderMobile(
      <MatchBoard
        board={Array.from({ length: 9 }, () => null)}
        gridSize={3}
        status="playing"
        currentTurn="P1"
        currentUserId="user-1"
        p1UserId="user-1"
        isTimeUp
      />,
    );

    expect(screen.getByText("Time's up")).toBeTruthy();
    expect(
      screen.getByText("Your turn expired before the move could be placed."),
    ).toBeTruthy();
  });
});
