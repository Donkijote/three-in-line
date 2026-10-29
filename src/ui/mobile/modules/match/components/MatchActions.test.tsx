import { fireEvent, waitFor } from "@testing-library/react-native";

import type { MatchState } from "@/domain/entities/Game";
import { renderMobile } from "@/test/mobile/render";

import { MatchActions } from "./MatchActions";

const match: MatchState = {
  format: "bo3",
  targetWins: 2,
  roundIndex: 2,
  score: { P1: 1, P2: 0 },
  matchWinner: null,
  rounds: [],
};

describe("MatchActions", () => {
  it("renders the abandon action and round info", () => {
    const screen = renderMobile(
      <MatchActions
        match={match}
        isAbandoning={false}
        onAbandonMatch={jest.fn().mockResolvedValue(undefined)}
      />,
    );

    expect(screen.getByText("Abandon Match")).toBeTruthy();
    expect(screen.getByText("Round 2 · Best of 3")).toBeTruthy();
  });

  it("calls the abandon handler when pressed", async () => {
    const onAbandonMatch = jest.fn().mockResolvedValue(undefined);
    const screen = renderMobile(
      <MatchActions
        match={match}
        isAbandoning={false}
        onAbandonMatch={onAbandonMatch}
      />,
    );

    fireEvent.press(screen.getByText("Abandon Match"));

    await waitFor(() => {
      expect(onAbandonMatch).toHaveBeenCalledTimes(1);
    });
  });

  it("hides round info for single matches", () => {
    const screen = renderMobile(
      <MatchActions
        match={{ ...match, format: "single" }}
        isAbandoning={false}
        onAbandonMatch={jest.fn().mockResolvedValue(undefined)}
      />,
    );

    expect(screen.queryByText("Round 2 · Best of 3")).toBeNull();
  });
});
