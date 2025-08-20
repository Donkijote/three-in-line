import { Board } from "@/modules/board";
import { GameState } from "@/modules/board/types";

import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import * as logic from "../domain/board-logic";
import { DEFAULT_PLAYS } from "../domain/board-logic";

const mockedSync = vi.spyOn(logic, "syncGamePlay");

describe("Board", () => {
  test("Render user and bots actions", async () => {
    render(<Board />);

    screen.getByTestId("Board");

    const firstCell = screen.getByTestId("Board-cell-0");
    expect(firstCell).toBeInTheDocument();

    await waitFor(async () => await userEvent.click(firstCell));

    const expectedValues = [...DEFAULT_PLAYS] as Array<number | null>;
    expectedValues.splice(0, 1, 1);

    expect(mockedSync).toHaveBeenCalledWith(
      expectedValues,
      true,
      GameState.PROGRESS,
    );

    const secondCell = screen.getByTestId("Board-cell-1");
    expect(secondCell).toBeInTheDocument();

    await waitFor(async () => await userEvent.click(secondCell));

    expectedValues.splice(1, 1, 0);

    expect(mockedSync).toHaveBeenCalledWith(
      expectedValues,
      false,
      GameState.PROGRESS,
    );
  });
});
