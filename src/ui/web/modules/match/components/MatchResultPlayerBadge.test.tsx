import { render, screen } from "@testing-library/react";

import type { UserAvatar } from "@/domain/entities/Avatar";

const { AvatarMock, AvatarImageMock, AvatarFallbackMock } = vi.hoisted(() => ({
  AvatarMock: ({ children }: { children: ReactNode }) => (
    <div data-testid="avatar">{children}</div>
  ),
  AvatarImageMock: (props: ComponentProps<"img">) => (
    <img data-testid="avatar-image" {...props} alt={props.alt} />
  ),
  AvatarFallbackMock: ({ children }: { children: ReactNode }) => (
    <span data-testid="avatar-fallback">{children}</span>
  ),
}));

vi.mock("@/ui/web/components/ui/avatar", () => ({
  Avatar: AvatarMock,
  AvatarImage: AvatarImageMock,
  AvatarFallback: AvatarFallbackMock,
}));

import type { ComponentProps, ReactNode } from "react";

import { MatchResultPlayerBadge } from "./MatchResultPlayerBadge";

describe("MatchResultPlayerBadge", () => {
  it("renders winner styling and avatar initials", () => {
    const avatar = { type: "preset", value: "avatar-2" } as UserAvatar;

    const { container } = render(
      <MatchResultPlayerBadge
        name="Nova Prime"
        avatar={avatar}
        isWinner={true}
        accent="primary"
        label="You"
      />,
    );

    expect(screen.getByText("Nova Prime")).toBeInTheDocument();
    expect(screen.getByText("You")).toBeInTheDocument();
    expect(screen.getByText("NP")).toBeInTheDocument();

    const image = screen.getByTestId("avatar-image") as HTMLImageElement;
    expect(image).toHaveAttribute("src", "/avatars/avatar-2.svg");

    const winnerBadge = container.querySelector("span.bg-primary");
    expect(winnerBadge).toBeInTheDocument();
  });

  it("renders loser styling", () => {
    const { container } = render(
      <MatchResultPlayerBadge
        name="Rex"
        isWinner={false}
        accent="destructive"
        label="Opponent"
      />,
    );

    expect(screen.getByText("Rex")).toBeInTheDocument();
    expect(screen.getByText("Opponent")).toBeInTheDocument();

    const loserBadge = container.querySelector(
      "span.bg-destructive.text-destructive-foreground",
    );
    expect(loserBadge).toBeInTheDocument();
  });
});
