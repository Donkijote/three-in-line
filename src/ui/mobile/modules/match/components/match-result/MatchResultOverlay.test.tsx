import { router } from "expo-router";

import { fireEvent } from "@testing-library/react-native";

import { renderMobile } from "@/test/mobile/render";

import { MatchResultOverlay } from "./MatchResultOverlay";

describe("MatchResultOverlay", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders nothing when the match is not ended", () => {
    const screen = renderMobile(
      <MatchResultOverlay
        status="playing"
        endedReason={null}
        winner={null}
        abandonedBy={null}
        p1UserId="user-1"
        currentUserId="user-1"
        onPrimaryAction={jest.fn().mockResolvedValue(undefined)}
        currentUser={{ name: "Nova" }}
        opponentUser={{ name: "Rex" }}
      />,
    );

    expect(screen.queryByText("You win!")).toBeNull();
  });

  it("renders the winner state and triggers actions", () => {
    const onPrimaryAction = jest.fn().mockResolvedValue(undefined);
    const screen = renderMobile(
      <MatchResultOverlay
        status="ended"
        endedReason="win"
        winner="P1"
        abandonedBy={null}
        p1UserId="user-1"
        currentUserId="user-1"
        score={{ P1: 2, P2: 1 }}
        onPrimaryAction={onPrimaryAction}
        currentUser={{ name: "Nova" }}
        opponentUser={{ name: "Rex" }}
      />,
    );

    expect(screen.getByText("You win!")).toBeTruthy();
    expect(screen.getByText("Play Again")).toBeTruthy();
    expect(screen.getByText("Change Mode")).toBeTruthy();
    expect(screen.getByText("Back Home")).toBeTruthy();

    fireEvent.press(screen.getByText("Play Again"));
    fireEvent.press(screen.getByText("Change Mode"));
    fireEvent.press(screen.getByText("Back Home"));

    expect(onPrimaryAction).toHaveBeenCalledTimes(1);
    expect(router.replace).toHaveBeenCalledWith("/play");
    expect(router.replace).toHaveBeenCalledWith("/");
  });

  it("renders disconnect messaging when the opponent leaves", () => {
    const screen = renderMobile(
      <MatchResultOverlay
        status="ended"
        endedReason="disconnect"
        winner={null}
        abandonedBy="P2"
        p1UserId="user-1"
        currentUserId="user-1"
        onPrimaryAction={jest.fn().mockResolvedValue(undefined)}
        currentUser={{ name: "Nova" }}
        opponentUser={{ name: "Rex" }}
      />,
    );

    expect(screen.getByText("Match Ended")).toBeTruthy();
    expect(screen.getByText("Match Incomplete")).toBeTruthy();
    expect(screen.getByText("Find New Match")).toBeTruthy();
  });
});
