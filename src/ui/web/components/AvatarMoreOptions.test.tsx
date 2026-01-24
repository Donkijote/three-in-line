import type { ReactNode } from "react";

import { describe, expect, it, vi } from "vitest";

import { fireEvent, render, screen } from "@testing-library/react";

import { AvatarMoreOptions } from "./AvatarMoreOptions";

vi.mock("@/ui/web/hooks/useMediaQuery", () => ({
  useMediaQuery: () => ({ isMobile: false }),
}));

vi.mock("@/ui/web/components/ui/drawer", () => ({
  Drawer: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  DrawerTrigger: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
  DrawerContent: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
  DrawerHeader: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
  DrawerFooter: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
  DrawerTitle: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  DrawerClose: ({
    children,
    onClick,
  }: {
    children: ReactNode;
    onClick?: () => void;
    // biome-ignore lint/a11y/noStaticElementInteractions: only for testing purposes
    // biome-ignore lint/a11y/useKeyWithClickEvents: only for testing purposes
  }) => (
    <div data-testid="drawer-close" onClick={onClick}>
      {children}
    </div>
  ),
}));

describe("AvatarMoreOptions", () => {
  it("disables accept until an avatar is selected", () => {
    const onAccept = vi.fn();

    render(
      <AvatarMoreOptions onAccept={onAccept}>
        <button type="button">Open</button>
      </AvatarMoreOptions>,
    );

    const acceptButton = screen.getByRole("button", { name: "Accept" });
    expect(acceptButton).toBeDisabled();

    fireEvent.click(acceptButton);
    expect(onAccept).not.toHaveBeenCalled();
  });

  it("accepts the selected avatar", () => {
    const onAccept = vi.fn();

    render(
      <AvatarMoreOptions onAccept={onAccept}>
        <button type="button">Open</button>
      </AvatarMoreOptions>,
    );

    fireEvent.click(screen.getByRole("button", { name: /Orion/i }));

    const acceptButton = screen.getByRole("button", { name: "Accept" });
    expect(acceptButton).not.toBeDisabled();

    fireEvent.click(acceptButton);

    expect(onAccept).toHaveBeenCalledTimes(1);
    expect(onAccept).toHaveBeenCalledWith(
      expect.objectContaining({ id: "avatar-1" }),
    );
  });

  it("clears selection when the close control is used", () => {
    const onAccept = vi.fn();

    render(
      <AvatarMoreOptions onAccept={onAccept}>
        <button type="button">Open</button>
      </AvatarMoreOptions>,
    );

    fireEvent.click(screen.getByRole("button", { name: /Orion/i }));

    const acceptButton = screen.getByRole("button", { name: "Accept" });
    expect(acceptButton).not.toBeDisabled();

    fireEvent.click(screen.getAllByTestId("drawer-close")[0]);

    expect(acceptButton).toBeDisabled();
  });
});
